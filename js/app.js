/* ============================================================
   XION GAMING — BUILDER LOGIC
   Ganti nomor WhatsApp di bawah ini dengan nomor toko Anda.
   Format: kode negara + nomor tanpa 0 di depan, tanpa spasi/strip.
   ============================================================ */
const WA_NUMBER = "6285814565849";

/* ---------- STATE ---------- */
const state = {
  activeCategory: "cpu",
  filters: {},        // { [category]: { [filterKey]: Set(values), inStock:false } }
  single: {},          // { cpu: productId, motherboard: productId, psu: productId, casing: productId, monitor: productId }
  multi: { ram:{}, gpu:{}, storage:{} }, // { [productId]: qty }
};
CATEGORY_LIST.forEach(c => { state.filters[c.key] = { inStock:false }; });

/* ---------- HELPERS ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const byId = id => PRODUCTS.find(p => p.id === id);
const catProducts = cat => PRODUCTS.filter(p => p.category === cat);

function getSelectedProduct(cat){
  const id = state.single[cat];
  return id ? byId(id) : null;
}
function getMultiList(cat){
  return Object.entries(state.multi[cat] || {})
    .filter(([,qty]) => qty > 0)
    .map(([id,qty]) => ({ product: byId(id), qty }));
}
function allSelectedItems(){
  const items = [];
  ["cpu","motherboard","psu","casing","monitor"].forEach(cat=>{
    const p = getSelectedProduct(cat);
    if(p) items.push({ product:p, qty:1 });
  });
  ["ram","gpu","storage"].forEach(cat=>{
    items.push(...getMultiList(cat));
  });
  return items;
}

/* ---------- COMPATIBILITY ---------- */
function compatInfo(){
  const cpu = getSelectedProduct("cpu");
  const mobo = getSelectedProduct("motherboard");
  const casing = getSelectedProduct("casing");
  const ramList = getMultiList("ram");
  const gpuList = getMultiList("gpu");
  const psu = getSelectedProduct("psu");

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

/* ---------- BUILD SCORE ----------
   Heuristik internal: skor dihitung dari tingkatan (tier 1-5) tiap
   komponen inti, keseimbangan CPU/GPU, dan kecukupan daya PSU.
   Ini BUKAN data real-time dari forum, melainkan bobot yang disusun
   mengikuti konvensi umum tier-list komunitas PC builder (CPU/GPU
   sekelas cenderung dipasangkan, PSU diberi headroom ±30%). Sesuaikan
   bobot di bawah bila Anda punya acuan benchmark sendiri. */
function calcBuildScore(){
  const cpu = getSelectedProduct("cpu");
  const mobo = getSelectedProduct("motherboard");
  const psu = getSelectedProduct("psu");
  const ramList = getMultiList("ram");
  const gpuList = getMultiList("gpu");
  const storageList = getMultiList("storage");

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
  score += cpu.tier * 15;      // 0-75
  score += gpuTier * 15;       // 0-75
  score += Math.min(ramTotalGB/64, 1) * 15; // 0-15, capped di 64GB
  score += hasNvme ? 10 : (storageList.length ? 5 : 0);

  const balanceGap = Math.abs(cpu.tier - gpuTier);
  if(balanceGap >= 3){ score -= 15; notes.push("CPU dan GPU cukup timpang — salah satu jadi bottleneck."); }
  else if(balanceGap <= 1){ score += 5; notes.push("CPU dan GPU seimbang, cocok dipasangkan."); }

  const { tdpTotal, recommendedWattage } = compatInfo();
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

/* ---------- FILTER OPTIONS ---------- */
const FILTER_DEFS = {
  cpu: [ {key:"brand", label:"Manufacturer"}, {key:"socket", label:"Socket"}, {key:"generation", label:"Generasi"} ],
  motherboard: [ {key:"brand", label:"Manufacturer"}, {key:"socket", label:"Socket"}, {key:"memoryType", label:"Tipe RAM"}, {key:"formFactor", label:"Form Factor"} ],
  ram: [ {key:"memoryType", label:"Tipe"}, {key:"capacity", label:"Kapasitas (GB)"}, {key:"speed", label:"Speed"} ],
  gpu: [ {key:"brand", label:"Manufacturer"}, {key:"series", label:"Generasi"}, {key:"vram", label:"VRAM (GB)"} ],
  storage: [ {key:"type", label:"Tipe"}, {key:"speedTier", label:"Kecepatan"} ],
  psu: [ {key:"wattage", label:"Daya (W)"}, {key:"rating", label:"Sertifikasi"} ],
  casing: [ {key:"formFactor", label:"Form Factor"} ],
  monitor: [ {key:"resolution", label:"Resolusi"}, {key:"refreshRate", label:"Refresh Rate (Hz)"} ],
};

function uniqueValues(cat, key){
  return [...new Set(catProducts(cat).map(p => p[key]))].sort((a,b)=> (a>b?1:-1));
}

function filteredProducts(cat){
  let list = catProducts(cat);
  const f = state.filters[cat];
  if(f.inStock) list = list.filter(p=>p.stock);
  FILTER_DEFS[cat].forEach(def=>{
    const set = f[def.key];
    if(set && set.size) list = list.filter(p => set.has(String(p[def.key])));
  });

  // Compatibility-aware sorting/highlighting handled in render (not hard filter),
  // except RAM <-> motherboard memory type, and monitor <-> GPU tier which we soft-flag.
  return list;
}

/* ---------- RENDER: NAV ---------- */
function renderNav(){
  const nav = $("#category-nav");
  nav.innerHTML = CATEGORY_LIST.map(c=>{
    const count = c.multi ? getMultiList(c.key).length : (state.single[c.key] ? 1 : 0);
    const active = c.key === state.activeCategory ? "active" : "";
    return `<button class="nav-item ${active}" data-cat="${c.key}">
      <span>${c.label}</span>
      ${count ? `<span class="nav-badge">${count}</span>` : ""}
    </button>`;
  }).join("");
  $$("#category-nav .nav-item").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.activeCategory = btn.dataset.cat;
      renderAll();
    });
  });
}

