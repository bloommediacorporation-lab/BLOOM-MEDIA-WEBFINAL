export { cursorState, setCursorLabel, setHovering, clearCursor } from '../cursorState.svelte.js';

import { clearCursor } from '../cursorState.svelte.js';

if (typeof window !== 'undefined') {
  window.clearCursor = clearCursor;
}

