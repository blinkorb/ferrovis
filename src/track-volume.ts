import { mutable } from './mutable.ts';

export const trackVolume = (stream: MediaStream, multiplier: number) => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  const microphone = audioContext.createMediaStreamSource(stream);

  analyser.smoothingTimeConstant = 0.1;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);

  javascriptNode.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    const arrayCopy = [...array];
    arrayCopy.forEach((value) => {
      values += value * multiplier;
    });

    const average = values / arrayCopy.length;

    mutable.averageVolume = Math.round(average);
  };
};
