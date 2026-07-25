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
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
        <Background color="#334155" gap={20} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.nodeType === 'database') return '#f59e0b';
            if (n.data?.nodeType === 'cache') return '#f43f5e';
            if (n.data?.nodeType === 'network') return '#10b981';
            return '#3b82f6';
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}
