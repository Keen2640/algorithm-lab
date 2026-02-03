export class Renderer {
  constructor(canvas){this.canvas=canvas; this.ctx=canvas.getContext("2d");}
  drawGraph(graph, highlight=[]){
    const ctx=this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for(let i=0;i<graph.n;i++)
      for(const e of graph.adj[i]){
        ctx.strokeStyle="#ccc";
        ctx.beginPath();
        ctx.moveTo(graph.positions[i].x,graph.positions[i].y);
        ctx.lineTo(graph.positions[e.to].x,graph.positions[e.to].y);
        ctx.stroke();
      }
    for(let i=0;i<graph.n;i++){
      ctx.beginPath();
      ctx.fillStyle=highlight.includes(i)?"red":"steelblue";
      ctx.arc(graph.positions[i].x,graph.positions[i].y,10,0,Math.PI*2);
      ctx.fill();
    }
  }
}