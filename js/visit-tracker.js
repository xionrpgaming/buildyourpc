/* ============================================================
   XION GAMING — VISIT TRACKER
   ------------------------------------------------------------
   Dimuat di setiap halaman publik (index, builder, cek-pc, hasil).
   Cukup catat 1 dokumen ke Firestore koleksi "visits" tiap kali
   halaman dibuka — tanpa perlu pengguna login. Datanya cuma bisa
   dibaca lagi oleh admin lewat admin-analytics.html.

   WAJIB dimuat setelah SDK Firebase + js/firebase-membership.js.
   ============================================================ */
(function(){
  const page = document.body.getAttribute("data-page") || location.pathname.split("/").pop() || "index.html";
  if(typeof logPageVisit === "function"){
    logPageVisit(page);
  }
})();
