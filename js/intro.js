/* ==========================================================================
   HERMES Mini App — intro.js
   Particle Burst Motion Study & Cinematic Editorial Reveal
   ========================================================================== */

const Intro = (() => {
  "use strict";

  const TOTAL_DURATION = 3200; // ms (smooth and crisp)
  const BURST_TIMESTAMP = 350;  // ms

  let canvas, ctx;
  let width = 0, height = 0, dpr = 1;
  let particles = [];
  let animId = null;
  let startTime = null;
  let isFinished = false;
  let hasBursted = false;

  const COLORS = ["#c9b37e", "#dfcca0", "#e9e6dd", "#ffffff", "#85838c"];

  class Particle {
    constructor(x, y, isBurst = false) {
      this.x = x;
      this.y = y;
      
      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.94 + Math.random() * 0.03;
        this.size = Math.random() * 2.2 + 0.8;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.008;
      } else {
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.friction = 0.99;
        this.size = Math.random() * 1.5 + 0.5;
        this.life = Math.random() * 0.8 + 0.2;
        this.decay = 0.005;
      }

      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  }

  function triggerBurst() {
    const cx = width / 2;
    const cy = height / 2;
    for (let i = 0; i < 130; i++) {
      particles.push(new Particle(cx, cy, true));
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function finishIntro(onDone) {
    if (isFinished) return;
    isFinished = true;

    if (animId) cancelAnimationFrame(animId);

    const introEl = document.getElementById("intro");
    const appEl = document.getElementById("app-root");

    if (introEl) {
      introEl.classList.add("intro--hidden");
      introEl.setAttribute("aria-hidden", "true");
    }
    if (appEl) {
      appEl.classList.add("visible");
    }

    if (typeof onDone === "function") {
      onDone();
    }
  }

  function renderLoop(timestamp, onDone) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    ctx.fillStyle = "rgba(5, 5, 8, 0.25)";
    ctx.fillRect(0, 0, width, height);

    if (elapsed >= BURST_TIMESTAMP && !hasBursted) {
      hasBursted = true;
      triggerBurst();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) particles.splice(i, 1);
    }

    const introEl = document.getElementById("intro");
    if (introEl) {
      if (elapsed >= BURST_TIMESTAMP + 50) introEl.classList.add("intro--burst");
      if (elapsed >= 1150) introEl.classList.add("intro--show-realms");
      if (elapsed >= 1950) introEl.classList.add("intro--show-sig");
      if (elapsed >= 2650) introEl.classList.add("intro--leaving");
    }

    if (elapsed < TOTAL_DURATION && !isFinished) {
      animId = requestAnimationFrame(t => renderLoop(t, onDone));
    } else {
      finishIntro(onDone);
    }
  }

  function run(onDone) {
    const introEl = document.getElementById("intro");
    const appEl = document.getElementById("app-root");
    const skipBtn = document.getElementById("intro-skip");
    canvas = document.getElementById("intro-canvas");

    if (!introEl || !appEl || !canvas) {
      finishIntro(onDone);
      return;
    }

    if (prefersReducedMotion()) {
      setTimeout(() => finishIntro(onDone), 400);
      return;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const cx = width / 2;
    const cy = height / 2;
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60, false));
    }

    if (skipBtn) {
      skipBtn.onclick = () => finishIntro(onDone);
    }

    animId = requestAnimationFrame(t => renderLoop(t, onDone));
  }

  return { run };
})();