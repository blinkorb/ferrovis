import { Canvasimo } from 'canvasimo';

import { render } from './render';

const message = 'Hello, world!';

interface Audio {
  audioContext: AudioContext;
  audioAnalyser: AnalyserNode;
}

interface Particle {
  x: number;
  y: number;
  velX: number;
  velY: number;
}

interface Peaks {
  min: number | null;
  max: number | null;
}

const MAX_PEAK = 256;
const PARTICLE_COUNT = 1;
const PARTICLE_RADIUS = 5;
const PARTICLE_BOUNCE = 0.3;

let audio: Audio | null = null;

const initAudioContext = () => {
  if (!audio) {
    const audioContext = new AudioContext();
    const audioAnalyser = audioContext.createAnalyser();
    audio = { audioContext, audioAnalyser };
  }

  return audio;
};

const getMicAudio = () => {
  window.navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false,
      noiseSuppression: false,
      echoCancellation: false,
    })
    .then((stream) => {
      const { audioContext, audioAnalyser } = initAudioContext();
      const streamSource = audioContext.createMediaStreamSource(stream);
      const gain = audioContext.createGain();
      gain.gain.value = 2;
      streamSource.connect(gain);
      gain.connect(audioAnalyser);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      alert('Could not get mic audio');
    });
};

const getTabAudio = () => {
  alert(
    "This will ask for access to your screen, but we don't do anything with the video - just the audio.\n\nYou must share a Chrome tab to provide audio."
  );
  window.navigator.mediaDevices
    .getDisplayMedia({ audio: true, video: true })
    .then((stream) => {
      initAudioContext();
      const { audioContext, audioAnalyser } = initAudioContext();
      const streamSource = audioContext.createMediaStreamSource(stream);
      streamSource.connect(audioAnalyser);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      alert('Could not get tab audio');
    });
};

const getPeaks = (dataArray: Uint8Array) =>
  dataArray.reduce<Peaks>(
    (memo, value) => {
      if (memo.max === null || value > memo.max) {
        memo.max = value;
      }

      if (memo.min === null || value < memo.min) {
        memo.min = value;
      }

      return memo;
    },
    { max: null, min: null }
  );

const getClampedVolume = (peaks: Peaks) =>
  typeof peaks.max === 'number' && typeof peaks.min === 'number'
    ? Math.min(Math.abs(peaks.max - peaks.min), MAX_PEAK)
    : 0;

const canvas = <canvas width={200} height={200}></canvas>;

const ctx = new Canvasimo(canvas as HTMLCanvasElement);
ctx.setDensity(window.devicePixelRatio >= 2 ? 2 : 1);

const gravity = 1;
let particles: readonly Particle[] = [];
let prev = Date.now();

const initParticles = () => {
  const { width, height } = ctx.getSize();
  particles = [...Array(PARTICLE_COUNT)].map(() => ({
    x: width * 0.5 + Math.random() * 10 - 5,
    y: height * 0.5 + Math.random() * 10 - 5,
    velX: 0,
    velY: 0,
  }));
};

render(
  <div>
    <div>
      <p>{message}</p>
      <button onClick={getMicAudio}>Grant mic audio access</button>
      <button onClick={getTabAudio}>Grant tab audio access</button>
      <button onClick={initParticles}>Reset particles</button>
    </div>
    <div>{canvas}</div>
  </div>,
  document.getElementById('app')
);

const loop = () => {
  const now = Date.now();
  const delta = (now - prev) / 1000;
  const { width, height } = ctx.getSize();
  const safeRadius = Math.min(width, height) * 0.5;

  const bufferLength = audio?.audioAnalyser.frequencyBinCount ?? 0;
  const dataArray = new Uint8Array(bufferLength);
  audio?.audioAnalyser.getByteTimeDomainData(dataArray);

  const peaks = getPeaks(dataArray);
  const offset = getClampedVolume(peaks) / MAX_PEAK;

  ctx
    .clearCanvas()
    .fillCircle(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.5 * offset,
      false,
      'black'
    )
    .tap(() => {
      particles.forEach((particle) => {
        const distanceFromCenter = ctx.getDistance(
          width * 0.5,
          height * 0.5,
          particle.x,
          particle.y
        );
        const angle = ctx.getAngle(
          width * 0.5,
          height * 0.5,
          particle.x,
          particle.y
        );

        if (distanceFromCenter > safeRadius - PARTICLE_RADIUS) {
          particle.x =
            width * 0.5 + Math.cos(angle) * (safeRadius - PARTICLE_RADIUS);
          particle.y =
            height * 0.5 + Math.sin(angle) * (safeRadius - PARTICLE_RADIUS);
          particle.velX *= -PARTICLE_BOUNCE;
          particle.velY *= -PARTICLE_BOUNCE;
        }

        particle.x += particle.velX;
        particle.y += particle.velY;
        particle.velY += gravity * delta;
        ctx.fillCircle(particle.x, particle.y, PARTICLE_RADIUS, true, 'red');
      });
    });

  prev = now;
  window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
