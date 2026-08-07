/* ============================================================
   XION GAMING — CEK PC SAYA
   ------------------------------------------------------------
   Estimasi Gaming/Streaming/Bottleneck Check + Score Rating
   berdasarkan CPU/GPU/RAM yang dipilih pengguna dari katalog
   yang sama dengan halaman Rakit PC (js/products-data.js).

   Bukan benchmark per judul game — cuma estimasi kasar dari
   tingkatan (tier) komponen, supaya orang awam dapat gambaran
   umum sebelum tanya-tanya detail ke admin.
   ============================================================ */
(function(){
  "use strict";

  function $(sel){ return document.querySelector(sel); }

  function populateSelect(selectEl, category){
    const items = PRODUCTS
      .filter(p => p.category === category)
      .slice()
      .sort((a,b) => a.tier - b.tier || a.name.localeCompare(b.name));
    items.forEach(p=>{
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.name} — ${p.spec}`;
      selectEl.appendChild(opt);
    });
  }

  /* ---------- LOGIKA CEK (murni, gampang diaudit) ---------- */
  function gamingCheck(cpuTier, gpuTier){
    const eff = gpuTier*0.6 + cpuTier*0.4;
    if(eff < 1.8) return { level:"low", text:"Kurang cocok untuk game AAA berat — nyaman untuk game ringan/eSports lawas di setting rendah." };
    if(eff < 2.6) return { level:"mid", text:"Bisa main game AAA di 1080p, tapi setting Low–Medium biar lancar." };
    if(eff < 3.6) return { level:"good", text:"Lancar untuk game AAA 1080p Medium–High, mulai mendekati 1440p." };
    if(eff < 4.6) return { level:"good", text:"Kencang untuk 1440p High–Ultra, mendekati 4K di beberapa judul." };
    return { level:"great", text:"Kelas atas — nyaman 4K Ultra settings, ray tracing pun lancar." };
  }

  function streamingCheck(cpuTier, ramGB){
    if(cpuTier <= 2 || ramGB < 16){
      return { level:"low", text:"Streaming sambil gaming bakal berat. Disarankan RAM minimal 16GB, atau pakai encoder GPU (NVENC/AMF) kalau VGA-nya mendukung." };
    }
    if(cpuTier <= 3){
      return { level:"mid", text:"Bisa streaming + gaming pakai encoder GPU (NVENC/AMF). Kalau pakai encoder software (x264) mungkin agak nge-drop di setting tinggi." };
    }
    return { level:"great", text:"Nyaman streaming sambil gaming — CPU & RAM cukup mumpuni untuk multitasking berat." };
  }

  function bottleneckCheck(cpuTier, gpuTier){
    const gap = Math.abs(cpuTier - gpuTier);
    if(gap >= 3){
      const weaker = cpuTier < gpuTier ? "CPU" : "GPU";
      return { level:"low", text:`Bottleneck cukup kentara — ${weaker} kamu jauh lebih lemah dibanding pasangannya, jadi penghambat performa.` };
    }
    if(gap === 2){
      return { level:"mid", text:"Ada sedikit ketimpangan CPU-GPU, tapi masih dalam batas wajar." };
    }
    return { level:"great", text:"CPU dan GPU seimbang, tidak ada bottleneck yang signifikan." };
  }

  function scoreRating(cpuTier, gpuTier, ramGB){
    const ramFactor = Math.min(ramGB/32, 1) * 5; // skala ke 1-5
    let base = (gpuTier*0.5 + cpuTier*0.35 + ramFactor*0.15);
    const gap = Math.abs(cpuTier - gpuTier);
    if(gap >= 3) base -= 0.6;
    const score = Math.max(0, Math.min(100, Math.round((base/5)*100)));

    let label = "Entry-Level";
    if(score >= 80) label = "Enthusiast / Flagship";
    else if(score >= 60) label = "High-End";
    else if(score >= 40) label = "Mainstream";
    return { score, label };
  }

  /* ---------- RENDER ---------- */
  function renderUsageBadge(){
    const box = $("#cekpc-usage");
    const remaining = getRemainingToday();
    const limit = getDailyLimit();
    const member = getActiveMembership();
    box.innerHTML = `
      <span class="cekpc-usage-pill">Sisa cek hari ini: <strong>${remaining}/${limit}</strong></span>
      ${member ? `<span class="cekpc-usage-pill cekpc-usage-member">✓ Member ${member.tier}x/hari s.d. ${member.exp}</span>` : ""}
    `;
  }

  function renderScoreGauge(result){
    const wrap = $("#cekpc-score-wrap");
    wrap.innerHTML = `
      <div class="score-gauge" style="--deg:0deg">
        <span class="score-num">0</span>
      </div>
      <div class="score-label">${result.label}</div>
      <p class="score-disclaimer">*Estimasi dari tingkatan komponen, bukan benchmark game sesungguhnya.</p>
    `;
    const gaugeEl = wrap.querySelector(".score-gauge");
    const numEl = wrap.querySelector(".score-num");
    requestAnimationFrame(()=>{ gaugeEl.style.setProperty("--deg", Math.round(result.score/100*360) + "deg"); });
    animateNumberCekpc(numEl, 0, result.score, 700);
  }

  function animateNumberCekpc(el, from, to, duration){
    const start = performance.now();
    function tick(now){
      const progress = Math.min(1, (now-start)/duration);
      const eased = 1 - Math.pow(1-progress, 3);
      el.textContent = Math.round(from + (to-from)*eased);
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function runCheck(){
    const cpu = byIdShared($("#cekpc-cpu").value);
    const gpu = byIdShared($("#cekpc-gpu").value);
    const ram = byIdShared($("#cekpc-ram").value);

    if(!cpu || !gpu || !ram){
      alert("Pilih dulu CPU, VGA, dan RAM-nya ya.");
      return;
    }
    if(getRemainingToday() <= 0){
      $("#cekpc-limit-box").classList.remove("hidden");
      $("#cekpc-limit-box").scrollIntoView({ behavior:"smooth", block:"start" });
      return;
    }

    incrementUsageToday();
    renderUsageBadge();

    const g = gamingCheck(cpu.tier, gpu.tier);
    const s = streamingCheck(cpu.tier, ram.capacity);
    const b = bottleneckCheck(cpu.tier, gpu.tier);
    const score = scoreRating(cpu.tier, gpu.tier, ram.capacity);

    $("#cekpc-gaming-text").textContent = g.text;
    $("#cekpc-streaming-text").textContent = s.text;
    $("#cekpc-bottleneck-text").textContent = b.text;
    renderScoreGauge(score);

    $("#cekpc-form").classList.add("hidden");
    $("#cekpc-results").classList.remove("hidden");
    $("#cekpc-limit-box").classList.add("hidden");

    // simpan pilihan terakhir untuk tombol WA
    window._cekpcLast = { cpu, gpu, ram, score };
  }

  function waMessage(){
    const last = window._cekpcLast;
    if(!last) return "Halo, saya habis pakai Cek PC Saya, mau tanya rekomendasi upgrade.";
    return [
      "Halo, saya habis cek PC lewat fitur Cek PC Saya, ini hasilnya:",
      "",
      `- CPU: ${last.cpu.name}`,
      `- VGA: ${last.gpu.name}`,
      `- RAM: ${last.ram.name}`,
      `- Score Rating: ${last.score.score}/100 (${last.score.label})`,
      "",
      "Mohon rekomendasi upgrade komponen yang paling worth-it ya, terima kasih!"
    ].join("\n");
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    populateSelect($("#cekpc-cpu"), "cpu");
    populateSelect($("#cekpc-gpu"), "gpu");
    populateSelect($("#cekpc-ram"), "ram");
    renderUsageBadge();

    if(getRemainingToday() <= 0){
      $("#cekpc-limit-box").classList.remove("hidden");
    }

    $("#cekpc-submit").addEventListener("click", runCheck);

    $("#cekpc-show-member-link").addEventListener("click", ()=>{
      $("#cekpc-limit-box").classList.toggle("hidden");
      $("#cekpc-limit-box").scrollIntoView({ behavior:"smooth", block:"start" });
    });

    $("#cekpc-again-btn").addEventListener("click", ()=>{
      $("#cekpc-results").classList.add("hidden");
      $("#cekpc-form").classList.remove("hidden");
      if(getRemainingToday() <= 0){
        $("#cekpc-limit-box").classList.remove("hidden");
      }
    });

    $("#cekpc-wa-btn").addEventListener("click", ()=>{
      const text = encodeURIComponent(waMessage());
      window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
    });

    $("#cekpc-member-btn").addEventListener("click", ()=>{
      const raw = $("#cekpc-member-input").value;
      const decoded = decodeMemberCode(raw);
      if(!decoded){
        alert("Kode member tidak valid atau sudah kadaluarsa. Cek lagi kodenya atau hubungi admin.");
        return;
      }
      saveActiveMembership(raw.trim());
      renderUsageBadge();
      $("#cekpc-limit-box").classList.add("hidden");
      $("#cekpc-form").classList.remove("hidden");
      alert(`Member ${decoded.tier}x/hari aktif sampai ${decoded.exp}. Selamat mencoba!`);
    });
  });
})();
