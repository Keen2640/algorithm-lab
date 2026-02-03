export class Metrics {
  constructor() { this.reset(); }
  reset() { this.comparisons=0; this.visits=0; this.cacheHits=0; this.cacheMisses=0; this.startTime=performance.now(); this.endTime=null; }
  finish() { this.endTime=performance.now(); }
  report() { return { comparisons:this.comparisons, visits:this.visits, cacheHits:this.cacheHits, cacheMisses:this.cacheMisses, timeMs:(this.endTime-this.startTime).toFixed(2) }; }
}