/* ---------- RENDER: FILTER SIDEBAR ---------- */
function renderFilters(){
  const cat = state.activeCategory;
  const panel = $("#filter-panel");
  const defs = FILTER_DEFS[cat];
  const f = state.filters[cat];

  panel.innerHTML = `
    <div class="filter-header">
      <span class="filter-title">Filters</span>
    </div>
    <label class="filter-instock">
      <input type="checkbox" id="f-instock" ${f.inStock ? "checked":""}/>
      In Stock
    </label>
    ${defs.map(def=>{
      const values = uniqueValues(cat, def.key);
      const set = f[def.key] || new Set();
      return `<div class="filter-section">
        <button class="filter-section-head" data-toggle="${def.key}">
          <span>${def.label}</span><span class="chev">⌃</span>
        </button>
        <div class="filter-section-body" data-body="${def.key}">
          ${values.map(v=>`
            <label class="filter-check">
              <input type="checkbox" data-filter-key="${def.key}" value="${v}" ${set.has(String(v)) ? "checked":""}/>
              ${v}
            </label>`).join("")}
        </div>
      </div>`;
    }).join("")}
  `;

  $("#f-instock").addEventListener("change", e=>{
    f.inStock = e.target.checked;
    renderGrid();
  });
  $$("#filter-panel [data-filter-key]").forEach(cb=>{
    cb.addEventListener("change", ()=>{
      const key = cb.dataset.filterKey;
      f[key] = f[key] || new Set();
      if(cb.checked) f[key].add(cb.value); else f[key].delete(cb.value);
      renderGrid();
    });
  });
  $$("#filter-panel .filter-section-head").forEach(head=>{
    head.addEventListener("click", ()=>{
      const body = panel.querySelector(`[data-body="${head.dataset.toggle}"]`);
      body.classList.toggle("collapsed");
      head.classList.toggle("collapsed");
    });
  });
}

