/* ============================================================
   XION GAMING — BUILDER LOGIC
   Nomor WhatsApp toko sekarang didefinisikan satu kali di
   js/build-shared.js (const WA_NUMBER), supaya sama persis di
   builder.html & hasil.html.
   ============================================================ */

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
  SINGLE_CATEGORIES.forEach(cat=>{
    const p = getSelectedProduct(cat);
    if(p) items.push({ product:p, qty:1 });
  });
  ["ram","gpu","storage"].forEach(cat=>{
    items.push(...getMultiList(cat));
  });
  return items;
}

/* ---------- COMPATIBILITY ----------
   Logika sebenarnya sekarang ada di js/build-shared.js (versi
   parametrik compatInfoFrom), supaya bisa dipakai ulang persis
   sama di hasil.html. Fungsi ini cuma menyambungkan ke state
   builder yang sedang aktif. */
function compatInfo(){
  return compatInfoFrom(state.single, state.multi);
}

/* ---------- BUILD SCORE ----------
   Heuristik internal: skor dihitung dari tingkatan (tier 1-5) tiap
   komponen inti, keseimbangan CPU/GPU, dan kecukupan daya PSU.
   Ini BUKAN data real-time dari forum, melainkan bobot yang disusun
   mengikuti konvensi umum tier-list komunitas PC builder (CPU/GPU
   sekelas cenderung dipasangkan, PSU diberi headroom ±30%). Sesuaikan
   bobot di bawah bila Anda punya acuan benchmark sendiri. */
function calcBuildScore(){
  return calcBuildScoreFrom(state.single, state.multi);
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
   3. Email Templates → Create New Template. Isi "To Email" dengan
      {{to_email}}, lalu di isi/subject email pakai variable berikut
      (nama variabel harus PERSIS sama, isi & tata letak bebas):
        - {{build_code}}     kode rakitan, mis. XG1-eyJzIjp7...
        - {{build_summary}}  daftar komponen dalam teks biasa
        - {{result_link}}    link HALAMAN HASIL (hasil.html) — buka
                              kapan saja untuk lihat ulang rakitan
                              lengkap dgn cek kompatibilitas & skor.
                              Ini link utama yang ingin dibuka user.
        - {{edit_link}}      link ke builder.html untuk lanjut
                              mengedit rakitan yang sama (opsional)
      Contoh subject   : Rakitan PC Kamu Sudah Tersimpan — Xion Gaming
      Contoh isi (boleh HTML kalau pakai template editor visual):
        Kode rakitan kamu: {{build_code}}
        Lihat & simpan hasil rakitan kamu di sini:
        {{result_link}}
        (mau ubah lagi? buka: {{edit_link}})
      Simpan → salin "Template ID" (contoh: template_xyz789)
   4. Account → General → salin "Public Key"
   5. Tempel ketiga nilai itu di EMAILJS_CONFIG di bawah ini.

   Selama EMAILJS_CONFIG belum diisi, tombol tetap berfungsi
   (kode tetap dibuat & tampil di layar + tersimpan di perangkat
   ini) — hanya bagian "kirim ke email" yang dilewati otomatis.
   ============================================================ */
const EMAILJS_CONFIG = {
  publicKey: "zlMzDLlY5Z7ITM535",
  serviceId: "service_6zzzr19",
  templateId: "template_nsytfw3",
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
      result_link: buildResultLink(code),
      edit_link: buildEditLink(code),
    });
    return { sent:true };
  }catch(err){
    console.error("EmailJS error:", err);
    return { sent:false, reason:"send-failed" };
  }
}

/* ---------- WHATSAPP ORDER ----------
   Logika pesan sekarang ada di buildWaMessageFrom() di
   js/build-shared.js, supaya sama persis dipakai di hasil.html. */
function buildWaMessage(){
  return buildWaMessageFrom(state.single, state.multi);
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

/* toBase64Url / fromBase64Url / encodeBuildCode / decodeBuildCode
   sekarang ada di js/build-shared.js (dipakai bareng hasil.html).
   generateBuildCode() di sini cuma menyambungkan ke state aktif. */
function generateBuildCode(){
  return encodeBuildCode(state.single, state.multi);
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
  const resultLinkEl = $("#save-result-link");

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
      if(resultLinkEl) resultLinkEl.href = buildResultLink(code);
      saveResult.classList.remove("hidden");
      saveForm.classList.add("hidden");
      renderSavedBuildsList();

      // Buka halaman hasil rakitan secara otomatis di tab baru —
      // tidak menunggu status pengiriman email, supaya pengguna
      // langsung lihat hasilnya begitu klik simpan.
      window.open(buildResultLink(code), "_blank");

      const resultHint = $("#save-result-hint");
      const originalLabel = saveConfirm.textContent;
      saveConfirm.disabled = true;
      saveConfirm.textContent = "Mengirim...";
      showToast("Halaman hasil dibuka di tab baru — mengirim kode ke email...");

      const result = await sendBuildCodeEmail(email, code);
      saveConfirm.disabled = false;
      saveConfirm.textContent = originalLabel;

      if(result.sent){
        showToast("Kode & link hasil terkirim ke email kamu ✓");
        if(resultHint) resultHint.textContent = `Kode dan link halaman hasil sudah dikirim ke ${email}. Buka link itu kapan saja untuk lihat ulang rakitan ini, atau masukkan kodenya lagi di kolom "Muat Rakitan" — dari perangkat manapun.`;
      } else if(result.reason === "not-configured"){
        showToast("Kode dibuat ✓ (pengiriman email belum di-setup admin)", "err");
        if(resultHint) resultHint.textContent = `Kode & halaman hasil berhasil dibuat, tapi pengiriman otomatis ke email belum aktif di situs ini. Salin kode atau buka "Buka Halaman Hasil" di bawah untuk simpan link-nya secara manual.`;
      } else {
        showToast("Kode dibuat, tapi gagal terkirim ke email. Salin manual ya.", "err");
        if(resultHint) resultHint.textContent = `Kode & halaman hasil berhasil dibuat, tapi pengiriman ke email gagal (cek koneksi/coba lagi). Salin kode atau buka "Buka Halaman Hasil" di bawah untuk simpan link-nya secara manual.`;
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
  refreshAllPickerRows();
  renderSummary();
}

document.addEventListener("DOMContentLoaded", ()=>{
  initPickers();
  renderSummary();
  initWaButton();
  initResetButton();
  initSaveLoad();
});
