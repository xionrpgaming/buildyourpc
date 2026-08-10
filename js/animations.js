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

  document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initParticles();
    initBetaNotice();
  });
})();
