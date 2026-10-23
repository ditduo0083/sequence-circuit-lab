(function (root) {
  'use strict';
  // Extracted from 001 CircuitDiagram.analyze. No DOM access or input mutation.
  // flow retains the input edge objects so the existing renderer can use Set.has(edge).
  function analyzeConduction(graph, state) {
    const adjacency={};for(const id of Object.keys(graph.nodes))adjacency[id]=[];
    for(const edge of graph.edges){if(edge.type==='wire'||state.contacts[edge.id]){adjacency[edge.a].push([edge.b,edge]);adjacency[edge.b].push([edge.a,edge]);}}
    const reach=(start)=>{const seen=new Set([start]),q=[start];while(q.length){const a=q.pop();for(const [b] of adjacency[a])if(!seen.has(b)){seen.add(b);q.push(b);}}return seen;};
    const high=state.power?reach(graph.high):new Set(),low=reach(graph.low),flow=new Set(),calculatedLoads={};
    const trace=(from,to)=>{
      const visited=new Set();
      function walk(a){if(a===to)return true;visited.add(a);let found=false;for(const [b,edge] of adjacency[a])if(!visited.has(b)&&walk(b)){flow.add(edge);found=true;}visited.delete(a);return found;}
      walk(from);
    };
    for(const load of graph.loads){const on=high.has(load.positive)&&low.has(load.negative);calculatedLoads[load.id]=on;if(on){trace(graph.high,load.positive);trace(graph.low,load.negative);}}
    return {high,low,flow,calculatedLoads};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = analyzeConduction;
  else root.analyzeConduction = analyzeConduction;
})(typeof window === 'undefined' ? globalThis : window);
