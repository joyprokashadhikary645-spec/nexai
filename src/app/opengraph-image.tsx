// src/app/opengraph-image.tsx

import { ImageResponse } from 'next/og';

export const alt = 'NexAI — Free AI SaaS Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a12 0%, #1e1b3a 50%, #312e81 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 88,
              height: 88,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            
          </div>
          <div style={{ display: 'flex', color: 'white', fontSize: 72, fontWeight: 800 }}>NexAI</div>
        </div>
        <div style={{ display: 'flex', color: '#c7d2fe', fontSize: 32, fontWeight: 500 }}>
          Free AI SaaS Platform
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 36,
          }}
        >
          {['Chat', 'Content', 'Images', 'Code'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                color: '#e0e7ff',
                fontSize: 22,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
