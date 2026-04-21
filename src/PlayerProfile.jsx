import React, { useState } from 'react';
import { generateReport } from './generateReport';

const getCredibilityBadge = (highlights = []) => {
  if (highlights.length >= 3) return { label: 'Rising Talent', color: 'var(--warning)', bg: 'var(--warning-bg)' };
  if (highlights.length >= 1) return { label: 'Active Player', color: 'var(--accent-primary)', bg: 'rgba(59, 130, 246, 0.1)' };
  return { label: 'New Player', color: 'var(--text-secondary)', bg: 'var(--bg-surface)' };
};

const STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];

const StatBar = ({ label, value }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
      <span className="text-muted" style={{ textTransform: 'capitalize', fontWeight: '500' }}>{label}</span>
      <span style={{ 
        fontWeight: '700', 
        color: value > 80 ? 'var(--success)' : value < 65 ? 'var(--danger)' : 'var(--text-primary)' 
      }}>{value}</span>
    </div>
    <div style={{ background: 'var(--bg-main)', borderRadius: '100px', height: '8px', border: '1px solid var(--border-color)' }}>
      <div style={{ 
        width: `${value}%`, 
        height: '100%', 
        borderRadius: '100px', 
        background: value > 80 ? 'var(--success)' : value < 65 ? 'var(--danger)' : 'var(--accent-primary)', 
        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
      }} />
    </div>
  </div>
);

const PlayerProfile = ({ player, onBack, onUploadClick, onGenerateReport }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!player) return <div>Player not found</div>;

  const badge = getCredibilityBadge(player.highlights);

  const generateReportText = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerateReport(generateReport(player));
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="container animate-fade-in">
      <button onClick={onBack} className="btn btn-ghost" style={{ marginBottom: '1.5rem', padding: '0.5rem 0' }}>
        &larr; Back to Dashboard
      </button>

      {/* Header Card */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: 'var(--bg-main)', border: '2px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)' 
        }}>
          {player.name[0]}
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{player.name}</h1>
            <span className="badge" style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}40` }}>
              {badge.label}
            </span>
          </div>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
            {player.position} &middot; Age {player.age}{player.city ? ` \u00b7 ${player.city}` : ''}
          </p>
        </div>

        <button onClick={onUploadClick} className="btn btn-primary">
          Upload Highlight
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
        <button className={`tab ${activeTab === 'highlights' ? 'active' : ''}`} onClick={() => setActiveTab('highlights')}>
          Highlights <span className="badge" style={{ background: 'var(--bg-surface)', marginLeft: '0.5rem' }}>{player.highlights?.length || 0}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'overview' && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Biography</h3>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              {player.bio || `${player.name} is a ${player.age}-year-old ${player.position} registered on ScoutIndia. Review their stats and highlights to evaluate their potential.`}
            </p>

            {/* AI Report Card */}
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--success-bg)', borderRadius: 'var(--radius-md)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--success)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.88-.45 1.71-1 2.45-.63.83-1.46 1.49-2.45 1.95a2 2 0 0 1-2.9-1.39A7.95 7.95 0 0 1 12 2Z"/><path d="M4 14a8 8 0 0 0 16 0"/><path d="M10 20v2"/><path d="M14 20v2"/><path d="M12 22v-6"/></svg>
                  AI Scouting Report
                </h4>
                {!player.ai_report && (
                  <button onClick={generateReportText} disabled={isGenerating} className="btn btn-success" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                    {isGenerating ? 'Analyzing Data...' : 'Generate Report'}
                  </button>
                )}
              </div>
              
              <p style={{ margin: 0, color: player.ai_report ? 'var(--text-primary)' : 'var(--text-secondary)', fontStyle: player.ai_report ? 'normal' : 'italic', fontSize: '0.95rem' }}>
                {player.ai_report || 'No analysis generated yet. Click generate to analyze player statistics.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0 }}>Performance Attributes</h3>
              <span className="badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                Self-Reported
              </span>
            </div>

            {player.stats && Object.keys(player.stats).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0 3rem' }}>
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
              <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}>🎥</div>
                <h3 style={{ margin: '0 0 0.5rem' }}>No footage available</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Upload game highlights to showcase this player's abilities.</p>
                <button onClick={onUploadClick} className="btn btn-primary">Upload Video</button>
              </div>
            ) : (
              <div className="grid-cards">
                {player.highlights.map((vid) => (
                  <div key={vid.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <video src={vid.url} controls style={{ width: '100%', display: 'block', background: '#000', borderBottom: '1px solid var(--border-color)' }} />
                    <div style={{ padding: '1rem' }}>
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
