/* ============================================================
   XION GAMING — CEK PC SAYA
   ------------------------------------------------------------
   Estimasi Gaming Check, Streaming Check, dan Bottleneck Check
   berdasarkan CPU/GPU/RAM yang dipilih pengguna dari katalog
   yang sama dengan halaman Rakit PC (js/products-data.js).

   Bukan benchmark per judul game — cuma estimasi kasar dari
   tingkatan (tier) komponen, supaya orang awam dapat gambaran
   umum + rekomendasi komponen mana yang perlu di-upgrade,
   sebelum tanya-tanya detail ke admin.
   ============================================================ */
(function(){
  "use strict";

  function $(sel){ return document.querySelector(sel); }

  /* ---------- Limit cek harian (localStorage, tetap anonim untuk gratisan) ---------- */
  const USAGE_STORAGE_KEY = "xion_cekpc_usage_v1";
  const FREE_DAILY_LIMIT = 1;

  function todayStr(){ return new Date().toISOString().slice(0,10); }

  function getEffectiveTierKey(){
    return (currentMemberDoc && isMembershipActive(currentMemberDoc)) ? currentMemberDoc.tier : 0;
  }

  function getUsageToday(){
    try{
      const raw = localStorage.getItem(USAGE_STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if(!saved || saved.date !== todayStr()) return 0;
      // kalau tier efektif berubah (baru login/baru di-approve member), mulai hitungan segar
      if(saved.tierKey !== getEffectiveTierKey()) return 0;
      return Number(saved.count) || 0;
    } catch(e){ return 0; }
  }
  function incrementUsageToday(){
    const count = getUsageToday() + 1;
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify({ date: todayStr(), count, tierKey: getEffectiveTierKey() }));
    return count;
  }

  /* ---------- Status login & membership (dari Firebase) ---------- */
  let currentUser = null;      // firebase.User | null
  let currentMemberDoc = null; // { tier, expiresAt, hasPending, pendingRequest } | null

  function getDailyLimit(){
    if(currentMemberDoc && isMembershipActive(currentMemberDoc)) return currentMemberDoc.tier;
    return FREE_DAILY_LIMIT;
  }
  function getRemainingToday(){
    return Math.max(0, getDailyLimit() - getUsageToday());
  }

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

  function ramToTier(ramGB){
    if(ramGB < 8) return 1;
    if(ramGB < 16) return 2;
    if(ramGB < 32) return 3;
    if(ramGB < 64) return 4;
    return 5;
  }

  function gameClassLabel(eff){
    if(eff < 2.0) return { label:"Low-End", desc:"game ringan / eSports lawas, setting rendah" };
    if(eff < 3.2) return { label:"Mid-End", desc:"game AAA 1080p, setting Low–Medium" };
    if(eff < 4.3) return { label:"High-End (AAA)", desc:"game AAA 1080p–1440p, setting High–Ultra" };
    return { label:"High-End (AAA) — Kelas Atas", desc:"1440p–4K Ultra, ray tracing lancar" };
  }

  function gamingCheck(cpu, gpu, ramGB){
    const cpuTier = cpu.tier, gpuTier = gpu.tier, ramTier = ramToTier(ramGB);
    const eff = gpuTier*0.55 + cpuTier*0.30 + ramTier*0.15;
    const score = Math.max(0, Math.min(100, Math.round(eff/5*100)));
    const cls = gameClassLabel(eff);

    const notes = [];
    if(ramGB < 8){
      notes.push({ type:"bad", text:`RAM cuma ${ramGB}GB — ini kemungkinan besar jadi penghambat utama. Banyak game modern minta minimal 8GB, idealnya 16GB.` });
    } else if(ramGB < 16){
      notes.push({ type:"warn", text:`RAM ${ramGB}GB masih pas-pasan untuk game AAA modern — upgrade ke 16GB+ akan terasa dampaknya.` });
    }
    if(gpuTier <= 2){
      notes.push({ type:"bad", text:`VGA (${gpu.name}) tergolong kelas entry — ini pembatas utama untuk main game AAA di setting tinggi.` });
    }
    if(cpuTier <= 2 && gpuTier >= 4){
      notes.push({ type:"warn", text:`CPU (${cpu.name}) tergolong lemah dibanding VGA-nya — berpotensi jadi bottleneck di game yang berat di CPU (strategi, simulasi, banyak NPC).` });
    }
    if(notes.length === 0){
      notes.push({ type:"good", text:"Kombinasi CPU, VGA, dan RAM kamu sudah seimbang untuk kelasnya." });
    }

    const verdict = `PC kamu masuk kelas <strong>${cls.label}</strong> — cocok untuk ${cls.desc}.`;
    return { score, classLabel:cls.label, verdict, notes };
  }

  function streamingCheck(cpu, gpu, ramGB){
    const cpuTier = cpu.tier, gpuTier = gpu.tier;
    let capacity, capacityDesc;

    if(cpuTier <= 2 || ramGB < 8){
      capacity = "Belum Disarankan";
      capacityDesc = "Fokus gaming saja dulu — CPU/RAM belum cukup lega untuk nambah beban encoding streaming.";
    } else if(cpuTier === 3 || ramGB < 16){
      capacity = "Single Stream";
      capacityDesc = "Cukup untuk streaming ke 1 platform (YouTube / Facebook / TikTok saja) sambil main.";
    } else if(cpuTier === 4 && ramGB >= 16){
      capacity = "Double Stream";
      capacityDesc = "Bisa multistream ke 2 platform sekaligus, atau streaming + local recording bareng.";
    } else {
      capacity = "Multiple Stream";
      capacityDesc = "Mumpuni untuk multistream 3+ platform / kualitas tinggi multi-bitrate sekaligus.";
    }

    const notes = [];
    if(gpuTier >= 3){
      notes.push({ type:"good", text:"VGA kamu mendukung encoder hardware (NVENC/AMF) — pakai ini supaya beban CPU tetap ringan saat streaming." });
    } else {
      notes.push({ type:"warn", text:"VGA kamu kurang ideal untuk encoder hardware — kemungkinan harus pakai encoder software (x264) yang lebih berat ke CPU." });
    }
    if(ramGB < 16){
      notes.push({ type:"warn", text:"RAM di bawah 16GB akan terasa sempit kalau OBS/streaming software jalan bareng game + browser/chat overlay." });
    }

    const streamPenalty = capacity === "Belum Disarankan" ? 0 : (capacity === "Single Stream" ? 0.8 : capacity === "Double Stream" ? 1.3 : 1.8);
    const ramTier = ramToTier(ramGB);
    const baseEff = gpuTier*0.55 + cpuTier*0.30 + ramTier*0.15;
    const effWhileStreaming = Math.max(1, baseEff - streamPenalty);
    const clsStream = gameClassLabel(effWhileStreaming);

    const verdict = capacity === "Belum Disarankan"
      ? `Kapasitas: <strong>${capacity}</strong>. ${capacityDesc}`
      : `Kapasitas: <strong>${capacity}</strong>. ${capacityDesc}<br>Sambil streaming, game yang masih nyaman dimainkan: kelas <strong>${clsStream.label}</strong>.`;

    return { capacity, verdict, notes };
  }

  function bottleneckCheck(cpu, gpu, ramGB){
    const ramTier = ramToTier(ramGB);
    const parts = [
      { key:"cpu", name:"CPU", label: cpu.name, tier: cpu.tier },
      { key:"gpu", name:"VGA", label: gpu.name, tier: gpu.tier },
      { key:"ram", name:"RAM", label: `${ramGB}GB`, tier: ramTier },
    ];
    const avgAll = (parts[0].tier + parts[1].tier + parts[2].tier) / 3;
    const weak = parts.filter(p => (avgAll - p.tier) >= 1.3).sort((a,b)=> a.tier - b.tier);

    let verdict;
    if(weak.length === 0){
      verdict = "Rakitan seimbang — tidak ada bottleneck signifikan yang terdeteksi antara CPU, VGA, dan RAM.";
    } else if(weak.length === 1){
      const w = weak[0];
      verdict = `<strong>${w.name}</strong> (${w.label}) jadi titik lemah rakitan ini dibanding dua komponen lainnya. Rekomendasi: upgrade ${w.name} dulu sebelum yang lain — itu yang paling menahan performa keseluruhan.`;
    } else {
      const names = weak.map(w=>w.name).join(" & ");
      verdict = `<strong>${names}</strong> sama-sama jadi titik lemah dibanding komponen lain yang lebih tinggi kelasnya — komponen yang kuat jadi "kelaparan", tidak terpakai maksimal. Rekomendasi: upgrade ${names} dulu.`;
    }

    return { parts, weakKeys: weak.map(w=>w.key), verdict };
  }

  function renderUsageBadge(){
    const box = $("#cekpc-usage");
    const remaining = getRemainingToday();
    const limit = getDailyLimit();
    const active = currentMemberDoc && isMembershipActive(currentMemberDoc);
    box.innerHTML = `
      <span class="cekpc-usage-pill">Sisa cek hari ini: <strong>${remaining}/${limit}</strong></span>
      ${active ? `<span class="cekpc-usage-pill cekpc-usage-member">✓ Member ${currentMemberDoc.tier}x/hari s.d. ${currentMemberDoc.expiresAt}</span>` : ""}
    `;
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

  function renderGamingTab(result){
    const wrap = $("#cekpc-gaming-score-wrap");
    wrap.innerHTML = `
      <div class="score-gauge" style="--deg:0deg"><span class="score-num">0</span></div>
      <div class="score-label">${result.classLabel}</div>
    `;
    const gaugeEl = wrap.querySelector(".score-gauge");
    const numEl = wrap.querySelector(".score-num");
    requestAnimationFrame(()=>{ gaugeEl.style.setProperty("--deg", Math.round(result.score/100*360) + "deg"); });
    animateNumberCekpc(numEl, 0, result.score, 700);

    $("#cekpc-gaming-verdict").innerHTML = result.verdict;
    $("#cekpc-gaming-notes").innerHTML = result.notes.map(n=>`<li class="cekpc-note cekpc-note-${n.type}">${n.text}</li>`).join("");
  }

  const STREAM_LEVELS = ["Belum Disarankan", "Single Stream", "Double Stream", "Multiple Stream"];

  function renderStreamingTab(result, mode){
    $("#cekpc-streaming-badge").textContent = result.capacity;
    $("#cekpc-streaming-badge").className = "cekpc-capacity-badge cekpc-capacity-" +
      (result.capacity === "Belum Disarankan" ? "none" : result.capacity === "Single Stream" ? "single" : result.capacity === "Double Stream" ? "double" : "multi");
    $("#cekpc-streaming-verdict").innerHTML = result.verdict;
    $("#cekpc-streaming-notes").innerHTML = result.notes.map(n=>`<li class="cekpc-note cekpc-note-${n.type}">${n.text}</li>`).join("");

    const have = STREAM_LEVELS.indexOf(result.capacity);
    const modeVerdictEl = $("#cekpc-streaming-modeverdict");
    if(mode === "gaming-streaming"){
      const need = STREAM_LEVELS.indexOf("Single Stream");
      const ok = have >= need;
      modeVerdictEl.innerHTML = ok
        ? `✅ <strong>Bisa</strong> gaming sambil streaming ke 1 platform.`
        : `❌ <strong>Belum cukup</strong> untuk gaming sambil streaming — kapasitas kamu saat ini "${result.capacity}".`;
      modeVerdictEl.className = "cekpc-mode-verdict " + (ok ? "ok" : "bad");
    } else if(mode === "gaming-multistreaming"){
      const need = STREAM_LEVELS.indexOf("Multiple Stream");
      const ok = have >= need;
      modeVerdictEl.innerHTML = ok
        ? `✅ <strong>Bisa</strong> gaming sambil multistream ke beberapa platform sekaligus.`
        : `❌ <strong>Belum cukup</strong> untuk multistreaming — kapasitas kamu saat ini "${result.capacity}", minimal butuh "Multiple Stream".`;
      modeVerdictEl.className = "cekpc-mode-verdict " + (ok ? "ok" : "bad");
    } else {
      modeVerdictEl.textContent = "";
    }
  }

  function renderBottleneckTab(result){
    const bars = $("#cekpc-bottleneck-bars");
    bars.innerHTML = result.parts.map(p=>{
      const isWeak = result.weakKeys.includes(p.key);
      const pct = (p.tier/5)*100;
      return `
        <div class="cekpc-bar-row ${isWeak ? "cekpc-bar-weak" : ""}">
          <div class="cekpc-bar-label">
            <span>${p.name}</span>
            <span class="cekpc-bar-sub">${p.label}${isWeak ? " ⚠️" : ""}</span>
          </div>
          <div class="cekpc-bar-track"><div class="cekpc-bar-fill" style="width:${pct}%"></div></div>
        </div>
      `;
    }).join("");
    $("#cekpc-bottleneck-verdict").innerHTML = result.verdict;
  }

  function renderAuthUI(){
    const guestBlock = $("#cekpc-auth-guest");
    const userBlock = $("#cekpc-auth-user");

    if(!currentUser){
      guestBlock.classList.remove("hidden");
      userBlock.classList.add("hidden");
      return;
    }
    guestBlock.classList.add("hidden");
    userBlock.classList.remove("hidden");
    $("#cekpc-user-email").textContent = currentUser.email;

    const pricingGrid = $("#cekpc-pricing-grid");
    const pendingBox = $("#cekpc-pending-status");
    const active = currentMemberDoc && isMembershipActive(currentMemberDoc);

    if(currentMemberDoc && currentMemberDoc.hasPending){
      pricingGrid.classList.add("hidden");
      pendingBox.classList.remove("hidden");
      $("#cekpc-pending-tier").textContent = currentMemberDoc.pendingRequest ? currentMemberDoc.pendingRequest.tier : "?";
    } else if(active){
      pricingGrid.classList.add("hidden");
      pendingBox.classList.add("hidden");
    } else {
      pricingGrid.classList.remove("hidden");
      pendingBox.classList.add("hidden");
    }
  }

  let selectedMode = null; // "gaming" | "gaming-streaming" | "gaming-multistreaming"

  function switchTab(tab){
    document.querySelectorAll(".cekpc-tab").forEach(btn=>{
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    document.querySelectorAll(".cekpc-tab-panel").forEach(panel=>{
      panel.classList.toggle("hidden", panel.dataset.panel !== tab);
    });
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

    const needsStreaming = selectedMode === "gaming-streaming" || selectedMode === "gaming-multistreaming";

    const gaming = gamingCheck(cpu, gpu, ram.capacity);
    const bottleneck = bottleneckCheck(cpu, gpu, ram.capacity);
    renderGamingTab(gaming);
    renderBottleneckTab(bottleneck);

    let streaming = null;
    $("#cekpc-tab-streaming-btn").classList.toggle("hidden", !needsStreaming);
    if(needsStreaming){
      streaming = streamingCheck(cpu, gpu, ram.capacity);
      renderStreamingTab(streaming, selectedMode);
    }

    switchTab("gaming");

    $("#cekpc-form").classList.add("hidden");
    $("#cekpc-results").classList.remove("hidden");
    $("#cekpc-limit-box").classList.add("hidden");

    window._cekpcLast = { cpu, gpu, ram, gaming, streaming, bottleneck, mode: selectedMode };
  }

  function waMessage(){
    const last = window._cekpcLast;
    if(!last) return "Halo, saya habis pakai Cek PC Saya, mau tanya rekomendasi upgrade.";
    const lines = [
      "Halo, saya habis cek PC lewat fitur Cek PC Saya, ini hasilnya:",
      "",
      `- CPU: ${last.cpu.name}`,
      `- VGA: ${last.gpu.name}`,
      `- RAM: ${last.ram.name}`,
      `- Gaming: ${last.gaming.score}/100 (${last.gaming.classLabel})`,
    ];
    if(last.streaming) lines.push(`- Streaming: ${last.streaming.capacity}`);
    lines.push(`- Bottleneck: ${last.bottleneck.weakKeys.length ? last.bottleneck.weakKeys.join(", ").toUpperCase() + " jadi titik lemah" : "seimbang"}`);
    lines.push("", "Mohon rekomendasi upgrade komponen yang paling worth-it ya, terima kasih!");
    return lines.join("\n");
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

    document.querySelectorAll(".cekpc-mode-card").forEach(card=>{
      card.addEventListener("click", ()=>{
        selectedMode = card.dataset.mode;
        $("#cekpc-mode-select").classList.add("hidden");
        $("#cekpc-form").classList.remove("hidden");
      });
    });

    $("#cekpc-change-mode-btn").addEventListener("click", ()=>{
      $("#cekpc-form").classList.add("hidden");
      $("#cekpc-mode-select").classList.remove("hidden");
    });

    $("#cekpc-show-member-link").addEventListener("click", ()=>{
      $("#cekpc-limit-box").classList.toggle("hidden");
      $("#cekpc-limit-box").scrollIntoView({ behavior:"smooth", block:"start" });
    });

    document.querySelectorAll(".cekpc-tab").forEach(btn=>{
      btn.addEventListener("click", ()=> switchTab(btn.dataset.tab));
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

    $("#cekpc-google-login-btn").addEventListener("click", ()=>{
      signInWithGoogle().catch(err=>{
        console.error(err);
        alert("Login gagal: " + (err && err.message ? err.message : "coba lagi ya."));
      });
    });

    $("#cekpc-logout-btn").addEventListener("click", ()=>{
      signOutUser();
    });

    document.querySelectorAll(".cekpc-price-btn").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        if(!currentUser){
          alert("Login dulu ya sebelum upgrade.");
          return;
        }
        const tier = btn.dataset.tier;
        try{
          await requestMembershipUpgrade(currentUser.uid, tier);
          currentMemberDoc = await getMemberDoc(currentUser.uid);
          renderAuthUI();
          const waText = encodeURIComponent(
            `Halo, saya (${currentUser.email}) mau upgrade membership Cek PC Saya ke tier ${tier}x/hari. Sudah saya ajukan di web — mohon dikonfirmasi setelah pembayaran saya kirim ya.`
          );
          window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, "_blank");
        } catch(err){
          console.error(err);
          alert("Gagal mengajukan upgrade: " + (err && err.message ? err.message : "coba lagi ya."));
        }
      });
    });

    onAuthChange(async (user)=>{
      currentUser = user;
      if(user){
        try{
          currentMemberDoc = await ensureMemberDoc(user);
        } catch(err){
          console.error(err);
          currentMemberDoc = null;
        }
      } else {
        currentMemberDoc = null;
      }
      renderUsageBadge();
      renderAuthUI();
      if(getRemainingToday() <= 0){
        $("#cekpc-limit-box").classList.remove("hidden");
      } else {
        $("#cekpc-limit-box").classList.add("hidden");
      }
    });
  });
})();
