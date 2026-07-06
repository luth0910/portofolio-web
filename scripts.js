// ── COUNTER ANIMATION ──
function animateCount(el, target, decimals = 0, duration = 1800) {
  let start = 0;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = decimals ? (eased * target).toFixed(2) : Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = decimals ? target.toFixed(2) : target;
  };
  requestAnimationFrame(step);
}

// ── REVEAL OBSERVER ──
const revealEls = document.querySelectorAll(".reveal, .timeline-item");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);
revealEls.forEach((el) => io.observe(el));

// ── COUNTER OBSERVER ──
let countersStarted = false;
const statsObs = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCount(document.getElementById("c-projects"), 8, 0);
      animateCount(document.getElementById("c-years"), 2, 0);
      animateCount(document.getElementById("c-certs"), 4, 0);
      animateCount(document.getElementById("c-paper"), 1, 0);
    }
  },
  { threshold: 0.3 },
);
const statsEl = document.getElementById("stats");
if (statsEl) statsObs.observe(statsEl);

// ── ACTIVE NAV ──
const sections = document.querySelectorAll("section[id], div[id]");
const navLinks = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach((a) => {
    const isActive = a.getAttribute("href") === "#" + current;
    a.style.color = isActive ? "var(--accent)" : "var(--muted)";
  });
});

// ── STAGGER DELAYS ──
document.querySelectorAll(".skills-grid .skill-card").forEach((c, i) => (c.style.transitionDelay = `${i * 0.07}s`));
document.querySelectorAll(".timeline-item").forEach((c, i) => (c.style.transitionDelay = `${i * 0.1}s`));
document.querySelectorAll(".project-card").forEach((c, i) => (c.style.transitionDelay = `${i * 0.08}s`));
document.querySelectorAll(".cert-card").forEach((c, i) => (c.style.transitionDelay = `${i * 0.07}s`));

// ── CURSOR GLOW (subtle) ──
const glow = document.createElement("div");
glow.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9999;
  width: 320px; height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,229,160,0.04) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.8s cubic-bezier(0.23,1,0.32,1), top 0.8s cubic-bezier(0.23,1,0.32,1);
  left: -999px; top: -999px;
`;
document.body.appendChild(glow);
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});
// ── THEME TOGGLE ──
const themeBtn = document.getElementById("theme-btn");
const saved = localStorage.getItem("theme");

// Default = dark. Light hanya aktif kalau user pernah pilih light.
if (saved === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☾";
}

themeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  themeBtn.textContent = isLight ? "☾" : "☀";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// ── MOBILE NAV ──
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileNav = document.getElementById("mobile-nav");

hamburgerBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  const isOpen = mobileNav.classList.contains("open");
  // Animasi hamburger jadi X
  const spans = hamburgerBtn.querySelectorAll("span");
  if (isOpen) {
    spans[0].style.cssText = "transform: translateY(6px) rotate(45deg)";
    spans[1].style.cssText = "opacity: 0";
    spans[2].style.cssText = "transform: translateY(-6px) rotate(-45deg)";
  } else {
    spans.forEach((s) => (s.style.cssText = ""));
  }
});

function closeMobileNav() {
  mobileNav.classList.remove("open");
  hamburgerBtn.querySelectorAll("span").forEach((s) => (s.style.cssText = ""));
}

// Tutup mobile nav saat klik di luar
document.addEventListener("click", (e) => {
  if (!hamburgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
    closeMobileNav();
  }
});
function toggleCompetency(btn) {
  const list = document.getElementById("competency-list");
  const extraItems = list.querySelectorAll(".extra-item");
  const isCurrentlyHidden = extraItems[0].classList.contains("is-hidden");

  extraItems.forEach((item) => {
    item.classList.toggle("is-hidden");
  });

  btn.textContent = isCurrentlyHidden ? "Show less ▴" : "+6 more ▾";
}
