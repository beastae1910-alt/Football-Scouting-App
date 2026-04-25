import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from './supabaseClient';
import { AGE_FILTERS, matchesAgeFilter } from './playerFilters';

const getPosClass = (pos) => {
  if (pos === 'Forward') return 'badge-orange';
  if (pos === 'Midfielder') return 'badge-gold';
  if (pos === 'Winger') return 'badge-gold';
  if (pos === 'Goalkeeper') return 'badge-red';
  return 'badge-green'; // Defender
};

const getCardAccent = (pos) => {
  if (pos === 'Forward') return 'orange-accent';
  if (pos === 'Midfielder' || pos === 'Winger') return 'gold-accent';
  if (pos === 'Goalkeeper') return 'red-accent';
  return 'green-accent';
};

const CompactCard = ({ player, onClick }) => (
  <div 
    className={`sport-card ${getCardAccent(player.position)}`}
    onClick={() => onClick(player)} 
    style={{ cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s ease', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
  >
    <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: 'var(--bg-dark)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sport)', fontSize: '1.5rem', color: 'var(--text-main)', transition: 'all 0.2s ease' }}>
      {player.name?.[0]?.toUpperCase() || '?'}
    </div>
    <div style={{ flex: 1 }}>
      <h4 style={{ margin: '0 0 0.1rem', fontSize: '1.2rem', fontFamily: 'var(--font-ui)', fontWeight: 700, textTransform: 'none', letterSpacing: 0, transition: 'all 0.2s ease' }}>{player.name}</h4>
      <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s ease' }}>{player.position}</span>
    </div>
  </div>
);

