const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const updateNavbar = () => navbar.classList.toggle("scrolled", window.scrollY > 25);
updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((element) => observer.observe(element));
} else {
  revealItems.forEach((element) => element.classList.add("visible"));
}

const heroVisual = document.getElementById("heroVisual");
const portraitFrame = document.getElementById("portraitFrame");
if (finePointer && !reducedMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portraitFrame.style.transform = `rotateY(${x * 7 - 3}deg) rotateX(${-y * 5 + 2}deg) translateY(-3px)`;
  });
  heroVisual.addEventListener("pointerleave", () => {
    portraitFrame.style.transform = "rotateY(-5deg) rotateX(2deg)";
  });

  document
    .querySelectorAll(".service-card, .gallery-tile, .credential, .fact, .contact-card, .form-card")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--tilt-x", `${(x - 0.5) * 7}deg`);
        card.style.setProperty("--tilt-y", `${(0.5 - y) * 7}deg`);
        card.classList.add("is-tilting");
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
}

document.getElementById("year").textContent = new Date().getFullYear();

const cursorHalo = document.getElementById("cursorHalo");
if (finePointer && !reducedMotion) {
  document.addEventListener(
    "pointermove",
    (event) => {
      cursorHalo.style.opacity = "1";
      cursorHalo.style.left = `${event.clientX}px`;
      cursorHalo.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a, button, .service-card, .gallery-tile, .portrait-frame")) {
      cursorHalo.classList.add("active");
    } else {
      cursorHalo.classList.remove("active");
    }
  });
  document.addEventListener("pointerleave", () => {
    cursorHalo.style.opacity = "0";
  });
}

document.getElementById("bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const message = document.getElementById("formMessage");
  message.style.display = "block";
  message.textContent =
    "Your details have been checked in this demo. No message was sent. Please use the phone or email above to contact Areeba directly.";
});
