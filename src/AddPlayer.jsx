import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const POSITIONS = ['Forward', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'];

const AddPlayer = ({ user, onPlayerAdded, onCancel }) => {
  const [form, setForm]     = useState({ name: '', age: '', position: 'Forward', city: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim())                        return setError('Name is required.');
    if (!form.age || form.age < 1 || form.age > 40) return setError('Enter a valid age (1–40).');
    if (!form.city.trim())                        return setError('City is required.');

    setSaving(true);

    const { data, error } = await supabase
      .from('players')
      .insert([{
        name:       form.name.trim(),
        age:        Number(form.age),
        position:   form.position,
        city:       form.city.trim(),
        highlights: [],
        user_id:    user?.id,   // ← links player to logged-in user
      }])
      .select()
      .single();

    setSaving(false);

    if (error) { setError(`Failed to add player: ${error.message}`); return; }
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
        <form onSubmit={handleSubmit}>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Full Name</span>
            <input name="name" type="text" placeholder="e.g. Arjun Sharma" value={form.name} onChange={handleChange} className="input-field" />
          </label>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Age</span>
            <input name="age" type="number" placeholder="e.g. 17" value={form.age} onChange={handleChange} className="input-field" min="1" max="40" />
          </label>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Position</span>
            <select name="position" value={form.position} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
              {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>City</span>
            <input name="city" type="text" placeholder="e.g. Mumbai" value={form.city} onChange={handleChange} className="input-field" />
          </label>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
              {saving ? 'Saving...' : 'Create Profile'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddPlayer;
