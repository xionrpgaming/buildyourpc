/**
 * XION GAMING — Builder logic
 * Semua berjalan di browser (tanpa backend). Pilihan disimpan
 * di localStorage supaya tidak hilang saat reload halaman.
 */
(function () {
  "use strict";

  const WA_NUMBER = "6285814565849"; // format internasional, tanpa "+" atau "0" di depan
  const STORAGE_KEY = "xion_build_v1";

  const formatRupiah = (n) =>
    "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

  // ---- state ----
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage tidak tersedia, lanjut tanpa persist */
    }
  }

  let selected = loadState(); // { [categoryKey]: productId }
  let activeCat = "cpu";

  // cat dari query string ?cat=gpu
  const params = new URLSearchParams(window.location.search);
  if (params.get("cat") && XION_CATEGORIES.some((c) => c.key === params.get("cat"))) {
    activeCat = params.get("cat");
  }

  // ---- render: tabs kategori ----
  const catTabsEl = document.getElementById("catTabs");
  function renderTabs() {
    if (!catTabsEl) return;
    catTabsEl.innerHTML = XION_CATEGORIES.map((cat) => {
      const isDone = !!selected[cat.key];
      const isActive = cat.key === activeCat;
      return `
        <button type="button"
          class="cat-tab ${isActive ? "is-active" : ""} ${isDone && !isActive ? "done" : ""}"
          data-cat="${cat.key}">
          <span class="icon"><svg><use href="#ic-${cat.icon === "motherboard" ? "mobo" : cat.icon === "casing" ? "case" : cat.icon}"/></svg></span>
          ${cat.label}
          ${isDone ? '<svg width="12" height="12"><use href="#ic-check"/></svg>' : ""}
        </button>
      `;
    }).join("");

    catTabsEl.querySelectorAll(".cat-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCat = btn.dataset.cat;
        renderTabs();
        renderProducts();
      });
    });
  }

  // ---- render: grid produk untuk kategori aktif ----
  const productGridEl = document.getElementById("productGrid");
  function renderProducts() {
    if (!productGridEl) return;
    const items = XION_PRODUCTS.filter((p) => p.category === activeCat);
    productGridEl.innerHTML = items
      .map((p) => {
        const isSelected = selected[activeCat] === p.id;
        return `
          <article class="product-card ${isSelected ? "is-selected" : ""}">
            <h4>${p.name}</h4>
            <p class="spec">${p.spec}</p>
            <p class="price">${formatRupiah(p.price)}</p>
            <button type="button" class="btn-pick" data-id="${p.id}">
              ${isSelected ? "✓ Terpilih" : "Pilih"}
            </button>
          </article>
        `;
      })
      .join("");

    productGridEl.querySelectorAll(".btn-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (selected[activeCat] === id) {
          delete selected[activeCat]; // klik lagi buat batalkan pilihan
        } else {
          selected[activeCat] = id;
        }
        saveState(selected);
        renderTabs();
        renderProducts();
        renderSummary();
      });
    });
  }

  // ---- render: ringkasan build + power meter + total + link WA ----
  const summaryListEl = document.getElementById("summaryList");
  const summaryTotalEl = document.getElementById("summaryTotal");
  const summarySubEl = document.getElementById("summarySub");
  const powerMeterEl = document.getElementById("powerMeter");
  const btnOrderEl = document.getElementById("btnOrder");

  function findProduct(id) {
    return XION_PRODUCTS.find((p) => p.id === id);
  }

  function renderSummary() {
    const filledCount = XION_CATEGORIES.filter((c) => selected[c.key]).length;

    // power meter
    if (powerMeterEl) {
      powerMeterEl.innerHTML = XION_CATEGORIES.map((c) => {
        const lit = !!selected[c.key];
        return `<i class="${lit ? "lit" : ""}"></i>`;
      }).join("");
    }
    if (summarySubEl) {
      summarySubEl.textContent = `${filledCount} dari ${XION_CATEGORIES.length} kategori terisi`;
    }

    // list
    let total = 0;
    if (summaryListEl) {
      summaryListEl.innerHTML = XION_CATEGORIES.map((cat) => {
        const pid = selected[cat.key];
        const product = pid ? findProduct(pid) : null;
        if (product) total += product.price;
        return `
          <div class="summary-row">
            <div>
              <span class="cat-label">${cat.label}</span>
              ${
                product
                  ? `<span class="name">${product.name}</span>`
                  : `<span class="empty">Belum dipilih</span>`
              }
            </div>
            ${
              product
                ? `<div style="display:flex;align-items:center;">
                     <span class="row-price">${formatRupiah(product.price)}</span>
                     <button type="button" class="remove" data-cat="${cat.key}" aria-label="Hapus ${cat.label}">
                       <svg width="14" height="14"><use href="#ic-x"/></svg>
                     </button>
                   </div>`
                : ""
            }
          </div>
        `;
      }).join("");

      summaryListEl.querySelectorAll(".remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          delete selected[btn.dataset.cat];
          saveState(selected);
          renderTabs();
          renderProducts();
          renderSummary();
        });
      });
    }

    if (summaryTotalEl) summaryTotalEl.textContent = formatRupiah(total);

    // tombol WhatsApp
    if (btnOrderEl) {
      if (filledCount === 0) {
        btnOrderEl.setAttribute("aria-disabled", "true");
        btnOrderEl.href = "#";
      } else {
        btnOrderEl.removeAttribute("aria-disabled");
        btnOrderEl.href = buildWhatsAppLink(total);
        btnOrderEl.target = "_blank";
        btnOrderEl.rel = "noopener";
      }
    }
  }

  function buildWhatsAppLink(total) {
    const lines = ["Halo Xion Gaming, saya mau pesan rakitan PC berikut:", ""];
    XION_CATEGORIES.forEach((cat) => {
      const pid = selected[cat.key];
      const product = pid ? findProduct(pid) : null;
      if (product) {
        lines.push(`- ${cat.label}: ${product.name} (${formatRupiah(product.price)})`);
      }
    });
    lines.push("", `Total: ${formatRupiah(total)}`, "", "Mohon info ketersediaan & ongkirnya, terima kasih.");
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  }

  // ---- mobile bottom-sheet toggle ----
  const dragHandle = document.getElementById("dragHandle");
  const buildSummaryEl = document.getElementById("buildSummary");
  if (dragHandle && buildSummaryEl) {
    dragHandle.addEventListener("click", () => {
      buildSummaryEl.classList.toggle("is-open");
    });
  }

  // ---- init ----
  renderTabs();
  renderProducts();
  renderSummary();
})();
