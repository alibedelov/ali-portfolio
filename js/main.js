/* ==========================================================================
   Ali Badalov — Game Developer Portfolio Interactive Engine
   Web Audio Synthesizer, Interactive Gameplay Lab, Achievements & FX
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Web Audio Synthesizer (Zero External Dependencies)
  // ==========================================================================
  let audioCtx = null;
  let sfxEnabled = localStorage.getItem('ali_portfolio_sfx') === 'true';

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSfx(type) {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    try {
      if (type === 'hover') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.035);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'laser') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'hit') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'water') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'slowmo') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.25);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'achievement') {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const start = now + idx * 0.08;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.07, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(start);
          osc.stop(start + 0.24);
        });
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Bind SFX toggle UI
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  function updateSfxToggleUI() {
    if (!sfxToggleBtn) return;
    if (sfxEnabled) {
      sfxToggleBtn.classList.add('active');
      const text = sfxToggleBtn.querySelector('.sfx-text');
      if (text) text.textContent = 'SFX: ON';
    } else {
      sfxToggleBtn.classList.remove('active');
      const text = sfxToggleBtn.querySelector('.sfx-text');
      if (text) text.textContent = 'SFX: OFF';
    }
  }
  updateSfxToggleUI();

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;
      localStorage.setItem('ali_portfolio_sfx', sfxEnabled);
      updateSfxToggleUI();
      if (sfxEnabled) {
        playSfx('achievement');
        unlockAchievement('audiophile', 'Soundtrack Armed', 'Toggled Web Audio Sound FX!');
      }
    });
  }

  // Attach generic hover and click sound on interactive elements
  document.querySelectorAll('a, button, .filter-btn, .project-card, .gallery-card').forEach((el) => {
    el.addEventListener('mouseenter', () => playSfx('hover'));
    el.addEventListener('click', () => playSfx('click'));
  });

  // ==========================================================================
  // 2. Achievements Engine
  // ==========================================================================
  let unlockedAchievements = {};
  try {
    unlockedAchievements = JSON.parse(localStorage.getItem('ali_portfolio_achievements') || '{}');
  } catch (e) {
    unlockedAchievements = {};
  }

  const toastContainer = document.getElementById('achievement-toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'achievement-toast-container';
    el.className = 'achievement-toast-container';
    document.body.appendChild(el);
    return el;
  })();

  function unlockAchievement(id, title, desc, icon = '🏆') {
    if (unlockedAchievements[id]) return;
    unlockedAchievements[id] = true;
    try {
      localStorage.setItem('ali_portfolio_achievements', JSON.stringify(unlockedAchievements));
    } catch (e) {}

    playSfx('achievement');

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="achievement-icon">${icon}</div>
      <div class="achievement-text-wrap">
        <span class="achievement-title">Achievement Unlocked!</span>
        <span class="achievement-desc"><strong>${title}</strong>: ${desc}</span>
      </div>
    `;
    toastContainer.appendChild(toast);

    updateAchievementCounterUI();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  function updateAchievementCounterUI() {
    const counterEl = document.getElementById('achievements-counter');
    if (counterEl) {
      const count = Object.keys(unlockedAchievements).length;
      counterEl.textContent = `${count} / 6 Unlocked`;
    }
  }
  updateAchievementCounterUI();

  // Track CV downloads and contact clicks
  document.querySelectorAll('a[download]').forEach(a => {
    a.addEventListener('click', () => {
      unlockAchievement('recruiter', 'Recruiter Speedrun', 'Downloaded Ali Badalov’s CV!', '📄');
    });
  });

  // ==========================================================================
  // 3. Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A)
  // ==========================================================================
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        unlockAchievement('konami', 'Cheat Code Master', 'Entered the legendary Konami Code!', '🎮');
        triggerConfettiFX();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerConfettiFX() {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    const confetti = [];
    for (let i = 0; i < 120; i++) {
      confetti.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 4,
        size: Math.random() * 8 + 4,
        color: `hsl(${Math.random() * 360}, 100%, 65%)`
      });
    }
    let frames = 0;
    function blast() {
      if (frames > 150) return;
      confetti.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      frames++;
      requestAnimationFrame(blast);
    }
    blast();
  }

  // ==========================================================================
  // 4. Background Particle Constellation Canvas
  // ==========================================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.4 ? '0, 242, 254' : '157, 78, 221';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      resize();
      particles = [];
      const count = Math.min(Math.floor((width * height) / 18000), 70);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      const maxDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist / maxDist) * 0.16})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    if (!prefersReducedMotion) {
      initParticles();
      animate();
      window.addEventListener('resize', () => { resize(); initParticles(); });
      window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
      window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    }
  }

  // ==========================================================================
  // 5. Interactive Gameplay Lab (Predictive Aim, Biome Grid, Chrono Time)
  // ==========================================================================
  const labCanvas = document.getElementById('lab-canvas');
  if (labCanvas) {
    const ctx = labCanvas.getContext('2d');
    let labMode = 'turret'; // 'turret' | 'biome' | 'chrono'
    let labWidth, labHeight;
    let labHits = 0;

    function resizeLab() {
      const rect = labCanvas.getBoundingClientRect();
      labWidth = labCanvas.width = rect.width;
      labHeight = labCanvas.height = rect.height;
    }
    resizeLab();
    window.addEventListener('resize', resizeLab);

    // --- Mode 1: Predictive Turret Aiming (Motor Burn) ---
    const turretState = {
      x: 0,
      y: 0,
      angle: 0,
      targetAngle: 0,
      bulletSpeed: 640, // px/s
      droneSpeed: 165,
      bullets: [],
      particles: [],
      floatingTexts: [],
      mode: 'predictive', // 'predictive' | 'direct'
      autoFire: false, // Default to FALSE so manual button works crisply
      autoFireTimer: 0,
      recoil: 0,
      muzzleFlash: 0,
      drone: { x: 100, y: 100, vx: 180, vy: 120, radius: 20, t: 0, hitFlash: 0 }
    };

    function updateTurret(dt) {
      turretState.x = labWidth * 0.5;
      turretState.y = labHeight * 0.78;

      // Spring decay recoil & muzzle flash
      turretState.recoil = Math.max(0, turretState.recoil - dt * 26);
      turretState.muzzleFlash = Math.max(0, turretState.muzzleFlash - dt);
      if (turretState.drone.hitFlash > 0) {
        turretState.drone.hitFlash = Math.max(0, turretState.drone.hitFlash - dt);
      }

      // Drone flight path (lissajous figure-8)
      turretState.drone.t += dt * (turretState.droneSpeed / 100);
      const droneX = labWidth * 0.5 + Math.sin(turretState.drone.t) * (labWidth * 0.35);
      const droneY = labHeight * 0.3 + Math.cos(turretState.drone.t * 2) * (labHeight * 0.16);

      turretState.drone.vx = (droneX - turretState.drone.x) / dt;
      turretState.drone.vy = (droneY - turretState.drone.y) / dt;
      turretState.drone.x = droneX;
      turretState.drone.y = droneY;

      // Aim calculation
      const dx = turretState.drone.x - turretState.x;
      const dy = turretState.drone.y - turretState.y;

      let aimX = turretState.drone.x;
      let aimY = turretState.drone.y;

      if (turretState.mode === 'predictive') {
        // Kinematic first-order intercept solution: P_intercept = P_target + V_target * t_flight
        const dist = Math.hypot(dx, dy);
        const flightTime = dist / turretState.bulletSpeed;
        aimX = turretState.drone.x + turretState.drone.vx * flightTime;
        aimY = turretState.drone.y + turretState.drone.vy * flightTime;
      }

      turretState.targetAngle = Math.atan2(aimY - turretState.y, aimX - turretState.x);

      // Smooth turret rotation (Slerp-style damping)
      let diff = turretState.targetAngle - turretState.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      turretState.angle += diff * Math.min(dt * 14, 1);

      // Only auto-fire if explicitly turned ON by the user
      if (turretState.autoFire) {
        turretState.autoFireTimer += dt;
        if (turretState.autoFireTimer >= 0.28) {
          turretState.autoFireTimer = 0;
          fireTurretBullet();
        }
      }

      // Update bullets
      for (let i = turretState.bullets.length - 1; i >= 0; i--) {
        const b = turretState.bullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;

        // Check hit against drone
        const hitDist = Math.hypot(b.x - turretState.drone.x, b.y - turretState.drone.y);
        if (hitDist < turretState.drone.radius + 6) {
          labHits++;
          playSfx('hit');
          turretState.drone.hitFlash = 0.2;
          spawnSparks(b.x, b.y, '#00f2fe');
          spawnSparks(b.x, b.y, '#ffbe0b');

          // Floating score indicator
          turretState.floatingTexts.push({
            text: turretState.mode === 'predictive' ? '+100 INTERCEPT!' : '+50 DIRECT HIT!',
            x: turretState.drone.x,
            y: turretState.drone.y - 10,
            alpha: 1,
            color: turretState.mode === 'predictive' ? '#00f2fe' : '#ffbe0b'
          });

          turretState.bullets.splice(i, 1);

          if (labHits >= 3) {
            unlockAchievement('sniper', 'Kinematic Marksman', 'Scored 3 predictive turret hits!', '🎯');
          }
          continue;
        }

        if (b.life <= 0 || b.x < 0 || b.x > labWidth || b.y < 0 || b.y > labHeight) {
          turretState.bullets.splice(i, 1);
        }
      }

      // Update sparks
      for (let i = turretState.particles.length - 1; i >= 0; i--) {
        const p = turretState.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) turretState.particles.splice(i, 1);
      }

      // Update floating texts
      for (let i = turretState.floatingTexts.length - 1; i >= 0; i--) {
        const ft = turretState.floatingTexts[i];
        ft.y -= dt * 35;
        ft.alpha -= dt * 1.3;
        if (ft.alpha <= 0) turretState.floatingTexts.splice(i, 1);
      }

      // Update HUD elements
      const readoutAim = document.getElementById('hud-aim-status');
      if (readoutAim) readoutAim.textContent = turretState.mode === 'predictive' ? 'LEAD INTERCEPT' : 'DIRECT AIM';
      const readoutHits = document.getElementById('hud-score');
      if (readoutHits) readoutHits.textContent = `HITS: ${labHits}`;
    }

    function fireTurretBullet() {
      turretState.recoil = 10;
      turretState.muzzleFlash = 0.09;
      const barrelLen = 36;
      const spawnX = turretState.x + Math.cos(turretState.angle) * barrelLen;
      const spawnY = turretState.y + Math.sin(turretState.angle) * barrelLen;

      turretState.bullets.push({
        x: spawnX,
        y: spawnY,
        vx: Math.cos(turretState.angle) * turretState.bulletSpeed,
        vy: Math.sin(turretState.angle) * turretState.bulletSpeed,
        life: 2.2
      });

      // Muzzle sparks
      for (let i = 0; i < 5; i++) {
        const ang = turretState.angle + (Math.random() - 0.5) * 0.7;
        const spd = Math.random() * 140 + 50;
        turretState.particles.push({
          x: spawnX,
          y: spawnY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0.18,
          color: '#00f2fe'
        });
      }

      playSfx('laser');

      const fireBtn = document.getElementById('turret-fire-btn');
      if (fireBtn) {
        fireBtn.classList.remove('fire-pulse');
        void fireBtn.offsetWidth;
        fireBtn.classList.add('fire-pulse');
      }
    }

    function spawnSparks(x, y, color) {
      for (let i = 0; i < 14; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 160 + 40;
        turretState.particles.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0.35,
          color
        });
      }
    }

    function renderTurret() {
      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < labWidth; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, labHeight); ctx.stroke();
      }
      for (let y = 0; y < labHeight; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(labWidth, y); ctx.stroke();
      }

      // Draw predicted trajectory vector line
      if (turretState.mode === 'predictive') {
        const dist = Math.hypot(turretState.drone.x - turretState.x, turretState.drone.y - turretState.y);
        const flightTime = dist / turretState.bulletSpeed;
        const leadX = turretState.drone.x + turretState.drone.vx * flightTime;
        const leadY = turretState.drone.y + turretState.drone.vy * flightTime;

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255, 190, 11, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(turretState.x, turretState.y);
        ctx.lineTo(leadX, leadY);
        ctx.stroke();

        // Lead marker reticle
        ctx.beginPath();
        ctx.arc(leadX, leadY, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Direct laser sight
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = 'rgba(255, 75, 75, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(turretState.x, turretState.y);
        ctx.lineTo(turretState.drone.x, turretState.drone.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Drone
      ctx.save();
      ctx.translate(turretState.drone.x, turretState.drone.y);
      ctx.shadowBlur = turretState.drone.hitFlash > 0 ? 25 : 15;
      ctx.shadowColor = turretState.drone.hitFlash > 0 ? '#ffbe0b' : '#00f2fe';
      ctx.fillStyle = turretState.drone.hitFlash > 0 ? '#ffbe0b' : '#142033';
      ctx.strokeStyle = turretState.drone.hitFlash > 0 ? '#ffffff' : '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, turretState.drone.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Drone rotor arms
      ctx.strokeStyle = '#9d4edd';
      ctx.beginPath();
      ctx.moveTo(-24, 0); ctx.lineTo(24, 0);
      ctx.moveTo(0, -24); ctx.lineTo(0, 24);
      ctx.stroke();
      ctx.restore();

      // Draw Turret Base
      ctx.save();
      ctx.translate(turretState.x, turretState.y);
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#4facfe';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Turret Barrel (with animated recoil)
      ctx.rotate(turretState.angle);
      const barrelLength = 36 - turretState.recoil;
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(0, -6, barrelLength, 12);

      // Muzzle Flash
      if (turretState.muzzleFlash > 0) {
        ctx.beginPath();
        ctx.arc(barrelLength, 0, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f2fe';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // Draw Bullets with glowing tracers
      turretState.bullets.forEach(b => {
        ctx.fillStyle = '#ffbe0b';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffbe0b';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Sparks
      turretState.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Floating Feedback Texts
      turretState.floatingTexts.forEach(ft => {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      });
      ctx.shadowBlur = 0;
    }

    // --- Mode 2: Dynamic Biome Grid Simulation (HIDRO HAZBO) ---
    const biomeGrid = {
      cols: 4,
      rows: 4,
      tiles: []
    };

    function initBiomeGrid() {
      biomeGrid.tiles = [];
      for (let r = 0; r < biomeGrid.rows; r++) {
        for (let c = 0; c < biomeGrid.cols; c++) {
          biomeGrid.tiles.push({
            r, c,
            moisture: Math.random() * 20 + 10, // 0 - 100
            locked: false,
            lockTimer: 0
          });
        }
      }
    }
    initBiomeGrid();

    function updateBiome(dt) {
      let lockedCount = 0;
      biomeGrid.tiles.forEach(tile => {
        // Natural gradual evaporation
        if (!tile.locked) {
          tile.moisture = Math.max(0, tile.moisture - dt * 3.5);

          // Check if in fertile range (35% to 75%)
          if (tile.moisture >= 35 && tile.moisture <= 75) {
            tile.lockTimer += dt;
            if (tile.lockTimer >= 2.5) {
              tile.locked = true;
              playSfx('achievement');
            }
          } else {
            tile.lockTimer = Math.max(0, tile.lockTimer - dt * 2);
          }
        } else {
          lockedCount++;
        }
      });

      if (lockedCount >= 4) {
        unlockAchievement('eco_guardian', 'Eco Guardian', 'Cultivated and locked 4 forest tiles!', '🌱');
      }

      const readoutLocked = document.getElementById('hud-locked-tiles');
      if (readoutLocked) readoutLocked.textContent = `LOCKED: ${lockedCount}/16`;
    }

    function renderBiome() {
      const tileSize = Math.min((labWidth - 60) / biomeGrid.cols, (labHeight - 60) / biomeGrid.rows);
      const startX = (labWidth - tileSize * biomeGrid.cols) / 2;
      const startY = (labHeight - tileSize * biomeGrid.rows) / 2;

      biomeGrid.tiles.forEach(tile => {
        const x = startX + tile.c * tileSize;
        const y = startY + tile.r * tileSize;

        // Color transitions based on moisture
        let fillColor = '#3a2016'; // Drought
        let strokeColor = 'rgba(255, 100, 50, 0.4)';

        if (tile.moisture >= 35 && tile.moisture <= 75) {
          fillColor = tile.locked ? '#0b3d22' : '#14532d'; // Fertile
          strokeColor = tile.locked ? '#ffbe0b' : '#10e793';
        } else if (tile.moisture > 75) {
          fillColor = '#0f2942'; // Swamp
          strokeColor = '#00f2fe';
        }

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = tile.locked ? 3 : 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 4, tileSize - 8, tileSize - 8, 8);
        ctx.fill();
        ctx.stroke();

        // Lock icon
        if (tile.locked) {
          ctx.fillStyle = '#ffbe0b';
          ctx.font = '16px sans-serif';
          ctx.fillText('🔒', x + tileSize / 2 - 8, y + tileSize / 2 + 6);
        } else {
          // Moisture gauge bar
          const barW = tileSize - 20;
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(x + 10, y + tileSize - 16, barW, 6);
          ctx.fillStyle = '#00f2fe';
          ctx.fillRect(x + 10, y + tileSize - 16, (barW * tile.moisture) / 100, 6);
        }
      });
    }

    function interactBiome(clientX, clientY, addMoisture = 25) {
      const rect = labCanvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const tileSize = Math.min((labWidth - 60) / biomeGrid.cols, (labHeight - 60) / biomeGrid.rows);
      const startX = (labWidth - tileSize * biomeGrid.cols) / 2;
      const startY = (labHeight - tileSize * biomeGrid.rows) / 2;

      biomeGrid.tiles.forEach(tile => {
        const tx = startX + tile.c * tileSize;
        const ty = startY + tile.r * tileSize;
        if (x >= tx && x <= tx + tileSize && y >= ty && y <= ty + tileSize) {
          if (!tile.locked) {
            tile.moisture = Math.min(100, Math.max(0, tile.moisture + addMoisture));
            playSfx('water');
          }
        }
      });
    }

    // --- Mode 3: Chrono Strike Slow-Motion Matrix (Temporal Warfare) ---
    const chronoState = {
      timeScale: 1.0,
      targetTimeScale: 1.0,
      particles: [],
      projectiles: [],
      spawnTimer: 0
    };

    function updateChrono(dt) {
      chronoState.timeScale += (chronoState.targetTimeScale - chronoState.timeScale) * Math.min(dt * 8, 1);
      const effectiveDt = dt * chronoState.timeScale;

      chronoState.spawnTimer += effectiveDt;
      if (chronoState.spawnTimer >= 0.12) {
        chronoState.spawnTimer = 0;
        const ang = Math.random() * Math.PI * 2;
        chronoState.projectiles.push({
          x: labWidth * 0.5 + Math.cos(ang) * (labWidth * 0.45),
          y: labHeight * 0.5 + Math.sin(ang) * (labHeight * 0.45),
          vx: -Math.cos(ang) * (Math.random() * 200 + 150),
          vy: -Math.sin(ang) * (Math.random() * 200 + 150),
          life: 3.0,
          tail: []
        });
      }

      for (let i = chronoState.projectiles.length - 1; i >= 0; i--) {
        const p = chronoState.projectiles[i];
        p.tail.unshift({ x: p.x, y: p.y });
        if (p.tail.length > 8) p.tail.pop();

        p.x += p.vx * effectiveDt;
        p.y += p.vy * effectiveDt;
        p.life -= effectiveDt;

        if (p.life <= 0 || p.x < 0 || p.x > labWidth || p.y < 0 || p.y > labHeight) {
          chronoState.projectiles.splice(i, 1);
        }
      }

      if (chronoState.targetTimeScale < 0.3) {
        unlockAchievement('chrono', 'Chronos Operator', 'Engaged tactical slow-motion dilation!', '⏳');
      }

      const readoutScale = document.getElementById('hud-timescale');
      if (readoutScale) readoutScale.textContent = `${Math.round(chronoState.timeScale * 100)}% SPEED`;
    }

    function renderChrono() {
      // Circular chrono core
      ctx.save();
      ctx.translate(labWidth * 0.5, labHeight * 0.5);
      ctx.strokeStyle = chronoState.timeScale < 0.5 ? '#00f2fe' : '#9d4edd';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Projectiles with motion trails
      chronoState.projectiles.forEach(p => {
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.beginPath();
        p.tail.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // --- Main Lab Loop ---
    let lastTime = performance.now();
    function labLoop(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, labWidth, labHeight);

      if (labMode === 'turret') {
        updateTurret(dt);
        renderTurret();
      } else if (labMode === 'biome') {
        updateBiome(dt);
        renderBiome();
      } else if (labMode === 'chrono') {
        updateChrono(dt);
        renderChrono();
      }

      requestAnimationFrame(labLoop);
    }
    requestAnimationFrame(labLoop);

    // --- Lab Tabs Switching ---
    const labTabs = document.querySelectorAll('.lab-tab-btn');
    labTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        labTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        labMode = btn.getAttribute('data-lab');

        // Hide/Show contextual controls
        document.querySelectorAll('.lab-controls-sub').forEach(el => el.style.display = 'none');
        const sub = document.getElementById(`lab-controls-${labMode}`);
        if (sub) sub.style.display = 'flex';

        // Update HUD mode text
        const hudMode = document.getElementById('hud-mode-title');
        if (hudMode) {
          hudMode.textContent = labMode === 'turret' ? 'KINEMATICS: PREDICTIVE AIM' :
                                labMode === 'biome' ? 'CELLULAR GRID: HYDRATION' : 'CHRONO: TIME SCALE';
        }
      });
    });

    // --- Control Listeners ---
    const aimToggle = document.getElementById('turret-aim-toggle');
    if (aimToggle) {
      aimToggle.addEventListener('click', () => {
        turretState.mode = turretState.mode === 'predictive' ? 'direct' : 'predictive';
        aimToggle.textContent = turretState.mode === 'predictive' ? 'Mode: Predictive (Lead)' : 'Mode: Direct Aim';
        aimToggle.style.borderColor = turretState.mode === 'predictive' ? 'var(--accent-cyan)' : 'rgba(255, 75, 75, 0.5)';
      });
    }

    const fireBtn = document.getElementById('turret-fire-btn');
    if (fireBtn) {
      fireBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fireTurretBullet();
      });
    }

    const autoFireBtn = document.getElementById('turret-autofire-toggle');
    if (autoFireBtn) {
      autoFireBtn.addEventListener('click', (e) => {
        e.preventDefault();
        turretState.autoFire = !turretState.autoFire;
        if (turretState.autoFire) {
          autoFireBtn.textContent = 'Auto-Fire: ON';
          autoFireBtn.style.background = 'rgba(16, 231, 147, 0.2)';
          autoFireBtn.style.color = 'var(--accent-green)';
          autoFireBtn.style.borderColor = 'var(--accent-green)';
        } else {
          autoFireBtn.textContent = 'Auto-Fire: OFF';
          autoFireBtn.style.background = 'rgba(255, 255, 255, 0.06)';
          autoFireBtn.style.color = 'var(--text-muted)';
          autoFireBtn.style.borderColor = 'var(--line)';
        }
      });
    }

    const waterBtn = document.getElementById('biome-water-btn');
    if (waterBtn) {
      waterBtn.addEventListener('click', () => {
        biomeGrid.tiles.forEach(t => { if (!t.locked) t.moisture = Math.min(100, t.moisture + 15); });
        playSfx('water');
      });
    }

    const slowmoBtn = document.getElementById('chrono-slowmo-btn');
    if (slowmoBtn) {
      const toggleSlowMo = (active) => {
        chronoState.targetTimeScale = active ? 0.12 : 1.0;
        slowmoBtn.classList.toggle('active', active);
        if (active) playSfx('slowmo');
      };
      slowmoBtn.addEventListener('mousedown', () => toggleSlowMo(true));
      window.addEventListener('mouseup', () => toggleSlowMo(false));
      slowmoBtn.addEventListener('touchstart', (e) => { e.preventDefault(); toggleSlowMo(true); }, { passive: false });
      window.addEventListener('touchend', () => toggleSlowMo(false));
    }

    // Touch & Mouse input inside canvas
    labCanvas.addEventListener('click', (e) => {
      if (labMode === 'biome') {
        interactBiome(e.clientX, e.clientY, 25);
      } else if (labMode === 'turret') {
        fireTurretBullet();
      }
    });

    labCanvas.addEventListener('touchstart', (e) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      if (labMode === 'biome') {
        interactBiome(touch.clientX, touch.clientY, 25);
      } else if (labMode === 'turret') {
        fireTurretBullet();
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 6. Project Filter Tabs
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCats = card.getAttribute('data-category').split(' ');
          if (category === 'all' || cardCats.includes(category)) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // 7. Universal Lightbox with Keyboard & Touch Gestures
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-card, figure');
  const lightbox = document.getElementById('lightbox');

  if (lightbox && galleryItems.length) {
    const lightboxImg = lightbox.querySelector('#lightbox-img') || lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const imagesData = [];

    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const caption = item.querySelector('figcaption');
      if (img) {
        imagesData.push({
          src: img.src,
          alt: img.alt || '',
          caption: caption ? caption.textContent.trim() : ''
        });

        item.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(index);
        });
      }
    });

    function openLightbox(index) {
      if (!imagesData.length) return;
      currentIndex = (index + imagesData.length) % imagesData.length;
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      playSfx('click');
    }

    function updateLightboxContent() {
      const data = imagesData[currentIndex];
      if (!data) return;
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      if (lightboxCaption) lightboxCaption.textContent = data.caption || data.alt;
      if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${imagesData.length}`;
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      playSfx('click');
    }

    function nextImage() { openLightbox(currentIndex + 1); }
    function prevImage() { openLightbox(currentIndex - 1); }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrap')) {
        closeLightbox();
      }
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) nextImage(); // Swiped left
      if (touchEndX - touchStartX > 50) prevImage(); // Swiped right
    }, { passive: true });
  }

  // ==========================================================================
  // 8. Dynamic Year in Footer
  // ==========================================================================
  const yearEls = document.querySelectorAll('#y, .current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = currentYear);

})();
