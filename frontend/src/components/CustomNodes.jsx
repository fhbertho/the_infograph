import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, Zap, Globe, Server, Cpu, Shield, Activity, Network } from 'lucide-react';

const getNodeIcon = (nodeType) => {
  switch (nodeType) {
    case 'database':
      return <Database size={15} color="#10b981" />;
    case 'cache':
      return <Zap size={15} color="#34d399" />;
    case 'proxy':
      return <Globe size={15} color="#22c55e" />;
    case 'api':
      return <Server size={15} color="#10b981" />;
    case 'frontend':
      return <Cpu size={15} color="#4ade80" />;
    case 'monitoring':
      return <Activity size={15} color="#6ee7b7" />;
    default:
      return <Shield size={15} color="#71717a" />;
  }
};

export const CustomNode = memo(({ data }) => {
  const { label, nodeType, image, ports, envCount } = data;

  return (
    <div className={`custom-node ${nodeType || 'generic'}`}>
      <Handle type="target" position={Position.Top} style={{ background: '#10b981', width: 7, height: 7, border: '1px solid #000' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        {getNodeIcon(nodeType)}
        <strong style={{ fontSize: '0.9rem', color: '#f4f4f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px', fontWeight: 600 }}>
          {label}
        </strong>
      </div>

      {image && (
        <div style={{ fontSize: '0.72rem', color: '#71717a', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <code>{image}</code>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
        {ports && ports.length > 0 && (
          <span style={{ fontSize: '0.68rem', background: '#18181b', color: '#a1a1aa', border: '1px solid #27272a', borderRadius: '4px', padding: '1px 6px' }}>
            Porta: {ports.join(', ')}
          </span>
        )}
        {envCount > 0 && (
          <span style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.08)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '4px', padding: '1px 6px' }}>
            {envCount} Envs
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#10b981', width: 7, height: 7, border: '1px solid #000' }} />
    </div>
  );
});

export const NetworkNode = memo(({ data }) => {
  return (
    <div className="network-node" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Network size={15} color="#10b981" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
});
