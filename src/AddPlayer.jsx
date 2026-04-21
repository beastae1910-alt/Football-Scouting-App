import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const POSITIONS = ['Forward', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'];

// SECURITY: Strict field length limits (OWASP: reject oversized inputs)
const LIMITS = { name: 100, city: 100 };

// SECURITY: Sanitize — strips characters used in XSS / HTML injection
const sanitize = (str) => str.trim().replace(/[<>"'`]/g, '');

// SECURITY: Only allow letters, spaces, hyphens, apostrophes in names
const isValidName = (str) => /^[a-zA-Z\s'-]+$/.test(str);

const AddPlayer = ({ user, onPlayerAdded, onCancel }) => {
  const [form, setForm]     = useState({ name: '', age: '', position: 'Forward', city: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // SECURITY: Enforce max length at input time, not just on submit
    if (LIMITS[name] && value.length > LIMITS[name]) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // SECURITY: Sanitize all text inputs before validation and storage
    const name = sanitize(form.name);
    const city = sanitize(form.city);
    const age  = Number(form.age);

    // Validate name — required, max length, allowed characters
    if (!name)                          return setError('Name is required.');
    if (name.length > LIMITS.name)      return setError(`Name must be under ${LIMITS.name} characters.`);
    if (!isValidName(name))             return setError('Name may only contain letters, spaces, hyphens, and apostrophes.');

    // Validate age — must be a real integer in range (no float tricks)
    if (!Number.isInteger(age) || age < 1 || age > 40)
      return setError('Enter a valid age between 1 and 40.');

    // Validate position — must be from the whitelist (OWASP: reject unexpected fields)
    if (!POSITIONS.includes(form.position))
      return setError('Invalid position selected.');

    // Validate city
    if (!city)                          return setError('City is required.');
    if (city.length > LIMITS.city)      return setError(`City must be under ${LIMITS.city} characters.`);

    setSaving(true);

    const { data, error: dbError } = await supabase
      .from('players')
      .insert([{
        name,
        age,
        position: form.position,
        city,
        highlights: [],
        user_id:    user?.id, // link player to authenticated user
      }])
      .select()
      .single();

    setSaving(false);

    if (dbError) { setError(`Failed to save: ${dbError.message}`); return; }
    onPlayerAdded(data);
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '520px' }}>
      <button onClick={onCancel} className="btn btn-ghost" style={{ padding: '0.5rem 0', marginBottom: '1.5rem' }}>
        &larr; Back to Players
      </button>

      <h2 style={{ marginBottom: '0.25rem' }}>Create Player Profile</h2>
      <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
        Fill in your details to register on ScoutIndia.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
              Full Name <span style={{ opacity: 0.5 }}>(max {LIMITS.name} chars)</span>
            </span>
            <input name="name" type="text" placeholder="e.g. Arjun Sharma" value={form.name} onChange={handleChange} className="input-field" maxLength={LIMITS.name} autoComplete="name" />
          </label>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Age</span>
            <input name="age" type="number" placeholder="e.g. 17" value={form.age} onChange={handleChange} className="input-field" min="1" max="40" step="1" />
          </label>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Position</span>
            <select name="position" value={form.position} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
              {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
              City <span style={{ opacity: 0.5 }}>(max {LIMITS.city} chars)</span>
            </span>
            <input name="city" type="text" placeholder="e.g. Mumbai" value={form.city} onChange={handleChange} className="input-field" maxLength={LIMITS.city} />
          </label>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Create Profile'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlayer;
