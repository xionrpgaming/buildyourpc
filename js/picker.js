/* ============================================================
   XION GAMING — PICKER (dropdown pencarian per kategori)
   ------------------------------------------------------------
   Menggantikan UI grid+filter lama dengan dropdown yang bisa
   dicari, satu baris per kategori. Tetap memakai state.single /
   state.multi yang sama (didefinisikan di js/app.js) supaya
   semua logika kompatibilitas, Build Score, kode rakitan, dan
   pesan WhatsApp di build-shared.js tidak perlu diubah sama
   sekali — cuma cara MEMILIH komponennya yang berubah.

   WAJIB dimuat setelah js/app.js (butuh `state`, `byId`, dll)
   dan sebelum akhir body / DOMContentLoaded lain yang manggil
   renderSummary().
   ============================================================ */

let openPickerCat = null; // kategori dropdown yang lagi kebuka, biar bisa auto-close yang lain
let selectedPlatform = null; // null | "AMD" | "Intel" — dipilih dari toggle di atas

const MOBO_SOCKET_PLATFORM = {
  AM4:"AMD", AM5:"AMD", sTR5:"AMD",
  LGA1150:"Intel", LGA1151:"Intel", LGA1200:"Intel", LGA1700:"Intel", LGA1851:"Intel",
};

/* Daftar produk kategori, sudah disaring platform AMD/Intel untuk
   CPU & Motherboard kalau platform lagi dipilih. Kategori lain
   tidak terpengaruh platform. */
function catProductsFiltered(cat){
  let list = catProducts(cat);
  if(cat === "cpu"){
    if(selectedPlatform) list = list.filter(p => p.brand === selectedPlatform);
    const mobo = getSelectedProduct("motherboard");
    if(mobo) list = list.filter(p => p.socket === mobo.socket);
  } else if(cat === "motherboard"){
    if(selectedPlatform) list = list.filter(p => MOBO_SOCKET_PLATFORM[p.socket] === selectedPlatform);
    const cpu = getSelectedProduct("cpu");
    if(cpu) list = list.filter(p => p.socket === cpu.socket);
  }
  return list;
}

function setPlatform(platform){
  selectedPlatform = platform || null;

  document.querySelectorAll(".platform-btn").forEach(btn=>{
    btn.classList.toggle("active", (btn.dataset.platform || null) === selectedPlatform);
  });

  // kalau CPU/motherboard yang sudah dipilih jadi tidak sesuai platform baru, kosongkan
  if(selectedPlatform){
    const cpu = getSelectedProduct("cpu");
    if(cpu && cpu.brand !== selectedPlatform) state.single.cpu = null;
    const mobo = getSelectedProduct("motherboard");
    if(mobo && MOBO_SOCKET_PLATFORM[mobo.socket] !== selectedPlatform) state.single.motherboard = null;
  }

  if(openPickerCat === "cpu" || openPickerCat === "motherboard") closePicker(openPickerCat);
  refreshPickerRow("cpu");
  refreshPickerRow("motherboard");
  renderSummary();
}

/* Gabungan semua field teks/angka produk (nama, brand, spec, socket,
   tipe RAM, form factor, resolusi, dst) jadi satu string lowercase,
   supaya pencarian bisa nemu produk lewat atribut apapun — bukan
   cuma nama/brand/spec. Di-cache per produk (objek sama = hasil sama). */
const _searchHaystackCache = new WeakMap();
function productSearchHaystack(p){
  if(_searchHaystackCache.has(p)) return _searchHaystackCache.get(p);
  const skip = new Set(["id","category","tier","stock","qtyMax"]);
  const parts = Object.entries(p)
    .filter(([k,v]) => !skip.has(k) && (typeof v === "string" || typeof v === "number"))
    .map(([,v]) => String(v));
  const haystack = parts.join(" ").toLowerCase();
  _searchHaystackCache.set(p, haystack);
  return haystack;
}

