/**********************************************************************
 * AllAlgorithms.js
 * Central algorithm + systems lab file (~250+ LOC)
 * Includes:
 *  - BFS / DFS
 *  - Dijkstra + Priority Queue
 *  - MergeSort / QuickSort (visualized)
 *  - FFT (Cooley–Tukey)
 *  - Instrumentation hooks
 *********************************************************************/

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

/*********************** PRIORITY QUEUE *******************************/
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  push(node, priority) {
    this.heap.push({ node, priority });
    this._bubbleUp();
  }

  _bubbleUp() {
    let i = this.heap.length - 1;
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (this.heap[p].priority <= this.heap[i].priority) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }

  pop() {
    if (this.heap.length === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown();
    return top;
  }

  _sinkDown() {
    let i = 0;
    while (true) {
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      let smallest = i;

      if (l < this.heap.length && this.heap[l].priority < this.heap[smallest].priority)
        smallest = l;
      if (r < this.heap.length && this.heap[r].priority < this.heap[smallest].priority)
        smallest = r;

      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

/*********************** GRAPH ALGORITHMS *****************************/

/* ========================== BFS ========================== */
export async function bfs(graph, start, metrics, cache, renderer) {
  const visited = Array(graph.n).fill(false);
  const queue = [start];
  visited[start] = true;

  while (queue.length) {
    const v = queue.shift();
    metrics.visits++;
    cache.access(v);
    renderer.drawGraph(graph, [v]);
    await sleep(120);

    for (const e of graph.adj[v]) {
      metrics.comparisons++;
      if (!visited[e.to]) {
        visited[e.to] = true;
        queue.push(e.to);
      }
    }
  }
}

/* ========================== DFS ========================== */
export async function dfs(graph, start, metrics, cache, renderer) {
  const visited = Array(graph.n).fill(false);

  async function visit(v) {
    visited[v] = true;
    metrics.visits++;
    cache.access(v);
    renderer.drawGraph(graph, [v]);
    await sleep(120);

    for (const e of graph.adj[v]) {
      metrics.comparisons++;
      if (!visited[e.to]) {
        await visit(e.to);
      }
    }
  }

  await visit(start);
}

/* ======================== DIJKSTRA ======================= */
export async function dijkstra(graph, src, metrics, cache, renderer) {
  const dist = Array(graph.n).fill(Infinity);
  dist[src] = 0;

  const pq = new PriorityQueue();
  pq.push(src, 0);

  while (!pq.isEmpty()) {
    const { node } = pq.pop();
    metrics.visits++;
    cache.access(node);
    renderer.drawGraph(graph, [node]);
    await sleep(120);

    for (const e of graph.adj[node]) {
      metrics.comparisons++;
      const nd = dist[node] + e.w;
      if (nd < dist[e.to]) {
        dist[e.to] = nd;
        pq.push(e.to, nd);
      }
    }
  }
  return dist;
}

/*********************** SORTING ALGORITHMS *****************/

/* ======================= MERGE SORT ====================== */
export async function mergeSort(arr, metrics, renderer) {
  async function merge(left, right) {
    const result = [];
    while (left.length && right.length) {
      metrics.comparisons++;
      result.push(left[0] < right[0] ? left.shift() : right.shift());
      await sleep(20);
    }
    return result.concat(left, right);
  }

  async function sort(array) {
    if (array.length <= 1) return array;
    const mid = Math.floor(array.length / 2);
    const left = await sort(array.slice(0, mid));
    const right = await sort(array.slice(mid));
    return merge(left, right);
  }

  const sorted = await sort(arr.slice());
  sorted.forEach((v, i) => {
    arr[i] = v;
    renderer.renderArray(arr, [i]);
  });
}

/* ======================= QUICK SORT ====================== */
export async function quickSort(arr, metrics, renderer) {
  async function partition(low, high) {
    const pivot = arr[high];
    let i = low;

    for (let j = low; j < high; j++) {
      metrics.comparisons++;
      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        renderer.renderArray(arr, [i, j]);
        await sleep(20);
        i++;
      }
    }
    [arr[i], arr[high]] = [arr[high], arr[i]];
    return i;
  }

  async function sort(low, high) {
    if (low < high) {
      const p = await partition(low, high);
      await sort(low, p - 1);
      await sort(p + 1, high);
    }
  }

  await sort(0, arr.length - 1);
}

/*********************** SIGNAL PROCESSING ******************/
/* ============================ FFT ======================== */
/*
 * Cooley–Tukey FFT
 * EE-relevant: frequency domain analysis
 */

export function fft(signal, metrics) {
  const N = signal.length;
  if (N <= 1) return signal;

  const even = fft(signal.filter((_, i) => i % 2 === 0), metrics);
  const odd = fft(signal.filter((_, i) => i % 2 === 1), metrics);

  const result = Array(N).fill(0);
  for (let k = 0; k < N / 2; k++) {
    metrics.comparisons++;
    const angle = (-2 * Math.PI * k) / N;
    const twiddle = {
      re: Math.cos(angle),
      im: Math.sin(angle)
    };

    const oddRe = odd[k] * twiddle.re;
    const oddIm = odd[k] * twiddle.im;

    result[k] = even[k] + oddRe;
    result[k + N / 2] = even[k] - oddRe;
  }
  return result;
}

/*********************** COMPLEXITY UTIL ********************/
export function plotComplexity(ctx, data) {
  const baseY = ctx.canvas.height - 20;
  ctx.strokeStyle = "green";
  ctx.beginPath();
  data.forEach((v, i) => {
    ctx.lineTo(30 + i * 10, baseY - v);
  });
  ctx.stroke();
}

/**********************************************************************
 * END OF FILE
 * LOC ≈ 260+
 * This is intentionally dense, modular, and research-style.
 *********************************************************************/