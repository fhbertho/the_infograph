import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ShieldAlert, CheckCircle, Send, X, Bot, User, RefreshCw } from 'lucide-react';
import axios from 'axios';

export function AICopilot({ isOpen, onClose, infraData }) {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'chat'
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Olá! Sou o seu Copiloto de Infraestrutura. Faça uma pergunta sobre a topologia ou clique nas sugestões abaixo!' }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const runAiAudit = async () => {
    if (!infraData) return;
    setAuditLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/ai-analyze', infraData);
      setAuditResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleSendChat = async (questionText) => {
    const text = questionText || inputQuestion;
    if (!text.trim() || !infraData) return;

    const userMsg = { sender: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuestion('');
    setChatLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/copilot', {
        infra_data: infraData,
        question: text
      });
      setChatMessages((prev) => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: 'bot', text: 'Desculpe, ocorreu um erro ao se comunicar com o backend do Copiloto.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      width: '420px',
      height: 'calc(100% - 60px)',
      backgroundColor: '#111827',
      borderLeft: '1px solid #1f2937',
      position: 'absolute',
      right: 0,
      top: '60px',
      zIndex: 30,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-10px 0 25px rgba(0,0,0,0.5)'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#151d30'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#fbbf24" />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Copiloto AI de Infraestrutura</h2>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1f2937', background: '#0b0f19' }}>
        <button 
          onClick={() => setActiveTab('audit')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'audit' ? '#151d30' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'audit' ? '2px solid #8b5cf6' : 'none',
            color: activeTab === 'audit' ? '#f8fafc' : '#94a3b8',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Auditoria de IA
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'chat' ? '#151d30' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'chat' ? '2px solid #8b5cf6' : 'none',
            color: activeTab === 'chat' ? '#f8fafc' : '#94a3b8',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Chat Interativo
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'audit' && (
          <div>
            {!auditResult && !auditLoading && (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <Sparkles size={36} color="#8b5cf6" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '0.9rem', color: '#f8fafc', marginBottom: '6px' }}>Gerar Diagnóstico com IA</h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '16px' }}>
                  A IA analisará a arquitetura em busca de SPOFs, vulnerabilidades de segurança e otimizações de custos.
                </p>
                <button
                  onClick={runAiAudit}
                  style={{
                    backgroundColor: '#7c3aed',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} /> Analisar Infraestrutura
                </button>
              </div>
            )}

            {auditLoading && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <RefreshCw className="spin" size={28} color="#8b5cf6" style={{ margin: '0 auto 12px auto' }} />
                <p style={{ fontSize: '0.85rem' }}>Processando topologia com a IA...</p>
              </div>
            )}

            {auditResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {auditResult.analysis_text ? (
                  <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {auditResult.analysis_text}
                  </div>
                ) : (
                  <>
                    <div style={{ background: '#1e293b', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#60a5fa', marginBottom: '6px' }}>Resumo Executivo</h4>
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{auditResult.overview}</p>
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <AlertTriangle size={16} /> Pontos Únicos de Falha (SPOF)
                      </h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: '#fef3c7' }}>
                        {auditResult.spof?.map((item, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>)}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <ShieldAlert size={16} /> Riscos de Segurança
                      </h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: '#ffe4e6' }}>
                        {auditResult.security_risks?.map((item, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>)}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <CheckCircle size={16} /> Recomendações
                      </h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: '#d1fae5' }}>
                        {auditResult.recommendations?.map((item, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>)}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Suggestion Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              <button 
                onClick={() => handleSendChat('O que acontece se o banco de dados cair?')}
                style={{ fontSize: '0.7rem', background: '#1e293b', color: '#93c5fd', border: '1px solid #334155', borderRadius: '12px', padding: '4px 8px', cursor: 'pointer' }}
              >
                ⚡ Simular queda do DB
              </button>
              <button 
                onClick={() => handleSendChat('Quais os pontos únicos de falha?')}
                style={{ fontSize: '0.7rem', background: '#1e293b', color: '#fde047', border: '1px solid #334155', borderRadius: '12px', padding: '4px 8px', cursor: 'pointer' }}
              >
                ⚠️ Listar SPOFs
              </button>
              <button 
                onClick={() => handleSendChat('Como transformar essa infra em Alta Disponibilidade (HA)?')}
                style={{ fontSize: '0.7rem', background: '#1e293b', color: '#86efac', border: '1px solid #334155', borderRadius: '12px', padding: '4px 8px', cursor: 'pointer' }}
              >
                🚀 Sugerir Alta Disponibilidade
              </button>
            </div>

            {/* Chat List */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  {msg.sender === 'bot' && <Bot size={16} color="#8b5cf6" style={{ marginTop: '4px', flexShrink: 0 }} />}
                  <div style={{
                    background: msg.sender === 'user' ? '#2563eb' : '#1e293b',
                    color: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && <User size={16} color="#60a5fa" style={{ marginTop: '4px', flexShrink: 0 }} />}
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.75rem' }}>
                  <Bot size={16} color="#8b5cf6" />
                  <span>Pensando...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div style={{ display: 'flex', gap: '6px', paddingTop: '10px', borderTop: '1px solid #1f2937' }}>
              <input
                type="text"
                placeholder="Pergunte sobre a infraestrutura..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                style={{
                  flex: 1,
                  background: '#0b0f19',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem'
                }}
              />
              <button
                onClick={() => handleSendChat()}
                style={{
                  background: '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
