<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  const videoSrc = "/404 final.mp4"; 

  function goHome() {
    goto("/");
  }

  onMount(() => {
    document.documentElement.classList.add("error-404");
    document.body.classList.add("error-404");

    return () => {
      document.documentElement.classList.remove("error-404");
      document.body.classList.remove("error-404");
    };
  });
</script>

<svelte:head>
  <title>404 — Bloom Media</title>
  </svelte:head>

<div class="error-fullscreen">
  <video 
    autoplay 
    loop 
    muted 
    playsinline 
    class="fullscreen-video"
  >
    <source src={videoSrc} type="video/webm" />
  </video>
  
  <button 
    class="home-hit-area" 
    type="button" 
    aria-label="Back to Home" 
    on:click={goHome}
  ></button>
</div>

<style>
  :global(html.error-404),
  :global(body.error-404) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #000;
  }

  :global(body.error-404 .liquid-glass-navbar),
  :global(body.error-404 .mobile-menu-overlay) {
    display: none !important;
  }

  .error-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    background: #000;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .fullscreen-video {
    width: 100vw;
    height: 100dvh;
    object-fit: cover;
    object-position: center;
    transform: scale(1);
    transform-origin: center;
  }

  .home-hit-area {
    position: absolute;
    left: 50%;
    bottom: 15%; 
    transform: translateX(-50%);
    width: 220px; 
    height: 70px;
    background: transparent; 
    border: none;
    cursor: pointer;
    z-index: 10;
    outline: none;
  }
</style>