/* ---------- RENDER: PRODUCT GRID ---------- */
function renderGrid(){
  const cat = state.activeCategory;
  const catDef = CATEGORY_LIST.find(c=>c.key===cat);
  const grid = $("#product-grid");
  const list = filteredProducts(cat);

  const cpu = getSelectedProduct("cpu");
  const mobo = getSelectedProduct("motherboard");
  const gpuList = getMultiList("gpu");
  const gpuTierMax = gpuList.length ? Math.max(...gpuList.map(g=>g.product.tier)) : null;

  $("#grid-title").textContent = catDef.label;
  $("#grid-count").textContent = `${list.length} produk`;

  if(!list.length){
    grid.innerHTML = `<div class="empty-state">Tidak ada produk yang cocok dengan filter ini.</div>`;
    return;
  }

  grid.innerHTML = list.map(p=>{
    let compatBadge = "";
    if(cat === "motherboard" && cpu){
      compatBadge = p.socket === cpu.socket
        ? `<span class="badge badge-ok">✓ Cocok dgn CPU</span>`
        : `<span class="badge badge-warn">Socket berbeda (${p.socket})</span>`;
    }
    if(cat === "ram" && mobo){
      compatBadge = p.memoryType === mobo.memoryType
        ? `<span class="badge badge-ok">✓ Cocok dgn Motherboard</span>`
        : `<span class="badge badge-warn">Bukan ${mobo.memoryType}</span>`;
    }
    if(cat === "casing" && mobo){
      compatBadge = p.supportedFormFactors.includes(mobo.formFactor)
        ? `<span class="badge badge-ok">✓ Muat Motherboard Anda</span>`
        : `<span class="badge badge-danger">Tidak muat (${mobo.formFactor})</span>`;
    }
    if(cat === "monitor" && gpuTierMax){
      compatBadge = p.minGpuTier <= gpuTierMax
        ? `<span class="badge badge-ok">✓ Direkomendasikan untuk GPU Anda</span>`
        : `<span class="badge badge-info">Cocok untuk GPU lebih tinggi</span>`;
    }

    const isMulti = catDef.multi;
    const selectedQty = isMulti ? (state.multi[cat][p.id] || 0) : (state.single[cat]===p.id ? 1 : 0);
    const stockBadge = p.stock ? "" : `<span class="badge badge-oos">Stok Habis</span>`;

    return `<div class="product-card ${selectedQty ? "selected":""}">
      <div class="product-top">
        <span class="product-brand">${p.brand}</span>
        ${stockBadge}
      </div>
      <div class="product-name">${p.name}</div>
      <div class="product-spec">${p.spec}</div>
      <div class="product-badges">${compatBadge}</div>
      <div class="product-actions">
        ${isMulti
          ? `<div class="qty-stepper">
               <button class="qty-btn" data-act="dec" data-id="${p.id}" ${!p.stock?"disabled":""}>−</button>
               <span class="qty-val">${selectedQty}</span>
               <button class="qty-btn" data-act="inc" data-id="${p.id}" ${!p.stock?"disabled":""}>+</button>
             </div>`
          : `<button class="select-btn ${selectedQty?"is-selected":""}" data-id="${p.id}" ${!p.stock?"disabled":""}>
               ${selectedQty ? "✓ Dipilih" : "Pilih"}
             </button>`
        }
      </div>
    </div>`;
  }).join("");

  if(catDef.multi){
    $$("#product-grid .qty-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.dataset.id;
        const p = byId(id);
        const cur = state.multi[cat][id] || 0;
        const max = p.qtyMax || 1;
        let next = btn.dataset.act === "inc" ? cur+1 : cur-1;
        next = Math.max(0, Math.min(max, next));
        state.multi[cat][id] = next;
        renderGrid();
        renderSummary();
        renderNav();
      });
    });
  } else {
    $$("#product-grid .select-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.dataset.id;
        state.single[cat] = state.single[cat] === id ? null : id;
        renderGrid();
        renderSummary();
        renderNav();
      });
    });
  }
}

