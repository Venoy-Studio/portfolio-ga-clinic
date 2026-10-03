/**
 * G.A Clinic — Script de Interatividade e Experiência do Usuário
 * Totalmente vanilla, moderno, acessível e auto-suficiente.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Controle do Cabeçalho (Sticky / Visibilidade ao rolar)
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    // data-top: se está no topo da página
    if (header) {
      if (currentScrollY <= 40) {
        header.setAttribute('data-top', 'true');
        header.setAttribute('data-visible', 'true');
      } else {
        header.setAttribute('data-top', 'false');

        // Visibilidade na rolagem para cima vs para baixo
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
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateHeader();

  // 2. Menu Mobile (Dialog nativo com acessibilidade)
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
      menuToggle.focus();
    }

    menuToggle.addEventListener('click', openMenu);

    if (menuClose) {
      menuClose.addEventListener('click', closeMenu);
    }

    // Fechar ao clicar no backdrop (fora do diálogo)
    mobileMenu.addEventListener('click', (e) => {
      const rect = mobileMenu.getBoundingClientRect();
      const isInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!isInDialog) {
        closeMenu();
      }
    });

    // Fechar ao pressionar Escape
    mobileMenu.addEventListener('cancel', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });

    // Fechar ao clicar em qualquer link de navegação mobile
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // 3. Accordion de Perguntas Frequentes (FAQ)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (trigger && answer) {
      // Ajusta estado inicial se aberto
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

        // Opcional: fechar outros itens para comportamento accordion limpo
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.getAttribute('data-open') === 'true') {
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherTrigger && otherAnswer) {
              otherItem.setAttribute('data-open', 'false');
              otherTrigger.setAttribute('aria-expanded', 'false');
              otherAnswer.style.height = `${otherAnswer.scrollHeight}px`;
              requestAnimationFrame(() => {
                otherAnswer.style.transition = 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
                otherAnswer.style.height = '0px';
              });
              setTimeout(() => {
                otherAnswer.setAttribute('hidden', '');
                otherAnswer.setAttribute('inert', '');
                otherAnswer.setAttribute('aria-hidden', 'true');
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
          }, 360);
        }
      });
    }
  });

  // 4. Rolagem suave para links âncora internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 76;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Atualizar hash na URL sem scroll abrupto
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  // 5. Botão "Voltar ao topo" do rodapé
  const backToTop = document.querySelector('.clinic-footer-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Atualização de ano no rodapé se houver marcação dinâmica
  const yearEl = document.querySelector('.clinic-footer-bottom p');
  if (yearEl && !yearEl.textContent.includes('2026')) {
    yearEl.innerHTML = `© ${new Date().getFullYear()} G.A Clinic <span>— Portfólio demonstrativo.</span>`;
  }

  // 7. Scroll reveal suave com Intersection Observer para cards de resultados e procedimentos
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll('.results-card, .procedure-card, .profile-editorial, .amanda-editorial, .gabriela-editorial')
      .forEach((el) => {
        revealObserver.observe(el);
      });
  }
});
