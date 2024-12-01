import { JSXChildren } from './types.ts';

export const jsx = <T extends keyof JSX.IntrinsicElements>(
  type: T,
  props: JSX.IntrinsicElements[T] | null
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(type);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'className') {
        element[key] = value;
      }

      if (key === 'style') {
        Object.assign(element[key], value);
      }

      if (key === 'children') {
        const appendChildren = (children: JSXChildren) => {
          if (Array.isArray(children)) {
            children.forEach((child) => {
              element.appendChild(child);
            });
          } else if (
            typeof children === 'string' ||
            typeof children === 'number'
          ) {
            const textNode = document.createTextNode(children.toString());
            element.appendChild(textNode);
          } else if (children instanceof HTMLElement) {
            element.appendChild(children);
          }
        };

        appendChildren(props[key]);
      }
    });
  }

  return element;
};

export const jsxs = jsx;

export const Fragment = ({ children }: { children?: JSXChildren }) => children;

Fragment.displayName = 'Fragment';
