/* ============================================================
   XION GAMING — HALAMAN HASIL RAKITAN (hasil.html)
   ------------------------------------------------------------
   Halaman ini read-only: membaca ?code=XG1-... dari URL, decode
   pakai decodeBuildCode() dari js/build-shared.js, lalu tampilkan
   ulang rakitannya (komponen, cek kompatibilitas, build score).

   Tidak ada server/database di balik ini — semua data rakitan
   sudah "menempel" di kode/link itu sendiri, jadi halaman ini
   akan selalu bisa menampilkan rakitan yang sama kapan pun link
   dibuka, dari perangkat manapun.
   ============================================================ */

const WA_NUMBER = "6285814565849"; // samakan dengan js/app.js kalau diubah

const $ = sel => document.querySelector(sel);

function currentCodeFromUrl(){
  return new URLSearchParams(window.location.search).get("code");
}

function renderResultSummary(single, multi){
  const items = allItemsFrom(single, multi);
  const listEl = $("#result-summary-list");
  listEl.innerHTML = items.length
    ? items.map(({product,qty})=>`
        <div class="summary-item">
          <div>
            <div class="summary-item-name">${product.name}</div>
            <div class="summary-item-spec">${product.spec}</div>
          </div>
          ${qty>1 ? `<span class="summary-qty">x${qty}</span>` : ""}
        </div>
      `).join("")
    : `<div class="empty-state small">Rakitan ini tidak berisi komponen apa pun.</div>`;
}

function renderResultCompat(single, multi){
  const { checks } = compatInfoFrom(single, multi);
  const compatEl = $("#result-compat-list");
  compatEl.innerHTML = checks.length
    ? checks.map(c=>`
        <div class="compat-row ${c.ok ? "ok":"bad"}">
          <span class="compat-icon">${c.ok ? "✓" : "!"}</span>
          <span>${c.label}</span>
        </div>
      `).join("")
    : `<div class="empty-state small">Belum cukup komponen untuk cek kompatibilitas.</div>`;
}

function renderResultScore(single, multi){
  const result = calcBuildScoreFrom(single, multi);
  const scoreWrap = $("#result-score-wrap");
  if(result.score === null){
    scoreWrap.innerHTML = `
      <div class="score-gauge score-empty">
        <span class="score-num">—</span>
      </div>
      <div class="score-label">${result.label}</div>
      <ul class="score-notes">${result.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
    `;
    return;
  }
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

function buildResultWaMessage(single, multi, code){
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
  lines.push("", `Kode Build: ${code}`);
  return lines.join("\n");
}

function showEmptyState(){
  $("#result-view").classList.add("hidden");
  $("#result-empty").classList.remove("hidden");
}

function renderBuild(code, decoded){
  $("#result-empty").classList.add("hidden");
  const view = $("#result-view");
  view.classList.remove("hidden");

  $("#result-code-text").textContent = code;
  renderResultSummary(decoded.single, decoded.multi);
  renderResultCompat(decoded.single, decoded.multi);
  renderResultScore(decoded.single, decoded.multi);

  $("#result-edit-link").href = buildEditLink(code);

  const waBtn = $("#result-wa-btn");
  waBtn.onclick = ()=>{
    const text = encodeURIComponent(buildResultWaMessage(decoded.single, decoded.multi, code));
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  };

  const copyBtn = $("#result-copy-btn");
  copyBtn.onclick = async ()=>{
    try{
      await navigator.clipboard.writeText(code);
      copyBtn.textContent = "Tersalin ✓";
    }catch(e){
      // fallback lama untuk browser tanpa Clipboard API
      const tmp = document.createElement("textarea");
      tmp.value = code;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
      copyBtn.textContent = "Tersalin ✓";
    }
    setTimeout(()=>{ copyBtn.textContent = "Salin Kode"; }, 1800);
  };
}

function tryLoad(code){
  if(!code){ showEmptyState(); return; }
  const decoded = decodeBuildCode(code);
  if(!decoded){ showEmptyState(); return; }
  const totalParts = Object.keys(decoded.single).length +
    Object.values(decoded.multi).reduce((n,obj)=> n + Object.keys(obj).length, 0);
  if(totalParts === 0){ showEmptyState(); return; }
  renderBuild(code.trim(), decoded);
}

function initEmptyStateLoader(){
  const input = $("#result-load-input");
  const btn = $("#result-load-btn");
  if(!btn || !input) return;
  const go = ()=>{
    const code = input.value.trim();
    if(!code) return;
    // update URL supaya bisa di-refresh/dibagikan langsung dari sini
    const url = new URL(window.location.href);
    url.searchParams.set("code", code);
    window.history.replaceState({}, "", url);
    tryLoad(code);
  };
  btn.addEventListener("click", go);
  input.addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); go(); } });
}

document.addEventListener("DOMContentLoaded", ()=>{
  initEmptyStateLoader();
  tryLoad(currentCodeFromUrl());
});
