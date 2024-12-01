import type { Ferrovis, JSXChildren } from './types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = Ferrovis.Element;
  export type IntrinsicAttributes = Ferrovis.IntrinsicAttributes;
  export type IntrinsicElements = Ferrovis.IntrinsicElements;
  export type ElementAttributesProperty = Ferrovis.ElementAttributesProperty;
  export type ElementChildrenAttribute = Ferrovis.ElementChildrenAttribute;
  export type ElementType = Ferrovis.ElementType;
}

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

      if (
        element instanceof HTMLCanvasElement &&
        (key === 'width' || key === 'height')
      ) {
        element[key] = value;
      }

      if (key.startsWith('on')) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      }
    });
  }

  return element;
};

export const jsxs = jsx;

export const Fragment = ({ children }: { children?: JSXChildren }) => children;

Fragment.displayName = 'Fragment';
