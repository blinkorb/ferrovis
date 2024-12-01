export type UnknownObject = Record<string, unknown>;

export type JSXChildren =
  | HTMLElement
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly JSXChildren[];

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Ferrovis {
  export type Element = HTMLElement;

  export interface IntrinsicAttributes {
    className?: string;
    style?: CSSStyleDeclaration;
    children?: JSXChildren;
    onClick?: (event: MouseEvent) => void;
  }

  export interface CanvasAttributes extends IntrinsicAttributes {
    width?: number;
    height?: number;
  }

  export interface IntrinsicElements {
    div: IntrinsicAttributes;
    span: IntrinsicAttributes;
    main: IntrinsicAttributes;
    aside: IntrinsicAttributes;
    section: IntrinsicAttributes;
    nav: IntrinsicAttributes;
    article: IntrinsicAttributes;
    ul: IntrinsicAttributes;
    li: IntrinsicAttributes;
    a: IntrinsicAttributes;
    button: IntrinsicAttributes;
    header: IntrinsicAttributes;
    footer: IntrinsicAttributes;
    h1: IntrinsicAttributes;
    p: IntrinsicAttributes;
    canvas: CanvasAttributes;
  }

  export interface ElementAttributesProperty {
    props: UnknownObject;
  }

  export interface ElementChildrenAttribute {
    children: JSXChildren;
  }

  export type ElementType = keyof IntrinsicElements;
}

declare global {
  interface MediaStreamConstraints {
    noiseSuppression?: boolean;
    echoCancellation?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    export type Element = Ferrovis.Element;
    export type IntrinsicAttributes = Ferrovis.IntrinsicAttributes;
    export type IntrinsicElements = Ferrovis.IntrinsicElements;
    export type ElementAttributesProperty = Ferrovis.ElementAttributesProperty;
    export type ElementChildrenAttribute = Ferrovis.ElementChildrenAttribute;
    export type ElementType = Ferrovis.ElementType;
  }
}
