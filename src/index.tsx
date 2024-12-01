import { render } from './render.ts';

const message = 'Hello, world!';

const buttonMic = <button>Grant mic audio access</button>;
const buttonTab = <button>Grant tab audio access</button>;
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
