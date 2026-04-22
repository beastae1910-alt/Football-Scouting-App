import React, { useState } from 'react';

const positionColors = {
  Forward:    '#F59E0B',
  Midfielder: '#3B82F6',
  Winger:     '#8B5CF6',
  Goalkeeper: '#EF4444',
  Defender:   '#10B981',
};

const PlayerDashboard = ({ players = [], userRole, onSelectPlayer, onAddPlayer }) => {
  const [search, setSearch]             = useState('');
  const [filterPosition, setFilterPos]  = useState('All');
  const [filterAge, setFilterAge]       = useState('All');

  const filtered = players.filter((p) => {
    const matchesSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = filterPosition === 'All' || p.position === filterPosition;
    const matchesAge =
      filterAge === 'All'      ? true :
      filterAge === 'Under 16' ? p.age <= 16 :
      filterAge === 'Under 18' ? p.age <= 18 :
      filterAge === 'Under 21' ? p.age <= 21 : true;

    return matchesSearch && matchesPosition && matchesAge;
  });

  const scrollToPlayers = () => {
    document.getElementById('scout-dashboard').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container animate-fade-in">
      
      {/* Conditional Hero / Stats Section */}
      {userRole === 'player' && players.length > 0 ? (
        <div className="hero-section" style={{ padding: '3rem 1rem 2rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Welcome Back, {players[0].name}</h1>
          <p className="hero-subtitle">
            Your profile is live. Upload highlights to increase your chances of getting scouted.
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ fontSize: '1.8rem', color: 'var(--accent-primary)' }}>142</strong><br/>
              <span className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scout Views</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.8rem', color: 'var(--success)' }}>18</strong><br/>
              <span className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search Appearances</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.8rem', color: 'var(--warning)' }}>{players[0].highlights?.length || 0}</strong><br/>
              <span className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Highlights</span>
            </div>
          </div>
        </div>
      ) : userRole === 'player' ? (
        <>
          <div className="hero-section">
            <h1 className="hero-title">Get Discovered. <br/>Build Your Football Profile.</h1>
            <p className="hero-subtitle">
              Create your football profile to get discovered. Upload your best match highlights and get noticed by professional scouts nationwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {onAddPlayer && (
                <button onClick={onAddPlayer} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
                  Create Profile
                </button>
              )}
            </div>
          </div>

          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-icon">1</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Create Profile</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Register your details, position, and attributes.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">2</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Upload Highlights</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Add video clips showing your best moments.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">3</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Get Discovered</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Stand out to scouts with AI-driven performance reports.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="hero-section">
          <h1 className="hero-title">Scout Dashboard</h1>
          <p className="hero-subtitle">
            Discover talented players and analyze their performance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={scrollToPlayers} className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
              Browse Players
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Section */}
      <div id="scout-dashboard" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ margin: 0 }}>Player Dashboard</h2>
          {onAddPlayer && (
            <button onClick={onAddPlayer} className="btn btn-primary">
              + Add Player
            </button>
          )}
        </div>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          Showing {filtered.length} of {players.length} registered players
        </p>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ flex: 1, minWidth: '200px' }}
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
            {['All', 'Under 16', 'Under 18', 'Under 21'].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {(search || filterPosition !== 'All' || filterAge !== 'All') && (
            <button onClick={() => { setSearch(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-secondary">
              Clear
            </button>
          )}
        </div>

        {/* Player Cards */}
        {players.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No players yet.</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              {userRole === 'scout'
                ? "No players available yet. Check back later."
                : "Create your football profile to get discovered."}
            </p>
            {onAddPlayer && (
              <button onClick={onAddPlayer} className="btn btn-primary">
                Create Your Profile
              </button>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p className="text-muted">No players match your current filters.</p>
            <button onClick={() => { setSearch(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-ghost" style={{ marginTop: '1rem' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-cards">
            {filtered.map((player) => (
              <div key={player.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
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
                  <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>•</span>
                  <span>{player.highlights?.length || 0} highlight{player.highlights?.length !== 1 ? 's' : ''}</span>
                </div>

                <button onClick={() => onSelectPlayer && onSelectPlayer(player)} className="btn btn-secondary" style={{ width: '100%' }}>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;
