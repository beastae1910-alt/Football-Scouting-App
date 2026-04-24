import React, { useState, useEffect, useRef } from 'react';
import { generateReport } from './generateReport';
import { supabase } from './supabaseClient';

const getCredibilityBadge = (highlights = []) => {
  if (highlights.length >= 3) return { label: 'Rising Talent', color: 'var(--warning)', bg: 'var(--warning-bg)' };
  if (highlights.length >= 1) return { label: 'Active Player', color: 'var(--text-primary)', bg: 'var(--bg-surface)' };
  return { label: 'New Player', color: 'var(--text-secondary)', bg: 'transparent' };
};

const STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];

const getStatsDraft = (stats = {}) =>
  STAT_KEYS.reduce((draft, key) => {
    const value = Number(stats?.[key]);
    draft[key] = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 50;
    return draft;
  }, {});

const StatBar = ({ label, value }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
      <span className="text-muted" style={{ textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em', fontSize: '0.75rem' }}>{label}</span>
      <span style={{ 
        fontWeight: '600', 
        color: value > 80 ? 'var(--success)' : value < 65 ? 'var(--text-muted)' : 'var(--text-primary)' 
      }}>{value}</span>
    </div>
    <div style={{ background: 'var(--bg-main)', borderRadius: '4px', height: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div style={{ 
        width: `${value}%`, 
        height: '100%', 
        borderRadius: '4px', 
        background: value > 80 ? 'var(--success)' : value < 65 ? 'var(--text-secondary)' : 'var(--text-primary)', 
        transition: 'width 0.5s ease-out' 
      }} />
    </div>
  </div>
);

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

      const trackView = async () => {
        const { error } = await supabase.from('player_views').insert([{ 
          player_id: player.id, 
          scout_id: viewerId,
          view_date: new Date().toISOString().split('T')[0]
        }]);

        if (error && error.code !== '23505') {
          console.error('Unexpected error tracking scout view:', error);
          trackedPlayerId.current = null;
        }
      };

      trackView();
    }
  }, [player?.id, player?.user_id, userRole, viewerId]);

  useEffect(() => {
    if (!isScout || !viewerId || !player?.id) {
      return;
    }

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

  const badge = getCredibilityBadge(player.highlights);

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
      setStatsError(err.message || 'Failed to save stats.');
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
      setShortlistError(error.message);
      setShortlistLoading(false);
      return;
    }

    setIsShortlisted(true);
    setShortlistLoading(false);
  };

  return (
    <div className="container animate-fade-in">
      <button onClick={onBack} className="btn btn-ghost" style={{ marginBottom: '1.5rem', padding: '0.5rem 0' }}>
        &larr; Back to Dashboard
      </button>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: 'var(--bg-main)', border: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' 
        }}>
          {player.name?.[0]?.toUpperCase() || '?'}
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{player.name}</h1>
            <span className="badge" style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color === 'var(--text-secondary)' ? 'var(--border-color)' : badge.color + '40'}` }}>
              {badge.label}
            </span>
          </div>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
            {player.position} &middot; Age {player.age}{player.city ? ` \u00b7 ${player.city}` : ''}
          </p>
        </div>

        {isScout && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button onClick={handleShortlist} disabled={shortlistLoading || isShortlisted} className={isShortlisted ? 'btn btn-secondary' : 'btn btn-primary'}>
              {isShortlisted ? 'Shortlisted' : (shortlistLoading ? 'Saving...' : 'Shortlist')}
            </button>
            {shortlistError && (
              <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{shortlistError}</span>
            )}
          </div>
        )}

        {isOwnProfile && (
          <button onClick={onUploadClick} className="btn btn-secondary">
            Upload Highlight
          </button>
        )}
      </div>

      <div className="tabs-container">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
        <button className={`tab ${activeTab === 'highlights' ? 'active' : ''}`} onClick={() => setActiveTab('highlights')}>
          Highlights <span className="badge" style={{ marginLeft: '0.5rem', background: 'var(--bg-main)' }}>{player.highlights?.length || 0}</span>
        </button>
      </div>

      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'overview' && (
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Biography</h3>
            <p className="text-muted" style={{ marginBottom: '2.5rem', lineHeight: '1.7' }}>
              {player.bio || `${player.name} is a ${player.age}-year-old ${player.position} registered on ScoutIndia. Review their stats and highlights to evaluate their potential.`}
            </p>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.88-.45 1.71-1 2.45-.63.83-1.46 1.49-2.45 1.95a2 2 0 0 1-2.9-1.39A7.95 7.95 0 0 1 12 2Z"/><path d="M4 14a8 8 0 0 0 16 0"/><path d="M10 20v2"/><path d="M14 20v2"/><path d="M12 22v-6"/></svg>
                  AI Scouting Report
                </h4>
                {!player.ai_report && (
                  <button onClick={generateReportText} disabled={isGenerating} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {isGenerating ? 'Analyzing Data...' : 'Generate'}
                  </button>
                )}
              </div>
              
              <p style={{ margin: 0, color: player.ai_report ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {player.ai_report || 'No analysis generated yet. Click generate to evaluate player potential based on statistics.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Performance Attributes</h3>
              <span className="badge" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                Self-Reported
              </span>
            </div>

            {isOwnProfile ? (
              <form onSubmit={handleSaveStats}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem 3rem' }}>
                  {STAT_KEYS.map((key) => (
                    <label key={key} style={{ display: 'block' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <span className="text-muted" style={{ textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em', fontSize: '0.75rem' }}>{key}</span>
                        <strong>{statsDraft[key]}</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={statsDraft[key]}
                        onChange={(e) => handleStatChange(key, e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </label>
                  ))}
                </div>

                {statsError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem' }}>{statsError}</p>}
                {statsSaved && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '1rem' }}>Stats saved.</p>}

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <button type="submit" disabled={isSavingStats} className="btn btn-primary">
                    {isSavingStats ? 'Saving...' : 'Save Attributes'}
                  </button>
                </div>
              </form>
            ) : player.stats && Object.keys(player.stats).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem 3rem' }}>
                {STAT_KEYS.filter(k => player.stats[k] !== undefined).map(k => (
                  <StatBar key={k} label={k} value={player.stats[k]} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p className="text-muted">No attributes recorded for this player.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'highlights' && (
          <div>
            {!player.highlights || player.highlights.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </div>
                <h3 style={{ margin: '0 0 0.5rem' }}>No footage available</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Upload game highlights to showcase your abilities.</p>
                {isOwnProfile && (
                  <button onClick={onUploadClick} className="btn btn-secondary">Upload Video</button>
                )}
              </div>
            ) : (
              <div className="grid-cards">
                {player.highlights.map((vid) => (
                  <div key={vid.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <video src={vid.url} controls style={{ width: '100%', display: 'block', background: '#000', borderBottom: '1px solid var(--border-color)' }} />
                    <div style={{ padding: '1.25rem' }}>
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{vid.title}</h4>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>Uploaded {vid.uploadedAt}</p>
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
