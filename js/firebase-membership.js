/* ============================================================
   XION GAMING — FIREBASE MEMBERSHIP (shared)
   ------------------------------------------------------------
   Login Google + status membership "Cek PC Saya" tersimpan di
   Firestore (bukan lagi kode teks manual). Dipakai bareng oleh
   cek-pc.html (sisi pengguna) dan admin-membership.html (sisi
   admin, buat approve permintaan upgrade).

   WAJIB dimuat setelah SDK Firebase compat (firebase-app-compat,
   firebase-auth-compat, firebase-firestore-compat) via CDN, dan
   sebelum js/cekpc.js atau script admin.

   Struktur dokumen Firestore, koleksi "members", id dokumen =
   Firebase Auth UID pengguna:
     {
       email: "user@gmail.com",
       tier: 0 | 10 | 50 | 100,      // 0 = belum/bukan member
       expiresAt: "YYYY-MM-DD" | null,
       hasPending: true | false,
       pendingRequest: { tier: number, requestedAt: Timestamp } | null
     }

   Aturan keamanan (Firestore Rules) HARUS dipasang di Firebase
   Console supaya pengguna tidak bisa mengubah tier/expiresAt
   miliknya sendiri — lihat README bagian Firebase untuk teksnya.
   ============================================================ */

const ADMIN_EMAIL = "triplet.tapg@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyAbaTNl2PuxUxNXoorVMPLI1Bd9cW0Ngdo",
  authDomain: "xionrpgaming.firebaseapp.com",
  projectId: "xionrpgaming",
  storageBucket: "xionrpgaming.firebasestorage.app",
  messagingSenderId: "172620616496",
  appId: "1:172620616496:web:fe867f89fb75cf55262ef5",
  measurementId: "G-SBB0CTZR22"
};

const FIREBASE_READY = typeof firebase !== "undefined";

let fbAuth = null, fbDb = null, googleProvider = null;

if(FIREBASE_READY){
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  fbAuth = firebase.auth();
  fbDb = firebase.firestore();
  googleProvider = new firebase.auth.GoogleAuthProvider();
} else {
  console.warn("Firebase SDK gagal dimuat (mungkin diblokir adblocker/jaringan) — fitur login & membership dinonaktifkan, cek gratis tetap jalan.");
}

function signInWithGoogle(){
  if(!FIREBASE_READY) return Promise.reject(new Error("Login sedang tidak tersedia, coba refresh halaman."));
  return fbAuth.signInWithPopup(googleProvider);
}
function signOutUser(){
  if(!FIREBASE_READY) return Promise.resolve();
  return fbAuth.signOut();
}
function onAuthChange(callback){
  if(!FIREBASE_READY){ callback(null); return function(){}; }
  return fbAuth.onAuthStateChanged(callback);
}

/* Ambil dokumen member punya user ini; auto-buat kalau belum ada. */
async function ensureMemberDoc(user){
  const ref = fbDb.collection("members").doc(user.uid);
  const snap = await ref.get();
  if(!snap.exists){
    const fresh = {
      email: user.email,
      tier: 0,
      expiresAt: null,
      hasPending: false,
      pendingRequest: null
    };
    await ref.set(fresh);
    return fresh;
  }
  return snap.data();
}

async function getMemberDoc(uid){
  const snap = await fbDb.collection("members").doc(uid).get();
  return snap.exists ? snap.data() : null;
}

function isMembershipActive(memberDoc){
  if(!memberDoc || !memberDoc.tier || !memberDoc.expiresAt) return false;
  const today = new Date().toISOString().slice(0,10);
  return memberDoc.expiresAt >= today;
}

/* Ajukan permintaan upgrade — TIDAK langsung aktif, nunggu admin approve. */
async function requestMembershipUpgrade(uid, tier){
  await fbDb.collection("members").doc(uid).update({
    hasPending: true,
    pendingRequest: {
      tier: Number(tier),
      requestedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  });
}

/* ---------- Dashboard Pengunjung ---------- */

/* Dicatat sekali per page-load, TANPA perlu login (rules Firestore
   mengizinkan create anonim ke koleksi "visits", tapi cuma admin
   yang bisa baca/list-nya). Dipanggil dari js/visit-tracker.js di
   setiap halaman publik. */
function logPageVisit(pageName){
  if(!FIREBASE_READY) return;
  try{
    fbDb.collection("visits").add({
      page: pageName,
      ref: (document.referrer || "direct").slice(0,200),
      w: window.innerWidth,
      ts: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(()=>{});
  } catch(e){}
}

/* ---------- Khusus admin: baca statistik kunjungan ---------- */
function startOfDay(daysAgo){
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - (daysAgo || 0));
  return firebase.firestore.Timestamp.fromDate(d);
}

async function countVisits(query){
  const snap = await query.get();
  return snap.size !== undefined ? snap.size : (snap.docs ? snap.docs.length : 0);
}

async function getVisitStats(pages){
  const col = fbDb.collection("visits");
  const [total, today] = await Promise.all([
    countVisits(col),
    countVisits(col.where("ts", ">=", startOfDay(0))),
  ]);

  const perPage = {};
  await Promise.all(pages.map(async (pg)=>{
    perPage[pg] = await countVisits(col.where("page", "==", pg));
  }));

  const last7 = [];
  for(let i=6; i>=0; i--){
    const from = startOfDay(i);
    const to = startOfDay(i-1);
    const count = await countVisits(col.where("ts", ">=", from).where("ts", "<", to));
    last7.push({ daysAgo:i, count });
  }

  return { total, today, perPage, last7 };
}

/* ---------- Khusus admin: kelola permintaan membership ---------- */
async function listPendingMembers(){
  const q = await fbDb.collection("members").where("hasPending", "==", true).get();
  const out = [];
  q.forEach(doc => out.push({ id: doc.id, ...doc.data() }));
  return out;
}

async function approveMember(uid, tier, days){
  const exp = new Date();
  exp.setDate(exp.getDate() + Number(days || 30));
  await fbDb.collection("members").doc(uid).update({
    tier: Number(tier),
    expiresAt: exp.toISOString().slice(0,10),
    hasPending: false,
    pendingRequest: null
  });
}

async function rejectMember(uid){
  await fbDb.collection("members").doc(uid).update({
    hasPending: false,
    pendingRequest: null
  });
}
