export const render = (element: HTMLElement, app: HTMLElement | null) => {
  if (app) {
    app.innerHTML = '';
    app.appendChild(element);
  }
};
