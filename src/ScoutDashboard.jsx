import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

const positionColors = {
  Forward:    '#F97316', // Orange
  Midfielder: '#F59E0B', // Gold
  Winger:     '#EAB308', // Yellow
  Goalkeeper: '#EF4444', // Red
  Defender:   '#10B981', // Green
};

const CompactCard = ({ player, onClick }) => (
  <div 
    className="card" 
    onClick={() => onClick(player)} 
    style={{ cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
  >
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>
      {player.name?.[0]?.toUpperCase() || '?'}
    </div>
    <div>
      <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem' }}>{player.name}</h4>
      <span className="text-muted" style={{ fontSize: '0.8rem' }}>{player.position}</span>
    </div>
  </div>
);

const ScoutDashboard = ({ players = [], onSelectPlayer }) => {
  const [filterPosition, setFilterPos] = useState('All');
  const [filterAge, setFilterAge] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [topPlayers, setTopPlayers] = useState(null);
  const [recentPlayers, setRecentPlayers] = useState(null);

  const filteredRef      = useRef([]);
  const trackedSearches  = useRef(new Set());

  useEffect(() => {
    if (!players || players.length === 0) return;
    let isMounted = true;

    const fetchScoutData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      const playerMap = {};
      players.forEach(p => playerMap[p.id] = p);

      const { data: allViews, error: viewsError } = await supabase.from('player_views').select('player_id').limit(500);
      if (!isMounted) return;
      if (viewsError) {
        console.error('Failed to fetch top players:', viewsError.message);
        setTopPlayers([]);
      } else if (allViews) {
        const counts = {};
        allViews.forEach(v => { counts[v.player_id] = (counts[v.player_id] || 0) + 1; });
        const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5);
        const top = sortedIds.map(id => playerMap[id]).filter(Boolean);
        setTopPlayers(top);
      }

      const { data: recentViews, error: recentError } = await supabase
        .from('player_views')
        .select('player_id, viewed_at')
        .eq('scout_id', user.id)
        .order('viewed_at', { ascending: false })
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
            if (recent.length >= 5) break;
          }
        }
        setRecentPlayers(recent);
      }
    };

    fetchScoutData();
    return () => { isMounted = false; };
  }, [players]);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = (players || []).filter(p => {
    const matchesPos = filterPosition === 'All' || p.position === filterPosition;
    const matchesAge =
      filterAge === 'All'      ? true :
      filterAge === 'Under 16' ? p.age <= 16 :
      filterAge === 'Under 18' ? p.age <= 18 :
      filterAge === 'Under 21' ? p.age <= 21 : true;
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const toInsert = currentFiltered
        .slice(0, 10)
        .filter(p => !trackedSearches.current.has(`${query}:${p.id}`))
        .map(p => ({ player_id: p.id, scout_id: user.id, query }));

      if (toInsert.length === 0) return;

      toInsert.forEach(r => trackedSearches.current.add(`${r.query}:${r.player_id}`));

      const { error } = await supabase.from('player_search_views').insert(toInsert);
      if (error) {
        console.error('Search tracking error:', error.message);
        toInsert.forEach(r => trackedSearches.current.delete(`${r.query}:${r.player_id}`));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      
      <div className="hero-section" style={{ padding: '2rem 1rem', marginBottom: '2rem', borderBottom: 'none' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Scout Dashboard</h1>
        <p className="hero-subtitle">
          Discover talented players and analyze their performance.
        </p>
      </div>

      {players && players.length > 0 && searchQuery.trim().length === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>Top Players</h3>
            {!topPlayers ? <p className="text-muted">Loading...</p> : topPlayers.length === 0 ? <p className="text-muted">No player activity yet</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {topPlayers.map(p => <CompactCard key={p.id} player={p} onClick={onSelectPlayer} />)}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>Recently Viewed</h3>
            {!recentPlayers ? <p className="text-muted">Loading...</p> : recentPlayers.length === 0 ? <p className="text-muted">No recent views</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {recentPlayers.map(p => <CompactCard key={p.id} player={p} onClick={onSelectPlayer} />)}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <p className="text-muted" style={{ margin: 0 }}>
          Showing {filtered.length} of {players?.length || 0} players
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search players by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '250px' }}
          />

          <select
            value={filterPosition}
            onChange={(e) => setFilterPos(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {['All', 'Forward', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'].map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>

          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '130px' }}
          >
            {['All', 'Under 16', 'Under 18', 'Under 21'].map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>

          {(searchQuery || filterPosition !== 'All' || filterAge !== 'All') && (
            <button onClick={() => { setSearchQuery(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-secondary">
              Clear
            </button>
          )}
        </div>
      </div>

      {players === null ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-secondary)' }}>
          Loading players...
        </div>
      ) : players.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>No players yet.</h3>
          <p className="text-muted">No players available yet. Check back later.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p className="text-muted">No players match your filter.</p>
          <button onClick={() => { setSearchQuery(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-ghost" style={{ marginTop: '1rem' }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((player) => (
            <div 
              key={player.id} 
              className="card" 
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => onSelectPlayer(player)}
            >
              <div style={{ marginBottom: '1rem' }}>
                <span 
                  className="badge" 
                  style={{ 
                    background: positionColors[player.position] ? `${positionColors[player.position]}15` : 'rgba(255,255,255,0.05)', 
                    color: positionColors[player.position] || '#fff',
                    border: `1px solid ${positionColors[player.position] ? positionColors[player.position] : '#ffffff'}40`
                  }}
                >
                  {player.position}
                </span>
              </div>

              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{player.name}</h3>

              <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1 }}>
                <span>Age {player.age}</span>
              </div>

              <button className="btn btn-secondary" style={{ width: '100%', pointerEvents: 'none' }}>
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoutDashboard;
