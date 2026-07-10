// scroll.js -- fade-in on scroll + active nav highlighting + hamburger

(function() {
  'use strict';

  // ── 0. RESET MENU STATE ──
  function resetMenuState() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu-mobile');
    const body = document.body;
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navMenu) {
      navMenu.classList.remove('open');
    }
    if (body) {
      body.classList.remove('menu-open');
    }
  }

  // Reset on DOM ready AND on pageshow
  document.addEventListener('DOMContentLoaded', resetMenuState);
  window.addEventListener('pageshow', resetMenuState);

  // ── 1. SCROLL-TRIGGERED FADE IN ──
  document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.fade-in').forEach(function(el) {
      observer.observe(el);
    });
  });

  // ── 2. ACTIVE NAV LINK ON SCROLL ──
  document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a, .nav-menu-mobile a');

    window.addEventListener('scroll', function() {
      let current = '';
      sections.forEach(function(s) {
        if (window.scrollY >= s.offsetTop - 120) {
          current = s.id;
        }
      });
      navLinks.forEach(function(a) {
        if (a.getAttribute('href') === '#' + current) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
    });
  });

  // ── 3. NAV TRANSPARENCY ON SCROLL ──
  document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    if (nav) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      });
    }
  });

  // ── 4. HAMBURGER MENU TOGGLE ──
  document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu-mobile');
    const body = document.body;

    // If the nav doesn't exist on this page, exit
    if (!navToggle || !navMenu) return;

    // Ensure clean start
    resetMenuState();

    // Explicit state setter
    function setMenuState(open) {
      if (open) {
        navToggle.classList.add('open');
        navMenu.classList.add('open');
        body.classList.add('menu-open');
        navToggle.setAttribute('aria-expanded', 'true');
      } else {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        body.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }

    // Toggle on button click
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      setMenuState(!isOpen);
    });

    // ── 5. CLOSE BUTTON ──
    const closeBtn = document.querySelector('.nav-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        setMenuState(false);
      });
    }

    // Close when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        setMenuState(false);
      });
    });

    // Close if user clicks on the overlay background
    navMenu.addEventListener('click', function(e) {
      if (e.target === navMenu) {
        setMenuState(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    });
  });

})();