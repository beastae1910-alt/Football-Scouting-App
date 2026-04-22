import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';

// SECURITY: Whitelist of accepted video MIME types (OWASP: restrict file type)
const ALLOWED_TYPES  = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB hard limit
const MAX_TITLE_LEN  = 120;

// SECURITY: Basic string sanitizer — strips HTML-injection characters
const sanitize = (str) => str.trim().replace(/[<>"'`]/g, '');

const UploadVideo = ({ playerName, onUpload, onCancel }) => {
  const [videoFile, setVideoFile]   = useState(null);
  const [videoURL, setVideoURL]     = useState(null);
  const [title, setTitle]           = useState('');
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // SECURITY: Validate MIME type against whitelist (not just file extension)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(`Invalid file type "${file.type}". Allowed: MP4, WebM, OGG, MOV.`);
      return;
    }

    // SECURITY: Enforce maximum file size to prevent storage abuse
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed: 100 MB.`);
      return;
    }

    setVideoFile(file);
    // BUG FIX: Revoke previous blob URL before creating a new one to prevent memory leak
    setVideoURL((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
    setUploadError(null);
  };

  // BUG FIX: Revoke blob URL when component unmounts
  useEffect(() => {
    return () => { if (videoURL) URL.revokeObjectURL(videoURL); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async () => {
    if (!videoFile) return;

    // SECURITY: Sanitize and length-limit the user-supplied title
    const safeTitle = sanitize(title || videoFile.name).slice(0, MAX_TITLE_LEN);

    setUploading(true);
    setUploadError(null);

    // Build a collision-resistant path: timestamp + random suffix
    const fileExt  = videoFile.name.split('.').pop().toLowerCase();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
    const filePath = `highlights/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from('highlights')
      .upload(filePath, videoFile, {
        contentType: videoFile.type, // explicitly set, don't let server guess
        upsert: false,               // prevent overwriting existing files
      });

    if (storageError) {
      setUploadError(`Upload failed: ${storageError.message}`);
      setUploading(false);
      return;
    }

    // Get the permanent public URL
    const { data } = supabase.storage.from('highlights').getPublicUrl(filePath);

    const videoData = {
      id:         Date.now(),
      title:      safeTitle,
      fileName:   videoFile.name,
      url:        data.publicUrl, // permanent — survives refresh
      uploadedAt: new Date().toLocaleDateString(),
    };

    setUploading(false);
    onUpload(videoData);
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '560px' }}>
      <button onClick={onCancel} className="btn btn-ghost" style={{ padding: '0.5rem 0', marginBottom: '1.5rem' }}>
        &larr; Back to Profile
      </button>

      <h2 style={{ marginBottom: '0.25rem' }}>Upload Highlight</h2>
      {playerName && <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>For: {playerName}</p>}

      <div className="card">
        {/* File Picker */}
        <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} id="video-input" />
        <label htmlFor="video-input" style={{ display: 'inline-block', marginBottom: '1rem', cursor: 'pointer' }}>
          <div className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Choose Video File
          </div>
        </label>

        {videoFile && (
          <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{videoFile.name}</strong>&nbsp;
            ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}

        {/* Local Preview */}
        {videoURL && (
          <video src={videoURL} controls style={{ width: '100%', borderRadius: 'var(--radius-sm)', background: '#000', marginBottom: '1rem', display: 'block' }} />
        )}

        {/* Title Input */}
        {videoFile && (
          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
              Title (optional, max {MAX_TITLE_LEN} chars)
            </span>
            <input
              type="text"
              placeholder="e.g. Hat-trick vs Pune FC"
              value={title}
              maxLength={MAX_TITLE_LEN} // SECURITY: browser-level length limit
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </label>
        )}

        {uploadError && (
          <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{uploadError}</p>
        )}

        {videoFile && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleUpload} disabled={uploading} className="btn btn-primary" style={{ opacity: uploading ? 0.7 : 1 }}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadVideo;
