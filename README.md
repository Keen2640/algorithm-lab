# algorithm-lab

An interactive visualizer for classic CS algorithms — built with plain JavaScript, HTML, and Canvas (no framework). Step through comparisons and swaps one at a time, or play them back at adjustable speed, with live complexity info alongside.

**Live demo:** _add your GitHub Pages link here once deployed_

## Currently implemented

**Sorting**
| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |

More categories (graph traversal/pathfinding, trees, dynamic programming) are planned — see Roadmap.

## Running locally

This is a static site with ES modules, so it needs to be served over HTTP (opening `index.html` directly via `file://` will block module imports).

```bash
git clone https://github.com/<your-username>/algorithm-lab.git
cd algorithm-lab
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Any static server works — `npx serve`, VS Code's Live Server extension, etc.

## Project structure

```
algorithm-lab/
├── index.html
├── style.css
└── src/
    ├── main.js                    # wires UI controls to algorithms + visualizer
    ├── ui/
    │   └── animationController.js # generic play/pause/step/speed engine
    ├── algorithms/
    │   └── sorting/               # each algorithm is a step-generator function
    └── visualizers/
        └── sortVisualizer.js      # canvas rendering
```

Every algorithm is written as a JS generator that `yield`s a snapshot of its state (the array, which indices are being compared/swapped, which are sorted). The `AnimationController` just pulls one snapshot at a time and hands it to the renderer — this is what makes step/play/speed controls work identically for every algorithm, and is the same architecture the graph, tree, and DP visualizers will plug into.

## Roadmap

- [ ] Graph traversal & pathfinding on a grid (BFS, DFS, Dijkstra, A*)
- [ ] Binary search trees + AVL rotations
- [ ] Dynamic programming grid-fill visualizer (knapsack, LCS)
- [ ] Side-by-side comparison mode (race two algorithms on the same input)
- [ ] Deploy to GitHub Pages

## License

MIT
