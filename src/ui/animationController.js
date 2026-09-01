// Wraps any step-generator (an algorithm) and plays it back one step at a
// time, so every algorithm — sorting, graph, tree, DP — can share the same
// play/pause/step/speed machinery.
export class AnimationController {
  constructor({ onStep, onDone }) {
    this.onStep = onStep;
    this.onDone = onDone;
    this.generator = null;
    this.playing = false;
    this.delayMs = 40;
    this.timer = null;
  }

  load(generator) {
    this.pause();
    this.generator = generator;
  }

  // Advance one step. Returns false when the generator is exhausted.
  step() {
    if (!this.generator) return false;
    const { value, done } = this.generator.next();
    if (done) {
      this.pause();
      this.onDone && this.onDone();
      return false;
    }
    this.onStep(value);
    return true;
  }

  play() {
    if (this.playing || !this.generator) return;
    this.playing = true;
    const loop = () => {
      if (!this.playing) return;
      const cont = this.step();
      if (cont) this.timer = setTimeout(loop, this.delayMs);
    };
    loop();
  }

  pause() {
    this.playing = false;
    clearTimeout(this.timer);
  }

  setSpeed(sliderValue) {
    // Slider goes 1 (slow) -> 100 (fast); map to a millisecond delay.
    const min = 4, max = 400;
    this.delayMs = max - ((sliderValue - 1) / 99) * (max - min);
  }
}
