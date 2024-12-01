import { render } from './render.ts';

const message = 'Hello, world!';

render(
  <div>
    <h1>{message}</h1>
  </div>,
  document.getElementById('app')
);