const ScoutDashboard = ({ players = [], onSelectPlayer }) => {
  const safePlayers = useMemo(() => Array.isArray(players) ? players : [], [players]);
  const isLoadingPlayers = players === null || players === undefined;
  const [filterPosition, setFilterPos] = useState('All');
  const [filterAge, setFilterAge] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [topPlayers, setTopPlayers] = useState(null);
  const [recentPlayers, setRecentPlayers] = useState(null);

  const filteredRef      = useRef([]);
  const trackedSearches  = useRef(new Set());

  useEffect(() => {
    if (safePlayers.length === 0) return;
    let isMounted = true;

    const fetchScoutData = async () => {
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      const playerMap = {};
      safePlayers.forEach(p => playerMap[p.id] = p);

      const { data: allViews, error: viewsError } = await supabase.from('player_views').select('player_id').limit(500);
      if (!isMounted) return;
      if (viewsError) {
        console.error('Failed to fetch top players:', viewsError.message);
        setTopPlayers([]);
      } else if (allViews) {
        const counts = {};
        allViews.forEach(v => { counts[v.player_id] = (counts[v.player_id] || 0) + 1; });
        const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 4);
        const top = sortedIds.map(id => playerMap[id]).filter(Boolean);
        setTopPlayers(top);
      }

      const { data: recentViews, error: recentError } = await supabase
        .from('player_views')
        .select('player_id, view_date')
        .eq('scout_id', user.id)
        .order('view_date', { ascending: false })
        .limit(50);

      if (!isMounted) return;
      if (recentError) {
        console.error('Failed to fetch recent views:', recentError.message);
        setRecentPlayers([]);
      } else if (recentViews) {
        const seen = new Set();
        const recent = [];
        for (const view of recentViews) {
          if (!seen.has(view.player_id)) {
            seen.add(view.player_id);
            const p = playerMap[view.player_id];
            if (p) recent.push(p);
            if (recent.length >= 4) break;
          }
        }
        setRecentPlayers(recent);
      }
    };

    fetchScoutData();
    return () => { isMounted = false; };
  }, [safePlayers]);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = safePlayers.filter(p => {
    const matchesPos = filterPosition === 'All' || p.position === filterPosition;
    const matchesAge = matchesAgeFilter(p.age, filterAge);
    const matchesName = (p.name || '').toLowerCase().includes(normalizedSearch);
    return matchesPos && matchesAge && matchesName;
  });

  useEffect(() => {
    filteredRef.current = filtered;
  }, [filtered]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const timer = setTimeout(async () => {
      const currentFiltered = filteredRef.current;
      if (currentFiltered.length === 0) return;

      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) return;

      const toInsert = currentFiltered
        .slice(0, 10)
        .filter(p => !trackedSearches.current.has(`${query}:${p.id}`))
        .map(p => ({ player_id: p.id, scout_id: user.id, query }));

      if (toInsert.length === 0) return;

      toInsert.forEach(r => trackedSearches.current.add(`${r.query}:${r.player_id}`));

      await supabase.from('player_search_views').insert(toInsert);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="container animate-up" style={{ paddingTop: '2rem' }}>
      
      {/* ── SCOUT HERO LANDING ── */}
      <div className="hero-block" style={{ padding: '4rem 3rem', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 500px' }}>
          <div className="badge badge-orange" style={{ marginBottom: '1rem' }}>SCOUTING NETWORK</div>
          <h1 className="hero-title-giant" style={{ color: 'var(--pitch-green)', fontSize: 'clamp(4rem, 8vw, 6rem)' }}>TALENT<br/><span style={{ color: 'var(--text-main)', textShadow: 'none' }}>RADAR</span></h1>
          <p style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', maxWidth: '550px', margin: '1.5rem 0 0', fontWeight: 500 }}>
            Real-time access to emerging players. Filter by position, age, and performance metrics to build your shortlist.
          </p>
        </div>
        
        {safePlayers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', flex: '1 1 300px' }}>
            <div className="stat-box" style={{ borderTop: '4px solid var(--pitch-green)' }}>
              <div className="stat-value" style={{ color: 'var(--pitch-green)' }}>{safePlayers.length}</div>
              <div className="stat-label">ACTIVE PROSPECTS</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--amber-gold)' }}>
              <div className="stat-value" style={{ color: 'var(--amber-gold)' }}>{topPlayers ? topPlayers.length : '-'}</div>
              <div className="stat-label">HOT PROSPECTS</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--energy-orange)' }}>
              <div className="stat-value" style={{ color: 'var(--energy-orange)' }}>{recentPlayers ? recentPlayers.length : '-'}</div>
              <div className="stat-label">RECENTLY VIEWED</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--text-main)' }}>
              <div className="stat-value" style={{ color: 'var(--text-main)' }}>{AGE_FILTERS.length - 1}</div>
              <div className="stat-label">AGE BRACKETS</div>
            </div>
          </div>
        )}
      </div>

      {/* ── HOT & RECENT PLAYERS SECTION ── */}
      {safePlayers.length > 0 && searchQuery.trim().length === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div className="sport-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--pitch-green)' }}>HOT PROSPECTS</h3>
            </div>
            {!topPlayers ? <p className="text-muted">Loading network data...</p> : topPlayers.length === 0 ? <p className="text-muted">No activity yet. Discover players below.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topPlayers.map(p => <CompactCard key={p.id} player={p} onClick={onSelectPlayer} />)}
              </div>
            )}
          </div>

          <div className="sport-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--amber-gold)' }}>RECENTLY SCOUTED</h3>
            </div>
            {!recentPlayers ? <p className="text-muted">Loading network data...</p> : recentPlayers.length === 0 ? <p className="text-muted">No recently viewed players.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentPlayers.map(p => <CompactCard key={p.id} player={p} onClick={onSelectPlayer} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PLAYER DATABASE FILTERS ── */}
      {safePlayers.length > 0 && (
        <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem', flex: '1 1 100%' }}>PLAYER DATABASE</h3>
          
          <input
            type="text"
            placeholder="SEARCH PLAYERS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ flex: '1 1 250px', textTransform: 'uppercase', fontWeight: 600 }}
          />

          <select
            value={filterPosition}
            onChange={(e) => setFilterPos(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '160px', textTransform: 'uppercase', fontWeight: 600 }}
          >
            {['All', 'Forward', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'].map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>

          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '140px', textTransform: 'uppercase', fontWeight: 600 }}
          >
            {AGE_FILTERS.map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>

          {(searchQuery || filterPosition !== 'All' || filterAge !== 'All') && (
            <button onClick={() => { setSearchQuery(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-ghost" style={{ padding: '0.75rem' }}>
              RESET
            </button>
          )}
        </div>
      )}

      {/* ── STATES & ROSTER ── */}
      {isLoadingPlayers ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-sport)', fontSize: '2rem' }}>
          CONNECTING TO NETWORK...
        </div>
      ) : safePlayers.length === 0 ? (
        <div className="sport-card" style={{ textAlign: 'center', padding: '6rem 2rem', borderTop: '4px solid var(--text-dim)' }}>
          <div style={{ fontFamily: 'var(--font-sport)', fontSize: '6rem', color: 'var(--text-dim)', lineHeight: 0.9, marginBottom: '1.5rem' }}>NETWORK<br/>OFFLINE</div>
          <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--font-ui)' }}>
            The player database is currently awaiting new registrations. Once athletes create their profiles, they will automatically appear on your radar.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3 style={{ color: 'var(--text-dim)' }}>0 RESULTS FOUND</h3>
          <button onClick={() => { setSearchQuery(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            CLEAR FILTERS
          </button>
        </div>
      ) : (
        <div className="roster-grid">
          {filtered.map((player) => (
            <div 
              key={player.id} 
              className={`sport-card ${getCardAccent(player.position)}`}
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => onSelectPlayer(player)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span className={`badge ${getPosClass(player.position)}`}>
                  {player.position}
                </span>
                <span style={{ fontFamily: 'var(--font-sport)', fontSize: '1.5rem', color: 'var(--text-dim)', lineHeight: 1 }}>
                  AGE {player.age}
                </span>
              </div>

              <h3 style={{ margin: '0 0 0.5rem', fontSize: '2.5rem', lineHeight: 1, wordBreak: 'break-word' }}>{player.name}</h3>

              <div style={{ flex: 1, marginBottom: '2rem' }}></div>

              <button className="btn btn-secondary" style={{ width: '100%', pointerEvents: 'none' }}>
                VIEW DOSSIER
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoutDashboard;
