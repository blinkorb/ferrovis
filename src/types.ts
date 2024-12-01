declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
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
    }
  }
}

export type JSXChildren =
  | HTMLElement
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly JSXChildren[];

export interface IntrinsicAttributes {
  className?: string;
  style?: CSSStyleDeclaration;
  children?: JSXChildren;
}
