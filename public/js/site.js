document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-primary-nav]");
  const dropdown = document.querySelector("[data-dropdown]");
  const dropdownToggle = document.querySelector("[data-dropdown-toggle]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdown.classList.toggle("open");
    });
  }

  document.addEventListener("click", (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
    }
  });

  const revealTargets = document.querySelectorAll("[data-reveal]");
  if (window.gsap && revealTargets.length) {
    gsap.from(".hero-title, .hero-copy, .hero-actions, .stat-card, .content-card, .admin-card", {
      opacity: 0,
      y: 24,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out"
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      observer.observe(el);
    });
  }
});
