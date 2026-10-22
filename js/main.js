/**
 * GUILHERME SCOPIN — PORTFÓLIO CRIATIVO & UI/UX DESIGN
 * Main Interactive Engine & Controller (AI Background, Custom Tech Cursor, Carrosséis & 3D Tilt)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initAIDigitalCanvas();
  initHeaderScroll();
  initMobileMenu();
  initHoverVideos();
  initCarousels();
  initCategoryFilters();
  initLightbox();
  initClipboardAndToasts();
  initScrollProgress();
  initMouseSpotlightAndParallax();
  initCard3DTilt();
  initScrollSpy();
  initScrollReveal();
});

/* ===================================================================
   01. HEADER & NAVIGATION
   =================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header.offsetHeight || 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        const navMenu = document.querySelector('.nav-menu');
        const toggleBtn = document.querySelector('.mobile-toggle');
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          if (toggleBtn) toggleBtn.innerHTML = '☰';
        }
      }
    });
  });
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });
}

/* ===================================================================
   02. HOVER-TO-PLAY VIDEO ENGINE
   =================================================================== */
function initHoverVideos() {
  // Autoplay permanent video (Pink Joint motion banner)
  const permanentVideos = document.querySelectorAll('.pj-prominent-motion-banner video');
  permanentVideos.forEach((v) => {
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.play().catch(() => {});
  });

  // Hover-to-play for matrix & story cards
  const hoverContainers = document.querySelectorAll('.nl-video-card, .story-card-box, .lab-media-box');

  hoverContainers.forEach((container) => {
    const video = container.querySelector('video');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';

    container.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    container.addEventListener('mouseleave', () => {
      video.pause();
    });

    // Touch support via IntersectionObserver
    if ('IntersectionObserver' in window && window.matchMedia('(hover: none)').matches) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(video);
    }
  });
}

/* ===================================================================
   03. INTERACTIVE CAROUSELS (With Slide Strips & Touch Gestures)
   =================================================================== */
