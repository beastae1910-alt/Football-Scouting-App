import React, { useState, useRef } from 'react';
import { supabase } from './supabaseClient';

// SECURITY: Constants for rate limiting and validation
const MAX_ATTEMPTS    = 5;    // max failed logins before lockout
const LOCKOUT_MS      = 30000; // 30 second lockout window
const MAX_EMAIL_LEN   = 254;  // RFC 5321 max email length
const MAX_PASS_LEN    = 128;  // sane maximum to prevent DoS via bcrypt

// SECURITY: Email format validation (OWASP recommended pattern)
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL_LEN;

const Auth = () => {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  // SECURITY: Client-side rate limiting state
  const attemptsRef  = useRef(0);
  const lockedUntilRef = useRef(null);

  const getRemainingLockout = () => {
    if (!lockedUntilRef.current) return 0;
    return Math.max(0, Math.ceil((lockedUntilRef.current - Date.now()) / 1000));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // SECURITY: Check rate limit lockout before any network call
    const remaining = getRemainingLockout();
    if (remaining > 0) {
      setError(`Too many failed attempts. Try again in ${remaining}s.`);
      return;
    }

    // SECURITY: Validate email format client-side before sending to server
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // SECURITY: Enforce password length bounds
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password.length > MAX_PASS_LEN) {
      setError(`Password must be under ${MAX_PASS_LEN} characters.`);
      return;
    }

    setLoading(true);

    const { error: authError } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (authError) {
      // SECURITY: Rate limit — increment attempt counter on every failure
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        lockedUntilRef.current = Date.now() + LOCKOUT_MS;
        attemptsRef.current = 0;
        setError(`Too many failed attempts. Account locked for 30 seconds.`);
      } else {
        // SECURITY: Return a generic message — don't reveal if email exists
        const remaining = MAX_ATTEMPTS - attemptsRef.current;
        setError(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
      }
      return;
    }

    // Success — reset rate limit counter
    attemptsRef.current = 0;
    lockedUntilRef.current = null;

    if (mode === 'signup') {
      setSuccess('Account created! Check your email to confirm, then sign in.');
    }
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
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>ScoutIndia ⚽</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
          {mode === 'login' ? 'Welcome back. Sign in to your account.' : 'Join ScoutIndia. Upload highlights. Get discovered.'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem' }}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="you@example.com"
              maxLength={MAX_EMAIL_LEN}
              autoComplete="email"
              className="input-field"
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              maxLength={MAX_PASS_LEN}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="input-field"
            />
          </label>

          {error   && <p style={{ color: 'var(--danger)',  fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          {success && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem' }}>{success}</p>}

          <button
            type="submit"
            disabled={loading || getRemainingLockout() > 0}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
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
