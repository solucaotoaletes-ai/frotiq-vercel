import { useState, useEffect } from 'react';

export default function Home() {
  const [tab, setTab] = useState('frotiq');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* Abas */}
      <div style={{
        display: 'flex',
        background: '#0f1219',
        borderBottom: '1px solid #1a2335',
        gap: 0
      }}>
        <button
          onClick={() => setTab('frotiq')}
          style={{
            padding: '16px 24px',
            background: tab === 'frotiq' ? '#f5b81e' : 'transparent',
            color: tab === 'frotiq' ? '#0a0d13' : '#8b92a9',
            border: 'none',
            cursor: 'pointer',
            fontWeight: tab === 'frotiq' ? '600' : '400',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          🚛 FROTIQ Completo
        </button>
        <button
          onClick={() => setTab('vistoria')}
          style={{
            padding: '16px 24px',
            background: tab === 'vistoria' ? '#f5b81e' : 'transparent',
            color: tab === 'vistoria' ? '#0a0d13' : '#8b92a9',
            border: 'none',
            cursor: 'pointer',
            fontWeight: tab === 'vistoria' ? '600' : '400',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          ✓ Vistoria
        </button>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'frotiq' && (
          <iframe
            src="/frotiq_completo.html"
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title="FROTIQ"
          />
        )}
        {tab === 'vistoria' && (
          <iframe
            src="/index.html"
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title="Vistoria"
          />
        )}
      </div>
    </div>
  );
}
