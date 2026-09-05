(function () {
  'use strict';

  /* ======================================================================
     CONFIGURAÇÃO — editar aqui quando os dados reais estiverem disponíveis
     ====================================================================== */
  const WHATSAPP_NUMBER = '5547900000000'; // TODO: substituir pelo número real (formato: 55 + DDD + número, apenas dígitos)
  const INSTAGRAM_URL = '#'; // TODO: substituir pelo link do Instagram da ConstruLima
  const WHATSAPP_DEFAULT_MESSAGE = 'Olá! Gostaria de solicitar um orçamento com a ConstruLima.';

  function buildWhatsappUrl(message) {
    const text = encodeURIComponent(message || WHATSAPP_DEFAULT_MESSAGE);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  /* ======================================================================
     Links de WhatsApp / Instagram
     ====================================================================== */
  document.querySelectorAll('#ctaWhatsapp, #infoWhatsapp, #footerWhatsapp').forEach((el) => {
    el.href = buildWhatsappUrl();
  });
  document.querySelectorAll('#infoInstagram, #footerInstagram').forEach((el) => {
    el.href = INSTAGRAM_URL;
  });

  /* ======================================================================
     Header — estado ao rolar
     ====================================================================== */
  const header = document.getElementById('header');
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ======================================================================
     Menu mobile
     ====================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  function closeMenu() {
    menuToggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMenu);
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  /* ======================================================================
     Reveal on scroll
     ====================================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ======================================================================
     Formulário de orçamento — monta mensagem e abre WhatsApp
     (protótipo sem backend)
     ====================================================================== */
  const form = document.getElementById('orcamentoForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const whatsapp = form.whatsapp.value.trim();
      const servico = form.servico.value;
      const mensagem = form.mensagem.value.trim();

      const linhas = [
        'Olá! Gostaria de solicitar um orçamento com a ConstruLima.',
        '',
        `Nome: ${nome}`,
        `WhatsApp: ${whatsapp}`,
        `Tipo de serviço: ${servico}`,
      ];
      if (mensagem) linhas.push(`Mensagem: ${mensagem}`);

      window.open(buildWhatsappUrl(linhas.join('\n')), '_blank', 'noopener');
    });
  }
})();