/* ---------- RENDER: SUMMARY / BUILD SCORE ---------- */
function renderSummary(){
  const items = allSelectedItems();
  const listEl = $("#summary-list");

  if(!items.length){
    listEl.innerHTML = `<div class="empty-state small">Belum ada komponen dipilih.</div>`;
  } else {
    listEl.innerHTML = items.map(({product,qty})=>`
      <div class="summary-item">
        <div>
          <div class="summary-item-name">${product.name}</div>
          <div class="summary-item-spec">${product.spec}</div>
        </div>
        ${qty>1 ? `<span class="summary-qty">x${qty}</span>` : ""}
      </div>
    `).join("");
  }

  // compatibility checklist
  const { checks } = compatInfo();
  const compatEl = $("#compat-list");
  compatEl.innerHTML = checks.length ? checks.map(c=>`
    <div class="compat-row ${c.ok ? "ok":"bad"}">
      <span class="compat-icon">${c.ok ? "✓" : "!"}</span>
      <span>${c.label}</span>
    </div>
  `).join("") : `<div class="empty-state small">Pilih beberapa komponen untuk melihat cek kompatibilitas.</div>`;

  // score
  const result = calcBuildScore();
  const scoreWrap = $("#score-wrap");
  if(result.score === null){
    scoreWrap.innerHTML = `
      <div class="score-gauge score-empty">
        <span class="score-num">—</span>
      </div>
      <div class="score-label">${result.label}</div>
      <ul class="score-notes">${result.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
    `;
  } else {
    const deg = Math.round(result.score/100*360);
    scoreWrap.innerHTML = `
      <div class="score-gauge" style="--deg:0deg">
        <span class="score-num">0</span>
      </div>
      <div class="score-label">${result.label}</div>
      <ul class="score-notes">${result.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
      <p class="score-disclaimer">*Skor estimasi internal berdasarkan tingkatan komponen &amp; konvensi umum komunitas PC builder, bukan harga.</p>
    `;
    // animasi: gauge terisi + angka menghitung naik ke skor final
    const gaugeEl = scoreWrap.querySelector(".score-gauge");
    const numEl = scoreWrap.querySelector(".score-num");
    requestAnimationFrame(()=>{ gaugeEl.style.setProperty("--deg", deg + "deg"); });
    animateNumber(numEl, 0, result.score, 700);
  }

  // WA button state
  $("#wa-order-btn").disabled = items.length === 0;
}

/* ============================================================
   KIRIM KODE RAKITAN VIA EMAIL (EmailJS)
   ------------------------------------------------------------
   Situs statis tidak bisa kirim email sendiri, jadi dipakai
   EmailJS (https://www.emailjs.com — gratis s/d 200 email/bulan)
   yang mengirim email langsung dari browser pengguna.

   CARA SETUP (sekali saja):
   1. Daftar gratis di https://www.emailjs.com
   2. Email Services → Add New Service → hubungkan Gmail/Outlook
      toko Anda → salin "Service ID" (contoh: service_abc123)
   3. Email Templates → Create New Template. Isi:
        - To Email   : {{to_email}}
        - Subject    : Kode Rakitan PC Kamu - Xion Gaming
        - Content    : pakai variable {{build_code}}, {{build_summary}},
                        {{site_url}} di isi emailnya (boleh disusun bebas)
      Simpan → salin "Template ID" (contoh: template_xyz789)
   4. Account → General → salin "Public Key"
   5. Tempel ketiga nilai itu di EMAILJS_CONFIG di bawah ini.

   Selama EMAILJS_CONFIG belum diisi, tombol tetap berfungsi
   (kode tetap dibuat & tampil di layar + tersimpan di perangkat
   ini) — hanya bagian "kirim ke email" yang dilewati otomatis.
   ============================================================ */
const EMAILJS_CONFIG = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  templateId: "YOUR_EMAILJS_TEMPLATE_ID",
};

function isEmailJsConfigured(){
  return EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.publicKey.startsWith("YOUR_")
    && EMAILJS_CONFIG.serviceId && !EMAILJS_CONFIG.serviceId.startsWith("YOUR_")
    && EMAILJS_CONFIG.templateId && !EMAILJS_CONFIG.templateId.startsWith("YOUR_");
}

if(isEmailJsConfigured() && window.emailjs){
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
}

function buildEmailSummaryText(){
  return allSelectedItems()
    .map(({product,qty})=> `- ${product.name}${qty>1 ? ` (x${qty})` : ""}`)
    .join("\n");
}

async function sendBuildCodeEmail(email, code){
  if(!isEmailJsConfigured() || !window.emailjs){
    return { sent:false, reason:"not-configured" };
  }
  try{
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
      to_email: email,
      build_code: code,
      build_summary: buildEmailSummaryText(),
      site_url: window.location.origin + window.location.pathname.replace(/builder\.html$/, "") + "builder.html?code=" + encodeURIComponent(code),
    });
    return { sent:true };
  }catch(err){
    console.error("EmailJS error:", err);
    return { sent:false, reason:"send-failed" };
  }
}

/* ---------- WHATSAPP ORDER ---------- */
function buildWaMessage(){
  const items = allSelectedItems();
  const lines = ["Halo, saya mau tanya-tanya rakitan PC berikut:", ""];
  items.forEach(({product,qty})=>{
    lines.push(`- ${product.name}${qty>1 ? ` (x${qty})` : ""} — ${product.spec}`);
  });
  const result = calcBuildScore();
  if(result.score !== null){
    lines.push("", `Estimasi Build Score: ${result.score}/100 (${result.label})`);
  }
  lines.push("", "Mohon info harga & ketersediaan untuk rakitan ini ya, terima kasih!");
  if(items.length){
    lines.push("", `Kode Build (simpan untuk cek ulang nanti): ${generateBuildCode()}`);
  }
  return lines.join("\n");
}

