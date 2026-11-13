let context: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    context = new Ctx();
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

function tone(
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
) {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(
    gainValue,
    ctx.currentTime + start + 0.01,
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + start + duration,
  );
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.02);
}

export function playDroid() {
  tone(880, 0, 0.07, "square", 0.04);
  tone(1320, 0.09, 0.08, "square", 0.035);
}

export function playClick() {
  tone(180, 0, 0.03, "square", 0.03);
}

export function playHum() {
  tone(70, 0, 0.22, "sine", 0.03);
}

/** Blade ignition: a 60→180 Hz sweep with a short filtered noise puff. */
export function playIgnition() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(60, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.03, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 900;
  osc.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.65);

  const length = Math.floor(ctx.sampleRate * 0.18);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / length);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1400;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.02;
  noise.connect(band);
  band.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
}

/** Guide beeps. Light: two soft rising sine notes. Shadow: two dry falling square pulses. */
export function playRobot(side: "light" | "dark") {
  if (side === "light") {
    tone(880, 0, 0.16, "sine", 0.05);
    tone(1320, 0.14, 0.18, "sine", 0.045);
    return;
  }
  tone(320, 0, 0.07, "square", 0.035);
  tone(180, 0.09, 0.08, "square", 0.035);
}
