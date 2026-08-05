/* ============================================================
   XION GAMING — HALAMAN HASIL (hasil.html)
   Membaca ?code=... dari URL, decode lewat build-shared.js,
   lalu tampilkan ringkasan komponen, cek kompatibilitas, dan
   Build Score-nya. Kalau kode kosong/tidak valid, tampilkan
   form untuk menempelkan kode secara manual.
   ============================================================ */
(function(){
  "use strict";
  const $ = sel => document.querySelector(sel);

  /* ---------- Toast notifikasi ringan (sama seperti app.js) ---------- */
  function showToast(msg, type){
    let toast = document.getElementById("xg-toast");
    if(!toast){
      toast = document.createElement("div");
      toast.id = "xg-toast";
      toast.className = "xg-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = "xg-toast show" + (type ? " " + type : "");
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(()=> toast.classList.remove("show"), 2800);
  }

  /* ---------- Animasi angka menghitung naik (sama seperti app.js) ---------- */
  function animateNumber(el, from, to, duration){
    if(!el) return;
    const start = performance.now();
    function tick(now){
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderResult(single, multi, code){
    $("#result-empty").classList.add("hidden");
    $("#result-card").classList.remove("hidden");

    $("#result-code-text").textContent = code;

    // ---- daftar komponen ----
    const items = allItemsFrom(single, multi);
    $("#result-summary-list").innerHTML = items.map(({product,qty})=>`
      <div class="summary-item">
        <div>
          <div class="summary-item-name">${product.name}</div>
          <div class="summary-item-spec">${product.spec}</div>
        </div>
        ${qty>1 ? `<span class="summary-qty">x${qty}</span>` : ""}
      </div>
    `).join("");

    // ---- cek kompatibilitas ----
    const { checks } = compatInfoFrom(single, multi);
    $("#result-compat-list").innerHTML = checks.length ? checks.map(c=>`
      <div class="compat-row ${c.ok ? "ok":"bad"}">
        <span class="compat-icon">${c.ok ? "✓" : "!"}</span>
        <span>${c.label}</span>
      </div>
    `).join("") : `<div class="empty-state small">Rakitan ini belum cukup lengkap untuk dicek kompatibilitasnya.</div>`;

    // ---- build score ----
    const result = calcBuildScoreFrom(single, multi);
    const scoreWrap = $("#result-score-wrap");
    if(result.score === null){
      scoreWrap.innerHTML = `
        <div class="score-gauge score-empty"><span class="score-num">—</span></div>
        <div class="score-label">${result.label}</div>
        <ul class="score-notes">${result.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
      `;
    } else {
      const deg = Math.round(result.score/100*360);
      scoreWrap.innerHTML = `
        <div class="score-gauge" style="--deg:0deg"><span class="score-num">0</span></div>
        <div class="score-label">${result.label}</div>
        <ul class="score-notes">${result.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
        <p class="score-disclaimer">*Skor estimasi internal berdasarkan tingkatan komponen &amp; konvensi umum komunitas PC builder, bukan harga.</p>
      `;
      const gaugeEl = scoreWrap.querySelector(".score-gauge");
      const numEl = scoreWrap.querySelector(".score-num");
      requestAnimationFrame(()=>{ gaugeEl.style.setProperty("--deg", deg + "deg"); });
      animateNumber(numEl, 0, result.score, 700);
    }

    // ---- tombol aksi ----
    $("#result-edit-link").href = buildEditLink(code);

    const waBtn = $("#result-wa-btn");
    waBtn.disabled = items.length === 0;
    waBtn.onclick = ()=>{
      const text = encodeURIComponent(buildWaMessageFrom(single, multi));
      window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
    };

    // ---- salin kode ----
    $("#result-copy-btn").onclick = async ()=>{
      try{
        await navigator.clipboard.writeText(code);
        showToast("Kode disalin ke clipboard ✓");
      }catch(e){
        showToast("Gagal menyalin — salin manual dari kotak kode.", "err");
      }
    };
  }

  function showEmptyState(){
    $("#result-card").classList.add("hidden");
    $("#result-empty").classList.remove("hidden");
  }

  function tryLoadCode(raw){
    const decoded = decodeBuildCode(raw);
    if(!decoded){
      showToast("Kode tidak valid atau rusak.", "err");
      return false;
    }
    const totalParts = Object.keys(decoded.single).length +
      Object.values(decoded.multi).reduce((n,obj)=> n + Object.keys(obj).length, 0);
    if(totalParts === 0){
      showToast("Kode ini tidak berisi komponen apa pun.", "err");
      return false;
    }
    renderResult(decoded.single, decoded.multi, raw.trim().startsWith("XG1-") ? raw.trim() : ("XG1-" + raw.trim()));
    // update URL supaya bisa di-bookmark/refresh tanpa kehilangan hasil
    const url = new URL(window.location.href);
    url.searchParams.set("code", raw.trim());
    window.history.replaceState({}, "", url);
    return true;
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const urlCode = new URLSearchParams(window.location.search).get("code");
    if(urlCode && tryLoadCode(urlCode)){
      // berhasil dimuat dari URL
    } else {
      showEmptyState();
    }

    const loadBtn = $("#result-load-btn");
    const loadInput = $("#result-load-input");
    if(loadBtn && loadInput){
      loadBtn.addEventListener("click", ()=>{
        if(!loadInput.value.trim()){ showToast("Masukkan kode rakitan dulu.", "err"); return; }
        tryLoadCode(loadInput.value.trim());
      });
      loadInput.addEventListener("keydown", (e)=>{
        if(e.key === "Enter"){ e.preventDefault(); loadBtn.click(); }
      });
    }
  });
})();