function compatBadgeFor(cat, p){
  const cpu = getSelectedProduct("cpu");
  const mobo = getSelectedProduct("motherboard");
  const gpuList = getMultiList("gpu");
  const gpuTierMax = gpuList.length ? Math.max(...gpuList.map(g=>g.product.tier)) : null;

  if(cat === "motherboard" && cpu){
    return p.socket === cpu.socket
      ? `<span class="picker-badge ok">✓ Cocok CPU</span>`
      : `<span class="picker-badge warn">Socket ${p.socket}</span>`;
  }
  if(cat === "ram" && mobo){
    return p.memoryType === mobo.memoryType
      ? `<span class="picker-badge ok">✓ Cocok Motherboard</span>`
      : `<span class="picker-badge warn">Bukan ${mobo.memoryType}</span>`;
  }
  if(cat === "casing" && mobo){
    return p.supportedFormFactors.includes(mobo.formFactor)
      ? `<span class="picker-badge ok">✓ Muat Motherboard</span>`
      : `<span class="picker-badge bad">Tidak muat (${mobo.formFactor})</span>`;
  }
  if(cat === "monitor" && gpuTierMax){
    return p.minGpuTier <= gpuTierMax
      ? `<span class="picker-badge ok">✓ Cocok VGA Anda</span>`
      : `<span class="picker-badge info">Untuk VGA lebih tinggi</span>`;
  }
  return "";
}

function pickerRowLabelText(catDef){
  const cat = catDef.key;
  if(catDef.multi){
    const list = getMultiList(cat);
    if(!list.length) return `— Pilih ${catDef.label} —`;
    const totalQty = list.reduce((s,i)=>s+i.qty,0);
    return `${list.length} produk dipilih (${totalQty} unit)`;
  }
  const p = getSelectedProduct(cat);
  return p ? p.name : `— Pilih ${catDef.label} —`;
}

function renderPickerList(cat, searchTerm, animate){
  const catDef = CATEGORY_LIST.find(c=>c.key===cat);
  const term = (searchTerm||"").trim().toLowerCase();
  let list = catProductsFiltered(cat);
  if(term){
    list = list.filter(p => productSearchHaystack(p).includes(term));
  }
  // urutkan: tier naik lalu nama
  list = list.slice().sort((a,b)=> a.tier - b.tier || a.name.localeCompare(b.name));

  const listEl = document.querySelector(`.picker-row[data-cat="${cat}"] .picker-list`);
  if(!listEl) return;

  if(!list.length){
    listEl.innerHTML = `<div class="picker-empty">Tidak ada produk yang cocok.</div>`;
    return;
  }

  const selectedId = catDef.multi ? null : state.single[cat];
  const multiState = catDef.multi ? (state.multi[cat] || {}) : null;

  listEl.innerHTML = list.map((p, i) => {
    const isSelected = catDef.multi ? (multiState[p.id] > 0) : (selectedId === p.id);
    const badge = compatBadgeFor(cat, p);
    const oos = !p.stock;
    const animStyle = animate ? `style="--i:${Math.min(i,10)}"` : `style="animation:none"`;
    return `
      <button type="button" class="picker-list-item ${isSelected ? "selected":""} ${oos ? "oos":""}"
        data-id="${p.id}" data-cat="${cat}" ${animStyle} ${oos ? "disabled":""}>
        <span class="picker-item-main">
          <span class="picker-item-name">${p.name}${isSelected ? ' <span class="picker-item-check">✓</span>' : ""}</span>
          <span class="picker-item-spec">${p.brand} · ${p.spec}</span>
        </span>
        <span class="picker-item-side">
          ${badge}
          ${oos ? '<span class="picker-badge bad">Stok Habis</span>' : ""}
          ${catDef.multi && multiState[p.id] > 0 ? `<span class="picker-item-qty">x${multiState[p.id]}</span>` : ""}
        </span>
      </button>
    `;
  }).join("");

  listEl.querySelectorAll(".picker-list-item").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if(btn.disabled) return;
      const id = btn.dataset.id;
      if(catDef.multi){
        const cur = state.multi[cat][id] || 0;
        const p = byId(id);
        const max = p.qtyMax || 4;
        state.multi[cat][id] = Math.min(max, cur + 1);
        renderPickerList(cat, searchTerm, false); // tetap terbuka, refresh tanpa animasi ulang
        refreshPickerRow(cat);
        renderChips(cat);
      } else {
        state.single[cat] = id;
        closePicker(cat);
        refreshPickerRow(cat);

        // CPU <-> Motherboard saling terkait socket-nya secara ketat
        if(cat === "cpu"){
          const mobo = getSelectedProduct("motherboard");
          if(mobo && mobo.socket !== byId(id).socket) state.single.motherboard = null;
          refreshPickerRow("motherboard");
        } else if(cat === "motherboard"){
          const cpu = getSelectedProduct("cpu");
          if(cpu && cpu.socket !== byId(id).socket) state.single.cpu = null;
          refreshPickerRow("cpu");
        }
      }
      renderSummary();
      refreshAllCompatBadgesSoftly();
    });
  });
}

