'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface ImageUploaderProps {
  storeId: string;
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  storeId,
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Vous ne pouvez uploader que ${maxImages} images maximum.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const newUrls = [...images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          throw new Error('Seules les images sont autorisées');
        }

        // 1. Get presigned URL
        const { uploadUrl, publicUrl } = await api.post('/pd/upload/presigned-url', {
          store_id: storeId,
          filename: file.name,
          content_type: file.type,
        });

        // 2. Upload directly to S3
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error('Échec du téléchargement vers le stockage');
        }

        newUrls.push(publicUrl);
      }

      onChange(newUrls);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        {images.map((url, index) => (
          <div
            key={url}
            style={{
              position: 'relative',
              width: 120,
              height: 120,
              borderRadius: 'var(--pd-radius-md)',
              border: '1px solid var(--pd-border)',
              overflow: 'hidden',
              backgroundColor: 'var(--pd-bg-secondary)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Upload ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label="Supprimer l'image"
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (!uploading && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={uploading ? -1 : 0}
            aria-label="Uploader des images"
            style={{
              width: 120,
              height: 120,
              borderRadius: 'var(--pd-radius-md)',
              border: '2px dashed var(--pd-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              backgroundColor: 'var(--pd-bg-secondary)',
              transition: 'all var(--pd-transition)',
              opacity: uploading ? 0.7 : 1,
            }}
            className="hover-lift"
          >
            {uploading ? (
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--pd-text-tertiary)' }} />
            ) : (
              <>
                <Upload size={24} style={{ color: 'var(--pd-text-tertiary)', marginBottom: 8 }} />
                <span style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-secondary)' }}>
                  Upload
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: 'var(--pd-red)', fontSize: 'var(--pd-fs-sm)', marginTop: 8 }}>
          {error}
        </p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />
      <p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)', marginTop: 8 }}>
        {images.length} / {maxImages} images
      </p>
    </div>
  );
}
