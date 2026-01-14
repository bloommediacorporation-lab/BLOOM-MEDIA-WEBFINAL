<script>
  export let checked = false;
  export let disabled = false;
  
  function toggle() {
    if (!disabled) {
      checked = !checked;
    }
  }
</script>

<button
  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  class:enabled={checked}
  class:disabled
  onclick={toggle}
  role="switch"
  aria-label="Toggle switch"
  aria-checked={checked}
  aria-disabled={disabled}
>
  <span
    class="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200"
    class:checked={checked}
  ></span>
</button>

<style>
  :global(:root) {
    --switch-bg-off: #6b7280;
    --switch-bg-on: #22c55e;
    --switch-bg-disabled: #9ca3af;
  }

  button {
    background-color: var(--switch-bg-off);
    border: none;
    cursor: pointer;
  }

  button.enabled {
    background-color: var(--switch-bg-on);
  }

  button.disabled {
    background-color: var(--switch-bg-disabled);
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:active span {
    transform: scale(0.9);
  }

  span.checked {
    transform: translateX(18px);
  }
</style>