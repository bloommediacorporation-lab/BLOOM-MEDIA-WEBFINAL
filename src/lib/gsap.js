import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Re-export for easier imports
export { gsap, ScrollTrigger };

/**
 * Standard luxury parallax effect for an element
 * @param {string|HTMLElement} target - Element to animate
 * @param {number} speed - Parallax speed (negative moves up, positive moves down)
 * @param {string|HTMLElement} trigger - Element that triggers the scroll
 */
export const parallax = (target, speed = -30, trigger) => {
  if (typeof window === 'undefined') return;

  return gsap.to(target, {
    yPercent: speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || target,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0
    }
  });
};

/**
 * Standard fade-up reveal animation
 * @param {string|HTMLElement} target - Element to reveal
 * @param {number} delay - Stagger delay
 */
export const reveal = (target, delay = 0) => {
  if (typeof window === 'undefined') return;

  return gsap.from(target, {
    y: 50,
    opacity: 0,
    duration: 1.2,
    delay: delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: target,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });
};

/**
 * Pin a section while scrolling
 * @param {string|HTMLElement} target - Section to pin
 * @param {string|HTMLElement} content - Content to animate while pinned
 */
export const pinSection = (target, content) => {
  if (typeof window === 'undefined') return;

  return ScrollTrigger.create({
    trigger: target,
    pin: true,
    start: 'top top',
    end: '+=100%',
    scrub: 1,
    animation: gsap.from(content, {
      scale: 0.8,
      opacity: 0
    })
  });
};
