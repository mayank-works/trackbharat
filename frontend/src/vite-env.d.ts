/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const content: string;
  export default content;
}

declare module '*.less' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// OGL type declarations
declare module 'ogl' {
  export class Renderer {
    constructor(options?: { alpha?: boolean; premultipliedAlpha?: boolean; antialias?: boolean; dpr?: number });
    gl: WebGLRenderingContext;
    dpr: number;
    setSize(width: number, height: number): void;
    render(options: { scene: any }): void;
  }

  export class Program {
    constructor(gl: WebGLRenderingContext, options: { vertex: string; fragment: string; uniforms: Record<string, any> });
    uniforms: Record<string, any>;
  }

  export class Mesh {
    constructor(gl: WebGLRenderingContext, options: { geometry: any; program: Program });
  }

  export class Triangle {
    constructor(gl: WebGLRenderingContext);
    attributes: Record<string, any>;
  }

  export class Color {
    constructor(r?: number, g?: number, b?: number);
    r: number;
    g: number;
    b: number;
    set(color: string | number[] | Color): this;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}