function initCarousels() {
  const carouselContainers = document.querySelectorAll('.interactive-carousel');

  carouselContainers.forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-nav-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-nav-btn.next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const counter = carousel.querySelector('.carousel-counter-badge');
    const thumbnails = carousel.querySelectorAll('.carousel-thumb-btn');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function updateCarousel(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;

      // Update Dots
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });

      // Update Thumbnails
      thumbnails.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentIndex);
      });

      // Update Counter Badge
      if (counter) {
        const currentPad = String(currentIndex + 1).padStart(2, '0');
        const totalPad = String(totalSlides).padStart(2, '0');
        counter.textContent = `${currentPad} / ${totalPad}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCarousel(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCarousel(currentIndex + 1);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateCarousel(idx);
      });
    });

    thumbnails.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        updateCarousel(idx);
      });
    });

    // Touch & Swipe
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX < -40) {
          updateCarousel(currentIndex + 1);
        } else if (diffX > 40) {
          updateCarousel(currentIndex - 1);
        }
      });
    }

    updateCarousel(0);
  });
}

/* ===================================================================
   04. CATEGORY FILTER TABS
   =================================================================== */
function initCategoryFilters() {
  const filterContainers = document.querySelectorAll('.filter-tabs');

  filterContainers.forEach((container) => {
    const buttons = container.querySelectorAll('.tab-btn');
    const targetGridId = container.dataset.target;
    const targetGrid = document.getElementById(targetGridId);

    if (!targetGrid) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const items = targetGrid.querySelectorAll('[data-category]');

        items.forEach((item) => {
          const category = item.dataset.category || '';
          if (filter === 'all' || category.includes(filter)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

/* ===================================================================
   05. FULLSCREEN LIGHTBOX
   =================================================================== */
function initLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  const mediaContainer = document.querySelector('.lightbox-media-wrapper');
  const titleEl = document.querySelector('.lightbox-title');
  const clientEl = document.querySelector('.lightbox-client');
  const closeBtn = document.querySelector('.lightbox-close-btn');

  if (!modal || !mediaContainer) return;

  const triggerElements = document.querySelectorAll('[data-lightbox]');

  triggerElements.forEach((el) => {
    el.addEventListener('click', (e) => {
      // Don't trigger if clicked on nav buttons or thumbnails
      if (e.target.closest('.carousel-nav-btn, .carousel-thumb-btn, .carousel-pagination')) {
        return;
      }

      e.preventDefault();
      const type = el.dataset.type || 'image';
      const src = el.dataset.src || el.querySelector('img, video')?.src;
      const title = el.dataset.title || 'Conceito Visual';
      const client = el.dataset.client || 'Guilherme Scopin';

      if (!src) return;

      if (type === 'video') {
        mediaContainer.innerHTML = `
          <video class="lightbox-media" src="${src}" controls autoplay playsinline></video>
        `;
      } else {
        mediaContainer.innerHTML = `
          <img class="lightbox-media" src="${src}" alt="${title}" />
        `;
      }

      if (titleEl) titleEl.textContent = title;
      if (clientEl) clientEl.textContent = client;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const video = mediaContainer.querySelector('video');
    if (video) video.pause();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   06. CLIPBOARD & TOAST NOTIFICATIONS
   =================================================================== */
function initClipboardAndToasts() {
  const copyButtons = document.querySelectorAll('.btn-copy');
  const toast = document.querySelector('.toast-notice');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`✓ ${textToCopy} copiado!`);
      }).catch(() => {
        showToast(`✓ ${textToCopy}`);
      });
    });
  });
}

/* ===================================================================
   07. SCROLL PROGRESS BAR
   =================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateBar() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      bar.style.width = '0%';
      return;
    }
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/* ===================================================================
   08. MOUSE SPOTLIGHT & AMBIENT PARALLAX
   =================================================================== */
function initMouseSpotlightAndParallax() {
  const spotlight = document.querySelector('.cursor-spotlight');
  const parallaxOrbs = document.querySelectorAll('.glow-orb[data-parallax]');
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!ticking) {
      requestAnimationFrame(() => {
        // Spotlight follow
        if (spotlight) {
          spotlight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }

        // Parallax calculations for ambient orbs
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (mouseX - centerX) / centerX;
        const deltaY = (mouseY - centerY) / centerY;

        parallaxOrbs.forEach((orb) => {
          const factor = parseFloat(orb.dataset.parallax) || 0.05;
          const px = deltaX * factor * 100;
          const py = deltaY * factor * 100;
          orb.style.setProperty('--parallax-x', `${px.toFixed(2)}px`);
          orb.style.setProperty('--parallax-y', `${py.toFixed(2)}px`);
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===================================================================
   09. 3D CARD PERSPECTIVE TILT
   =================================================================== */
function initCard3DTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltCards = document.querySelectorAll('[data-tilt], .service-card, .process-step, .metric-item');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===================================================================
   10. SCROLLSPY NAVIGATION (Projetos, Serviços, Lab, Processo, Contato)
   =================================================================== */
function initScrollSpy() {
  const sections = [
    document.getElementById('projetos'),
    document.getElementById('servicos'),
    document.getElementById('lab'),
    document.getElementById('processo'),
    document.getElementById('contato')
  ].filter(Boolean);

  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 200;
    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = sections[i];
      if (sec && sec.offsetTop <= scrollPos) {
        currentId = sec.getAttribute('id');
        break;
      }
    }

    if (!currentId && window.scrollY < 250) {
      navLinks.forEach((link) => link.classList.remove('active'));
      return;
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ===================================================================
   11. SCROLL REVEAL ANIMATIONS
   =================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.section-header, .service-card, .process-step, .pj-mosaic-card, .nl-video-card, .capellux-white-card, .lab-card, .contact-card-main'
  );

  elements.forEach((el) => {
    el.classList.add('reveal-on-scroll');
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}

/* ===================================================================
   12. ADVANCED INTERACTIVE TECH CURSOR (Dot & Magnetic Aura Ring)
   =================================================================== */
function initCustomCursor() {
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');
  if (!cursorDot || !cursorRing) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMoving) {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      isMoving = true;
    }

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Fluid spring interpolation for the outer aura ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorRing.style.left = `${ringX.toFixed(2)}px`;
    cursorRing.style.top = `${ringY.toFixed(2)}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states over interactive elements
  const interactiveSelector = 'a, button, [data-lightbox], [data-tilt], .tab-btn, .service-card, .process-step, .nl-video-card, .carousel-nav-btn, .btn-copy, .feed-thumb-card, .direct-box';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click physics
  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Boundary handling
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

/* ===================================================================
   13. AI DIGITAL GENERATIVE BACKGROUND (Shapes, Neural Nodes, Synapses)
   =================================================================== */
function initAIDigitalCanvas() {
  const canvas = document.getElementById('ai-digital-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse vector tracking for subtle AI mesh displacement
  let mouse = { x: -1000, y: -1000, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Palette from the codebase
  const colors = [
    { r: 0, g: 242, b: 254 },    // Cyan #00f2fe
    { r: 255, g: 46, b: 147 },   // Pink #ff2e93
    { r: 139, g: 92, b: 246 },   // Violet #8b5cf6
    { r: 79, g: 172, b: 254 },   // Blue #4facfe
    { r: 16, g: 185, b: 129 }    // Emerald #10b981
  ];

  // 1. Floating Generative AI Energy Shapes (Harmonic Volumetric Drift)
  const energyBlobs = [
    { x: width * 0.2, y: height * 0.25, r: 240, color: colors[0], vx: 0.22, vy: 0.18, phase: 0 },
    { x: width * 0.8, y: height * 0.35, r: 280, color: colors[1], vx: -0.18, vy: 0.24, phase: 2 },
    { x: width * 0.5, y: height * 0.75, r: 310, color: colors[2], vx: 0.2, vy: -0.19, phase: 4 },
    { x: width * 0.85, y: height * 0.85, r: 220, color: colors[3], vx: -0.25, vy: -0.16, phase: 1.5 }
  ];

  // 2. Floating AI Cyber-Geometric Wireframes (Digital IA Elements)
  const cyberShapes = [
    { type: 'hex', x: width * 0.15, y: height * 0.45, size: 48, rot: 0, rotSpeed: 0.003, color: colors[0], vx: 0.1, vy: -0.08 },
    { type: 'rings', x: width * 0.82, y: height * 0.2, size: 55, rot: 0, rotSpeed: -0.004, color: colors[2], vx: -0.08, vy: 0.12 },
    { type: 'cross', x: width * 0.75, y: height * 0.65, size: 36, rot: 0, rotSpeed: 0.005, color: colors[1], vx: 0.12, vy: 0.09 },
    { type: 'hex', x: width * 0.4, y: height * 0.18, size: 40, rot: 0, rotSpeed: -0.002, color: colors[3], vx: -0.07, vy: -0.1 }
  ];

  // 3. Neural Synaptic Nodes & Data Links
  const nodeCount = Math.min(38, Math.floor((width * height) / 32000));
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    const col = colors[Math.floor(Math.random() * colors.length)];
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      baseRadius: 1.5 + Math.random() * 2,
      color: col,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03
    });
  }

  // Synaptic Data Pulses (Micro-photons travelling across neural lines)
  const pulses = [];
  for (let i = 0; i < 8; i++) {
    pulses.push({
      nodeA: Math.floor(Math.random() * nodeCount),
      nodeB: Math.floor(Math.random() * nodeCount),
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.012
    });
  }

  let animationFrameId;

  function render() {
    if (document.hidden) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // --- Draw Floating AI Energy Blobs (Volumetric Gradients) ---
    energyBlobs.forEach((blob) => {
      blob.phase += 0.006;
      blob.x += blob.vx;
      blob.y += blob.vy;

      if (blob.x < -blob.r) blob.x = width + blob.r;
      if (blob.x > width + blob.r) blob.x = -blob.r;
      if (blob.y < -blob.r) blob.y = height + blob.r;
      if (blob.y > height + blob.r) blob.y = -blob.r;

      const dynamicRadius = blob.r + Math.sin(blob.phase) * 35;
      const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, dynamicRadius);
      grad.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.13)`);
      grad.addColorStop(0.5, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.04)`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, dynamicRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- Draw Floating AI Geometric Shapes (Hexagons, Rings, Crosses) ---
    cyberShapes.forEach((shape) => {
      shape.x += shape.vx;
      shape.y += shape.vy;
      shape.rot += shape.rotSpeed;

      if (shape.x < -100) shape.x = width + 100;
      if (shape.x > width + 100) shape.x = -100;
      if (shape.y < -100) shape.y = height + 100;
      if (shape.y > height + 100) shape.y = -100;

      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rot);
      ctx.strokeStyle = `rgba(${shape.color.r}, ${shape.color.g}, ${shape.color.b}, 0.18)`;
      ctx.lineWidth = 1;

      if (shape.type === 'hex') {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const hx = Math.cos(angle) * shape.size;
          const hy = Math.sin(angle) * shape.size;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = `rgba(${shape.color.r}, ${shape.color.g}, ${shape.color.b}, 0.35)`;
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape.type === 'rings') {
        ctx.beginPath();
        ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, shape.size * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (shape.type === 'cross') {
        const s = shape.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
        ctx.moveTo(0, -s); ctx.lineTo(0, s);
        ctx.stroke();
      }
      ctx.restore();
    });

    // --- Update & Draw Neural Nodes ---
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0) node.x = width;
      if (node.x > width) node.x = 0;
      if (node.y < 0) node.y = height;
      if (node.y > height) node.y = 0;

      if (mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160 && dist > 0) {
          const force = (1 - dist / 160) * 0.8;
          node.x -= (dx / dist) * force;
          node.y -= (dy / dist) * force;
        }
      }

      node.pulse += node.pulseSpeed;
      const currentRadius = node.baseRadius + Math.sin(node.pulse) * 0.7;

      ctx.fillStyle = `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0.65)`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0.12)`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, currentRadius * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- Draw Synaptic Connections (Neural Mesh) ---
    const maxDist = 135;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const na = nodes[i];
        const nb = nodes[j];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.strokeStyle = `rgba(${na.color.r}, ${na.color.g}, ${na.color.b}, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }
    }

    // --- Draw Synaptic Micro-Data Pulses (AI Signal Transmission) ---
    pulses.forEach((p) => {
      p.progress += p.speed;
      if (p.progress >= 1) {
        p.progress = 0;
        p.nodeA = Math.floor(Math.random() * nodes.length);
        p.nodeB = Math.floor(Math.random() * nodes.length);
      }

      const na = nodes[p.nodeA];
      const nb = nodes[p.nodeB];
      if (!na || !nb) return;

      const dx = nb.x - na.x;
      const dy = nb.y - na.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        const px = na.x + dx * p.progress;
        const py = na.y + dy * p.progress;
        ctx.fillStyle = `rgba(0, 242, 254, ${0.75 * (1 - p.progress)})`;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);
}
