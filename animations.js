/**
 * animations.js — Anvika personal site
 * Requires: GSAP 3 + ScrollTrigger (loaded in HTML)
 * Respects: prefers-reduced-motion
 */

(function () {
  'use strict';

  /* ─── Motion preference ────────────────────────── */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Wait for GSAP to be ready ────────────────── */
  function init() {
    if (typeof gsap === 'undefined') {
      // Retry in case GSAP CDN is still loading
      setTimeout(init, 50);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    setupCursor();
    heroEntrance();
    setupScrollReveal();
    setupGallery();
  }

  /* ════════════════════════════════════════════════
     CUSTOM CURSOR
  ════════════════════════════════════════════════ */
  function setupCursor() {
    // Don't show on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor    = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    if (!cursor || !cursorDot) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
      cursor.classList.add('visible');
      cursorDot.classList.add('visible');
    });

    // Smooth lag on the ring
    function animateCursor() {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover scale on interactives
    const interactives = document.querySelectorAll('a, button, .gallery__card, [tabindex]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
      cursorDot.classList.remove('visible');
    });
  }

  /* ════════════════════════════════════════════════
     HERO ENTRANCE (GSAP)
  ════════════════════════════════════════════════ */
  function heroEntrance() {
    if (reducedMotion) {
      // Instantly reveal everything
      document.querySelectorAll('.hero__name-letter, .hero__tagline, .hero__scroll-cue').forEach(el => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      return;
    }

    const letters = document.querySelectorAll('.hero__name-letter');
    const tagline  = document.getElementById('hero-tagline');
    const scrollCue = document.querySelector('.hero__scroll-cue');

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

    tl
      // Letters bounce in with stagger
      .to(letters, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.06,
        clearProps: 'transform',
      })
      // Tagline fades up 300ms later
      .to(tagline, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.2')
      // Scroll cue
      .to(scrollCue, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out',
      }, '+=0.3');
  }

  /* ════════════════════════════════════════════════
     SCROLL REVEAL (Intersection Observer + CSS)
  ════════════════════════════════════════════════ */
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (reducedMotion) {
      reveals.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  }

  /* ════════════════════════════════════════════════
     GALLERY — click to show fun fact bubble
  ════════════════════════════════════════════════ */
  function setupGallery() {
    const cards = document.querySelectorAll('.gallery__card');

    cards.forEach(card => {
      const fact   = card.dataset.fact || 'A character of mystery.';
      const bubble = card.querySelector('.gallery__bubble');
      if (!bubble) return;

      let bubbleTimer = null;

      function showBubble() {
        bubble.textContent = fact;
        bubble.classList.add('visible');
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => {
          bubble.classList.remove('visible');
        }, 2800);
      }

      function hideBubble() {
        clearTimeout(bubbleTimer);
        bubble.classList.remove('visible');
      }

      // Click / Enter key
      card.addEventListener('click', showBubble);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showBubble();
        }
      });

      // Mouse leave hides bubble
      card.addEventListener('mouseleave', hideBubble);

      // GSAP wobble on hover (skip if reduced motion)
      if (!reducedMotion) {
        const img = card.querySelector('.gallery__img, .gallery__fallback');
        if (img) {
          card.addEventListener('mouseenter', () => {
            gsap.killTweensOf(img);
            gsap.fromTo(img,
              { scale: 1, rotate: 0 },
              {
                keyframes: [
                  { scale: 1.14, rotate: -5, duration: 0.12 },
                  { scale: 1.18, rotate:  5, duration: 0.12 },
                  { scale: 1.14, rotate: -3, duration: 0.1  },
                  { scale: 1.16, rotate:  3, duration: 0.1  },
                  { scale: 1.14, rotate: -2, duration: 0.08 },
                ],
                ease: 'power1.inOut',
              }
            );
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(img, { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(1.4)' });
          });
        }
      }
    });
  }

  /* ─── Kick off ──────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
