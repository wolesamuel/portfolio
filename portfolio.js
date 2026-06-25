/* ============================================
   PORTFOLIO.JS - Complete JavaScript File
   Features: Dark Mode Toggle + Section Switch + Mobile Menu + Portfolio Filter
   Author: Samuel Oyewole
   ============================================ */

/* ============================================
   1. DARK MODE TOGGLE - Desktop + Mobile Sync
   Runs immediately to prevent "flash of white"
   Saves user choice in localStorage so it remembers next visit
   ============================================ */
const toggleDesktop = document.getElementById('theme-toggle');
const toggleMobile = document.getElementById('theme-toggle-mobile');
const html = document.documentElement;

// Function to apply theme and sync both toggle switches
function setTheme(theme) {
  if(theme === 'light') {
    html.classList.remove('dark'); // Remove dark class = light mode
    if(toggleDesktop) toggleDesktop.checked = false;
    if(toggleMobile) toggleMobile.checked = false;
  } else {
    html.classList.add('dark'); // Add dark class = dark mode
    if(toggleDesktop) toggleDesktop.checked = true;
    if(toggleMobile) toggleMobile.checked = true;
  }
  localStorage.setItem('theme', theme); // Save user choice
}

// Load saved theme on page load - default to dark if no choice saved
setTheme(localStorage.getItem('theme') || 'dark');

// Listen to both toggles and keep them in sync
[toggleDesktop, toggleMobile].forEach(toggle => {
  if(toggle) {
    toggle.addEventListener('change', (e) => {
      setTheme(e.target.checked? 'dark' : 'light');
    });
  }
});

