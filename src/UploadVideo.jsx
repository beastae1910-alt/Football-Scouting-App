import React, { useState, useRef } from 'react';
import { supabase } from './supabaseClient';

const UploadVideo = ({ playerName, onUpload, onCancel }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file.');
      return;
    }
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file)); // local preview only
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setUploading(true);
    setUploadError(null);

    // Create a unique file path in Supabase Storage
    const fileExt = videoFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `highlights/${fileName}`;

    // Upload file to Supabase Storage bucket "highlights"
    const { error: storageError } = await supabase.storage
      .from('highlights')
      .upload(filePath, videoFile);

    if (storageError) {
      setUploadError(`Upload failed: ${storageError.message}`);
      setUploading(false);
      return;
    }

    // Get permanent public URL
    const { data } = supabase.storage
      .from('highlights')
      .getPublicUrl(filePath);

    const permanentUrl = data.publicUrl;

    const videoData = {
      id: Date.now(),
      title: title || videoFile.name,
      fileName: videoFile.name,
      url: permanentUrl, // permanent — survives refresh
      uploadedAt: new Date().toLocaleDateString(),
    };

    setUploading(false);
    onUpload(videoData);
  };

  return (
    <div style={{ maxWidth: '560px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Back to Profile
      </button>

      <h2 style={{ marginBottom: '0.25rem' }}>Upload Highlight</h2>
      {playerName && <p style={{ color: '#888', marginBottom: '1.5rem' }}>For: {playerName}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} id="video-input" />
        <label htmlFor="video-input" style={{ display: 'inline-block', padding: '0.6rem 1.2rem', background: '#1a1a2e', color: '#fff', borderRadius: '8px', cursor: 'pointer', border: '2px dashed #555' }}>
          Choose Video File
        </label>
      </div>

      {videoFile && (
        <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.75rem' }}>
          <strong>File:</strong> {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
      )}

      {videoURL && (
        <div style={{ marginBottom: '1rem' }}>
          <video src={videoURL} controls style={{ width: '100%', borderRadius: '8px', background: '#000' }} />
        </div>
      )}

      {videoFile && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Add a title (e.g. Hat-trick vs Pune FC)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
        </div>
      )}

      {uploadError && (
        <p style={{ color: '#c00', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{uploadError}</p>
      )}

      {videoFile && (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ padding: '0.65rem 1.5rem', background: uploading ? '#888' : '#00e676', color: '#000', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer' }}
          >
            {uploading ? 'Uploading to cloud...' : 'Upload'}
          </button>
          <button onClick={onCancel} style={{ padding: '0.65rem 1.2rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
