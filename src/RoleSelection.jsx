import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const RoleSelection = ({ user, onRoleSelected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectRole = async (role) => {
    setLoading(true);
    setError(null);

    try {
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (selectError) throw selectError;

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role,
          });

        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { role },
      });

      if (metadataError) throw metadataError;

      onRoleSelected({ ...user, user_metadata: { ...user.user_metadata, role } });
    } catch (err) {
      console.error('Failed to save role:', err);
      setError('Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '480px', textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Welcome to ScoutIndia!
        </h1>

        <p className="text-muted" style={{ marginBottom: '2.5rem', fontSize: '1rem' }}>
          To customize your experience, please tell us how you'll be using the platform.
        </p>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <button
            onClick={() => handleSelectRole('player')}
            disabled={loading}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '2rem 1rem',
              height: 'auto',
              border: '2px solid var(--border-color)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontFamily: 'var(--font-sport)', fontSize: '3rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '50%' }}>
              01
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem' }}>
                I am a Player
              </h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                I want to build my profile and get scouted.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('scout')}
            disabled={loading}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '2rem 1rem',
              height: 'auto',
              border: '2px solid var(--border-color)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--success)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontFamily: 'var(--font-sport)', fontSize: '3rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '50%' }}>
              02
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem' }}>
                I am a Scout
              </h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                I want to discover and analyze talent.
              </p>
            </div>
          </button>
        </div>

        {loading && (
          <p className="text-muted" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Saving your preference...
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