/* ============================================
   2. MAIN APP - Runs after HTML is fully loaded
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     2A. MOBILE MENU SIDEBAR
     Handles hamburger menu open/close on mobile
     ============================================ */
  const menuBtn = document.getElementById("menuBtn");
  const menuSidebar = document.getElementById("menuSidebar");
  const closeBtn = document.getElementById("closeBtn");

  if (menuBtn && menuSidebar && closeBtn) {
    // Open menu when hamburger clicked
    menuBtn.addEventListener("click", () => {
      menuSidebar.classList.remove("-translate-x-full", "opacity-0", "pointer-events-none");
      menuSidebar.classList.add("translate-x-0", "opacity-100", "pointer-events-auto");
    });

    // Close menu when X button clicked
    closeBtn.addEventListener("click", () => {
      menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
      menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
    });

    // Close menu when user clicks any link inside menu
    menuSidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
        menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
      });
    });

    // Close menu when user clicks outside the sidebar
    document.addEventListener('click', (e) => {
      if (menuSidebar &&!menuSidebar.contains(e.target) &&!menuBtn.contains(e.target)) {
        menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
        menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
      }
    });
  }

  /* ============================================
     2B. SECTION SWITCHING SYSTEM
     Shows one section at a time: Home, Services, About, Portfolio, Contact
     Adds smooth fade + slide animation
     ============================================ */
  const sections = {
    home: document.querySelector('section > div.flex-col.md\\:flex-row'),
    services: document.getElementById('services'),
    about: document.getElementById('about'),
    portfolio: document.getElementById('portfolio'),
    contact: document.getElementById('contact')
  };

  const navLinks = document.querySelectorAll('a[href^="#"], a[href="index.html"]');
  const footer = document.querySelector('footer');

  // Function to hide current section and show new section
  function showSection(sectionName) {
    // Step 1: Fade out all visible sections
    Object.values(sections).forEach(sec => {
      if (sec &&!sec.classList.contains('hidden')) {
        sec.classList.add('opacity-0', 'translate-y-5'); // Start fade out
        setTimeout(() => sec.classList.add('hidden'), 500); // Hide after animation
      }
    });

    // Step 2: After 0.5s, fade in the new section
    setTimeout(() => {
      if (sections[sectionName]) {
        sections[sectionName].classList.remove('hidden', 'opacity-0', 'translate-y-5');
        sections[sectionName].classList.add('opacity-100', 'translate-y-0');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
      }

      // Always keep footer visible
      if (footer) {
        footer.classList.remove('hidden', 'opacity-0', 'translate-y-5');
        footer.classList.add('opacity-100', 'translate-y-0');
      }
    }, 520);
  }

  // Function to highlight active nav link with gradient text
  function setActiveLink(activeHref) {
    // Reset all links to gray - works in both light + dark mode
    navLinks.forEach(link => {
      link.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-transparent', 'bg-clip-text');
      link.classList.add('text-gray-600', 'dark:text-gray-400');
    });

    // Make clicked link gradient
    document.querySelectorAll(`a[href="${activeHref}"]`).forEach(link => {
      link.classList.remove('text-gray-600', 'dark:text-gray-400');
      link.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-transparent', 'bg-clip-text');
    });
  }

  // Add click event to all nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === 'index.html' || href === '#') {
        e.preventDefault(); // Stop page reload
        showSection('home');
        setActiveLink('index.html');
      } else if (href.startsWith('#')) {
        e.preventDefault(); // Stop jump to anchor
        showSection(href.substring(1)); // Remove # from href
        setActiveLink(href);
      }
      // Close mobile menu after clicking
      if(menuSidebar) {
        menuSidebar.classList.add("-translate-x-full", "opacity-0", "pointer-events-none");
        menuSidebar.classList.remove("translate-x-0", "opacity-100", "pointer-events-auto");
      }
    });
  });

  // "Hire Me" buttons both go to Contact section
  document.getElementById('hireMeTop')?.addEventListener('click', () => {
    showSection('contact');
    setActiveLink('#contact');
  });

  document.getElementById('hireMeHero')?.addEventListener('click', () => {
    showSection('contact');
    setActiveLink('#contact');
  });

  /* ============================================
     2C. PORTFOLIO FILTER SYSTEM
     Filters portfolio items by category: All, Websites, React, Landing, etc
     ============================================ */
  const filterBtns = document.querySelectorAll('#portfolio button[id$="btn"], #portfolio button[id="landing-pages"]');
  const portfolioItems = document.querySelectorAll('#portfolio.grid > div'); // All portfolio cards

  // Highlight active filter button with gradient bg
  function setActiveFilter(btn) {
    filterBtns.forEach(b => {
      b.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-white', 'border-transparent');
      b.classList.add('text-gray-600', 'dark:text-gray-400', 'border-gray-300', 'dark:border-gray-800');
    });
    btn.classList.remove('text-gray-600', 'dark:text-gray-400', 'border-gray-300', 'dark:border-gray-800');
    btn.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-pink-500', 'text-white', 'border-transparent');
  }

  // Show/hide portfolio items based on category
  function filterItems(category) {
    portfolioItems.forEach(item => {
      item.classList.add('opacity-0', 'scale-95'); // Start fade out
      setTimeout(() => {
        // If "all" or item has matching class, show it
        if (category === 'all' || item.classList.contains(category)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden'); // Hide non-matching items
        }
        item.classList.remove('opacity-0', 'scale-95');
        item.classList.add('opacity-100', 'scale-100'); // Fade in
      }, 150);
    });
  }

  // Add click event to all filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const btnId = btn.id;
      let category = 'all';
      // Map button ID to portfolio item class
      if (btnId === 'websitebtn' || btnId === 'app-desktopbtn') category = 'desktop';
      if (btnId === 'reactbtn') category = 'react';
      if (btnId === 'landing-pages') category = 'landing';
      if (btnId === 'uibtn') category = 'ui';
      filterItems(category);
      setActiveFilter(btn);
    });
  });

  /* ============================================
     2D. INITIALIZE ON PAGE LOAD
     Show Home section by default + set active nav
     ============================================ */
  showSection('home');
  setActiveLink('index.html');
  if (filterBtns.length > 0) setActiveFilter(filterBtns[0]); // "All" button active

});
