export function generateGraph(n, density=0.25){
  const adj=Array.from({length:n},()=>[]);
  const positions=[];
  for(let i=0;i<n;i++) positions.push({x:50+Math.random()*800,y:50+Math.random()*400});
  for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(Math.random()<density){ const w=1+Math.floor(Math.random()*10); adj[i].push({to:j,w}); adj[j].push({to:i,w}); }
  return {n,adj,positions};
}