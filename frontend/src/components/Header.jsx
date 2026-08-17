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
      backgroundColor: '#070708',
      borderBottom: '1px solid #1f1f23',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 20
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #10b981, #047857)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 14px rgba(16, 185, 129, 0.25)'
        }}>
          <Network size={18} color="#000000" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.02em' }}>
            InfraGraph
          </h1>
          <p style={{ fontSize: '0.68rem', color: '#71717a' }}>DevOps & Topology Analyzer</p>
        </div>
      </div>

      {/* Summary Badges */}
      {summary && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#a1a1aa', background: '#0e0e11', border: '1px solid #1f1f23', padding: '4px 10px', borderRadius: '6px' }}>
            <Server size={13} color="#10b981" />
            <span>Serviços: <strong style={{ color: '#f4f4f5' }}>{summary.total_services || summary.total_resources || 0}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#a1a1aa', background: '#0e0e11', border: '1px solid #1f1f23', padding: '4px 10px', borderRadius: '6px' }}>
            <FileText size={13} color="#34d399" />
            <span>Formato: <strong style={{ color: '#f4f4f5' }}>{summary.format || 'Custom'}</strong></span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".yml,.yaml,.tf"
          onChange={handleFileChange}
        />

        <button 
          onClick={onLoadSample}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#0e0e11',
            color: '#d4d4d8',
            border: '1px solid #27272a',
            borderRadius: '6px',
            padding: '7px 12px',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#18181b';
            e.currentTarget.style.borderColor = '#3f3f46';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0e0e11';
            e.currentTarget.style.borderColor = '#27272a';
          }}
        >
          <Play size={13} color="#10b981" />
          <span>Carregar Exemplo</span>
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#18181b',
            color: '#f4f4f5',
            border: '1px solid #27272a',
            borderRadius: '6px',
            padding: '7px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#27272a';
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.color = '#10b981';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#18181b';
            e.currentTarget.style.borderColor = '#27272a';
            e.currentTarget.style.color = '#f4f4f5';
          }}
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
            backgroundColor: copilotOpen ? '#10b981' : '#0e0e11',
            color: copilotOpen ? '#000000' : '#d4d4d8',
            border: copilotOpen ? '1px solid #10b981' : '1px solid #27272a',
            borderRadius: '6px',
            padding: '7px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: copilotOpen ? '0 0 14px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            if (!copilotOpen) {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.color = '#10b981';
            }
          }}
          onMouseOut={(e) => {
            if (!copilotOpen) {
              e.currentTarget.style.borderColor = '#27272a';
              e.currentTarget.style.color = '#d4d4d8';
            }
          }}
        >
          <Sparkles size={14} color={copilotOpen ? '#000000' : '#10b981'} />
          <span>Copiloto AI</span>
        </button>
      </div>
    </header>
  );
}
