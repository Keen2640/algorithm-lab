import { AnimationController } from "./ui/animationController.js";
import { drawBars, resizeCanvasToDisplaySize } from "./visualizers/sortVisualizer.js";
import { bubbleSort, info as bubbleInfo } from "./algorithms/sorting/bubbleSort.js";
import { mergeSort, info as mergeInfo } from "./algorithms/sorting/mergeSort.js";
import { quickSort, info as quickInfo } from "./algorithms/sorting/quickSort.js";

const ALGORITHMS = {
  bubble: { run: bubbleSort, info: bubbleInfo },
  merge: { run: mergeSort, info: mergeInfo },
  quick: { run: quickSort, info: quickInfo },
};

// --- DOM references ---
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const algoSelect = document.getElementById("algoSelect");
const sizeRange = document.getElementById("sizeRange");
const sizeValue = document.getElementById("sizeValue");
const speedRange = document.getElementById("speedRange");
const shuffleBtn = document.getElementById("shuffleBtn");
const playBtn = document.getElementById("playBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");
const statComparisons = document.getElementById("statComparisons");
const statSwaps = document.getElementById("statSwaps");
const cBest = document.getElementById("cBest");
const cAvg = document.getElementById("cAvg");
const cWorst = document.getElementById("cWorst");
const cSpace = document.getElementById("cSpace");

let baseArray = [];
let comparisons = 0;
let swaps = 0;

const controller = new AnimationController({
  onStep: (state) => {
    if (state.comparing) comparisons++;
    if (state.swapping || state.writing) swaps++;
    statComparisons.textContent = comparisons;
    statSwaps.textContent = swaps;
    drawBars(ctx, canvas, state);
  },
  onDone: () => {
    playBtn.textContent = "Play";
  },
});

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 380) + 10);
}

function updateComplexityPanel() {
  const { info } = ALGORITHMS[algoSelect.value];
  cBest.textContent = info.best;
  cAvg.textContent = info.average;
  cWorst.textContent = info.worst;
  cSpace.textContent = info.space;
}

function resetRun() {
  controller.pause();
  playBtn.textContent = "Play";
  comparisons = 0;
  swaps = 0;
  statComparisons.textContent = "0";
  statSwaps.textContent = "0";
  resizeCanvasToDisplaySize(canvas);
  drawBars(ctx, canvas, { array: baseArray });
  const { run } = ALGORITHMS[algoSelect.value];
  controller.load(run(baseArray));
}

function newArray() {
  baseArray = randomArray(Number(sizeRange.value));
  resetRun();
}

// --- Event wiring ---
algoSelect.addEventListener("change", () => {
  updateComplexityPanel();
  resetRun();
});

sizeRange.addEventListener("input", () => {
  sizeValue.textContent = sizeRange.value;
});
sizeRange.addEventListener("change", newArray);

speedRange.addEventListener("input", () => controller.setSpeed(Number(speedRange.value)));

shuffleBtn.addEventListener("click", newArray);
resetBtn.addEventListener("click", resetRun);

stepBtn.addEventListener("click", () => {
  controller.pause();
  playBtn.textContent = "Play";
  controller.step();
});

playBtn.addEventListener("click", () => {
  if (controller.playing) {
    controller.pause();
    playBtn.textContent = "Play";
  } else {
    controller.play();
    playBtn.textContent = "Pause";
  }
});

window.addEventListener("resize", () => resizeCanvasToDisplaySize(canvas));

// --- Init ---
controller.setSpeed(Number(speedRange.value));
updateComplexityPanel();
newArray();
