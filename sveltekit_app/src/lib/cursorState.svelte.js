export const cursorState = $state({
  label: '',
  active: false,
  isHovering: false
});

export function setCursorLabel(text) {
  cursorState.label = text;
  cursorState.active = !!text;
}

export function setHovering(isHovering) {
  cursorState.isHovering = isHovering;
}

export function clearCursor() {
  cursorState.label = '';
  cursorState.active = false;
  // We don't reset isHovering here because that's handled by the mouseover/out listeners
}

if (typeof window !== 'undefined') {
  window['clearCursor'] = clearCursor;
}
