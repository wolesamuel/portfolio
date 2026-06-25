document.addEventListener('DOMContentLoaded', () => {

  const menuBtn = document.getElementById("menuBtn");
  const menuSidebar = document.getElementById("menuSidebar");
  const closeBtn = document.getElementById("closeBtn");

  if (menuBtn && menuSidebar && closeBtn) {
    menuBtn.addEventListener("click", () => {
      menuSidebar.classList.remove("-translate-x-full", "opacity-0", "pointer-events-none");
      menuSidebar.classList.add("translate-x-0", "opacity-100", "pointer-events-auto");
    });

    closeBtn.addEventListener("click", () => {
      menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
      menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
    });

    menuSidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
        menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
      });
    });

    document.addEventListener('click', (e) => {
      if (!menuSidebar.contains(e.target) &&!menuBtn.contains(e.target)) {
        menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
        menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
      }
    });
  }

  const sections = {
    home: document.querySelector('section > div.flex-col.md\\:flex-row'),
    services: document.getElementById('services'),
    about: document.getElementById('about'),
    portfolio: document.getElementById('portfolio'),
    contact: document.getElementById('contact')
  };

  const navLinks = document.querySelectorAll('a[href^="#"], a[href="index.html"]');
  const footer = document.querySelector('footer'); // <-- CHANGE 1: grab footer

  function showSection(sectionName) {
    Object.values(sections).forEach(sec => {
      if (sec &&!sec.classList.contains('hidden')) {
        sec.classList.add('opacity-0', 'translate-y-5');
        setTimeout(() => sec.classList.add('hidden'), 500);
      }
    });

    setTimeout(() => {
      if (sections[sectionName]) {
        sections[sectionName].classList.remove('hidden', 'opacity-0', 'translate-y-5');
        sections[sectionName].classList.add('opacity-100', 'translate-y-0');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // CHANGE 2: Force footer to always show
      if (footer) {
        footer.classList.remove('hidden', 'opacity-0', 'translate-y-5');
        footer.classList.add('opacity-100', 'translate-y-0');
      }
    }, 520);
  }

  function setActiveLink(activeHref) {
    navLinks.forEach(link => {
      link.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-transparent', 'bg-clip-text');
      link.classList.add('text-gray-400');
    });

    document.querySelectorAll(`a[href="${activeHref}"]`).forEach(link => {
      link.classList.remove('text-gray-400');
      link.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-transparent', 'bg-clip-text');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === 'index.html' || href === '#') {
        e.preventDefault();
        showSection('home');
        setActiveLink('index.html');
      } else if (href.startsWith('#')) {
        e.preventDefault();
        showSection(href.substring(1));
        setActiveLink(href);
      }
      menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
      menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
    });
  });

  document.getElementById('hireMeTop')?.addEventListener('click', () => {
    showSection('contact');
    setActiveLink('#contact');
  });

  document.getElementById('hireMeHero')?.addEventListener('click', () => {
    showSection('contact');
    setActiveLink('#contact');
  });

  const filterBtns = document.querySelectorAll('#portfolio button');
  const portfolioItems = document.querySelectorAll('#portfolio.grid > div');

  function setActiveFilter(btn) {
    filterBtns.forEach(b => {
      b.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-white', 'border-transparent');
      b.classList.add('text-gray-400', 'border-gray-800');
    });
    btn.classList.remove('text-gray-400', 'border-gray-800');
    btn.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-white', 'border-transparent');
  }

  function filterItems(category) {
    portfolioItems.forEach(item => {
      item.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        if (category === 'all' || item.classList.contains(category)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
        item.classList.remove('opacity-0', 'scale-95');
        item.classList.add('opacity-100', 'scale-100');
      }, 150);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const btnText = btn.textContent.trim().toLowerCase();
      let category = 'all';
      if (btnText === 'desktop') category = 'desktop';
      if (btnText === 'reacts' || btnText === 'react apps') category = 'react';
      if (btnText === 'landing pages') category = 'landing';
      if (btnText === 'e-commerce') category = 'ecommerce';
      filterItems(category);
      setActiveFilter(btn);
    });
  });

  showSection('home');
  setActiveLink('index.html');
  if (filterBtns.length > 0) setActiveFilter(filterBtns[0]);

});