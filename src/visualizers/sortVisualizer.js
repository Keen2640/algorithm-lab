const COLORS = {
  default: "#3a4150",
  comparing: "#ffb86b",
  swapping: "#f2545b",
  pivot: "#7c6ff0",
  sorted: "#6fcf97",
};

export function drawBars(ctx, canvas, state) {
  const { array, comparing = [], swapping = [], writing = [], sorted = [], pivot } = state;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  if (!array || array.length === 0) return;

  const max = Math.max(...array);
  const gap = 2;
  const barWidth = (w - gap * (array.length - 1)) / array.length;

  array.forEach((value, idx) => {
    let color = COLORS.default;
    if (sorted.includes(idx)) color = COLORS.sorted;
    if (idx === pivot) color = COLORS.pivot;
    if (comparing.includes(idx)) color = COLORS.comparing;
    if (swapping.includes(idx) || writing.includes(idx)) color = COLORS.swapping;

    const barHeight = (value / max) * (h - 10);
    const x = idx * (barWidth + gap);
    const y = h - barHeight;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);
  });
}

export function resizeCanvasToDisplaySize(canvas) {
  const { width, height } = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const targetW = Math.round(width * dpr);
  const targetH = Math.round(height * dpr);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
}
