/* effects.js — All JS animations & effects */

/* ── MOBILE NAV ── */
function toggleMenu() {
  const menu = document.getElementById('nav-menu');
  const btn  = document.getElementById('hamburger');
  const overlay = document.getElementById('nav-overlay');
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    btn.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    menu.classList.add('open');
    btn.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeMenu() {
  document.getElementById('nav-menu')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('nav-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}
// Close menu on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

(function () {

  /* ── 1. CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a,button,.sc,.pc,.edu-card,.cc,.stat-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        ring.style.transform   = 'translate(-50%,-50%) scale(1.6)';
        ring.style.borderColor = 'rgba(99,102,241,.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform   = 'translate(-50%,-50%) scale(1)';
        ring.style.borderColor = 'rgba(6,182,212,.45)';
      });
    });
  }

  /* ── 2. PARTICLE CONSTELLATION ── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - .5) * .25;
        this.vy = (Math.random() - .5) * .25;
        this.r  = Math.random() * 1.3 + .4;
        this.a  = Math.random() * .6 + .2;
        this.col= Math.random() > .5 ? '6,182,212' : '99,102,241';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.col},${this.a})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < 80; i++) particles.push(new Particle());

    let mpx = -999, mpy = -999;
    document.addEventListener('mousemove', e => { mpx = e.clientX; mpy = e.clientY; });

    function drawLine(p1, p2, maxD, color = '6,182,212') {
      const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (d > maxD) return;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(${color},${(1 - d / maxD) * .25})`;
      ctx.lineWidth = .5;
      ctx.stroke();
    }
    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) drawLine(particles[i], particles[j], 110);
        drawLine(particles[i], { x: mpx, y: mpy }, 140, '16,185,129');
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ── 3. 3D CARD TILT ── */
  document.querySelectorAll('.sc, .pc, .edu-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      const rX = ((y - cy) / cy) * -7;
      const rY = ((x - cx) / cx) * 7;
      card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(8px)`;
      card.style.setProperty('--mx', `${(x / r.width)  * 100}%`);
      card.style.setProperty('--my', `${(y / r.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── 4. MAGNETIC BUTTONS ── */
  document.querySelectorAll('.btn-p, .btn-o, .btn-gh').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * .2}px,${y * .2}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── 5. SCROLL PROGRESS BAR ── */
  const bar = document.getElementById('scroll-progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ── 6. SCROLL REVEAL (Simple & working) ── */
  const revealEls = document.querySelectorAll('.sc, .pc, .edu-card, .cc, .tli, .stat-card');

  // Set initial hidden state
  revealEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = `opacity .65s ${i * 60}ms cubic-bezier(.16,1,.3,1), transform .65s ${i * 60}ms cubic-bezier(.16,1,.3,1)`;
  });

  const revObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => revObs.observe(el));

  /* ── 7. TYPING ANIMATION ── */
  const roleEl = document.getElementById('p-role');
  if (roleEl) {
    const phrases = [
      'Full-Stack Developer',
      'React.js Engineer',
      'Node.js Developer',
      'ASP.NET C# Developer',
      'UI/UX Enthusiast',
    ];
    let pi = 0, ci = 0, del = false;
    function type() {
      const ph = phrases[pi];
      if (!del) {
        roleEl.textContent = ph.slice(0, ci + 1);
        ci++;
        if (ci === ph.length) { del = true; setTimeout(type, 1800); return; }
      } else {
        roleEl.textContent = ph.slice(0, ci - 1);
        ci--;
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 42 : 78);
    }
    setTimeout(type, 1200);
  }

  /* ── 8. COUNTER ANIMATION ── */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const sn = entry.target.querySelector('.sn');
      if (!sn || sn.dataset.done) return;
      sn.dataset.done = '1';
      const raw    = sn.textContent.trim();
      const num    = parseFloat(raw);
      const suffix = raw.replace(/[\d.]/g, '');
      if (isNaN(num)) return;
      const dur  = 1600;
      const step = ts => {
        if (!step.s) step.s = ts;
        const p = Math.min((ts - step.s) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        sn.textContent = (num < 10 ? (num * e).toFixed(0) : Math.floor(num * e)) + suffix;
        p < 1 ? requestAnimationFrame(step) : (sn.textContent = raw);
      };
      requestAnimationFrame(step);
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-card').forEach(c => counterObs.observe(c));

  /* ── 9. SECTION HEADING REVEAL ── */
  const shObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        shObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.sh').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    shObs.observe(el);
  });

})();
