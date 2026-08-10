/* ============================================================
   XION GAMING — BUILD CODEC & SHARED LOGIC
   ------------------------------------------------------------
   File ini dipakai BERSAMA oleh:
     - js/app.js   (halaman builder.html — rakit & pilih komponen)
     - js/hasil.js (halaman hasil.html — lihat hasil rakitan)

   Isinya fungsi "murni" (tidak menyentuh DOM), supaya logika
   encode/decode kode rakitan, cek kompatibilitas, dan hitung
   Build Score tidak perlu ditulis dua kali di dua halaman.

   URUTAN LOAD SCRIPT WAJIB:
     1) js/products-data.js
     2) js/build-shared.js   <-- file ini
     3) js/app.js  ATAU  js/hasil.js
   ============================================================ */

function byIdShared(id){ return PRODUCTS.find(p => p.id === id); }

/* ---------- NOMOR WHATSAPP TOKO ----------
   Satu-satunya tempat nomor ini didefinisikan (dipakai app.js
   dan hasil.js). Format: kode negara + nomor tanpa 0 di depan,
   tanpa spasi/strip. */
const WA_NUMBER = "6285814565849";

/* ---------- BASE64 URL-SAFE ---------- */
function toBase64Url(str){
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function fromBase64Url(b64){
  let s = b64.replace(/-/g,"+").replace(/_/g,"/");
  while(s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

/* ---------- ENCODE / DECODE KODE RAKITAN ----------
   Kode "XG1-...." berisi rakitan itu sendiri (base64 dari JSON
   { s: single, m: multi }), BUKAN sekadar nomor referensi.
   Karena itu kode ini bisa dimuat ulang di HALAMAN & PERANGKAT
   manapun tanpa server/database — cukup decode kodenya. */
function encodeBuildCode(single, multi){
  const payload = { s: single, m: multi };
  return "XG1-" + toBase64Url(JSON.stringify(payload));
}

function decodeBuildCode(raw){
  try{
    const trimmed = String(raw).trim();
    const body = trimmed.startsWith("XG1-") ? trimmed.slice(4) : trimmed;
    const payload = JSON.parse(fromBase64Url(body));
    if(!payload || typeof payload !== "object") return null;

    const single = {};
    Object.entries(payload.s || {}).forEach(([cat,id])=>{
      if(id && byIdShared(id)) single[cat] = id;
    });
    const multi = { ram:{}, gpu:{}, storage:{}, casefan:{} };
    Object.entries(payload.m || {}).forEach(([cat,obj])=>{
      if(!multi[cat]) multi[cat] = {};
      Object.entries(obj || {}).forEach(([id,qty])=>{
        if(byIdShared(id) && qty > 0) multi[cat][id] = qty;
      });
    });
    return { single, multi };
  } catch(e){
    return null;
  }
}

/* ---------- ITEM LOOKUP (versi parametrik, bukan dari state global) ---------- */
const SINGLE_CATEGORIES = ["cpu","motherboard","psu","aircooler","watercooler","casing","monitor","mouse","keyboard","mousepad","os","headphone","networkcard","webcam"];
const MULTI_CATEGORIES = ["ram","gpu","storage","casefan"];

function getSelectedProductFrom(single, cat){
  const id = single ? single[cat] : null;
  return id ? byIdShared(id) : null;
}
function getMultiListFrom(multi, cat){
  return Object.entries((multi && multi[cat]) || {})
    .filter(([,qty]) => qty > 0)
    .map(([id,qty]) => ({ product: byIdShared(id), qty }))
    .filter(x => x.product);
}
function allItemsFrom(single, multi){
  const items = [];
  SINGLE_CATEGORIES.forEach(cat=>{
    const p = getSelectedProductFrom(single, cat);
    if(p) items.push({ product:p, qty:1 });
  });
  MULTI_CATEGORIES.forEach(cat=>{
    items.push(...getMultiListFrom(multi, cat));
  });
  return items;
}

/* ---------- KOMPATIBILITAS (identik dengan compatInfo() lama di app.js) ---------- */
function compatInfoFrom(single, multi){
  const cpu = getSelectedProductFrom(single, "cpu");
  const mobo = getSelectedProductFrom(single, "motherboard");
  const casing = getSelectedProductFrom(single, "casing");
  const ramList = getMultiListFrom(multi, "ram");
  const gpuList = getMultiListFrom(multi, "gpu");
  const psu = getSelectedProductFrom(single, "psu");

  const checks = [];

  if(cpu && mobo){
    checks.push({
      label:`Socket CPU (${cpu.socket}) ↔ Motherboard (${mobo.socket})`,
      ok: cpu.socket === mobo.socket
    });
  }
  if(mobo && ramList.length){
    const mismatch = ramList.find(r => r.product.memoryType !== mobo.memoryType);
    checks.push({
      label:`Tipe RAM (${mobo.memoryType} dibutuhkan oleh motherboard)`,
      ok: !mismatch
    });
  }
  if(mobo && casing){
    checks.push({
      label:`Ukuran Motherboard (${mobo.formFactor}) muat di Casing`,
      ok: casing.supportedFormFactors.includes(mobo.formFactor)
    });
  }
  const tdpTotal = (cpu ? cpu.tdp : 0) + gpuList.reduce((s,g)=> s + g.product.tdp * g.qty, 0);
  const recommendedWattage = Math.ceil((tdpTotal * 1.3 + 100) / 50) * 50;
  if(psu){
    checks.push({
      label:`Daya PSU (${psu.wattage}W) vs estimasi kebutuhan (±${recommendedWattage}W)`,
      ok: psu.wattage >= recommendedWattage
    });
  }

  return { checks, tdpTotal, recommendedWattage, cpu, mobo, gpuList };
}

/* ---------- BUILD SCORE (identik dengan calcBuildScore() lama di app.js) ---------- */
function calcBuildScoreFrom(single, multi){
  const cpu = getSelectedProductFrom(single, "cpu");
  const mobo = getSelectedProductFrom(single, "motherboard");
  const psu = getSelectedProductFrom(single, "psu");
  const ramList = getMultiListFrom(multi, "ram");
  const gpuList = getMultiListFrom(multi, "gpu");
  const storageList = getMultiListFrom(multi, "storage");

  const core = [cpu, mobo, psu];
  const haveCore = core.filter(Boolean).length;
  const notes = [];

  if(haveCore < 3 || ramList.length===0 || gpuList.length===0){
    return {
      score:null,
      label:"Rakitan Belum Lengkap",
      notes:["Pilih minimal CPU, Motherboard, RAM, VGA, dan PSU untuk melihat skor."]
    };
  }

  const gpuTier = Math.max(...gpuList.map(g=>g.product.tier));
  const ramTotalGB = ramList.reduce((s,r)=> s + r.product.capacity*r.qty, 0);
  const hasNvme = storageList.some(s=> s.product.type === "SSD-NVMe");

  let score = 0;
  score += cpu.tier * 15;
  score += gpuTier * 15;
  score += Math.min(ramTotalGB/64, 1) * 15;
  score += hasNvme ? 10 : (storageList.length ? 5 : 0);

  const balanceGap = Math.abs(cpu.tier - gpuTier);
  if(balanceGap >= 3){ score -= 15; notes.push("CPU dan GPU cukup timpang — salah satu jadi bottleneck."); }
  else if(balanceGap <= 1){ score += 5; notes.push("CPU dan GPU seimbang, cocok dipasangkan."); }

  const { tdpTotal, recommendedWattage } = compatInfoFrom(single, multi);
  if(psu.wattage < recommendedWattage){ score -= 20; notes.push(`PSU ${psu.wattage}W pas-pasan untuk estimasi beban ±${tdpTotal}W — disarankan minimal ${recommendedWattage}W.`); }
  else { notes.push(`PSU memiliki headroom aman di atas estimasi beban ±${tdpTotal}W.`); }

  if(ramTotalGB >= 32) notes.push("Kapasitas RAM lega untuk multitasking & game modern.");
  else if(ramTotalGB < 16) notes.push("Kapasitas RAM tergolong minim untuk game modern (disarankan ≥16GB).");

  score = Math.max(0, Math.min(100, Math.round(score)));

  let label = "Entry-Level";
  if(score >= 80) label = "Enthusiast / Flagship";
  else if(score >= 60) label = "High-End";
  else if(score >= 40) label = "Mainstream";

  return { score, label, notes };
}

/* ---------- LINK KE HALAMAN HASIL / EDIT ----------
   Menghasilkan URL absolut ke hasil.html / builder.html dengan
   ?code=... terpasang, dari lokasi file HTML manapun situs ini
   dijalankan (root domain ATAU sub-folder seperti GitHub Pages
   project page: username.github.io/nama-repo/). */
function siteBasePath(){
  return window.location.origin + window.location.pathname.replace(/(builder|hasil)\.html$/, "");
}
function buildResultLink(code){
  return siteBasePath() + "hasil.html?code=" + encodeURIComponent(code);
}
function buildEditLink(code){
  return siteBasePath() + "builder.html?code=" + encodeURIComponent(code);
}

/* ---------- PESAN WHATSAPP (versi parametrik, dipakai app.js & hasil.js) ---------- */
function buildWaMessageFrom(single, multi){
  const items = allItemsFrom(single, multi);
  const lines = ["Halo, saya mau tanya-tanya rakitan PC berikut:", ""];
  items.forEach(({product,qty})=>{
    lines.push(`- ${product.name}${qty>1 ? ` (x${qty})` : ""} — ${product.spec}`);
  });
  const result = calcBuildScoreFrom(single, multi);
  if(result.score !== null){
    lines.push("", `Estimasi Build Score: ${result.score}/100 (${result.label})`);
  }
  lines.push("", "Mohon info harga & ketersediaan untuk rakitan ini ya, terima kasih!");
  if(items.length){
    lines.push("", `Kode Build (simpan untuk cek ulang nanti): ${encodeBuildCode(single, multi)}`);
  }
  return lines.join("\n");
}
