declare global {
  interface Window {
    clearCursor?: () => void;
  }

  // Svelte 5 Type Declarations
  namespace svelteHTML {
    interface HTMLAttributes<T> {
      [key: string]: any;
    }

    interface SVGAttributes<T> {
      [key: string]: any;
    }

    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};

