import React, { useState, useEffect, useRef } from 'react';
import { generateReport } from './generateReport';
import { supabase } from './supabaseClient';

const getPosClass = (pos) => {
  if (pos === 'Forward') return 'badge-orange';
  if (pos === 'Midfielder') return 'badge-gold';
  if (pos === 'Winger') return 'badge-gold';
  if (pos === 'Goalkeeper') return 'badge-red';
  return 'badge-green';
};

const STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
const trackedScoutViews = new Set();
const pendingScoutViews = new Set();

const getStatsDraft = (stats = {}) =>
  STAT_KEYS.reduce((draft, key) => {
    const value = Number(stats?.[key]);
    draft[key] = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 50;
    return draft;
  }, {});

const StatBar = ({ label, value }) => {
  const isHigh = value >= 80;
  const isLow = value < 65;
  const color = isHigh ? 'var(--pitch-green)' : isLow ? 'var(--alert-red)' : 'var(--amber-gold)';
  const shadowColor = isHigh ? 'var(--shadow-green)' : isLow ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'var(--shadow-gold)';

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.25rem' }}>
        <span className="text-muted" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-sport)', letterSpacing: '1px', fontSize: '1.25rem', lineHeight: 1 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-sport)', fontSize: '2rem', lineHeight: 1, color, transition: 'all 0.3s ease' }}>{value}</span>
      </div>
      <div style={{ background: 'var(--bg-darkest)', borderRadius: '2px', height: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
        <div style={{ 
          width: `${value}%`, 
          height: '100%', 
          background: color, 
          boxShadow: shadowColor,
          transition: 'width 1s cubic-bezier(0.25, 1, 0.5, 1)' 
        }} />
      </div>
    </div>
  );
};

