import React, { useState, useEffect, useMemo } from 'react';
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
  if (pos === 'Goalkeeper') return 'red-accent';
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

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch   = (p.name || '').toLowerCase().includes(search.toLowerCase());
      const matchesPosition = filterPosition === 'All' || p.position === filterPosition;
      const matchesAge =
        filterAge === 'All'      ? true :
        filterAge === 'Under 16' ? p.age <= 16 :
        filterAge === 'Under 18' ? p.age <= 18 :
        filterAge === 'Under 21' ? p.age <= 21 : true;

      return matchesSearch && matchesPosition && matchesAge;
    });
  }, [players, search, filterPosition, filterAge]);

  const scrollToPlayers = () => {
    document.getElementById('scout-dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container animate-up">
      
      {/* Conditional Hero / Stats Section */}
      {userRole === 'player' && players.length > 0 ? (
        <div className="hero-block" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h1 className="hero-title-giant" style={{ color: 'var(--text-main)' }}>
            WELCOME BACK, <span style={{ color: 'var(--pitch-green)' }}>{players[0].name.split(' ')[0]}</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '1.5rem auto 3rem' }}>
            Your profile is live on the network. Keep your highlights updated to maximize your exposure to professional scouts.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="stat-box" style={{ borderTop: '4px solid var(--amber-gold)', transition: 'all 0.3s ease' }}>
              <div className="stat-value" style={{ color: 'var(--amber-gold)' }}>{realViews !== null ? realViews : '-'}</div>
              <div className="stat-label">Scout Views</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--pitch-green)', transition: 'all 0.3s ease' }}>
              <div className="stat-value" style={{ color: 'var(--pitch-green)' }}>
                {searchAppearances !== null ? searchAppearances : '—'}
              </div>
              <div className="stat-label">Search Appearances</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--energy-orange)', transition: 'all 0.3s ease' }}>
              <div className="stat-value" style={{ color: 'var(--energy-orange)' }}>{shortlistCount !== null ? shortlistCount : '-'}</div>
              <div className="stat-label">Shortlists</div>
            </div>
            <div className="stat-box" style={{ borderTop: '4px solid var(--text-main)', transition: 'all 0.3s ease' }}>
              <div className="stat-value" style={{ color: 'var(--text-main)' }}>{players[0].highlights?.length || 0}</div>
              <div className="stat-label">Highlights</div>
            </div>
          </div>
        </div>
      ) : userRole === 'player' ? (
        <>
          <div className="hero-block" style={{ textAlign: 'center' }}>
            <h1 className="hero-title-giant">GET DISCOVERED. <br/><span style={{ color: 'var(--pitch-green)' }}>BUILD YOUR PROFILE.</span></h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '1.5rem auto 2.5rem' }}>
              Create your football profile. Upload your best match highlights and get noticed by professional scouts nationwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {onAddPlayer && (
                <button onClick={onAddPlayer} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
                  CREATE PROFILE NOW
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="sport-card" style={{ textAlign: 'center', padding: '3rem 2rem', transition: 'all 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-sport)', fontSize: '4rem', color: 'var(--pitch-green)', lineHeight: 1, marginBottom: '1rem' }}>01</div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>CREATE PROFILE</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '1.05rem' }}>
                Register your details, position, and performance attributes.
              </p>
            </div>
            <div className="sport-card" style={{ textAlign: 'center', padding: '3rem 2rem', transition: 'all 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-sport)', fontSize: '4rem', color: 'var(--amber-gold)', lineHeight: 1, marginBottom: '1rem' }}>02</div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>UPLOAD HIGHLIGHTS</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '1.05rem' }}>
                Add match footage and video clips showing your best moments.
              </p>
            </div>
            <div className="sport-card" style={{ textAlign: 'center', padding: '3rem 2rem', transition: 'all 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-sport)', fontSize: '4rem', color: 'var(--energy-orange)', lineHeight: 1, marginBottom: '1rem' }}>03</div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>GET DISCOVERED</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '1.05rem' }}>
                Stand out to scouts with AI-driven performance reports.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="hero-block" style={{ textAlign: 'center' }}>
          <h1 className="hero-title-giant">SCOUT <span style={{ color: 'var(--amber-gold)' }}>DASHBOARD</span></h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '1.5rem auto 2.5rem' }}>
            Discover talented players and analyze their performance across the network.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button onClick={scrollToPlayers} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
              BROWSE PLAYERS
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Section */}
      <div id="scout-dashboard" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>PLAYER DATABASE</h2>
          {onAddPlayer && (
            <button onClick={onAddPlayer} className="btn btn-secondary">
              + ADD PLAYER
            </button>
          )}
        </div>
        <p className="text-muted" style={{ marginBottom: '2.5rem', fontFamily: 'var(--font-sport)', fontSize: '1.5rem' }}>
          SHOWING {filtered.length} OF {players.length} REGISTERED PLAYERS
        </p>

        {/* Filter Bar */}
        <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <input
            type="text"
            placeholder="SEARCH PLAYERS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ flex: 1, minWidth: '200px', textTransform: 'uppercase', fontWeight: 700, transition: 'all 0.2s ease' }}
          />

          <select
            value={filterPosition}
            onChange={(e) => setFilterPos(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '150px', textTransform: 'uppercase', fontWeight: 700, transition: 'all 0.2s ease' }}
          >
            {['All', 'Forward', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'].map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>

          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '130px', textTransform: 'uppercase', fontWeight: 700, transition: 'all 0.2s ease' }}
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

{/* Player Cards */}
        {players.length === 0 ? (
          <div className="sport-card" style={{ textAlign: 'center', padding: '5rem 1rem', transition: 'all 0.3s ease' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>NO PLAYERS REGISTERED</h3>
            <p className="text-muted" style={{ marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
              {userRole === 'scout'
                ? "The database is currently empty. Check back later."
                : "Create your football profile to get discovered."}
            </p>
            {onAddPlayer && (
              <button onClick={onAddPlayer} className="btn btn-primary">
                CREATE YOUR PROFILE
              </button>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', transition: 'all 0.3s ease' }}>
            <h3 style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>0 RESULTS FOUND</h3>
            <button onClick={() => { setSearch(''); setFilterPos('All'); setFilterAge('All'); }} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="roster-grid">
            {filtered.map((player) => (
              <div key={player.id} className={`sport-card ${getCardAccent(player.position)}`} style={{ display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <span className={`badge ${getPosClass(player.position)}`} style={{ transition: 'all 0.2s ease' }}>
                    {player.position}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sport)', fontSize: '1.5rem', color: 'var(--text-dim)', lineHeight: 1, transition: 'all 0.2s ease' }}>
                    AGE {player.age}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 1rem', fontSize: '2.5rem', lineHeight: 1, transition: 'all 0.2s ease' }}>{player.name}</h3>

                <div className="text-muted" style={{ fontFamily: 'var(--font-sport)', fontSize: '1.25rem', marginBottom: '2rem', flex: 1, letterSpacing: '1px', transition: 'all 0.2s ease' }}>
                  {player.highlights?.length || 0} HIGHLIGHT{player.highlights?.length !== 1 ? 'S' : ''} UPLOADED
                </div>

                <button onClick={() => onSelectPlayer && onSelectPlayer(player)} className="btn btn-secondary" style={{ width: '100%', transition: 'all 0.2s ease' }}>
                  VIEW PROFILE
                </button>
              </div>
            ))}
          </div>
        )}
          </div>
        ) : filtered.length === 0 ? (
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
    </div>
  );
};

export default PlayerDashboard;
