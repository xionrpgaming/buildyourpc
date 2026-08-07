/* ============================================================
   XION GAMING — KODE MEMBER "CEK PC SAYA" (shared)
   ------------------------------------------------------------
   Dipakai bareng oleh cek-pc.html dan admin-kode-member.html.

   PENTING — batasan jujur: situs ini statis (GitHub Pages, tanpa
   server/database), jadi kode member ini BUKAN sistem pembayaran/
   otentikasi yang aman. Kode cuma berisi { tier, kadaluarsa } yang
   di-encode base64 dan divalidasi di browser pengguna sendiri —
   sama seperti kode rakitan. Siapapun yang tahu formatnya bisa
   bikin kode sendiri. Ini murni sistem "modal percaya" seperti
   kebanyakan promo kode toko kecil, BUKAN pengganti sistem
   membership yang sungguh aman (yang butuh backend + payment
   gateway asli).

   Alur pemakaian:
     1) Pelanggan bayar manual (transfer/QRIS) ke admin via WA
     2) Admin buka admin-kode-member.html (tidak ditautkan di
        menu manapun — cuma dari alamatnya langsung), pilih tier
        & durasi, generate kode, kirim ke pelanggan
     3) Pelanggan tempel kode itu di cek-pc.html untuk naik limit
   ============================================================ */

const MEMBER_TIERS = [10, 50, 100];

function toBase64UrlM(str){
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function fromBase64UrlM(b64){
  let s = b64.replace(/-/g,"+").replace(/_/g,"/");
  while(s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

function encodeMemberCode(tier, days){
  const exp = new Date();
  exp.setDate(exp.getDate() + Number(days || 30));
  const payload = { t: Number(tier), e: exp.toISOString().slice(0,10) };
  return "XGM1-" + toBase64UrlM(JSON.stringify(payload));
}

/* Return { tier, exp } kalau valid & belum kadaluarsa, else null */
function decodeMemberCode(raw){
  try{
    const trimmed = String(raw).trim();
    if(!trimmed) return null;
    const body = trimmed.startsWith("XGM1-") ? trimmed.slice(5) : trimmed;
    const payload = JSON.parse(fromBase64UrlM(body));
    if(!payload || typeof payload !== "object") return null;
    const tier = Number(payload.t);
    const exp = String(payload.e || "");
    if(!MEMBER_TIERS.includes(tier)) return null;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(exp)) return null;

    const today = new Date().toISOString().slice(0,10);
    if(exp < today) return null; // sudah kadaluarsa

    return { tier, exp };
  } catch(e){
    return null;
  }
}

/* ---------- Simpan / baca kode member aktif di browser ini ---------- */
const MEMBER_STORAGE_KEY = "xion_member_v1";

function getActiveMembership(){
  try{
    const raw = localStorage.getItem(MEMBER_STORAGE_KEY);
    if(!raw) return null;
    const saved = JSON.parse(raw);
    const decoded = decodeMemberCode(saved.code);
    if(!decoded) { localStorage.removeItem(MEMBER_STORAGE_KEY); return null; }
    return { code: saved.code, tier: decoded.tier, exp: decoded.exp };
  } catch(e){
    return null;
  }
}

function saveActiveMembership(code){
  localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify({ code }));
}

/* ---------- Limit cek harian ---------- */
const USAGE_STORAGE_KEY = "xion_cekpc_usage_v1";
const FREE_DAILY_LIMIT = 1;

function todayStr(){ return new Date().toISOString().slice(0,10); }

function getDailyLimit(){
  const m = getActiveMembership();
  return m ? m.tier : FREE_DAILY_LIMIT;
}

function getUsageToday(){
  try{
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if(!saved || saved.date !== todayStr()) return 0;
    return Number(saved.count) || 0;
  } catch(e){
    return 0;
  }
}

function incrementUsageToday(){
  const count = getUsageToday() + 1;
  localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify({ date: todayStr(), count }));
  return count;
}

function getRemainingToday(){
  return Math.max(0, getDailyLimit() - getUsageToday());
}