/* ============================================================
   SIMPAN / MUAT RAKITAN VIA KODE
   ------------------------------------------------------------
   Situs ini statis (GitHub Pages, tanpa server/database), jadi
   "kode unik"-nya berisi rakitan itu sendiri (di-encode base64),
   BUKAN sekadar nomor referensi. Karena itu kode ini bisa dimuat
   ulang dari perangkat MANAPUN tanpa perlu server.
   Email yang diisi saat menyimpan hanya disimpan sebagai label
   lokal di browser ini (localStorage) & ikut ke pesan WhatsApp —
   bukan dipakai untuk pencarian lintas-perangkat, karena situs
   statis tidak punya tempat penyimpanan terpusat.
   ============================================================ */
const SAVED_BUILDS_KEY = "xion_saved_builds";

function toBase64Url(str){
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function fromBase64Url(b64){
  let s = b64.replace(/-/g,"+").replace(/_/g,"/");
  while(s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

function generateBuildCode(){
  const payload = { s: state.single, m: state.multi };
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
      if(id && byId(id)) single[cat] = id;
    });
    const multi = { ram:{}, gpu:{}, storage:{} };
    Object.entries(payload.m || {}).forEach(([cat,obj])=>{
      if(!multi[cat]) multi[cat] = {};
      Object.entries(obj || {}).forEach(([id,qty])=>{
        if(byId(id) && qty > 0) multi[cat][id] = qty;
      });
    });
    return { single, multi };
  } catch(e){
    return null;
  }
}

function applyDecodedBuild(decoded){
  state.single = decoded.single;
  state.multi = decoded.multi;
  renderAll();
}

function loadBuildFromCode(code){
  const decoded = decodeBuildCode(code);
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
  applyDecodedBuild(decoded);
  showToast("Rakitan berhasil dimuat ✓");
  return true;
}

function getSavedBuilds(){
  try{ return JSON.parse(localStorage.getItem(SAVED_BUILDS_KEY) || "[]"); }
  catch(e){ return []; }
}
function persistSavedBuilds(list){
  try{ localStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(list.slice(0,20))); }
  catch(e){ /* localStorage tidak tersedia, lanjut tanpa persist */ }
}
function addSavedBuildRecord(code, email){
  const list = getSavedBuilds().filter(r=>r.code!==code);
  list.unshift({ code, email: email || "", savedAt: Date.now() });
  persistSavedBuilds(list);
}
function removeSavedBuildRecord(code){
  persistSavedBuilds(getSavedBuilds().filter(r=>r.code!==code));
}

function renderSavedBuildsList(){
  const wrap = $("#saved-builds-list");
  if(!wrap) return;
  const list = getSavedBuilds();
  if(!list.length){ wrap.innerHTML = ""; return; }
  wrap.innerHTML = `<p class="saved-builds-title">Tersimpan di perangkat ini</p>` + list.map(r=>`
    <div class="saved-build-item">
      <button class="saved-build-load" data-code="${r.code}" type="button">
        <span class="sb-email">${r.email ? r.email : "(tanpa email)"}</span>
        <span class="sb-date">${new Date(r.savedAt).toLocaleDateString("id-ID")}</span>
      </button>
      <button class="saved-build-remove" data-code="${r.code}" type="button" aria-label="Hapus">✕</button>
    </div>
  `).join("");
  wrap.querySelectorAll(".saved-build-load").forEach(btn=>{
    btn.addEventListener("click", ()=> loadBuildFromCode(btn.dataset.code));
  });
  wrap.querySelectorAll(".saved-build-remove").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      removeSavedBuildRecord(btn.dataset.code);
      renderSavedBuildsList();
      showToast("Rakitan tersimpan dihapus dari perangkat ini");
    });
  });
}

