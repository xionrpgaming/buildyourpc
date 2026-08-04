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
  cpu: [ {key:"brand", label:"Manufacturer"}, {key:"socket", label:"Socket"} ],
  motherboard: [ {key:"brand", label:"Manufacturer"}, {key:"socket", label:"Socket"}, {key:"memoryType", label:"Tipe RAM"}, {key:"formFactor", label:"Form Factor"} ],
  ram: [ {key:"memoryType", label:"Tipe"}, {key:"capacity", label:"Kapasitas (GB)"} ],
  gpu: [ {key:"brand", label:"Manufacturer"}, {key:"vram", label:"VRAM (GB)"} ],
  storage: [ {key:"type", label:"Tipe"} ],
  psu: [ {key:"wattage", label:"Daya (W)"} ],
  casing: [ {key:"brand", label:"Manufacturer"} ],
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
      <div class="score-gauge" style="--deg:${deg}deg">
        <span class="score-num">${result.score}</span>
      </div>
      <div class="score-label">${result.label}</div>
      <ul class="score-notes">${result.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
      <p class="score-disclaimer">*Skor estimasi internal berdasarkan tingkatan komponen &amp; konvensi umum komunitas PC builder, bukan harga.</p>
    `;
  }

  // WA button state
  $("#wa-order-btn").disabled = items.length === 0;
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
  return lines.join("\n");
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
});
