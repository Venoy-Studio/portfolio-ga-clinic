/**
 * G.A Clinic — Orquestração de Animações de Scroll, GSAP, ScrollTrigger & Lenis
 * Reproduz com máxima fidelidade as transições de luxo, parallax e microinterações táteis.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 1000px)').matches;
  const isTabletOrDesktop = () => window.matchMedia('(min-width: 900px)').matches;

  // =========================================================================
  // 1. Lenis Smooth Momentum Scrolling
  // =========================================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    try {
      lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
        infinite: false
      });

      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn('Lenis could not be initialized:', e);
    }
  }

  // =========================================================================
  // 2. Cabeçalho Dinâmico Inteligente
  // =========================================================================
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    if (header) {
      if (currentScrollY <= 40) {
        header.setAttribute('data-top', 'true');
        header.setAttribute('data-visible', 'true');
      } else {
        header.setAttribute('data-top', 'false');
        if (currentScrollY > lastScrollY && currentScrollY > 120) {
          header.setAttribute('data-visible', 'false');
        } else if (currentScrollY < lastScrollY) {
          header.setAttribute('data-visible', 'true');
        }
      }
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(handleHeaderScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  handleHeaderScroll();

  // =========================================================================
  // 3. Menu Mobile Acessível com Trava de Scroll
  // =========================================================================
  const menuToggle = document.querySelector('.site-menu-toggle');
  const mobileMenu = document.getElementById('site-mobile-menu');
  const menuClose = document.querySelector('.site-menu-close');

  if (menuToggle && mobileMenu) {
    function openMenu() {
      if (typeof mobileMenu.showModal === 'function') {
        mobileMenu.showModal();
      } else {
        mobileMenu.setAttribute('open', '');
      }
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      if (menuClose) menuClose.focus();
    }

    function closeMenu() {
      if (typeof mobileMenu.close === 'function') {
        mobileMenu.close();
      } else {
        mobileMenu.removeAttribute('open');
      }
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      menuToggle.focus();
    }

    menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);

    mobileMenu.addEventListener('click', (e) => {
      const rect = mobileMenu.getBoundingClientRect();
      const inDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inDialog) closeMenu();
    });

    mobileMenu.addEventListener('cancel', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    });

    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => closeMenu());
    });
  }

  // =========================================================================
  // 4. Rolagem Suave com Compensação de Cabeçalho
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -70 });
          } else {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  const backToTop = document.querySelector('.clinic-footer-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 5. Accordion de Perguntas Frequentes (FAQ)
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (trigger && answer) {
      const isOpen = item.getAttribute('data-open') === 'true';
      if (isOpen) {
        answer.style.height = 'auto';
        answer.removeAttribute('hidden');
        answer.removeAttribute('inert');
        answer.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        answer.style.height = '0px';
        answer.setAttribute('hidden', '');
        answer.setAttribute('inert', '');
        answer.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
      }

      trigger.addEventListener('click', () => {
        const currentlyOpen = item.getAttribute('data-open') === 'true';

        faqItems.forEach((other) => {
          if (other !== item && other.getAttribute('data-open') === 'true') {
            const oTrigger = other.querySelector('.faq-trigger');
            const oAnswer = other.querySelector('.faq-answer');
            if (oTrigger && oAnswer) {
              other.setAttribute('data-open', 'false');
              oTrigger.setAttribute('aria-expanded', 'false');
              oAnswer.style.height = `${oAnswer.scrollHeight}px`;
              requestAnimationFrame(() => {
                oAnswer.style.transition = 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
                oAnswer.style.height = '0px';
              });
              setTimeout(() => {
                oAnswer.setAttribute('hidden', '');
                oAnswer.setAttribute('inert', '');
                oAnswer.setAttribute('aria-hidden', 'true');
                if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
              }, 350);
            }
          }
        });

        if (currentlyOpen) {
          item.setAttribute('data-open', 'false');
          trigger.setAttribute('aria-expanded', 'false');
          answer.style.height = `${answer.scrollHeight}px`;
          requestAnimationFrame(() => {
            answer.style.transition = 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            answer.style.height = '0px';
          });
          setTimeout(() => {
            answer.setAttribute('hidden', '');
            answer.setAttribute('inert', '');
            answer.setAttribute('aria-hidden', 'true');
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
          }, 350);
        } else {
          item.setAttribute('data-open', 'true');
          trigger.setAttribute('aria-expanded', 'true');
          answer.removeAttribute('hidden');
          answer.removeAttribute('inert');
          answer.setAttribute('aria-hidden', 'false');
          answer.style.height = '0px';
          requestAnimationFrame(() => {
            answer.style.transition = 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            answer.style.height = `${answer.scrollHeight}px`;
          });
          setTimeout(() => {
            answer.style.height = 'auto';
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
          }, 360);
        }
      });
    }
  });

  // =========================================================================
  // 6. GSAP + ScrollTrigger: Animações de Scroll de Alta Fidelidade
  // =========================================================================
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) {
    console.log('GSAP/ScrollTrigger não disponível ou movimento reduzido solicitado.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // -------------------------------------------------------------------------
  // 6.1 HERO: Revelação inicial e Parallax da imagem de fundo
  // -------------------------------------------------------------------------
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.brand-symbol', { autoAlpha: 0, scale: 0.94, duration: 0.6 }, 0.1)
    .from('.brand-divider', { scaleY: 0, transformOrigin: 'top center', duration: 0.52 }, 0.28)
    .from('.brand-type', { autoAlpha: 0, y: 10, duration: 0.52 }, 0.32)
    .from('.hero-eyebrow', { autoAlpha: 0, y: 10, duration: 0.42 }, 0.49)
    .from('.title-reveal', { yPercent: 110, duration: 0.8, stagger: 0.12, ease: 'power4.out' }, 0.57)
    .from('.hero-copy-rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.34 }, 1.05)
    .from('.hero-intro', { autoAlpha: 0, y: 13, duration: 0.49 }, 1.08)
    .from('.hero-action', { autoAlpha: 0, y: 15, duration: 0.52 }, 1.21)
    .from('.hero-names', { autoAlpha: 0, y: 11, duration: 0.48 }, 1.38)
    .from('.hero-aside', { autoAlpha: 0, x: 12, duration: 0.5 }, 1.4)
    .fromTo(
      '.hero-ornament path',
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' },
      1.5
    );

  if (isTabletOrDesktop()) {
    gsap.to('.hero-image', {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.7
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6.2 PERFILOPLASTIA: Título, Entrada dos Aspectos e Pin da Análise Facial
  // -------------------------------------------------------------------------
  const perfilSection = document.querySelector('#perfiloplastia');
  if (perfilSection) {
    // Revelação dos textos editoriais
    gsap
      .timeline({
        defaults: { ease: 'power3.out', duration: 0.6 },
        scrollTrigger: {
          id: 'profile-entry',
          trigger: perfilSection,
          start: 'top 78%',
          toggleActions: 'play complete none none'
        }
      })
      .from('.profile-eyebrow span', { yPercent: 110 }, 0)
      .from('.profile-title-line > span', { yPercent: 112, stagger: 0.12, duration: 0.75 }, 0.12)
      .from('.profile-copy-rule', { scaleX: 0, transformOrigin: 'left' }, 0.48)
      .from('.profile-description', { y: 18, autoAlpha: 0 }, 0.62);

    // Ícones de Nariz, Lábios, Mento e Proporção
    gsap
      .timeline({
        defaults: { ease: 'power3.out', duration: 0.5 },
        scrollTrigger: {
          id: 'profile-details-entry',
          trigger: '.profile-features',
          start: 'top 94%',
          toggleActions: 'play complete none none'
        }
      })
      .from('.profile-feature', { y: 18, autoAlpha: 0, stagger: 0.08 })
      .from('.profile-action', { y: 16, autoAlpha: 0 }, '-=0.18');

    // Pinning e Desenho Anatômico das Guias (Desktop/Tablet)
    if (isTabletOrDesktop()) {
      const profileComp = document.querySelector('.profile-composition');
      if (profileComp) {
        const profilePin = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'profile-analysis-pin',
            trigger: profileComp,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 2.8)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        profilePin
          .addLabel('retrato', 0)
          .from('.profile-portrait-reveal', { clipPath: 'inset(0 0 100% 0)', y: 24, duration: 0.85, ease: 'power2.inOut' }, 0)
          .from('.profile-narrative', { strokeDashoffset: 1, duration: 3.8 }, 0);

        // Inicializa as guias e linhas de chamada no offset 1 (ocultas)
        profilePin.set('.profile-guide-draw, .profile-leader-draw', { strokeDashoffset: 1 }, 0);

        // Marcos anatômicos: Nariz (0), Lábios (1), Mento (2)
        const landmarks = ['nariz', 'lábios', 'mento'];
        landmarks.forEach((label, idx) => {
          const pos = 0.85 + 0.78 * idx;
          profilePin
            .addLabel(label, pos)
            .to(`.profile-guide-draw-${idx}`, { strokeDashoffset: 0, duration: 0.3 }, pos)
            .from(
              `.profile-landmark-${idx} .profile-dot`,
              { scale: 0.3, transformOrigin: 'center', autoAlpha: 0, duration: 0.08, ease: 'power2.out' },
              pos + 0.36
            )
            .to(`.profile-leader-draw-${idx}`, { strokeDashoffset: 0, duration: 0.1 }, pos + 0.44)
            .from(`.profile-landmark-${idx} text`, { x: 10, autoAlpha: 0, duration: 0.1 }, pos + 0.54);
        });

        // Card flutuante de Avaliação Individual e parallax de profundidade
        profilePin
          .from('.profile-card', { y: 18, autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 3.2)
          .to('.profile-portrait-layer', { y: -12, duration: 3.8 }, 0)
          .to('.profile-card-anchor', { y: -6, duration: 0.6 }, 3.2)
          .to('.profile-atmosphere', { y: -8, duration: 3.8 }, 0)
          .to('.profile-geometry', { y: 6, duration: 3.8 }, 0);
      }
    } else {
      // Mobile: Revelação suave ao entrar no viewport
      gsap.from('.profile-portrait-reveal', {
        clipPath: 'inset(0 0 100% 0)',
        y: 20,
        duration: 0.9,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.profile-portrait-layer',
          start: 'top 85%'
        }
      });
      gsap.to('.profile-guide-draw, .profile-leader-draw', {
        strokeDashoffset: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.profile-analysis',
          start: 'top 80%'
        }
      });
      gsap.from('.profile-card', {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: '.profile-card',
          start: 'top 90%'
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 6.3 RESULTADOS REAIS: Entrada em Cascata dos Casos Antes/Depois
  // -------------------------------------------------------------------------
  const resultsSection = document.querySelector('#resultados');
  if (resultsSection) {
    gsap.from('.results-header > *', {
      y: 26,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: resultsSection,
        start: 'top 78%',
        toggleActions: 'play complete none none'
      }
    });

    gsap.from('.results-card', {
      y: 45,
      autoAlpha: 0,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.results-grid',
        start: 'top 82%',
        toggleActions: 'play complete none none'
      }
    });

    gsap.from('.results-action', {
      y: 20,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.results-action',
        start: 'top 95%',
        toggleActions: 'play complete none none'
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6.4 PROFISSIONAIS: A Grande Transformação Pinned Scrub (Amanda -> Gabriela)
  // -------------------------------------------------------------------------
  const profExp = document.querySelector('.professionals-experience');
  const profStage = document.querySelector('.professionals-stage');

  if (profExp && profStage) {
    if (isDesktop()) {
      // Ativa o modo de scroll guiado (CSS layout absoluto sobreposto)
      profExp.setAttribute('data-scroll-driven', 'true');

      const L = 'M640 -20C845 95 958 353 989 556C1012 703 961 803 914 840';
      const S = 'M0 0H1C1 .3 1 .7 1 1H0Z';
      const T = 'M1.2 0H1V1H1.2C1 .7 1 .3 1.2 0Z';

      const amandaEl = document.querySelector('#amanda');
      const gabrielaEl = document.querySelector('#gabriela');

      const profTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'professionals-transformation',
          trigger: profStage,
          start: 'top top',
          end: () => `+=${3 * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const isAmanda = self.progress < 0.5;
            if (amandaEl) amandaEl.inert = !isAmanda;
            if (gabrielaEl) gabrielaEl.inert = isAmanda;
          }
        }
      });

      // Marcador deslizando no indicador lateral
      profTl.fromTo('.professionals-marker', { y: 0 }, { y: 137, duration: 100 }, 0);

      // Contador de páginas (01 -> 02)
      profTl.fromTo('.professionals-counter-digits', { yPercent: 0 }, { yPercent: -50, duration: 8 }, 49);
      profTl.fromTo('.professionals-indicator-first', { color: '#78716a' }, { color: '#b9ad9d', duration: 35 }, 30);
      profTl.fromTo('.professionals-indicator-last', { color: '#a89b8b' }, { color: '#6b5038', duration: 35 }, 45);

      // Transição da foto de Amanda (desloca para esquerda e é cortada pela máscara)
      profTl.fromTo('.amanda-photo-reveal', { xPercent: 0, scale: 1 }, { xPercent: -18, scale: 1.025, duration: 37 }, 10);
      profTl.fromTo('.professionals-amanda-clip', { attr: { d: S } }, { attr: { d: 'M0 0H.5C.69 .3 .69 .7 .5 1H0Z' }, duration: 19 }, 10);
      profTl.to('.professionals-amanda-clip', { attr: { d: 'M0 0H-.2C0 .3 0 .7 -.2 1H0Z' }, duration: 18 }, 29);
      profTl.fromTo('.amanda-photo-reveal', { autoAlpha: 1 }, { autoAlpha: 0, duration: 8 }, 39);

      // Transição da foto de Gabriela (entra da direita com revelação de máscara)
      profTl.fromTo('.gabriela-photo-reveal', { xPercent: 16, scale: 1.025 }, { xPercent: 0, scale: 1, duration: 48 }, 36);
      profTl.fromTo('.professionals-gabriela-clip', { attr: { d: T } }, { attr: { d: 'M.64 0H1V1H.64C.45 .7 .45 .3 .64 0Z' }, duration: 24 }, 36);
      profTl.to('.professionals-gabriela-clip', { attr: { d: 'M0 0H1V1H0C0 .7 0 .3 0 0Z' }, duration: 24 }, 60);
      profTl.fromTo('.gabriela-photo-reveal', { autoAlpha: 0 }, { autoAlpha: 1, duration: 8 }, 36);

      // Textos editoriais de Amanda saindo
      profTl.fromTo('.amanda-action', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 34, duration: 12 }, 10);
      profTl.fromTo('.amanda-editorial .amanda-detail', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 34, duration: 12, stagger: 2 }, 13);
      profTl.fromTo('.amanda-description', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 34, duration: 15 }, 20);
      profTl.fromTo('.amanda-specialty', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 34, duration: 12 }, 24);
      profTl.fromTo('.amanda-role', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 34, duration: 12 }, 27);
      profTl.fromTo('.amanda-name-line > *', { autoAlpha: 1, yPercent: 0 }, { autoAlpha: 0, yPercent: -105, duration: 13, stagger: 3 }, 29);
      profTl.fromTo('.amanda-editorial .amanda-eyebrow', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 34, duration: 11 }, 34);
      profTl.fromTo('.amanda-quote', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: -30, duration: 16 }, 21);
      profTl.fromTo('.amanda-monogram', { autoAlpha: 1, xPercent: 0 }, { autoAlpha: 0, xPercent: -18, duration: 24 }, 26);

      // Arco dourado morfando
      profTl.fromTo('.professionals-arc path', { attr: { d: L } }, { attr: { d: 'M860 -20C1040 95 1030 353 866 556C750 703 720 803 800 840' }, duration: 20 }, 28);
      profTl.to('.professionals-arc path', { attr: { d: 'M1080 -20C878 75 735 294 705 486C680 643 704 743 767 815' }, duration: 22 }, 48);
      profTl.fromTo('#professionals-arc-gold', { attr: { x1: 670, x2: 950, y2: 941 } }, { attr: { x1: 1055, x2: 740, y2: 840 }, duration: 42 }, 28);
      profTl.fromTo('.professionals-background-end', { opacity: 0 }, { opacity: 1, duration: 40 }, 30);

      // Textos editoriais de Gabriela entrando
      profTl.fromTo('.gabriela-monogram', { autoAlpha: 0, xPercent: 18 }, { autoAlpha: 1, xPercent: 0, duration: 26 }, 45);
      profTl.fromTo('.gabriela-eyebrow', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 12 }, 46);
      profTl.fromTo('.gabriela-name-line > *', { autoAlpha: 0, yPercent: 105 }, { autoAlpha: 1, yPercent: 0, duration: 14, stagger: 3 }, 48);
      profTl.fromTo('.gabriela-role, .gabriela-role-rule', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 13 }, 62);
      profTl.fromTo('.gabriela-description', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 14 }, 66);
      profTl.fromTo('.gabriela-details .amanda-detail', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 12, stagger: 2 }, 71);
      profTl.fromTo('.gabriela-action', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 12 }, 78);
      profTl.fromTo('.gabriela-quote', { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 16 }, 72);
      profTl.fromTo('.professionals-scroll-start', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: -24, duration: 12 }, 24);
      profTl.fromTo('.professionals-scroll-end', { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 14 }, 76);
    } else {
      // Em mobile (< 1000px): exibe Amanda e Gabriela em fluxo contínuo com scroll suave
      profExp.removeAttribute('data-scroll-driven');
      ['#amanda', '#gabriela'].forEach((id) => {
        gsap.from(`${id} .amanda-editorial, ${id} .gabriela-editorial`, {
          y: 35,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: id,
            start: 'top 80%'
          }
        });
        gsap.from(`${id} .amanda-photo, ${id} .gabriela-photo`, {
          scale: 0.95,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: id,
            start: 'top 85%'
          }
        });
      });
    }
  }

  // -------------------------------------------------------------------------
  // 6.5 PROCEDIMENTOS: Entrada dos Cards e Desenho dos Arcos Laterais
  // -------------------------------------------------------------------------
  const procSection = document.querySelector('#procedimentos');
  if (procSection) {
    gsap.from('.procedures-header > *', {
      y: 26,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: procSection,
        start: 'top 78%'
      }
    });

    // Desenho dos arcos geométricos com scroll
    gsap.fromTo(
      '.procedures-edge-arc',
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'power2.out',
        stagger: 0.3,
        scrollTrigger: {
          trigger: procSection,
          start: 'top 70%'
        }
      }
    );

    // Cards de Procedimento
    gsap.from('.procedure-card', {
      y: 40,
      autoAlpha: 0,
      stagger: 0.14,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.procedures-grid',
        start: 'top 82%'
      }
    });

    // Banner de Avaliação
    gsap.from('.procedures-evaluation', {
      scale: 0.96,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.procedures-evaluation',
        start: 'top 88%'
      }
    });

    gsap.fromTo(
      '.procedures-evaluation-emblem path',
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.procedures-evaluation',
          start: 'top 85%'
        }
      }
    );
  }

  // -------------------------------------------------------------------------
  // 6.6 FAQ & FINAL EXPERIENCE: Transição Pinned do FAQ para o CTA Conversar
  // -------------------------------------------------------------------------
  const finalExp = document.querySelector('.final-experience');
  const finalStage = document.querySelector('.final-experience-stage');

  if (finalExp && finalStage) {
    if (isDesktop()) {
      finalExp.setAttribute('data-pinned', 'true');

      const finalTl = gsap.timeline({
        defaults: { ease: 'none', force3D: false },
        scrollTrigger: {
          id: 'final-transformation',
          trigger: finalExp,
          start: 'top top',
          end: () => `+=${1.25 * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });

      finalTl
        .addLabel('paper', 0)
        .addLabel('atmosphere', 15)
        .addLabel('decoration', 42)
        .addLabel('conversation', 60)
        .addLabel('rest', 92);

      // Transição de iluminação quente para fundo escuro sofisticado
      finalTl
        .fromTo('.final-experience-warm', { opacity: 0 }, { opacity: 1, duration: 35, ease: 'sine.inOut' }, 'atmosphere')
        .fromTo('.final-experience-dark', { opacity: 0 }, { opacity: 1, duration: 42, ease: 'sine.inOut' }, 'decoration')
        .fromTo('.faq-watermark', { opacity: 0.32 }, { opacity: 0, duration: 22 }, 18)
        .fromTo('.faq-fold', { opacity: 0.35 }, { opacity: 0, duration: 21 }, 22)
        .fromTo('.faq-geometry', { opacity: 1 }, { opacity: 0, duration: 22 }, 28)
        .fromTo('.faq-accordion', { opacity: 1, y: 0 }, { opacity: 0, y: -6, duration: 32 }, 23)
        .fromTo('.faq-intro, .faq-count', { opacity: 1 }, { opacity: 0, duration: 23 }, 30)
        .fromTo('.faq-eyebrow, .faq-title', { opacity: 1, y: 0 }, { opacity: 0, y: -6, duration: 24 }, 36)
        .fromTo('.faq-contact', { opacity: 1, y: 0 }, { opacity: 0, y: -6, duration: 22 }, 36)
        .fromTo('.final-cta-disc', { opacity: 0 }, { opacity: 1, duration: 26 }, 42)
        .fromTo('.final-cta-arcs', { opacity: 0 }, { opacity: 0.85, duration: 24 }, 44)
        .fromTo('.final-cta-axis', { opacity: 0 }, { opacity: 1, duration: 20 }, 46)
        .fromTo('.final-cta-eyebrow', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 10 }, 'conversation')
        .fromTo('.final-cta-rule', { opacity: 0, scaleX: 0.85 }, { opacity: 1, scaleX: 1, duration: 9 }, 63);

      document.querySelectorAll('.final-cta-line-reveal').forEach((line, idx) => {
        finalTl.fromTo(line, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 12 }, 66 + 4 * idx);
      });

      finalTl
        .fromTo('.final-cta-subtitle', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 10 }, 75)
        .fromTo('.final-cta-action', { opacity: 0, y: 8, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 14 }, 78);
    } else {
      // Mobile: Revelação suave do FAQ e do CTA final
      finalExp.removeAttribute('data-pinned');
      gsap.from('.faq-editorial > *', {
        y: 25,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: {
          trigger: '.faq-section',
          start: 'top 80%'
        }
      });
      gsap.from('.final-cta-content > *', {
        y: 25,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.final-cta-section',
          start: 'top 85%'
        }
      });
    }
  }

  // Recalcula posições do ScrollTrigger após carregamento de fontes e imagens
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
