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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000000' }}>
      <Header
        onFileUpload={handleFileUpload}
        onLoadSample={loadSampleInfra}
        summary={infraData?.summary}
        toggleCopilot={() => setCopilotOpen(!copilotOpen)}
        copilotOpen={copilotOpen}
      />

      <div style={{ flex: 1, position: 'relative', display: 'flex', backgroundColor: '#000000' }}>
        {error && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#18181b',
            color: '#f87171',
            border: '1px solid #7f1d1d',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '0.8rem',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)'
          }}>
            <ShieldAlert size={16} color="#f87171" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', background: '#000000' }}>
            <div style={{ textAlign: 'center' }}>
              <Server size={32} className="spin" color="#10b981" style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Carregando e renderizando topologia...</p>
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
            backgroundColor: '#0c0c0e',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '14px',
            zIndex: 25,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '0.88rem', color: '#f4f4f5', fontWeight: 600 }}>
                {selectedNode.data?.label}
              </h3>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex' }}>
                <X size={15} />
              </button>
            </div>
            
            <div style={{ fontSize: '0.76rem', color: '#a1a1aa', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong style={{ color: '#71717a' }}>Tipo:</strong> <span style={{ color: '#10b981', fontWeight: 500 }}>{selectedNode.data?.nodeType}</span></div>
              {selectedNode.data?.image && <div><strong style={{ color: '#71717a' }}>Imagem:</strong> <code style={{ color: '#e4e4e7', background: '#18181b', padding: '1px 4px', borderRadius: '3px' }}>{selectedNode.data?.image}</code></div>}
              {selectedNode.data?.kind && <div><strong style={{ color: '#71717a' }}>Kind:</strong> <span style={{ color: '#e4e4e7' }}>{selectedNode.data?.kind}</span></div>}
              {selectedNode.data?.ports && <div><strong style={{ color: '#71717a' }}>Portas:</strong> <span style={{ color: '#34d399' }}>{selectedNode.data?.ports.join(', ')}</span></div>}
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
