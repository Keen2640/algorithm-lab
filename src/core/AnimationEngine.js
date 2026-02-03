export class AnimationEngine {
  constructor(delay=50){this.delay=delay;}
  async pause(){return new Promise(res=>setTimeout(res,this.delay));}
  setSpeed(ms){this.delay=ms;}
}