const PlayerProfile = ({ player, userRole, viewerId, onBack, onUploadClick, onGenerateReport, onSaveStats }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statsDraft, setStatsDraft] = useState(() => getStatsDraft(player?.stats));
  const [isSavingStats, setIsSavingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [statsSaved, setStatsSaved] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [shortlistError, setShortlistError] = useState(null);

  const reportTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  useEffect(() => () => clearTimeout(reportTimerRef.current), []);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  const isOwnProfile = userRole === 'player' && player?.user_id === viewerId;
  const isScout = userRole === 'scout';

  const trackedPlayerId = useRef(null);

  useEffect(() => {
    if (!userRole || !viewerId || !player?.id) return;

    if (userRole === 'scout' && player.user_id !== viewerId) {
      if (trackedPlayerId.current === player.id) return;
      trackedPlayerId.current = player.id;
      const viewDate = new Date().toISOString().split('T')[0];
      const viewKey = `${viewerId}:${player.id}:${viewDate}`;
      if (trackedScoutViews.has(viewKey) || pendingScoutViews.has(viewKey)) return;
      pendingScoutViews.add(viewKey);

      const trackView = async () => {
        const { error } = await supabase.from('player_views').insert([{ 
          player_id: player.id, 
          scout_id: viewerId,
          view_date: viewDate
        }]);

        pendingScoutViews.delete(viewKey);
        if (error) {
          if (error.code === '23505') {
            trackedScoutViews.add(viewKey);
            return;
          }
          console.error('Unexpected error tracking scout view:', error);
          trackedPlayerId.current = null;
          return;
        }
        trackedScoutViews.add(viewKey);
      };

      trackView();
    }
  }, [player?.id, player?.user_id, userRole, viewerId]);

  useEffect(() => {
    if (!isScout || !viewerId || !player?.id) return;
    let isCurrent = true;

    const fetchShortlistStatus = async () => {
      const { data, error } = await supabase
        .from('scout_interests')
        .select('id')
        .eq('scout_id', viewerId)
        .eq('player_id', player.id)
        .maybeSingle();

      if (!isCurrent || !isMountedRef.current) return;
      if (error) {
        console.error('Failed to fetch shortlist status:', error.message);
        return;
      }
      setIsShortlisted(Boolean(data));
    };

    fetchShortlistStatus();
    return () => { isCurrent = false; };
  }, [isScout, player?.id, viewerId]);

  if (!player) return <div>Player not found</div>;

  const generateReportText = () => {
    setIsGenerating(true);
    reportTimerRef.current = setTimeout(() => {
      onGenerateReport(generateReport(player));
      setIsGenerating(false);
    }, 1200);
  };

  const handleStatChange = (key, value) => {
    setStatsSaved(false);
    setStatsError(null);
    setStatsDraft((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleSaveStats = async (e) => {
    e.preventDefault();
    if (!isOwnProfile || !onSaveStats) return;

    setIsSavingStats(true);
    setStatsError(null);
    setStatsSaved(false);

    try {
      await onSaveStats(statsDraft);
      if (!isMountedRef.current) return;
      setStatsSaved(true);
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Failed to save stats:', err);
      setStatsError('Failed to save attributes. Please try again.');
    } finally {
      if (isMountedRef.current) setIsSavingStats(false);
    }
  };

  const handleShortlist = async () => {
    if (!isScout || !viewerId || !player?.id || isShortlisted) return;

    setShortlistLoading(true);
    setShortlistError(null);

    const { error } = await supabase
      .from('scout_interests')
      .insert([{ scout_id: viewerId, player_id: player.id }]);

    if (!isMountedRef.current) return;
    if (error && error.code !== '23505') {
      console.error('Failed to shortlist player:', error);
      setShortlistError('Failed to shortlist player. Please try again.');
      setShortlistLoading(false);
      return;
    }

    setIsShortlisted(true);
    setShortlistLoading(false);
  };

return (
    <div className="container animate-up">
      <button onClick={onBack} className="btn btn-ghost" style={{ marginBottom: '1.5rem', padding: '0.5rem 0' }}>
        &larr; BACK TO DASHBOARD
      </button>

      {/* ATHLETIC HERO SECTION */}
      <div className="hero-block" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '4px', 
          background: 'var(--bg-darkest)', border: '2px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontFamily: 'var(--font-sport)', fontSize: '5rem', color: 'var(--text-main)',
          boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)'
        }}>
          {player.name?.[0]?.toUpperCase() || '?'}
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 className="hero-title-giant" style={{ wordBreak: 'break-word' }}>{player.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className={`badge ${getPosClass(player.position)}`} style={{ fontSize: '1.25rem', padding: '0.25rem 1rem' }}>
              {player.position}
            </span>
            <span style={{ fontFamily: 'var(--font-sport)', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
              AGE {player.age} {player.city ? `// ${player.city}` : ''}
            </span>
          </div>
        </div>

        {isScout && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button onClick={handleShortlist} disabled={shortlistLoading || isShortlisted} className={isShortlisted ? 'btn btn-secondary' : 'btn btn-primary'}>
              {isShortlisted ? 'SHORTLISTED' : (shortlistLoading ? 'SAVING...' : 'SHORTLIST PLAYER')}
            </button>
            {shortlistError && (
              <span style={{ color: 'var(--alert-red)', fontSize: '0.8rem', fontFamily: 'var(--font-ui)', fontWeight: 700 }}>{shortlistError}</span>
            )}
          </div>
        )}

        {isOwnProfile && (
          <button onClick={onUploadClick} className="btn btn-primary">
            UPLOAD HIGHLIGHT
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="sport-tabs">
        <button className={`sport-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>OVERVIEW</button>
        <button className={`sport-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>ATTRIBUTES</button>
        <button className={`sport-tab ${activeTab === 'highlights' ? 'active' : ''}`} onClick={() => setActiveTab('highlights')}>
          HIGHLIGHTS <span className="badge badge-neutral" style={{ marginLeft: '0.5rem', fontSize: '1rem' }}>{player.highlights?.length || 0}</span>
        </button>
      </div>

      <div className="animate-up" key={activeTab}>
        {activeTab === 'overview' && (
          <div className="sport-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>BIOGRAPHY</h3>
            <p className="text-muted" style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
              {player.bio || `${player.name} is a ${player.age}-year-old ${player.position} registered on ScoutIndia. Review their stats and highlights to evaluate their potential on the pitch.`}
            </p>

            <div style={{ background: 'var(--bg-dark)', borderLeft: '4px solid var(--pitch-green)', padding: '2rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0, color: 'var(--pitch-green)', fontSize: '1.75rem' }}>
                  AI SCOUTING REPORT
                </h4>
                {!player.ai_report && (
                  <button onClick={generateReportText} disabled={isGenerating} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                    {isGenerating ? 'ANALYZING...' : 'GENERATE REPORT'}
                  </button>
                )}
              </div>
              
              <p style={{ margin: 0, color: player.ai_report ? 'var(--text-main)' : 'var(--text-dim)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                {player.ai_report || 'No analysis generated yet. Click generate to evaluate player potential based on available statistics and footage.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="sport-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h3 style={{ margin: 0 }}>PERFORMANCE ATTRIBUTES</h3>
              <span className="badge badge-neutral">SELF-REPORTED</span>
            </div>

            {isOwnProfile ? (
              <form onSubmit={handleSaveStats}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem 4rem' }}>
                  {STAT_KEYS.map((key) => (
                    <label key={key} style={{ display: 'block' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <span className="text-muted" style={{ textTransform: 'uppercase', fontFamily: 'var(--font-sport)', fontSize: '1.25rem', letterSpacing: '1px' }}>{key}</span>
                        <strong style={{ fontFamily: 'var(--font-sport)', fontSize: '1.5rem', color: 'var(--pitch-green)' }}>{statsDraft[key]}</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={statsDraft[key]}
                        onChange={(e) => handleStatChange(key, e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--pitch-green)' }}
                      />
                    </label>
                  ))}
                </div>

                {statsError && <p style={{ color: 'var(--alert-red)', fontSize: '0.95rem', marginTop: '1.5rem', fontWeight: 600 }}>{statsError}</p>}
                {statsSaved && <p style={{ color: 'var(--pitch-green)', fontSize: '0.95rem', marginTop: '1.5rem', fontWeight: 600 }}>ATTRIBUTES SAVED SUCCESSFULLY.</p>}

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
                  <button type="submit" disabled={isSavingStats} className="btn btn-primary">
                    {isSavingStats ? 'SAVING...' : 'SAVE ATTRIBUTES'}
                  </button>
                </div>
              </form>
            ) : player.stats && Object.keys(player.stats).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem 4rem' }}>
                {STAT_KEYS.filter(k => player.stats[k] !== undefined).map(k => (
                  <StatBar key={k} label={k} value={player.stats[k]} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p className="text-muted" style={{ fontFamily: 'var(--font-sport)', fontSize: '2rem' }}>NO ATTRIBUTES RECORDED</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'highlights' && (
          <div>
            {!player.highlights || player.highlights.length === 0 ? (
              <div className="sport-card" style={{ textAlign: 'center', padding: '6rem 0' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '2.5rem' }}>NO FOOTAGE AVAILABLE</h3>
                <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Upload game highlights to showcase abilities on the pitch.</p>
                {isOwnProfile && (
                  <button onClick={onUploadClick} className="btn btn-primary">UPLOAD VIDEO</button>
                )}
              </div>
            ) : (
              <div className="roster-grid">
                {player.highlights.map((vid) => (
                  <div key={vid.id} className="sport-card" style={{ padding: 0 }}>
                    <video src={vid.url} controls style={{ width: '100%', display: 'block', background: '#000', borderBottom: '1px solid var(--border-subtle)' }} />
                    <div style={{ padding: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-ui)', fontWeight: 700, textTransform: 'none' }}>{vid.title}</h4>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>UPLOADED {vid.uploadedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
