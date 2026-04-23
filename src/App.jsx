import { useState, useEffect } from 'react';
import PlayerDashboard from './PlayerDashboard';
import ScoutDashboard from './ScoutDashboard';
import PlayerProfile from './PlayerProfile';
import UploadVideo from './UploadVideo';
import AddPlayer from './AddPlayer';
import Auth from './Auth';
import RoleSelection from './RoleSelection';
import { supabase } from './supabaseClient';

const STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];

function App() {
  const [user, setUser]               = useState(null);
  const [profile, setProfile]         = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [players, setPlayers]         = useState([]);
  const [selectedId, setSelectedId]   = useState(null);
  const [view, setView]               = useState('dashboard');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const selectedPlayer = players.find((p) => p.id === selectedId) || null;
  const effectiveRole = profile?.role || user?.user_metadata?.role || null;

  // ── Auth listener ──────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
        setAuthLoading(false);
      })
      .catch(() => {
        if (isMounted) setAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Fetch Profile ──────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
        .then(({ data, error }) => {
          if (!isMounted) return;
          if (error) {
            console.error('Profile fetch error:', error.message);
            setProfile({ role: user.user_metadata?.role || null });
          } else {
            setProfile(data || { role: user.user_metadata?.role || null });
          }
        });
    } else {
      queueMicrotask(() => {
        if (isMounted) setProfile(null);
      });
    }

    return () => { isMounted = false; };
  }, [user]);

  // ── Guard: reset to dashboard if profile view loses its player ─
  useEffect(() => {
    if (view === 'profile' && !selectedPlayer) {
      queueMicrotask(() => setView('dashboard'));
    }
  }, [view, selectedPlayer]);

  // ── Fetch players based on user role ───────────────────────
  useEffect(() => {
    let isMounted = true;

    if (!user || !effectiveRole) {
      queueMicrotask(() => {
        if (isMounted) setPlayers([]);
      });
      return () => { isMounted = false; };
    }

    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('players').select('*').order('name', { ascending: true });
      
      // If player, only fetch their own profiles. If scout, fetch all.
      if (effectiveRole === 'player') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (!isMounted) return;
      if (error) {
        setError('Failed to load players. Please try refreshing.');
      } else {
        setPlayers((data || []).map((p) => ({ ...p, highlights: p.highlights || [] })));
      }
      setLoading(false);
    };

    fetchPlayers();
    return () => { isMounted = false; };
  }, [user, effectiveRole]);

  // ── Handlers ───────────────────────────────────────────────
  const handleSelectPlayer = (player) => { setSelectedId(player.id); setView('profile'); };

  const handleSignOut = () => supabase.auth.signOut();

  const handleRoleSelected = (updatedUser) => {
    setUser(updatedUser);
    setProfile((prev) => ({ ...(prev || {}), role: updatedUser.user_metadata?.role || null }));
  };

  const handleUpload = async (videoData) => {
    if (!selectedPlayer) return;

    const updatedHighlights = [...(selectedPlayer.highlights || []), videoData];
    
    // Only verify user_id if the user is a player modifying their own profile
    let query = supabase.from('players').update({ highlights: updatedHighlights }).eq('id', selectedId);
    if (effectiveRole === 'player') {
      query = query.eq('user_id', user.id);
    }
    
    const { data, error } = await query.select();

    if (error) { alert(`DB error: ${error.message}`); return; }
    if (!data || data.length === 0) { alert('No rows updated!'); return; }

    setPlayers((prev) => prev.map((p) =>
      p.id === selectedId ? { ...p, highlights: updatedHighlights } : p
    ));
    setView('profile');
  };

  const handlePlayerAdded = (newPlayer) => {
    setPlayers((prev) => [...prev, { ...newPlayer, highlights: [] }]);
    setView('dashboard');
  };

  const handleGenerateReport = async (reportText) => {
    let query = supabase.from('players').update({ ai_report: reportText }).eq('id', selectedId);
    if (effectiveRole === 'player') {
      query = query.eq('user_id', user.id);
    }
    
    const { error } = await query;
    if (error) { alert(`Failed to save report: ${error.message}`); return; }
    
    setPlayers((prev) => prev.map((p) =>
      p.id === selectedId ? { ...p, ai_report: reportText } : p
    ));
  };

  const handleSaveStats = async (stats) => {
    if (!selectedPlayer || effectiveRole !== 'player' || selectedPlayer.user_id !== user.id) {
      throw new Error('You can only update your own player stats.');
    }

    const normalizedStats = STAT_KEYS.reduce((next, key) => {
      const value = Number(stats?.[key]);
      next[key] = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 50;
      return next;
    }, {});

    const { data, error } = await supabase
      .from('players')
      .update({ stats: normalizedStats })
      .eq('id', selectedId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    setPlayers((prev) => prev.map((p) =>
      p.id === selectedId ? { ...p, ...data, highlights: data.highlights || [] } : p
    ));
  };

  // ── Auth loading splash ────────────────────────────────────
  if (authLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}>
      Loading...
    </div>
  );

  // ── Not logged in ──────────────────────────────────────────
  if (!user) return <Auth />;

  // ── Profile loading splash ─────────────────────────────────
  if (!profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-secondary)' }}>
      Loading profile...
    </div>
  );

  // ── Role Selection ─────────────────────────────────────────
  if (!effectiveRole) {
    return <RoleSelection user={user} onRoleSelected={handleRoleSelected} />;
  }

  // ── Main app ───────────────────────────────────────────────
  const roleBadgeColor = effectiveRole === 'scout' ? 'var(--success)' : 'var(--accent-primary)';
  const roleBadgeBg = effectiveRole === 'scout' ? 'var(--success-bg)' : 'rgba(59, 130, 246, 0.1)';

  return (
    <>
      {/* Navigation bar */}
      <nav className="glass-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.02em', padding: 0 }}>
            ScoutIndia
          </button>
          <span className="badge" style={{ background: roleBadgeBg, color: roleBadgeColor, border: `1px solid ${roleBadgeColor}40`, textTransform: 'capitalize' }}>
            {effectiveRole}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="text-muted hide-mobile" style={{ fontSize: '0.82rem' }}>{user.email}</span>
          <button onClick={handleSignOut} className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Loading / Error states */}
      {loading && <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-secondary)' }}>Loading players...</div>}
      {error   && <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--danger)' }}>{error}</div>}

      {/* Views */}
      {!loading && !error && (
        <>
          {view === 'add' && (
            <AddPlayer user={user} onPlayerAdded={handlePlayerAdded} onCancel={() => setView('dashboard')} />
          )}
          {view === 'upload' && selectedPlayer && (
            <UploadVideo playerName={selectedPlayer.name} onUpload={handleUpload} onCancel={() => setView('profile')} />
          )}
          {view === 'profile' && selectedPlayer && (
            <PlayerProfile key={selectedPlayer.id} player={selectedPlayer} userRole={effectiveRole} viewerId={user.id} onBack={() => setView('dashboard')} onUploadClick={() => setView('upload')} onGenerateReport={handleGenerateReport} onSaveStats={handleSaveStats} />
          )}
          {view === 'dashboard' && (
            <div style={{ paddingTop: '1rem' }}>
              {effectiveRole === 'scout' ? (
                <ScoutDashboard 
                  players={players} 
                  onSelectPlayer={handleSelectPlayer} 
                />
              ) : (
                <PlayerDashboard 
                  players={players} 
                  userRole={effectiveRole}
                  onSelectPlayer={handleSelectPlayer} 
                  onAddPlayer={players.length === 0 ? () => setView('add') : null} 
                />
              )}
            </div>
          )}
        </>
      )}
      
      <style>{`
        @media (max-width: 600px) { .hide-mobile { display: none !important; } }
      `}</style>
    </>
  );
}

export default App;
