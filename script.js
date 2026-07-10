/* =========================================================
   Heyde Carlos — Portfólio | script.js
   Tema, header no scroll, menu mobile, scroll spy,
   reveal on scroll, voltar ao topo, ano dinâmico.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Tema claro/escuro (persistente) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const STORAGE_KEY = 'hc-theme';

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  };

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------- Ícones Lucide ---------- */
  const renderIcons = () => window.lucide && window.lucide.createIcons();
  if (document.readyState !== 'loading') renderIcons();
  window.addEventListener('load', renderIcons);

  /* ---------- Header com efeito ao rolar ---------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  const closeMenu = () => {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  };
  const toggleMenu = () => {
    const open = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  navToggle?.addEventListener('click', toggleMenu);
  nav?.querySelectorAll('.nav__link').forEach((link) =>
    link.addEventListener('click', closeMenu)
  );
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll spy (destaque da seção ativa) ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) =>
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => spy.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Brilho que segue o cursor nos cards ---------- */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Voltar ao topo ---------- */
  const toTop = document.getElementById('toTop');
  const onScrollTop = () => toTop.classList.toggle('is-visible', window.scrollY > 600);
  onScrollTop();
  window.addEventListener('scroll', onScrollTop, { passive: true });
  toTop?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---------- Ano dinâmico no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
