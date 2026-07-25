import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, Zap, Globe, Server, Cpu, Shield, Activity, Network } from 'lucide-react';

const getNodeIcon = (nodeType) => {
  switch (nodeType) {
    case 'database':
      return <Database className="w-4 h-4 text-amber-400" />;
    case 'cache':
      return <Zap className="w-4 h-4 text-rose-400" />;
    case 'proxy':
      return <Globe className="w-4 h-4 text-cyan-400" />;
    case 'api':
      return <Server className="w-4 h-4 text-purple-400" />;
    case 'frontend':
      return <Cpu className="w-4 h-4 text-emerald-400" />;
    case 'monitoring':
      return <Activity className="w-4 h-4 text-pink-400" />;
    default:
      return <Shield className="w-4 h-4 text-slate-400" />;
  }
};

export const CustomNode = memo(({ data }) => {
  const { label, nodeType, image, ports, envCount } = data;

  return (
    <div className={`custom-node ${nodeType || 'generic'}`}>
      <Handle type="target" position={Position.Top} style={{ background: '#3b82f6', width: 8, height: 8 }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        {getNodeIcon(nodeType)}
        <strong style={{ fontSize: '0.95rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
          {label}
        </strong>
      </div>

      {image && (
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <code>{image}</code>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
        {ports && ports.length > 0 && (
          <span style={{ fontSize: '0.7rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '4px', padding: '1px 6px' }}>
            Porta: {ports.join(', ')}
          </span>
        )}
        {envCount > 0 && (
          <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '4px', padding: '1px 6px' }}>
            {envCount} Envs
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#3b82f6', width: 8, height: 8 }} />
    </div>
  );
});

export const NetworkNode = memo(({ data }) => {
  return (
    <div className="network-node" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Network className="w-4 h-4 text-emerald-400" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
});
