// =========================================================
// FILE: main.js
// PURPOSE: Theme toggle, navbar behaviour, hero/pastor parallax,
//          scroll reveal, lightbox, local pastor effects, countdown,
//          join modal + form submit
// =========================================================
const API_BASE =
  location.hostname === "127.0.0.1" || location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://soj-south-backend.onrender.com";


document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // 1) GET ELEMENTS FROM HTML
  // =========================================================
  const header = document.getElementById("siteHeader");
  const themeBtn = document.getElementById("themeToggle");

  // HERO parallax elements
  const heroSection = document.querySelector(".home-hero");
  const heroCard = document.querySelector(".hero-card");
  const heroBg = document.querySelector(".hero-bg");

  // PASTOR parallax elements
  const pastorBanner = document.getElementById("pastorBanner");
  const pastorBgImage = document.querySelector(".pastor-bg-image");

  const burger = document.getElementById("navBurger");

if (header && burger){
  burger.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => {
      header.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}


  // =========================================================
  // HERO TYPING ANIMATION (LOOPING)
  // =========================================================
  const heroTyping = document.getElementById("heroTyping");
  const typingText = "2026 — The Year of ELROI";

  function loopTyping(el, text, speed = 55, delay = 5000){
    if (!el) return;

    let index = 0;

    function type(){
      el.textContent = "";
      index = 0;

      const typingInterval = setInterval(() => {
        el.textContent += text.charAt(index);
        index++;

        if (index >= text.length){
          clearInterval(typingInterval);
          setTimeout(type, delay);
        }
      }, speed);
    }

    type();
  }

  loopTyping(heroTyping, typingText, 55, 5000);

  // Track previous scroll position (for hide/show navbar)
  let lastY = window.scrollY;
  const startHidingAfter = 140;

  // =========================================================
  // SCROLL BEHAVIOUR
  // =========================================================
  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    // NAVBAR: Transparent on hero, solid after hero
    if (header && heroSection) {
      const heroBottom = heroSection.offsetHeight;
      header.classList.toggle("solid", y > (heroBottom - 80));
    }

    // NAVBAR: Hide on scroll down, show on scroll up
    if (header) {
      if (y < startHidingAfter) {
        header.classList.remove("hide");
        header.classList.add("show");
      } else if (y > lastY) {
        header.classList.add("hide");
        header.classList.remove("show");
      } else {
        header.classList.remove("hide");
        header.classList.add("show");
      }
    }

    // HERO PARALLAX
    if (heroCard && heroBg) {
      const rect = heroCard.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;

      if (inView) {
        let move = (window.innerHeight - rect.top) * 0.06;
        move = Math.min(Math.max(move, 0), 60);
        heroBg.style.transform = `translateY(${-move}px) scale(1.12)`;
      }

      if (window.scrollY < 5) {
        heroBg.style.transform = `translateY(0px) scale(1.12)`;
      }
    }

    // PASTOR PARALLAX
    if (pastorBanner && pastorBgImage) {
      const rect = pastorBanner.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;

      if (inView) {
        let move = (window.innerHeight - rect.top) * 0.18;
        move = Math.min(Math.max(move, 0), 220);
        pastorBgImage.style.transform = `translate3d(0, ${-move}px, 0) scale(1.32)`;
      }
    }

    lastY = y;
  });

  // =========================================================
  // MOUSE REVEAL (TOP AREA)
  // =========================================================
  document.addEventListener("mousemove", (e) => {
    if (!header) return;
    if (e.clientY < 80) {
      header.classList.remove("hide");
      header.classList.add("show");
    }
  });

  // =========================================================
  // SCROLL REVEAL (all .reveal)
  // =========================================================
  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(el => revealObserver.observe(el));
  }

  // =========================================================
  // LIGHTBOX (click Pastor image -> fullscreen)
  // =========================================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const pastorImg = document.querySelector(".pastor-image img");

  function openLightbox(src, alt){
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Expanded image";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (pastorImg){
    pastorImg.style.cursor = "zoom-in";
    pastorImg.addEventListener("click", () => openLightbox(pastorImg.src, pastorImg.alt));
  }

  if (lightboxClose){
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox){
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("is-open")){
      closeLightbox();
    }
  });

  // =========================================================
  // Local Pastor: Spotlight + Tilt
  // =========================================================
  document.querySelectorAll(".lp-photo[data-spotlight]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);

      const rotY = (px - 0.5) * 10;
      const rotX = (0.5 - py) * 10;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });

  // Local pastor section reveal
  const lpSection = document.querySelector(".local-pastor");
  if (lpSection){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) lpSection.classList.add("is-visible");
      });
    }, { threshold: 0.22 });

    obs.observe(lpSection);
  }

  // =========================================================
  // COUNTDOWN: Inaugural Service (22 March 2026 10:00)
  // =========================================================
  (function countdownInit(){
    const dEl = document.getElementById("cdDays");
    const hEl = document.getElementById("cdHours");
    const mEl = document.getElementById("cdMins");
    const sEl = document.getElementById("cdSecs");
    const noteEl = document.getElementById("countdownNote");

    if (!dEl || !hEl || !mEl || !sEl) return;

    const target = new Date(2026, 2, 22, 10, 0, 0);

    function pad(n){ return String(n).padStart(2, "0"); }

    function tick(){
      const now = new Date();
      const diff = target - now;

      if (diff <= 0){
        dEl.textContent = "0";
        hEl.textContent = "00";
        mEl.textContent = "00";
        sEl.textContent = "00";
        if (noteEl) noteEl.textContent = "We’re live! See you at the inaugural service 🎉";
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      dEl.textContent = String(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(mins);
      sEl.textContent = pad(secs);

      if (noteEl) noteEl.textContent = `Counting down to Sunday, 22 March 2026.`;
    }

    tick();
    setInterval(tick, 1000);
  })();

  // =========================================================
  // JOIN MODAL + FORM SUBMIT
  // =========================================================
  const modal = document.getElementById("joinModal");
  const form  = document.getElementById("quickJoinForm");
  const msg   = document.getElementById("joinMsg");

  if (modal && form && msg){

    function openJoinModal(preset = {}) {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      if (preset.volunteer) {
        form.wants_to_volunteer.checked = true;
      }
    }

    function closeJoinModal() {
      const dont = document.getElementById("dontShowAgain");
      if (dont && dont.checked){
        localStorage.setItem("sojsl_modal_never", "1");
      }

      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      msg.textContent = "";
    }

    function canAutoShow(){
      const never = localStorage.getItem("sojsl_modal_never") === "1";
      if (never) return false;

      const today = new Date().toISOString().slice(0,10);
      const last = localStorage.getItem("sojsl_modal_last_shown");
      if (last === today) return false;

      return true;
    }

    function markShown(){
      const today = new Date().toISOString().slice(0,10);
      localStorage.setItem("sojsl_modal_last_shown", today);
    }

    if (canAutoShow()){
      setTimeout(() => {
        openJoinModal();
        markShown();
      }, 8000);
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-join]");
      if (!btn) return;

      const mode = btn.getAttribute("data-open-join");
      if (mode === "volunteer") openJoinModal({ volunteer: true });
      else openJoinModal();
    });

    modal.addEventListener("click", (e) => {
      if (e.target?.dataset?.close === "true") closeJoinModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeJoinModal();
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "Submitting...";

      const payload = {
        full_name: form.full_name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        wants_launch_updates: form.wants_launch_updates.checked,
        wants_sunday_reminders: form.wants_sunday_reminders.checked,
        wants_event_notifications: form.wants_event_notifications.checked,
        wants_whatsapp: form.wants_whatsapp.checked,
        wants_to_volunteer: form.wants_to_volunteer.checked,
        is_newcomer: form.is_newcomer.checked,
        consent: form.consent.checked,
      };

const res = await fetch(`${API_BASE}/api/leads/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const data = await res.json().catch(() => ({}));
if (!res.ok) throw new Error(data.error || "Submission failed");

msg.textContent = "You’re in ✅";
form.reset();
setTimeout(closeJoinModal, 1200);

    });

    const btnNotNow = document.getElementById("modalNotNow");
    const btnNever = document.getElementById("modalNever");

    if (btnNotNow){
      btnNotNow.addEventListener("click", closeJoinModal);
    }

    if (btnNever){
      btnNever.addEventListener("click", () => {
        localStorage.setItem("sojsl_modal_never", "1");
        closeJoinModal();
      });
    }
  }

});

async function emailOnlySignup(email, source) {
  const res = await fetch(`${API_BASE}/api/leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to sign up");
  return data;
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("footerLeadForm");
  const input = document.getElementById("footerEmail");

  if (!form || !input) return;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = input.value.trim();

  try {
    const data = await emailOnlySignup(email, "footer");

    if (data.created === false) {
      alert("You’re already on the list ✅");
    } else {
      alert("Thanks! You’re on the list ✅");
    }

    form.reset();
  } catch (err) {
    alert(err.message || "Failed to sign up. Please try again.");
  }
});

});


