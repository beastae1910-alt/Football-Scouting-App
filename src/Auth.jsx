import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

// SECURITY: Constants for rate limiting and validation
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 30000;
const MAX_EMAIL_LEN = 254;
const MAX_PASS_LEN  = 128;
const FALLBACK_TURNSTILE_SITE_KEY = '0x4AAAAAADC2lra94Q6i1vN8';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || FALLBACK_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-api';

let turnstileScriptPromise = null;

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL_LEN;

const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.turnstile), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Turnstile.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error('Turnstile loaded without an API object.'));
    };
    script.onerror = () => reject(new Error('Failed to load Turnstile.'));
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
};

const TurnstileChallenge = ({ sitekey, onVerify, onReady, onError }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    onVerify(null);
    onReady(null);

    if (!sitekey) return undefined;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;

        try {
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey,
            callback: (token) => onVerify(token),
            'expired-callback': () => onVerify(null),
            'timeout-callback': () => onVerify(null),
            'error-callback': (captchaError) => {
              onVerify(null);
              onError(captchaError || new Error('Turnstile failed.'));
            },
            'unsupported-callback': () => {
              onVerify(null);
              onError(new Error('Turnstile is not supported in this browser.'));
            },
          });

          onReady(() => {
            try {
              if (widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current);
              }
            } catch (resetError) {
              console.error('Failed to reset Turnstile:', resetError);
            }
            onVerify(null);
          });
        } catch (renderError) {
          onError(renderError);
        }
      })
      .catch((loadError) => {
        if (!cancelled) onError(loadError);
      });

    return () => {
      cancelled = true;
      onReady(null);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (removeError) {
          console.error('Failed to remove Turnstile:', removeError);
        }
      }
      widgetIdRef.current = null;
    };
  }, [sitekey, onVerify, onReady, onError]);

  return <div ref={containerRef} />;
};

const Auth = () => {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);

  const attemptsRef    = useRef(0);
  const lockedUntilRef = useRef(null);
  const captchaResetRef = useRef(null);

  const getRemainingLockout = () => {
    if (!lockedUntilRef.current) return 0;
    return Math.max(0, Math.ceil((lockedUntilRef.current - Date.now()) / 1000));
  };

  const resetCaptcha = useCallback(() => {
    captchaResetRef.current?.();
    setCaptchaToken(null);
  }, []);

  const handleCaptchaReady = useCallback((resetFn) => {
    captchaResetRef.current = resetFn;
  }, []);

  const handleCaptchaVerify = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const handleCaptchaError = useCallback((captchaError) => {
    console.error('Turnstile failed:', captchaError);
    setCaptchaToken(null);
    setError('Security check failed to load. Please refresh and try again.');
  }, []);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;

    const timer = setInterval(() => {
      const remaining = getRemainingLockout();
      setLockoutRemaining(remaining);
      if (remaining === 0) lockedUntilRef.current = null;
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  // ── Google OAuth ───────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // redirect back to the app after OAuth
      },
    });

    if (error) {
      console.error('Google sign-in failed:', error);
      setError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
    // On success, Supabase redirects the browser — no further action needed here
  };

  // ── Email / Password ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const remaining = getRemainingLockout();
    setLockoutRemaining(remaining);
    if (remaining > 0) { setError(`Too many failed attempts. Try again in ${remaining}s.`); return; }

    if (!isValidEmail(email))      { setError('Please enter a valid email address.'); return; }
    if (password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    if (password.length > MAX_PASS_LEN) { setError(`Password must be under ${MAX_PASS_LEN} characters.`); return; }
    if (!TURNSTILE_SITE_KEY)       { setError('Security check is not configured.'); return; }
    if (!captchaToken)             { setError('Please complete the security check.'); return; }

    setLoading(true);

    const { error: authError } = mode === 'login'
      ? await supabase.auth.signInWithPassword({
          email,
          password,
          options: { captchaToken }
        })
      : await supabase.auth.signUp({
          email,
          password,
          options: { captchaToken }
        });

    setLoading(false);
    resetCaptcha();

    if (authError) {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        lockedUntilRef.current = Date.now() + LOCKOUT_MS;
        attemptsRef.current = 0;
        setLockoutRemaining(Math.ceil(LOCKOUT_MS / 1000));
        setError('Too many failed attempts. Account locked for 30 seconds.');
      } else {
        const left = MAX_ATTEMPTS - attemptsRef.current;
        setError(`Invalid credentials. ${left} attempt${left !== 1 ? 's' : ''} remaining.`);
      }
      return;
    }

    attemptsRef.current = 0;
    lockedUntilRef.current = null;
    setLockoutRemaining(0);
    if (mode === 'signup') setSuccess('Account created! Check your email to confirm, then sign in.');
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError(null);
    setSuccess(null);
    resetCaptcha();
  };

  const isSubmitDisabled = loading || lockoutRemaining > 0 || !captchaToken || !TURNSTILE_SITE_KEY;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>

      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>ScoutIndia ⚽</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
          {mode === 'login' ? 'Welcome back. Sign in to continue.' : 'Join ScoutIndia. Get discovered.'}
        </p>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem' }}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>

        {/* ── Google Button ── */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.75rem', padding: '0.72rem 1rem', marginBottom: '1.5rem',
            background: '#fff', color: '#1f1f1f', border: '1px solid #ddd',
            borderRadius: 'var(--radius-sm)', cursor: googleLoading ? 'not-allowed' : 'pointer',
            fontWeight: '600', fontSize: '0.95rem', fontFamily: 'inherit',
            transition: 'all 0.2s ease', opacity: googleLoading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          {/* Google "G" SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* ── Divider ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* ── Email / Password Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Email Address</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="you@example.com" maxLength={MAX_EMAIL_LEN} autoComplete="email" className="input-field" />
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters" maxLength={MAX_PASS_LEN}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="input-field" />
          </label>

          {TURNSTILE_SITE_KEY ? (
            <div style={{ marginBottom: '1rem', minHeight: '65px' }}>
              <TurnstileChallenge
                sitekey={TURNSTILE_SITE_KEY}
                onVerify={handleCaptchaVerify}
                onReady={handleCaptchaReady}
                onError={handleCaptchaError}
              />
            </div>
          ) : (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Security check is not configured.
            </p>
          )}

          {error   && <p style={{ color: 'var(--danger)',  fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          {success && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem' }}>{success}</p>}

          <button type="submit" disabled={isSubmitDisabled} className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', opacity: isSubmitDisabled ? 0.7 : 1 }}>
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