/* Kategori lain yang badge-nya bisa berubah gara-gara pilihan kategori ini
   (misal ganti motherboard -> badge di baris RAM & Casing perlu di-refresh
   kalau baris itu sedang terbuka). Cukup murah untuk re-render kalau lagi open. */
function refreshAllCompatBadgesSoftly(){
  if(openPickerCat){
    const input = document.querySelector(`.picker-row[data-cat="${openPickerCat}"] .picker-search`);
    renderPickerList(openPickerCat, input ? input.value : "", false);
  }
}

function renderChips(cat){
  const catDef = CATEGORY_LIST.find(c=>c.key===cat);
  if(!catDef.multi) return;
  const chipsEl = document.querySelector(`.picker-row[data-cat="${cat}"] .picker-chips`);
  if(!chipsEl) return;
  const list = getMultiList(cat);
  if(!list.length){ chipsEl.innerHTML = ""; return; }
  chipsEl.innerHTML = list.map(({product,qty})=>`
    <span class="picker-chip">
      <span class="picker-chip-name">${product.name}</span>
      <span class="picker-chip-qty">
        <button type="button" class="picker-chip-btn" data-act="dec" data-id="${product.id}" data-cat="${cat}">−</button>
        <span>${qty}</span>
        <button type="button" class="picker-chip-btn" data-act="inc" data-id="${product.id}" data-cat="${cat}">+</button>
      </span>
      <button type="button" class="picker-chip-remove" data-id="${product.id}" data-cat="${cat}" aria-label="Hapus">✕</button>
    </span>
  `).join("");

  chipsEl.querySelectorAll(".picker-chip-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id, c = btn.dataset.cat;
      const p = byId(id);
      const cur = state.multi[c][id] || 0;
      const max = p.qtyMax || 4;
      let next = btn.dataset.act === "inc" ? cur+1 : cur-1;
      next = Math.max(0, Math.min(max, next));
      state.multi[c][id] = next;
      renderChips(c);
      refreshPickerRow(c);
      refreshAllCompatBadgesSoftly();
      renderSummary();
    });
  });
  chipsEl.querySelectorAll(".picker-chip-remove").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id, c = btn.dataset.cat;
      delete state.multi[c][id];
      renderChips(c);
      refreshPickerRow(c);
      refreshAllCompatBadgesSoftly();
      renderSummary();
    });
  });
}

function refreshPickerRow(cat){
  const catDef = CATEGORY_LIST.find(c=>c.key===cat);
  const row = document.querySelector(`.picker-row[data-cat="${cat}"]`);
  if(!row) return;
  const triggerText = row.querySelector(".picker-trigger-text");
  triggerText.textContent = pickerRowLabelText(catDef);

  const filterHint = row.querySelector(".picker-row-filter-hint");
  if(filterHint){
    let hintText = "";
    if(cat === "cpu"){
      const mobo = getSelectedProduct("motherboard");
      if(mobo) hintText = `disaring: socket ${mobo.socket}`;
      else if(selectedPlatform) hintText = `disaring: ${selectedPlatform}`;
    } else if(cat === "motherboard"){
      const cpu = getSelectedProduct("cpu");
      if(cpu) hintText = `disaring: socket ${cpu.socket}`;
      else if(selectedPlatform) hintText = `disaring: ${selectedPlatform}`;
    }
    filterHint.textContent = hintText;
    filterHint.classList.toggle("hidden", !hintText);
  }

  const filled = catDef.multi ? getMultiList(cat).length > 0 : !!state.single[cat];
  row.classList.toggle("filled", filled);

  const clearBtn = row.querySelector(".picker-clear-btn");
  if(clearBtn) clearBtn.classList.toggle("hidden", catDef.multi || !state.single[cat]);
}

