import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const POSITIONS = ['Forward', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'];

const AddPlayer = ({ onPlayerAdded, onCancel }) => {
  const [form, setForm]       = useState({ name: '', age: '', position: 'Forward', city: '' });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.name.trim())        return setError('Name is required.');
    if (!form.age || form.age < 1 || form.age > 40) return setError('Enter a valid age (1–40).');
    if (!form.city.trim())        return setError('City is required.');

    setSaving(true);

    const { data, error } = await supabase
      .from('players')
      .insert([{
        name:       form.name.trim(),
        age:        Number(form.age),
        position:   form.position,
        city:       form.city.trim(),
        highlights: [],
      }])
      .select()
      .single();

    setSaving(false);

    if (error) {
      setError(`Failed to add player: ${error.message}`);
      return;
    }

    onPlayerAdded(data); // pass new player back to App.jsx
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginTop: '0.3rem',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    fontSize: '0.85rem',
    color: '#444',
    marginBottom: '1rem',
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>

      <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.9rem', marginBottom: '1rem', padding: 0 }}>
        Back to Players
      </button>

      <h2 style={{ marginBottom: '0.25rem' }}>Add New Player</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill in the details to register a player.</p>

      <form onSubmit={handleSubmit}>

        <label style={labelStyle}>
          Full Name
          <input name="name" type="text" placeholder="e.g. Arjun Sharma" value={form.name} onChange={handleChange} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Age
          <input name="age" type="number" placeholder="e.g. 17" value={form.age} onChange={handleChange} style={inputStyle} min="1" max="40" />
        </label>

        <label style={labelStyle}>
          Position
          <select name="position" value={form.position} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
            {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
          </select>
        </label>

        <label style={labelStyle}>
          City
          <input name="city" type="text" placeholder="e.g. Mumbai" value={form.city} onChange={handleChange} style={inputStyle} />
        </label>

        {error && (
          <p style={{ color: '#c00', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: '0.65rem 1.5rem', background: saving ? '#888' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '0.95rem' }}
          >
            {saving ? 'Adding...' : 'Add Player'}
          </button>
          <button type="button" onClick={onCancel} style={{ padding: '0.65rem 1.2rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddPlayer;
