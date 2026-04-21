import { useState, useEffect } from 'react';
import PlayerDashboard from './PlayerDashboard';
import PlayerProfile from './PlayerProfile';
import UploadVideo from './UploadVideo';
import AddPlayer from './AddPlayer';
import { supabase } from './supabaseClient';

function App() {
  const [players, setPlayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'profile' | 'upload' | 'add'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedPlayer = players.find((p) => p.id === selectedId) || null;

  // Fetch players from Supabase on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching players:', error.message);
        setError('Failed to load players. Check your Supabase config.');
      } else {
        console.log('Raw data from Supabase:', data); // ← check highlights here
        const normalized = data.map((p) => ({
          ...p,
          highlights: p.highlights || [],
        }));
        setPlayers(normalized);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  const handleSelectPlayer = (player) => {
    setSelectedId(player.id);
    setView('profile');
  };

  // Add uploaded video to player's highlights in Supabase + local state
  const handleUpload = async (videoData) => {
    const updatedHighlights = [...(selectedPlayer.highlights || []), videoData];

    console.log('Saving to player id:', selectedId, typeof selectedId);
    console.log('Updated highlights:', updatedHighlights);

    const { data, error } = await supabase
      .from('players')
      .update({ highlights: updatedHighlights })
      .eq('id', selectedId)
      .select(); // returns updated rows so we can verify

    console.log('Update result - data:', data, 'error:', error);

    if (error) {
      alert(`DB error: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      alert(`No rows updated! Player id "${selectedId}" (type: ${typeof selectedId}) did not match any row.\n\nCheck Supabase Table Editor to see the actual id values.`);
      return;
    }

    // Update local state
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? { ...p, highlights: updatedHighlights }
          : p
      )
    );

    setView('profile');
  };

  // Add newly created player to local state
  const handlePlayerAdded = (newPlayer) => {
    setPlayers((prev) => [...prev, { ...newPlayer, highlights: [] }]);
    setView('dashboard');
  };

  // Generate AI Report and save to Supabase
  const handleGenerateReport = async (reportText) => {
    const { error } = await supabase
      .from('players')
      .update({ ai_report: reportText })
      .eq('id', selectedId);

    if (error) {
      alert(`Failed to save AI report: ${error.message}\n\nMake sure to add the 'ai_report' column in Supabase!`);
      return;
    }

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === selectedId ? { ...p, ai_report: reportText } : p
      )
    );
  };

  // Loading and error states
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', fontFamily: 'sans-serif', color: '#555' }}>
        Loading players...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', fontFamily: 'sans-serif', color: '#c00' }}>
        {error}
      </div>
    );
  }

  if (view === 'add') {
    return (
      <AddPlayer
        onPlayerAdded={handlePlayerAdded}
        onCancel={() => setView('dashboard')}
      />
    );
  }

  if (view === 'upload' && selectedPlayer) {
    return (
      <UploadVideo
        playerName={selectedPlayer.name}
        onUpload={handleUpload}
        onCancel={() => setView('profile')}
      />
    );
  }

  if (view === 'profile' && selectedPlayer) {
    return (
      <PlayerProfile
        player={selectedPlayer}
        onBack={() => setView('dashboard')}
        onUploadClick={() => setView('upload')}
        onGenerateReport={handleGenerateReport}
      />
    );
  }

  return <PlayerDashboard players={players} onSelectPlayer={handleSelectPlayer} onAddPlayer={() => setView('add')} />;
}

export default App;
