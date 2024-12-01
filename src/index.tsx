import { Canvasimo } from 'canvasimo';

import { render } from './render';

const message = 'Hello, world!';

const audioContext = new AudioContext();
const audioAnalyser = audioContext.createAnalyser();
audioAnalyser.fftSize = 1024;

const getMicAudio = () => {
  window.navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false,
      noiseSuppression: false,
      echoCancellation: false,
    })
    .then((stream) => {
      const streamSource = audioContext.createMediaStreamSource(stream);
      streamSource.connect(audioAnalyser);
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
      const streamSource = audioContext.createMediaStreamSource(stream);
      streamSource.connect(audioAnalyser);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      alert('Could not get tab audio');
    });
};

interface Peaks {
  min: number | null;
  max: number | null;
}

const MAX_PEAK = 256;

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

const buttonMic = <button onClick={getMicAudio}>Grant mic audio access</button>;
const buttonTab = <button onClick={getTabAudio}>Grant tab audio access</button>;
const canvas = <canvas width={200} height={200}></canvas>;

render(
  <div>
    <div>
      <p>{message}</p>
      {buttonMic}
      {buttonTab}
    </div>
    <div>{canvas}</div>
  </div>,
  document.getElementById('app')
);

const ctx = new Canvasimo(canvas as HTMLCanvasElement);
ctx.setDensity(window.devicePixelRatio >= 2 ? 2 : 1);

const loop = () => {
  const { width, height } = ctx.getSize();

  const bufferLength = audioAnalyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  audioAnalyser.getByteTimeDomainData(dataArray);

  const peaks = getPeaks(dataArray);
  const offset = getClampedVolume(peaks) / MAX_PEAK;

  ctx
    .clearCanvas()
    .fillRect(
      width * 0.5 - 2,
      height * 0.5 - height * 0.5 * offset - 2,
      4,
      4,
      'black'
    );

  window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
