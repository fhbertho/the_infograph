import React, { useRef } from 'react';
import { Network, Upload, Play, Sparkles, Server, FileText } from 'lucide-react';

export function Header({ onFileUpload, onLoadSample, summary, toggleCopilot, copilotOpen }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <header style={{
      height: '60px',
      backgroundColor: '#111827',
      borderBottom: '1px solid #1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 20
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
        }}>
          <Network size={20} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            InfraGraph
          </h1>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DevOps & Topology Analyzer</p>
        </div>
      </div>

      {/* Summary Badges */}
      {summary && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', background: '#1e293b', padding: '4px 10px', borderRadius: '6px' }}>
            <Server size={14} color="#60a5fa" />
            <span>Serviços: <strong style={{ color: '#f8fafc' }}>{summary.total_services || summary.total_resources || 0}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', background: '#1e293b', padding: '4px 10px', borderRadius: '6px' }}>
            <FileText size={14} color="#34d399" />
            <span>Formato: <strong style={{ color: '#f8fafc' }}>{summary.format || 'Custom'}</strong></span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".yml,.yaml"
          onChange={handleFileChange}
        />

        <button 
          onClick={onLoadSample}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1f2937',
            color: '#e2e8f0',
            border: '1px solid #374151',
            borderRadius: '6px',
            padding: '7px 12px',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
        >
          <Play size={14} color="#34d399" />
          <span>Carregar Exemplo</span>
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 14px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <Upload size={14} />
          <span>Upload YAML</span>
        </button>

        <button 
          onClick={toggleCopilot}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: copilotOpen ? '#7c3aed' : '#1f2937',
            color: '#ffffff',
            border: copilotOpen ? '1px solid #8b5cf6' : '1px solid #374151',
            borderRadius: '6px',
            padding: '7px 14px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: copilotOpen ? '0 0 12px rgba(124, 58, 237, 0.4)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={14} color="#fbbf24" />
          <span>Copiloto AI</span>
        </button>
      </div>
    </header>
  );
}
