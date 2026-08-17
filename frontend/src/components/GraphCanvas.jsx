import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import { CustomNode, NetworkNode } from './CustomNodes';

export function GraphCanvas({ nodes: initialNodes, edges: initialEdges, onSelectNode }) {
  const nodeTypes = useMemo(() => ({
    customNode: CustomNode,
    networkNode: NetworkNode,
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Atualiza nós e arestas quando novos dados são carregados
  React.useEffect(() => {
    setNodes(initialNodes || []);
    setEdges(initialEdges || []);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#000000' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onSelectNode && onSelectNode(node)}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#1f1f23" gap={22} size={1.2} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.nodeType === 'database') return '#10b981';
            if (n.data?.nodeType === 'cache') return '#34d399';
            if (n.data?.nodeType === 'proxy') return '#22c55e';
            if (n.data?.nodeType === 'api') return '#059669';
            if (n.data?.nodeType === 'frontend') return '#4ade80';
            if (n.data?.nodeType === 'network') return '#10b981';
            return '#52525b';
          }}
          maskColor="rgba(0, 0, 0, 0.85)"
        />
      </ReactFlow>
    </div>
  );
}
