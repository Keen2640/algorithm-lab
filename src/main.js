import { Metrics } from "./core/Metrics.js";
import { LRUCache } from "./core/LRUCache.js";
import { Renderer } from "./ui/Renderer.js";
import * as Algo from "./algorithms/AllAlgorithms.js";
import { generateGraph } from "./data/GraphGenerator.js";

const metrics=new Metrics();
const cache=new LRUCache(8);
const canvas=document.getElementById("visualization");
const renderer=new Renderer(canvas);

(async function main(){
  const graph=generateGraph(20);
  renderer.drawGraph(graph);
  await Algo.bfs(graph,0,metrics,cache,renderer);
  await Algo.dfs(graph,0,metrics,cache,renderer);
  await Algo.dijkstra(graph,0,metrics,cache,renderer);
  await Algo.mergeSort([...Array(30).keys()],metrics,renderer);
  await Algo.quickSort([...Array(30).keys()],metrics,renderer);
  await Algo.fft([...Array(32).keys()],metrics);
  metrics.finish();
  console.log(metrics.report());
})();