/* ---------- Animasi angka menghitung naik (dipakai skor build) ---------- */
function animateNumber(el, from, to, duration){
  if(!el) return;
  const start = performance.now();
  function tick(now){
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(from + (to - from) * eased);
    if(progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Toast notifikasi ringan ---------- */
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

function initSaveLoad(){
  const saveBtn = $("#save-build-btn");
  const saveForm = $("#save-build-form");
  const saveConfirm = $("#save-build-confirm");
  const saveResult = $("#save-build-result");
  const codeOutput = $("#save-code-output");
  const copyBtn = $("#copy-code-btn");
  const emailInput = $("#save-email-input");

  if(saveBtn){
    saveBtn.addEventListener("click", ()=>{
      if(allSelectedItems().length === 0){
        showToast("Pilih minimal 1 komponen dulu.", "err");
        return;
      }
      saveForm.classList.toggle("hidden");
    });
  }

  if(saveConfirm){
    saveConfirm.addEventListener("click", async ()=>{
      const email = emailInput.value.trim();
      if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        showToast("Masukkan email yang valid dulu.", "err");
        return;
      }
      const code = generateBuildCode();
      addSavedBuildRecord(code, email);
      codeOutput.value = code;
      saveResult.classList.remove("hidden");
      saveForm.classList.add("hidden");
      renderSavedBuildsList();

      const resultHint = $("#save-result-hint");
      const originalLabel = saveConfirm.textContent;
      saveConfirm.disabled = true;
      saveConfirm.textContent = "Mengirim...";
      showToast("Membuat kode & mengirim ke email...");

      const result = await sendBuildCodeEmail(email, code);
      saveConfirm.disabled = false;
      saveConfirm.textContent = originalLabel;

      if(result.sent){
        showToast("Kode terkirim ke email kamu ✓");
        if(resultHint) resultHint.textContent = `Kode ini sudah dikirim ke ${email}. Masukkan lagi kapan saja di kolom "Muat Rakitan" untuk melanjutkan — dari perangkat manapun.`;
      } else if(result.reason === "not-configured"){
        showToast("Kode dibuat ✓ (pengiriman email belum di-setup admin)", "err");
        if(resultHint) resultHint.textContent = `Kode berhasil dibuat, tapi pengiriman otomatis ke email belum aktif di situs ini. Salin & simpan kode ini secara manual dulu.`;
      } else {
        showToast("Kode dibuat, tapi gagal terkirim ke email. Salin manual ya.", "err");
        if(resultHint) resultHint.textContent = `Kode berhasil dibuat, tapi pengiriman ke email gagal (cek koneksi/coba lagi). Salin & simpan kode ini secara manual dulu.`;
      }
    });
  }

  if(copyBtn){
    copyBtn.addEventListener("click", async ()=>{
      try{
        await navigator.clipboard.writeText(codeOutput.value);
        showToast("Kode disalin ke clipboard ✓");
      }catch(e){
        codeOutput.removeAttribute("readonly");
        codeOutput.select();
        document.execCommand("copy");
        codeOutput.setAttribute("readonly","");
        showToast("Kode disalin ✓");
      }
    });
  }

  [["#load-code-btn","#load-code-input"], ["#load-code-btn-top","#load-code-input-top"]].forEach(([btnSel,inputSel])=>{
    const btn = $(btnSel), input = $(inputSel);
    if(!btn || !input) return;
    btn.addEventListener("click", ()=>{
      if(!input.value.trim()){ showToast("Masukkan kode rakitan dulu.", "err"); return; }
      loadBuildFromCode(input.value.trim());
    });
    input.addEventListener("keydown", (e)=>{
      if(e.key === "Enter"){ e.preventDefault(); btn.click(); }
    });
  });

  renderSavedBuildsList();

  // auto-load kalau ada ?code=... di URL (dari link index.html atau dibagikan langsung)
  const urlCode = new URLSearchParams(window.location.search).get("code");
  if(urlCode){
    loadBuildFromCode(urlCode);
  }
}

function initWaButton(){
  $("#wa-order-btn").addEventListener("click", ()=>{
    const text = encodeURIComponent(buildWaMessage());
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  });
}

/* ---------- RESET ---------- */
function initResetButton(){
  $("#reset-btn").addEventListener("click", ()=>{
    if(!confirm("Reset semua pilihan komponen?")) return;
    state.single = {};
    state.multi = { ram:{}, gpu:{}, storage:{} };
    renderAll();
  });
}

/* ---------- INIT ---------- */
function renderAll(){
  renderNav();
  renderFilters();
  renderGrid();
  renderSummary();
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderAll();
  initWaButton();
  initResetButton();
  initSaveLoad();
});
