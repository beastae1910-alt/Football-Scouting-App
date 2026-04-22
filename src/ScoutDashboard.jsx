import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const positionColors = {
  Forward:    '#F59E0B',
  Midfielder: '#3B82F6',
  Winger:     '#8B5CF6',
  Goalkeeper: '#EF4444',
  Defender:   '#10B981',
};

const CompactCard = ({ player, onClick }) => (
  <div 
    className="card" 
    onClick={() => onClick(player)} 
    style={{ 
      cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', 
      minWidth: '200px', transition: 'transform 0.2s ease', background: 'var(--bg-surface)' 
    }} 
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'} 
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
      {player.name[0]?.toUpperCase() || '?'}
    </div>
    <div>
      <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem' }}>{player.name}</h4>
      <span className="text-muted" style={{ fontSize: '0.8rem' }}>{player.position}</span>
    </div>
  </div>
);

const ScoutDashboard = ({ players = [], onSelectPlayer }) => {
  const [filterPosition, setFilterPos] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [topPlayers, setTopPlayers] = useState(null);
  const [recentPlayers, setRecentPlayers] = useState(null);

  useEffect(() => {
    const fetchScoutData = async () => {
      if (!players || players.length === 0) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const playerMap = {};
      players.forEach(p => playerMap[p.id] = p);

      // 1. Top Players (Aggregate views)
      const { data: allViews } = await supabase.from('player_views').select('player_id').limit(500);
      if (allViews) {
        const counts = {};
        allViews.forEach(v => { counts[v.player_id] = (counts[v.player_id] || 0) + 1; });
        const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5);
        const top = sortedIds.map(id => playerMap[id]).filter(Boolean);
        setTopPlayers(top);
      }

      // 2. Recently Viewed (Current Scout)
      const { data: recentViews } = await supabase
        .from('player_views')
        .select('player_id, viewed_at')
        .eq('scout_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(50); // Fetch enough to deduplicate safely

      if (recentViews) {
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

    if (players && players.length > 0) {
      fetchScoutData();
    }
  }, [players]);

  // 3. REAL SEARCH & Filter
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = (players || []).filter(p => {
    const matchesPos = filterPosition === 'All' || p.position === filterPosition;
    const matchesName = (p.name || '').toLowerCase().includes(normalizedSearch);
    return matchesPos && matchesName;
  });

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      
      <div className="hero-section" style={{ padding: '2rem 1rem', marginBottom: '2rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Scout Dashboard</h1>
        <p className="hero-subtitle">
          Discover talented players and analyze their performance.
        </p>
      </div>

      {/* FEATURE 1 & 2: Top Players & Recent Views */}
      {players && players.length > 0 && searchQuery.trim().length === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔥 Top Players</h3>
            {!topPlayers ? <p className="text-muted">Loading...</p> : topPlayers.length === 0 ? <p className="text-muted">No player activity yet</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {topPlayers.map(p => <CompactCard key={p.id} player={p} onClick={onSelectPlayer} />)}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>👁️ Recently Viewed</h3>
            {!recentPlayers ? <p className="text-muted">Loading...</p> : recentPlayers.length === 0 ? <p className="text-muted">No recent views</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {recentPlayers.map(p => <CompactCard key={p.id} player={p} onClick={onSelectPlayer} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FILTER BAR & SEARCH */}
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
        </div>
      </div>

      {players === null ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-secondary)' }}>
          Loading players...
        </div>
      ) : players.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🏆</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No players yet.</h3>
          <p className="text-muted">No players available yet. Check back later.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p className="text-muted">No players match your filter.</p>
          <button onClick={() => setFilterPos('All')} className="btn btn-ghost" style={{ marginTop: '1rem' }}>
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((player) => (
            <div 
              key={player.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                transition: 'transform 0.2s ease', 
                cursor: 'pointer' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ marginBottom: '1rem' }}>
                <span 
                  className="badge" 
                  style={{ 
                    background: `${positionColors[player.position]}20` || 'rgba(255,255,255,0.1)', 
                    color: positionColors[player.position] || '#fff',
                    border: `1px solid ${positionColors[player.position]}40`
                  }}
                >
                  {player.position}
                </span>
              </div>

              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{player.name}</h3>

              <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1 }}>
                <span>Age {player.age}</span>
              </div>

              <button onClick={() => onSelectPlayer(player)} className="btn btn-secondary" style={{ width: '100%' }}>
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