function openPicker(cat){
  if(openPickerCat && openPickerCat !== cat) closePicker(openPickerCat);
  const row = document.querySelector(`.picker-row[data-cat="${cat}"]`);
  row.classList.add("open");
  openPickerCat = cat;
  renderPickerList(cat, "", true);
  const search = row.querySelector(".picker-search");
  search.value = "";
  requestAnimationFrame(()=> search.focus());
}
function closePicker(cat){
  const row = document.querySelector(`.picker-row[data-cat="${cat}"]`);
  if(row) row.classList.remove("open");
  if(openPickerCat === cat) openPickerCat = null;
}

function buildPickerRowHtml(catDef){
  const icon = CATEGORY_ICONS[catDef.key] || "•";
  return `
    <div class="picker-row" data-cat="${catDef.key}">
      <div class="picker-row-head">
        <span class="picker-row-icon" aria-hidden="true">${icon}</span>
        <span class="picker-row-label">${catDef.label}</span>
        <span class="picker-row-filter-hint hidden"></span>
        <span class="picker-row-check" aria-hidden="true">✓</span>
      </div>
      <div class="picker-combo">
        <button type="button" class="picker-trigger">
          <span class="picker-trigger-text">— Pilih ${catDef.label} —</span>
          <button type="button" class="picker-clear-btn hidden" aria-label="Hapus pilihan">✕</button>
          <svg class="picker-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="picker-panel">
          <input type="text" class="picker-search" placeholder="Cari ${catDef.label.toLowerCase()}...">
          <div class="picker-list"></div>
        </div>
      </div>
      <div class="picker-chips"></div>
    </div>
  `;
}

function initPickers(){
  document.querySelectorAll(".platform-btn").forEach(btn=>{
    btn.addEventListener("click", ()=> setPlatform(btn.dataset.platform || null));
  });

  const intiWrap = document.getElementById("picker-rows-inti");
  const aksWrap = document.getElementById("picker-rows-aksesoris");

  intiWrap.innerHTML = CATEGORY_LIST.filter(c=>c.group==="inti").map(buildPickerRowHtml).join("");
  aksWrap.innerHTML = CATEGORY_LIST.filter(c=>c.group==="aksesoris").map(buildPickerRowHtml).join("");

  CATEGORY_LIST.forEach(catDef=>{
    const cat = catDef.key;
    const row = document.querySelector(`.picker-row[data-cat="${cat}"]`);
    const trigger = row.querySelector(".picker-trigger");
    const search = row.querySelector(".picker-search");
    const clearBtn = row.querySelector(".picker-clear-btn");

    trigger.addEventListener("click", (e)=>{
      if(e.target.closest(".picker-clear-btn")) return;
      if(row.classList.contains("open")) closePicker(cat);
      else openPicker(cat);
    });
    search.addEventListener("input", ()=> renderPickerList(cat, search.value, false));
    search.addEventListener("click", e=> e.stopPropagation());
    search.addEventListener("keydown", e=>{ if(e.key === "Escape") closePicker(cat); });

    if(clearBtn){
      clearBtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        state.single[cat] = null;
        refreshPickerRow(cat);
        if(cat === "cpu") refreshPickerRow("motherboard");
        if(cat === "motherboard") refreshPickerRow("cpu");
        renderSummary();
        refreshAllCompatBadgesSoftly();
      });
    }

    renderChips(cat);
    refreshPickerRow(cat);
  });

  // klik di luar dropdown manapun -> tutup
  // (pakai composedPath, bukan e.target.closest, karena e.target bisa
  // "terlepas" dari DOM kalau list di-render ulang di tengah event ini)
  document.addEventListener("click", (e)=>{
    if(!openPickerCat) return;
    const path = e.composedPath();
    const stillInsideOpenRow = path.some(el =>
      el.classList && el.classList.contains("picker-row") && el.dataset.cat === openPickerCat
    );
    if(!stillInsideOpenRow) closePicker(openPickerCat);
  });
}

/* Dipanggil ulang setelah kode rakitan dimuat / reset, supaya semua
   baris dropdown (teks trigger, chip, badge) sinkron dengan state baru. */
function refreshAllPickerRows(){
  if(!selectedPlatform){
    const cpu = getSelectedProduct("cpu");
    if(cpu) setPlatform(cpu.brand);
  }
  CATEGORY_LIST.forEach(catDef=>{
    refreshPickerRow(catDef.key);
    if(catDef.multi) renderChips(catDef.key);
  });
}
