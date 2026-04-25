import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const getPosClass = (pos) => {
  if (pos === 'Forward') return 'badge-orange';
  if (pos === 'Midfielder') return 'badge-gold';
  if (pos === 'Winger') return 'badge-gold';
  if (pos === 'Goalkeeper') return 'badge-red';
  return 'badge-green';
};

const getCardAccent = (pos) => {
  if (pos === 'Forward') return 'orange-accent';
  if (pos === 'Midfielder' || pos === 'Winger') return 'gold-accent';
  return '';
};

const PlayerDashboard = ({ players = [], userRole, onSelectPlayer, onAddPlayer }) => {
  const [search, setSearch]             = useState('');
  const [filterPosition, setFilterPos]  = useState('All');
  const [filterAge, setFilterAge]       = useState('All');
  const [realViews, setRealViews]             = useState(null);
  const [searchAppearances, setSearchApp]      = useState(null);
  const [shortlistCount, setShortlistCount]    = useState(null);

  useEffect(() => {
    if (userRole !== 'player' || players.length === 0) return;
    let isMounted = true;
    const playerId = players[0]?.id;
    if (!playerId) return;

    const fetchViews = async () => {
      const { count, error } = await supabase
        .from('player_views')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', playerId);
      if (!isMounted) return;
      if (!error) setRealViews(count || 0);

      const { count: saCount, error: saError } = await supabase
        .from('player_search_views')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', playerId);
      if (!isMounted) return;
      if (!saError) setSearchApp(saCount || 0);

      const { count: interestCount, error: interestError } = await supabase
        .from('scout_interests')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', playerId);
      if (!isMounted) return;
      if (!interestError) setShortlistCount(interestCount || 0);
    };

    fetchViews();
    return () => { isMounted = false; };
  }, [userRole, players]);

  const filtered = players.filter((p) => {
    const matchesSearch   = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesPosition = filterPosition === 'All' || p.position === filterPosition;
    const matchesAge =
      filterAge === 'All'      ? true :
      filterAge === 'Under 16' ? p.age <= 16 :
      filterAge === 'Under 18' ? p.age <= 18 :
      filterAge === 'Under 21' ? p.age <= 21 : true;

    return matchesSearch && matchesPosition && matchesAge;
  });

  return (
    <div className="container animate-up">
      
      {/* ── PLAYER: HAS PROFILE (DASHBOARD) ── */}
      {userRole === 'player' && players.length > 0 ? (
        <div className="hero-block" style={{ padding: '4rem 3rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <div className="badge badge-green" style={{ marginBottom: '1rem' }}>ACTIVE STATUS</div>
            <h1 className="hero-title-giant" style={{ color: 'var(--text-main)', fontSize: 'clamp(3.5rem, 8vw, 5rem)' }}>
              WELCOME, <br/><span style={{ color: 'var(--pitch-green)', textShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>{players[0].name.split(' ')[0]}</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', margin: '1.5rem 0 0', fontWeight: 500 }}>
              Your profile is live on the network. Keep your attributes updated and upload new match highlights to maximize your exposure to professional scouts.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', flex: '1 1 300px' }}>
            <div className="stat-box" style={{ borderTop: '4px solid var(--amber-gold)' }}>
              <div className="stat-value" style={{ color: 'var(--amber-gold)' }}>{realViews !== null ? realViews : '-'}</div>
              <div className="stat-label">Scout Views</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--pitch-green)' }}>
              <div className="stat-value" style={{ color: 'var(--pitch-green)' }}>
                {searchAppearances !== null ? searchAppearances : '—'}
              </div>
              <div className="stat-label">Search Appearances</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--energy-orange)' }}>
              <div className="stat-value" style={{ color: 'var(--energy-orange)' }}>{shortlistCount !== null ? shortlistCount : '-'}</div>
              <div className="stat-label">Shortlists</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--text-main)' }}>
              <div className="stat-value" style={{ color: 'var(--text-main)' }}>{players[0].highlights?.length || 0}</div>
              <div className="stat-label">Highlights</div>
            </div>
          </div>
        </div>

      /* ── PLAYER: NO PROFILE (ONBOARDING LANDING) ── */
      ) : userRole === 'player' ? (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge badge-gold" style={{ marginBottom: '1.5rem' }}>PLAYER PORTAL</div>
            <h1 className="hero-title-giant" style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', lineHeight: 0.9 }}>
              YOUR JOURNEY <br/><span style={{ color: 'var(--pitch-green)', textShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}>STARTS HERE.</span>
            </h1>
            <p style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '2rem auto 3.5rem', fontWeight: 500 }}>
              Join the elite network. Build your performance dossier, upload match footage, and get scouted by professional academies and clubs.
            </p>
            
            {onAddPlayer && (
              <button onClick={onAddPlayer} className="btn btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.5rem', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)' }}>
                INITIALIZE PROFILE
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="sport-card" style={{ borderTop: '4px solid var(--pitch-green)', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '2rem' }}>1. PROFILE</h3>
                <span className="badge badge-green">REQUIRED</span>
              </div>
              <p className="text-muted" style={{ fontSize: '1.1rem', margin: 0 }}>Input your physical attributes, playing position, and core stats.</p>
            </div>
            
            <div className="sport-card" style={{ borderTop: '4px solid var(--amber-gold)', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '2rem' }}>2. FOOTAGE</h3>
                <span className="badge badge-gold">CRITICAL</span>
              </div>
              <p className="text-muted" style={{ fontSize: '1.1rem', margin: 0 }}>Upload raw match highlights to showcase your on-ball abilities.</p>
            </div>
            
            <div className="sport-card" style={{ borderTop: '4px solid var(--energy-orange)', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '2rem' }}>3. DISCOVERY</h3>
                <span className="badge badge-orange">AUTOMATIC</span>
              </div>
              <p className="text-muted" style={{ fontSize: '1.1rem', margin: 0 }}>Our AI generates performance reports that push you to scout feeds.</p>
            </div>
          </div>
        </div>

      /* ── FALLBACK (Though Scout is handled by ScoutDashboard) ── */
      ) : null}

      {/* ── PLAYER DATABASE LISTING (Only visible to player once they have a profile) ── */}
      {players.length > 0 && userRole === 'player' && (
        <div id="player-database" style={{ paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>PLAYER DATABASE</h2>
          </div>
          <p className="text-muted" style={{ marginBottom: '2.5rem', fontFamily: 'var(--font-sport)', fontSize: '1.5rem' }}>
            SHOWING {filtered.length} OF {players.length} REGISTERED PLAYERS
          </p>

          <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="SEARCH PLAYERS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ flex: 1, minWidth: '200px', textTransform: 'uppercase', fontWeight: 700 }}
            />
            <select
              value={filterPosition}
              onChange={(e) => setFilterPos(e.target.value)}
              className="input-field"
              style={{ width: 'auto', minWidth: '150px', textTransform: 'uppercase', fontWeight: 700 }}
            >
              {['All', 'Forward', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'].map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="input-field"
              style={{ width: 'auto', minWidth: '130px', textTransform: 'uppercase', fontWeight: 700 }}
            >
              {['All', 'Under 16', 'Under 18', 'Under 21'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {(search || filterPosition !== 'All' || filterAge !== 'All') && (
              <button onClick={() => { setSearch(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-ghost">
                RESET
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <h3 style={{ color: 'var(--text-dim)' }}>0 RESULTS FOUND</h3>
              <button onClick={() => { setSearch(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <div className="roster-grid">
              {filtered.map((player) => (
                <div key={player.id} className={`sport-card ${getCardAccent(player.position)}`} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <span className={`badge ${getPosClass(player.position)}`}>
                      {player.position}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sport)', fontSize: '1.5rem', color: 'var(--text-dim)', lineHeight: 1 }}>
                      AGE {player.age}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 1rem', fontSize: '2.5rem', lineHeight: 1 }}>{player.name}</h3>

                  <div className="text-muted" style={{ fontFamily: 'var(--font-sport)', fontSize: '1.25rem', marginBottom: '2rem', flex: 1, letterSpacing: '1px' }}>
                    {player.highlights?.length || 0} HIGHLIGHT{player.highlights?.length !== 1 ? 'S' : ''} UPLOADED
                  </div>

                  <button onClick={() => onSelectPlayer && onSelectPlayer(player)} className="btn btn-secondary" style={{ width: '100%' }}>
                    VIEW PROFILE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerDashboard;
