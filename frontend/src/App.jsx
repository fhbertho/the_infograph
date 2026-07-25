import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { GraphCanvas } from './components/GraphCanvas';
import { AICopilot } from './components/AICopilot';
import { Server, Cpu, Database, Network, ShieldAlert, Code, X } from 'lucide-react';

export default function App() {
  const [infraData, setInfraData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  // Carrega a infraestrutura de exemplo ao iniciar a aplicação
  useEffect(() => {
    loadSampleInfra();
  }, []);

  const loadSampleInfra = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/sample');
      setInfraData(res.data);
    } catch (err) {
      console.error(err);
      setError('Certifique-se de que o backend Python em FastAPI esteja rodando na porta 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/parse-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setInfraData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao processar o arquivo YAML.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header
        onFileUpload={handleFileUpload}
        onLoadSample={loadSampleInfra}
        summary={infraData?.summary}
        toggleCopilot={() => setCopilotOpen(!copilotOpen)}
        copilotOpen={copilotOpen}
      />

      <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
        {error && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#7f1d1d',
            color: '#fecaca',
            border: '1px solid #991b1b',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '0.82rem',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
          }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: '#0b0f19' }}>
            <div style={{ textAlign: 'center' }}>
              <Server size={36} className="spin" color="#3b82f6" style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '0.9rem' }}>Carregando e renderizando topologia...</p>
            </div>
          </div>
        ) : (
          <GraphCanvas
            nodes={infraData?.nodes || []}
            edges={infraData?.edges || []}
            onSelectNode={(node) => setSelectedNode(node)}
          />
        )}

        {/* Modal Inspetor do Nó Selecionado */}
        {selectedNode && (
          <div style={{
            position: 'absolute',
            left: '20px',
            bottom: '20px',
            width: '320px',
            backgroundColor: '#151d30',
            border: '1px solid #2a364f',
            borderRadius: '10px',
            padding: '14px',
            zIndex: 25,
            boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700 }}>
                {selectedNode.data?.label}
              </h3>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Tipo:</strong> <span style={{ color: '#60a5fa' }}>{selectedNode.data?.nodeType}</span></div>
              {selectedNode.data?.image && <div><strong>Imagem:</strong> <code>{selectedNode.data?.image}</code></div>}
              {selectedNode.data?.kind && <div><strong>Kind:</strong> {selectedNode.data?.kind}</div>}
              {selectedNode.data?.ports && <div><strong>Portas:</strong> {selectedNode.data?.ports.join(', ')}</div>}
            </div>
          </div>
        )}

        {/* Sidebar do Copiloto AI */}
        <AICopilot
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          infraData={infraData}
        />
      </div>
    </div>
  );
}
