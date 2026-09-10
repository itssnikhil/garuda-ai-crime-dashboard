import React, { useEffect, useState, useRef, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function NetworkAnalysis({ user }: { user: any }) {
  const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<string>('All');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const fetchGraph = async (q: string = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/network/search?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch graph data");
      const data = await res.json();
      setGraphData(data);
      setCollapsedNodes(new Set());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGraph(searchQuery);
  };

  const handleNodeRightClick = (node: any) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(node.id)) {
        newSet.delete(node.id);
      } else {
        newSet.add(node.id);
      }
      return newSet;
    });
  };

  const visibleGraphData = useMemo(() => {
    if (!graphData) return null;
    
    let nodes = [...graphData.nodes];
    let links = [...graphData.links];

    if (typeFilter !== 'All') {
      nodes = nodes.filter(n => n.type === typeFilter);
      const nodeIds = new Set(nodes.map(n => n.id));
      links = links.filter(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return nodeIds.has(s) && nodeIds.has(t);
      });
    }

    const degree = new Map<string, number>();
    links.forEach(l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      degree.set(sourceId, (degree.get(sourceId) || 0) + 1);
      degree.set(targetId, (degree.get(targetId) || 0) + 1);
    });

    const hiddenNodes = new Set<string>();

    collapsedNodes.forEach(collapsedId => {
      links.forEach(l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        
        if (sourceId === collapsedId && degree.get(targetId) === 1) {
          hiddenNodes.add(targetId);
        } else if (targetId === collapsedId && degree.get(sourceId) === 1) {
          hiddenNodes.add(sourceId);
        }
      });
    });

    return {
      nodes: nodes.filter(n => !hiddenNodes.has(n.id)),
      links: links.filter(l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return !hiddenNodes.has(sourceId) && !hiddenNodes.has(targetId);
      })
    };
  }, [graphData, collapsedNodes, typeFilter]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Suspect': return '#ef4444';
      case 'Vehicle': return '#eab308';
      case 'FIR': return '#3b82f6';
      case 'Phone': return '#10b981';
      case 'Location': return '#a855f7';
      case 'Organization': return '#6366f1';
      default: return '#71717a';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07090e] text-slate-200 overflow-hidden">
      {/* Network Header / Search */}
      <div className="p-4 border-b border-slate-800 bg-[#0c1017] flex flex-wrap items-center justify-between z-10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-lg">hub</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">GARUDA Criminal Network Link Analysis</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">High-dimensional graph linking Suspects, Burner SIMs, ANPR Plates, FIRs, and Safehouses</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Node Category Filter */}
          <div className="flex gap-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5">
            {['All', 'Suspect', 'Vehicle', 'FIR', 'Phone', 'Location', 'Organization'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                  typeFilter === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Entity, Phone, Plate..."
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-52"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">search</span>
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 flex relative" ref={containerRef}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#07090e]/80 z-20 backdrop-blur-sm">
            <div className="text-blue-500 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Traversing Graph Hierarchy...</span>
            </div>
          </div>
        )}
        
        {visibleGraphData && (
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={visibleGraphData}
            nodeLabel="label"
            nodeColor={(node: any) => getNodeColor(node.type)}
            nodeRelSize={6}
            linkColor={() => '#334155'}
            linkWidth={1.5}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            onNodeClick={(node) => setSelectedNode(node)}
            onNodeRightClick={handleNodeRightClick}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              
              ctx.beginPath();
              ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
              ctx.fillStyle = getNodeColor(node.type);
              ctx.fill();
              
              if (selectedNode?.id === node.id) {
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = '#38bdf8';
                ctx.stroke();
                ctx.shadowColor = getNodeColor(node.type);
                ctx.shadowBlur = 12;
              } else {
                ctx.shadowBlur = 0;
              }

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#cbd5e1';
              ctx.fillText(label, node.x, node.y + 11);

              if (collapsedNodes.has(node.id)) {
                ctx.beginPath();
                ctx.arc(node.x, node.y - 10, 3.5, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#3b82f6';
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = '6px Sans-Serif';
                ctx.fillText('+', node.x, node.y - 10);
              }
            }}
            linkCanvasObjectMode={() => 'after'}
            linkCanvasObject={(link: any, ctx, globalScale) => {
              if (globalScale < 1.4) return;
              
              const start = link.source;
              const end = link.target;
              if (typeof start !== 'object' || typeof end !== 'object') return;
              
              const relLink = { x: end.x - start.x, y: end.y - start.y };
              let textAngle = Math.atan2(relLink.y, relLink.x);
              if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
              if (textAngle < -Math.PI / 2) textAngle = -(Math.PI + textAngle);
              
              const label = `${link.label} (${link.confidence || 90}%)`;
              ctx.font = `3.5px Sans-Serif`;
              ctx.save();
              ctx.translate(start.x + relLink.x / 2, start.y + relLink.y / 2);
              ctx.rotate(textAngle);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#64748b';
              ctx.fillText(label, 0, 0);
              ctx.restore();
            }}
          />
        )}
        
        {/* Node Detail Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-[#0c1017]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-5 shadow-2xl z-20 animate-fade-in">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: getNodeColor(selectedNode.type) }}></div>
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">{selectedNode.label}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedNode.type} Node</span>
                </div>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            {selectedNode.photo && (
              <div className="mb-3 flex justify-center">
                <img 
                  src={selectedNode.photo} 
                  alt={selectedNode.label} 
                  className="w-20 h-20 rounded-lg object-cover border border-slate-700 shadow-md"
                />
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500 uppercase font-mono text-[10px]">Node Identifier</span>
                <span className="text-slate-300 font-mono">{selectedNode.id}</span>
              </div>

              {selectedNode.role && (
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Syndicate Role</span>
                  <span className="text-slate-200 font-semibold">{selectedNode.role}</span>
                </div>
              )}

              {selectedNode.risk && (
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">AI Threat Score</span>
                  <span className={`font-bold font-mono ${selectedNode.risk > 75 ? 'text-red-400' : 'text-amber-400'}`}>
                    {selectedNode.risk} / 100
                  </span>
                </div>
              )}

              {selectedNode.status && (
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Warrant / Status</span>
                  <span className="text-red-400 font-bold">{selectedNode.status}</span>
                </div>
              )}

              {selectedNode.typeLabel && (
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Model / Specs</span>
                  <span className="text-amber-300 font-medium">{selectedNode.typeLabel}</span>
                </div>
              )}

              {selectedNode.notes && (
                <div className="pt-1">
                  <span className="text-slate-500 uppercase font-mono text-[10px] block mb-0.5">Intelligence Notes</span>
                  <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded border border-slate-800">
                    {selectedNode.notes}
                  </p>
                </div>
              )}

              {selectedNode.coordinates && (
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Coordinates</span>
                  <span className="text-purple-300 font-mono">{selectedNode.coordinates}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tactical Graph Legend */}
        <div className="absolute bottom-4 left-4 bg-[#0c1017]/90 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 z-10 flex flex-col gap-1.5 shadow-xl text-xs">
          <p className="text-[10px] uppercase text-slate-400 tracking-widest font-bold mb-1">Entity Taxonomy</p>
          <div className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Prime Suspect</div>
          <div className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> Tracked Vehicle</div>
          <div className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Connected FIR</div>
          <div className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Cellular / SIM Intercept</div>
          <div className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Safehouse / Scene</div>
          <div className="flex items-center gap-2 text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Cartel Syndicate</div>
        </div>
      </div>
    </div>
  );
}
