/* ============================================================
   XION GAMING — TESTIMONI MARQUEE
   ------------------------------------------------------------
   Menduplikasi isi #testimoniTrack satu kali (jadi 2x lipat).
   Animasi CSS geser track dari 0 ke -50% (lebar 1 set asli),
   begitu sampai -50% langsung "loncat" balik ke 0 — tapi karena
   set kedua adalah salinan persis set pertama, loncatannya tidak
   terlihat sama sekali (looping mulus/seamless).
   ============================================================ */
document.addEventListener("DOMContentLoaded", ()=>{
  const track = document.getElementById("testimoniTrack");
  if(!track) return;
  const originalCards = Array.from(track.children);
  originalCards.forEach(card=>{
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden","true"); // salinan cuma untuk visual loop, bukan konten baru
    track.appendChild(clone);
  });
});
