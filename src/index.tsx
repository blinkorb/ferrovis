import { render } from './render.ts';
import { trackVolume } from './track-volume.ts';

const message = 'Hello, world!';

const getMicAudio = () => {
  window.navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false,
      noiseSuppression: false,
      echoCancellation: false,
    })
    .then((stream) => {
      trackVolume(stream, 2);
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
      trackVolume(stream, 1);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      alert('Could not get tab audio');
    });
};

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
