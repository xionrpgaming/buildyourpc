/* ============================================================
   XION GAMING — ANIMASI
   Animasi orisinal (bukan aset situs manapun): scroll-reveal
   dan particle mengambang di hero. File ini dipakai bareng di
   index.html & builder.html, jadi setiap fungsi mengecek dulu
   elemennya ada sebelum jalan.
   ============================================================ */
(function () {
  "use strict";

  // ---------- Scroll reveal (fade + slide up saat elemen masuk viewport) ----------
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
  }

  // ---------- Floating particles di background hero ----------
  function initParticles() {
    const field = document.getElementById("heroParticles");
    if (!field) return;
    const COUNT = 18;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const left = Math.random() * 100;
      const delay = Math.random() * 6;
      const duration = 6 + Math.random() * 6;
      const bottom = Math.random() * 60;
      p.style.left = left + "%";
      p.style.bottom = bottom + "%";
      p.style.animationDelay = delay + "s";
      p.style.animationDuration = duration + "s";
      field.appendChild(p);
    }
  }

  // ---------- Notifikasi "Website Masih Beta" (cuma di index.html) ----------
  const BETA_NOTICE_KEY = "xion_beta_notice_seen_v1";
  function initBetaNotice() {
    const modal = document.getElementById("betaModal");
    if (!modal) return;
    const dismissBtn = document.getElementById("betaModalDismiss");

    let alreadySeen = false;
    try { alreadySeen = localStorage.getItem(BETA_NOTICE_KEY) === "1"; } catch (e) {}
    if (alreadySeen) { modal.remove(); return; }

    // sedikit delay biar transisi masuknya kerasa, bukan langsung "nempel"
    requestAnimationFrame(() => {
      setTimeout(() => modal.classList.add("show"), 120);
    });

    dismissBtn.addEventListener("click", () => {
      modal.classList.add("hide");
      modal.classList.remove("show");
      try { localStorage.setItem(BETA_NOTICE_KEY, "1"); } catch (e) {}
      setTimeout(() => modal.remove(), 400);
    });
  }

  // ---------- Testimoni <-> Brand Partner: layer bergantian ----------
  function initTestiBrandAlternation() {
    const card = document.querySelector(".js-testi-card");
    if (!card) return;
    const dots = card.querySelectorAll(".testi-dot");
    const views = card.querySelectorAll(".testi-view");
    const titleEl = document.getElementById("testiCardTitle");
    const TITLES = { testi: "💬 Testimoni Pelanggan", brand: "🤝 Brand Partner Kami" };
    let current = "testi";

    function showView(name) {
      current = name;
      views.forEach((v) => v.classList.toggle("testi-view-active", v.dataset.view === name));
      dots.forEach((d) => d.classList.toggle("active", d.dataset.view === name));
      if (titleEl) titleEl.textContent = TITLES[name];
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        showView(dot.dataset.view);
        resetTimer();
      });
    });

    let timer;
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => showView(current === "testi" ? "brand" : "testi"), 6000);
    }
    resetTimer();
  }

  // ---------- Sidebar "Testimoni" / "Untuk Bisnis" -> scroll + kedip sorot ----------
  function initAnchorPulse() {
    const links = document.querySelectorAll(".js-anchor-jump");
    if (!links.length) return;
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.dataset.target;
        const target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.remove("pulse-highlight");
        // force reflow biar animasinya bisa diulang walau baru saja jalan
        void target.offsetWidth;
        target.classList.add("pulse-highlight");
        setTimeout(() => target.classList.remove("pulse-highlight"), 1400);
      });
    });
  }

  // ---------- Testimoni: klik kartu -> buka modal semua testimoni ----------
  function initTestiModal() {
    const card = document.querySelector(".js-testi-card");
    const modal = document.getElementById("testiModal");
    if (!card || !modal) return;
    const closeBtn = document.getElementById("testiModalClose");

    function openModal(e) {
      if (e.target.closest(".testi-dots")) return; // klik titik indikator jangan buka modal
      modal.classList.add("show");
    }
    function closeModal() {
      modal.classList.remove("show");
    }
    card.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ---------- B2B: klik di mana saja pada kartu -> buka WhatsApp ----------
  function initBisnisCardClick() {
    const card = document.querySelector(".js-bisnis-card");
    if (!card) return;
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // biarkan tombol/link di dalamnya jalan normal
      const href = card.dataset.waHref;
      if (href) window.open(href, "_blank", "noopener");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initParticles();
    initBetaNotice();
    initTestiBrandAlternation();
    initAnchorPulse();
    initTestiModal();
    initBisnisCardClick();
  });
})();
