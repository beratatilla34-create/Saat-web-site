/**
 * Procedural Web Audio API sound generator for Swiss Mechanical Watch
 * Escapement rate: 28,800 vph (8 beats per second = 125ms interval)
 */

class HorologySoundEngine {
  private ctx: AudioContext | null = null;
  private isTicking: boolean = false;
  private timerId: number | null = null;
  private tickCount: number = 0;
  private volume: number = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play single escapement tick-tock impulse
  private triggerSingleEscapementTick(isTick: boolean) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered noise pulse simulating pallet fork striking escape wheel
    const bufferSize = this.ctx.sampleRate * 0.025; // 25ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Resonant bandpass filter for mechanical metallic chime
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isTick ? 4200 : 3800, now);
    filter.Q.setValueAtTime(8, now);

    // High subtle tone for jewel impact
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isTick ? 5200 : 4800, now);
    osc.frequency.exponentialRampToValueAtTime(isTick ? 3400 : 3100, now + 0.015);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(this.volume * 0.15, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, now);

    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    masterGain.connect(this.ctx.destination);

    noiseNode.start(now);
    noiseNode.stop(now + 0.03);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  public toggleTicking(): boolean {
    this.initContext();
    if (this.isTicking) {
      this.stopTicking();
      return false;
    } else {
      this.startTicking();
      return true;
    }
  }

  public startTicking() {
    this.initContext();
    if (this.isTicking) return;
    this.isTicking = true;

    // 28,800 vph = 8 beats per second = 125ms
    this.timerId = window.setInterval(() => {
      this.tickCount++;
      const isTick = this.tickCount % 2 === 0;
      this.triggerSingleEscapementTick(isTick);
    }, 125);
  }

  public stopTicking() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isTicking = false;
  }

  public getIsTicking(): boolean {
    return this.isTicking;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Metallic haptic click for UI button interactions
  public playMetallicClick() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const horologySound = new HorologySoundEngine();
