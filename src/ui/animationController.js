
export class AnimationController {
  constructor({ onStep, onDone, onError } = {}) {
    this.onStep = onStep ?? (() => {});
    this.onDone = onDone ?? (() => {});
    this.onError = onError ?? (() => {});

    this.generator = null;
    this.playing = false;
    this.delayMs = 40;
    this.timer = null;
    this.generation = 0;
  }

  // Load a new algorithm and reset playback.
  load(generator) {
    this.pause();

    if (!generator || typeof generator.next !== "function") {
      throw new TypeError("Expected an iterator or generator.");
    }

    this.generator = generator;
    this.generation++;
  }

  // Advance one step. Returns false when exhausted or unavailable.
  step() {
    if (!this.generator || this.playing) return false;

    return this._advance();
  }

  _advance() {
    try {
      const result = this.generator.next();

      if (result.done) {
        this.pause();
        this.generator = null;
        this.onDone();
        return false;
      }

      this.onStep(result.value);
      return true;
    } catch (error) {
      this.pause();
      this.generator = null;
      this.onError(error);
      return false;
    }
  }

  // Play continuously until paused or finished.
  play() {
    if (this.playing || !this.generator) return;

    this.playing = true;
    const generation = this.generation;

    const loop = () => {
      if (!this.playing || generation !== this.generation) return;

      if (!this._advance()) return;

      this.timer = setTimeout(loop, this.delayMs);
    };

    loop();
  }

  pause() {
    this.playing = false;

    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  // Slider: 1 = slow, 100 = fast.
  setSpeed(sliderValue) {
    const value = Math.max(1, Math.min(100, Number(sliderValue)));

    if (!Number.isFinite(value)) return;

    const minDelay = 4;
    const maxDelay = 400;

    this.delayMs =
      maxDelay - ((value - 1) / 99) * (maxDelay - minDelay);
  }

  // Release the current generator and stop playback.
  reset() {
    this.pause();
    this.generator = null;
    this.generation++;
  }

  get isPlaying() {
    return this.playing;
  }

  get hasGenerator() {
    return this.generator !== null;
  }
}
