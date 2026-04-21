import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = () => {
  const [mode, setMode]       = useState('login'); // 'login' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { error } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else if (mode === 'signup') {
      setSuccess('Account created! Check your email to confirm, then sign in.');
    }

    setLoading(false);
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError(null);
    setSuccess(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>

      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
          ScoutIndia ⚽
        </h1>
        <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
          {mode === 'login'
            ? 'Welcome back. Sign in to your account.'
            : 'Join ScoutIndia. Upload highlights. Get discovered.'}
        </p>
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem' }}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
              Email Address
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="input-field"
            />
          </label>

          {error   && <p style={{ color: 'var(--danger)',  fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          {success && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem' }}>{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          >
            {loading
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', marginBottom: 0 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={switchMode} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600', padding: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
