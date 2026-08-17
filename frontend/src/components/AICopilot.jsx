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
      backgroundColor: '#050505',
      borderLeft: '1px solid #1f1f23',
      position: 'absolute',
      right: 0,
      top: '60px',
      zIndex: 30,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.8)'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid #1f1f23',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#09090b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={17} color="#10b981" />
          <h2 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f4f4f5' }}>Copiloto AI de Infraestrutura</h2>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <X size={17} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1f1f23', background: '#070708' }}>
        <button 
          onClick={() => setActiveTab('audit')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'audit' ? '#0e0e11' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'audit' ? '2px solid #10b981' : '2px solid transparent',
            color: activeTab === 'audit' ? '#10b981' : '#71717a',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Auditoria de IA
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'chat' ? '#0e0e11' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'chat' ? '2px solid #10b981' : '2px solid transparent',
            color: activeTab === 'chat' ? '#10b981' : '#71717a',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
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
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto'
                }}>
                  <Sparkles size={24} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '0.9rem', color: '#f4f4f5', marginBottom: '6px', fontWeight: 600 }}>Gerar Diagnóstico com IA</h3>
                <p style={{ fontSize: '0.78rem', color: '#71717a', marginBottom: '18px', lineHeight: '1.4' }}>
                  A IA analisará a arquitetura em busca de SPOFs, vulnerabilidades de segurança e otimizações de custos.
                </p>
                <button
                  onClick={runAiAudit}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  <Sparkles size={14} color="#000000" /> Analisar Infraestrutura
                </button>
              </div>
            )}

            {auditLoading && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a' }}>
                <RefreshCw className="spin" size={26} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
                <p style={{ fontSize: '0.82rem' }}>Processando topologia com a IA...</p>
              </div>
            )}

            {auditResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {auditResult.analysis_text ? (
                  <div style={{ fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.5', whiteSpace: 'pre-wrap', background: '#0e0e11', border: '1px solid #1f1f23', padding: '14px', borderRadius: '8px' }}>
                    {auditResult.analysis_text}
                  </div>
                ) : (
                  <>
                    <div style={{ background: '#0e0e11', border: '1px solid #1f1f23', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.82rem', color: '#10b981', marginBottom: '6px', fontWeight: 600 }}>Resumo Executivo</h4>
                      <p style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: '1.4' }}>{auditResult.overview}</p>
                    </div>

                    <div style={{ background: '#0e0e11', border: '1px solid #27272a', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.82rem', color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 }}>
                        <AlertTriangle size={15} color="#10b981" /> Pontos Únicos de Falha (SPOF)
                      </h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.76rem', color: '#a1a1aa', lineHeight: '1.4' }}>
                        {auditResult.spof?.map((item, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>)}
                      </ul>
                    </div>

                    <div style={{ background: '#0e0e11', border: '1px solid #27272a', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.82rem', color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 }}>
                        <ShieldAlert size={15} color="#34d399" /> Riscos de Segurança
                      </h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.76rem', color: '#a1a1aa', lineHeight: '1.4' }}>
                        {auditResult.security_risks?.map((item, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>)}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 }}>
                        <CheckCircle size={15} color="#10b981" /> Recomendações
                      </h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.76rem', color: '#d1fae5', lineHeight: '1.4' }}>
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
                style={{ fontSize: '0.7rem', background: '#0e0e11', color: '#a1a1aa', border: '1px solid #27272a', borderRadius: '12px', padding: '4px 8px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#a1a1aa'; }}
              >
                ⚡ Simular queda do DB
              </button>
              <button 
                onClick={() => handleSendChat('Quais os pontos únicos de falha?')}
                style={{ fontSize: '0.7rem', background: '#0e0e11', color: '#a1a1aa', border: '1px solid #27272a', borderRadius: '12px', padding: '4px 8px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#a1a1aa'; }}
              >
                ⚠️ Listar SPOFs
              </button>
              <button 
                onClick={() => handleSendChat('Como transformar essa infra em Alta Disponibilidade (HA)?')}
                style={{ fontSize: '0.7rem', background: '#0e0e11', color: '#a1a1aa', border: '1px solid #27272a', borderRadius: '12px', padding: '4px 8px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#a1a1aa'; }}
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
                  {msg.sender === 'bot' && <Bot size={15} color="#10b981" style={{ marginTop: '4px', flexShrink: 0 }} />}
                  <div style={{
                    background: msg.sender === 'user' ? '#10b981' : '#0e0e11',
                    color: msg.sender === 'user' ? '#000000' : '#f4f4f5',
                    fontWeight: msg.sender === 'user' ? 500 : 400,
                    border: msg.sender === 'user' ? 'none' : '1px solid #27272a',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && <User size={15} color="#10b981" style={{ marginTop: '4px', flexShrink: 0 }} />}
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', color: '#71717a', fontSize: '0.75rem' }}>
                  <Bot size={15} color="#10b981" />
                  <span>Pensando...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div style={{ display: 'flex', gap: '6px', paddingTop: '10px', borderTop: '1px solid #1f1f23' }}>
              <input
                type="text"
                placeholder="Pergunte sobre a infraestrutura..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                style={{
                  flex: 1,
                  background: '#09090b',
                  border: '1px solid #27272a',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f4f4f5',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#27272a'}
              />
              <button
                onClick={() => handleSendChat()}
                style={{
                  background: '#10b981',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                <Send size={14} color="#000000" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
