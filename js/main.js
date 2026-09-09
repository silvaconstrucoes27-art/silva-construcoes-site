/* =========================================================================
   SILVA CONSTRUÇÃO E REFORMAS — interações
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     WHATSAPP — link único, com mensagem pré-preenchida
     --------------------------------------------------------------- */
  var WA_PHONE = '5547996490556';
  var WA_TEXT = 'Olá! Gostaria de solicitar um orçamento com a Silva Construção e Reformas.';
  var WA_URL = 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(WA_TEXT);

  Array.prototype.forEach.call(document.querySelectorAll('.js-wa'), function (el) {
    el.setAttribute('href', WA_URL);
    el.setAttribute('rel', 'noopener noreferrer');
    el.setAttribute('target', '_blank');
  });

  /* ---------------------------------------------------------------
     HEADER — fundo sólido a partir do scroll
     --------------------------------------------------------------- */
  var header = document.getElementById('header');
  var waFloat = document.querySelector('.wa-float');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 40);
    if (waFloat) waFloat.classList.toggle('is-visible', y > 520);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     MENU MOBILE
     --------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var backdrop = document.getElementById('navBackdrop');

  function setMenu(open) {
    if (!burger || !nav) return;
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
    if (backdrop) {
      if (open) {
        backdrop.hidden = false;
        requestAnimationFrame(function () { backdrop.classList.add('is-visible'); });
      } else {
        backdrop.classList.remove('is-visible');
        setTimeout(function () { if (!nav.classList.contains('is-open')) backdrop.hidden = true; }, 300);
      }
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });

  // Fecha o menu ao clicar em qualquer link interno
  Array.prototype.forEach.call(nav ? nav.querySelectorAll('a') : [], function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------------------------------------------------------------
     LINK ATIVO CONFORME A SEÇÃO VISÍVEL
     --------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-current', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------------
     REVEAL AO ENTRAR NA TELA
     --------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revealObs.observe(el); });

    // Rede de segurança: nada permanece invisível se o observer não disparar
    window.addEventListener('load', function () {
      setTimeout(function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
        });
      }, 400);
    });
  }

  /* ---------------------------------------------------------------
     ESC FECHA O MENU MOBILE
     --------------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) setMenu(false);
  });

  /* ---------------------------------------------------------------
     FECHA O MENU AO VOLTAR PARA O DESKTOP
     --------------------------------------------------------------- */
  var desktop = window.matchMedia('(min-width: 1041px)');
  var onBreak = function (e) { if (e.matches) setMenu(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onBreak);
  else if (desktop.addListener) desktop.addListener(onBreak);
})();
