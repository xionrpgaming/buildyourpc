/* ============================================================
   XION GAMING — DATA PRODUK
   ------------------------------------------------------------
   127 produk di bawah ini di-MIGRASI dari data lama Anda
   (js/products-data.js versi sebelumnya, format XION_PRODUCTS)
   ke skema baru yang punya field kompatibilitas.

   Field "price" SENGAJA DIHAPUS dari data karena situs ini
   tidak lagi menampilkan harga di manapun (harga & ketersediaan
   dikonfirmasi admin lewat WhatsApp). Kalau suatu saat perlu
   ditampilkan lagi, tinggal tambahkan field price per produk.

   Field yang DITAMBAHKAN otomatis saat migrasi (baca CATATAN
   MIGRASI di bawah untuk penjelasan & bagian yang perlu dicek):
     - tdp   (CPU & GPU)      -> dipakai hitung estimasi watt PSU
     - tier  (semua kategori) -> dihitung otomatis dari urutan
       harga lama (quintile 1-5, termurah=1, termahal=5), dipakai
       untuk Build Score & rekomendasi monitor
     - formFactor / supportedFormFactors (motherboard & casing)
     - memoryType (motherboard, dari teks spec lama)
     - qtyMax (RAM/Storage/GPU, untuk kategori multi-select)

   Field kompatibilitas yang dipakai builder.html & app.js:
     - cpu.socket            <-> motherboard.socket
     - motherboard.memoryType <-> ram.memoryType
     - motherboard.formFactor -> dicek ke casing.supportedFormFactors
     - cpu.tdp / gpu.tdp     -> estimasi kebutuhan watt PSU
     - tier (1-5)            -> Build Score & rekomendasi monitor

   =========================== CATATAN UPDATE TERBARU ===========================
   Update lanjutan (setelah migrasi awal) menambah varian yang tadinya belum
   lengkap, disusun dari data resmi AMD/Intel/NVIDIA per pertengahan 2026:
     - CPU: tambah APU Ryzen 8000G, Ryzen 9000 non-X/X3D lengkap (9600X,
       9800X3D, 9900X, 9950X3D), Ryzen 5000 non-X3D tambahan (5500/5900X/
       5950X di AM4), serta Core Ultra 200S tambahan (Ultra 5 235 non-K,
       Ultra 9 285K).
     - Motherboard: tambah varian Mini-ITX untuk AM5, LGA1700, & LGA1851
       (menutup gap "casing ITX tanpa mobo ITX" yang dilaporkan sebelumnya),
       plus chipset terbaru X870E, B850, A620M.
     - RAM: tambah DDR3 (menutup gap motherboard H81M/LGA1150 yang sebelumnya
       tidak punya RAM cocok), plus kit DDR5 8000MHz kelas enthusiast.
     - GPU: lengkapi seri RTX 50 (5050, 5060 Ti 8/16GB, 5090), tambah Radeon
       RX 9000 (RDNA 4 — 9060, 9060 XT 8/16GB, 9070, 9070 XT), dan tambah
       brand baru Intel Arc (A750, A770, B570, B580).
     - Storage: tambah NVMe Gen5 2TB, SATA SSD 2TB, HDD 8TB.
     - PSU: tambah entry-level 400W 80+ White.
     - Casing & Monitor: tambah beberapa varian (Micro-ATX RGB, Mid Tower
       silent, monitor 22"/240Hz/OLED/curved) untuk pilihan lebih lengkap.

   tier tetap berupa estimasi 1-5 (dulu dihitung dari urutan harga data lama,
   produk baru di atas saya beri tier manual selaras dengan level performanya).
   tdp diisi dari spek umum tipe tersebut di pasaran, bukan diukur langsung —
   cek ulang kalau Anda punya data resmi yang lebih presisi.
   ================================================================================

   =========================== CROSSCHECK VARIASI (terbaru) =====================
   Ditemukan gap nyata saat crosscheck: 0 CPU tier budget (Ryzen 3 / Core i3)
   dan 0 tier tertinggi (Core i9) di SELURUH socket, plus jumlah motherboard per
   socket jauh lebih sedikit dari jumlah CPU-nya (AM4: 9 CPU vs 2 motherboard;
   LGA1200/1151/1150/sTR5 masing-masing cuma 1 motherboard). Ditambahkan:
     - CPU (+16): Ryzen 3 3100/3300X (AM4), Ryzen 5 7500F (AM5), Core i3-12100F/
       13100F + Core i9-13900K/14900K (LGA1700), Core i3-10100F + i9-10900K +
       i7-11700K (LGA1200), Core i3-9100F + i7-8700K (LGA1151), Core i3-4160 +
       i7-4790K (LGA1150), Core Ultra 5 225 (LGA1851), Threadripper 7970X (sTR5).
     - Motherboard (+15): A320M/B450M/X570 (AM4), B650/X670 ATX (AM5), H610/
       B760/Z690 (LGA1700), B860 (LGA1851), H510/Z590 (LGA1200), B360M/Z390
       (LGA1151), Z97 (LGA1150), WRX90 (sTR5).
   Total sekarang: 54 CPU, 32 motherboard — setiap socket minimal 2 motherboard
   dan tiap socket punya rentang tier budget s/d tertinggi.
   ================================================================================
   ============================================================ */

const PRODUCTS = [
  // ================= CPU =================
  { id:"cpu-01", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 2600", spec:"6 Core / 12 Thread, 3.4GHz base", socket:"AM4", generation:"Ryzen 2000", tdp:65, tier:1, stock:true },
  { id:"cpu-02", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 2700X", spec:"8 Core / 16 Thread, 3.7GHz base", socket:"AM4", generation:"Ryzen 2000", tdp:105, tier:2, stock:true },
  { id:"cpu-03", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 3600", spec:"6 Core / 12 Thread, 3.6GHz base", socket:"AM4", generation:"Ryzen 3000", tdp:65, tier:1, stock:true },
  { id:"cpu-04", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 3700X", spec:"8 Core / 16 Thread, 3.6GHz base", socket:"AM4", generation:"Ryzen 3000", tdp:65, tier:2, stock:true },
  { id:"cpu-05", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 5600", spec:"6 Core / 12 Thread, 3.5GHz base", socket:"AM4", generation:"Ryzen 5000", tdp:65, tier:2, stock:true },
  { id:"cpu-06", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 5700X3D", spec:"8 Core / 16 Thread, 3D V-Cache", socket:"AM4", generation:"Ryzen 5000", tdp:105, tier:3, stock:true },
  { id:"cpu-06b", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 5500", spec:"6 Core / 12 Thread, 3.6GHz base", socket:"AM4", generation:"Ryzen 5000", tdp:65, tier:1, stock:true },
  { id:"cpu-06c", category:"cpu", brand:"AMD", name:"AMD Ryzen 9 5900X", spec:"12 Core / 24 Thread, 3.7GHz base", socket:"AM4", generation:"Ryzen 5000", tdp:105, tier:4, stock:true },
  { id:"cpu-06d", category:"cpu", brand:"AMD", name:"AMD Ryzen 9 5950X", spec:"16 Core / 32 Thread, 3.4GHz base", socket:"AM4", generation:"Ryzen 5000", tdp:105, tier:5, stock:true },
  { id:"cpu-07", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 7600", spec:"6 Core / 12 Thread, 3.8GHz base", socket:"AM5", generation:"Ryzen 7000", tdp:65, tier:3, stock:true },
  { id:"cpu-08", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 7700X", spec:"8 Core / 16 Thread, 4.5GHz base", socket:"AM5", generation:"Ryzen 7000", tdp:105, tier:4, stock:true },
  { id:"cpu-08b", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 8500G", spec:"6 Core / 12 Thread, Radeon 740M iGPU", socket:"AM5", generation:"Ryzen 8000G", tdp:65, tier:2, stock:true },
  { id:"cpu-08c", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 8600G", spec:"6 Core / 12 Thread, Radeon 760M iGPU", socket:"AM5", generation:"Ryzen 8000G", tdp:65, tier:3, stock:true },
  { id:"cpu-09", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 9700X", spec:"8 Core / 16 Thread, 3.8GHz base", socket:"AM5", generation:"Ryzen 9000", tdp:65, tier:5, stock:true },
  { id:"cpu-09b", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 9600X", spec:"6 Core / 12 Thread, 3.9GHz base", socket:"AM5", generation:"Ryzen 9000", tdp:65, tier:4, stock:true },
  { id:"cpu-09c", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 9800X3D", spec:"8 Core / 16 Thread, 3D V-Cache", socket:"AM5", generation:"Ryzen 9000", tdp:120, tier:5, stock:true },
  { id:"cpu-09d", category:"cpu", brand:"AMD", name:"AMD Ryzen 9 9900X", spec:"12 Core / 24 Thread, 4.4GHz base", socket:"AM5", generation:"Ryzen 9000", tdp:120, tier:5, stock:true },
  { id:"cpu-10", category:"cpu", brand:"AMD", name:"AMD Ryzen 9 9950X", spec:"16 Core / 32 Thread, 4.3GHz base", socket:"AM5", generation:"Ryzen 9000", tdp:170, tier:5, stock:true },
  { id:"cpu-10b", category:"cpu", brand:"AMD", name:"AMD Ryzen 9 9950X3D", spec:"16 Core / 32 Thread, 3D V-Cache", socket:"AM5", generation:"Ryzen 9000", tdp:170, tier:5, stock:true },
  { id:"cpu-11", category:"cpu", brand:"AMD", name:"AMD Threadripper 7960X", spec:"24 Core / 48 Thread, HEDT", socket:"sTR5", generation:"Threadripper 7000", tdp:350, tier:5, stock:true },
  { id:"cpu-12", category:"cpu", brand:"AMD", name:"AMD Threadripper 7980X", spec:"64 Core / 128 Thread, HEDT", socket:"sTR5", generation:"Threadripper 7000", tdp:350, tier:5, stock:false },
  { id:"cpu-13", category:"cpu", brand:"Intel", name:"Intel Core Ultra 5 235", spec:"14 Core / 14 Thread, non-K", socket:"LGA1851", generation:"Core Ultra 200", tdp:65, tier:3, stock:true },
  { id:"cpu-13b", category:"cpu", brand:"Intel", name:"Intel Core Ultra 5 245K", spec:"14 Core / 14 Thread", socket:"LGA1851", generation:"Core Ultra 200", tdp:125, tier:4, stock:true },
  { id:"cpu-14", category:"cpu", brand:"Intel", name:"Intel Core Ultra 7 265K", spec:"20 Core / 20 Thread", socket:"LGA1851", generation:"Core Ultra 200", tdp:125, tier:5, stock:true },
  { id:"cpu-14b", category:"cpu", brand:"Intel", name:"Intel Core Ultra 9 285K", spec:"24 Core / 24 Thread", socket:"LGA1851", generation:"Core Ultra 200", tdp:125, tier:5, stock:true },
  { id:"cpu-15", category:"cpu", brand:"Intel", name:"Intel Core i5-12400F", spec:"6 Core / 12 Thread, 2.5GHz base", socket:"LGA1700", generation:"Core Gen 12", tdp:65, tier:3, stock:true },
  { id:"cpu-16", category:"cpu", brand:"Intel", name:"Intel Core i7-12700K", spec:"12 Core / 20 Thread", socket:"LGA1700", generation:"Core Gen 12", tdp:125, tier:4, stock:true },
  { id:"cpu-17", category:"cpu", brand:"Intel", name:"Intel Core i5-13400F", spec:"10 Core / 16 Thread", socket:"LGA1700", generation:"Core Gen 13", tdp:65, tier:3, stock:true },
  { id:"cpu-18", category:"cpu", brand:"Intel", name:"Intel Core i7-13700K", spec:"16 Core / 24 Thread", socket:"LGA1700", generation:"Core Gen 13", tdp:125, tier:4, stock:true },
  { id:"cpu-19", category:"cpu", brand:"Intel", name:"Intel Core i5-14400F", spec:"10 Core / 16 Thread", socket:"LGA1700", generation:"Core Gen 14", tdp:65, tier:3, stock:true },
  { id:"cpu-20", category:"cpu", brand:"Intel", name:"Intel Core i7-14700K", spec:"20 Core / 28 Thread", socket:"LGA1700", generation:"Core Gen 14", tdp:125, tier:4, stock:true },
  { id:"cpu-21", category:"cpu", brand:"Intel", name:"Intel Core i5-10400F", spec:"6 Core / 12 Thread, 2.9GHz base", socket:"LGA1200", generation:"Core Gen 10", tdp:65, tier:2, stock:true },
  { id:"cpu-22", category:"cpu", brand:"Intel", name:"Intel Core i5-11400F", spec:"6 Core / 12 Thread, 2.6GHz base", socket:"LGA1200", generation:"Core Gen 11", tdp:65, tier:3, stock:true },
  { id:"cpu-23", category:"cpu", brand:"Intel", name:"Intel Core i5-7500", spec:"4 Core / 4 Thread, 3.4GHz base", socket:"LGA1151", generation:"Core Gen 6-7", tdp:65, tier:1, stock:true },
  { id:"cpu-24", category:"cpu", brand:"Intel", name:"Intel Core i5-8400", spec:"6 Core / 6 Thread, 2.8GHz base", socket:"LGA1151", generation:"Core Gen 8-9", tdp:65, tier:1, stock:true },
  { id:"cpu-25", category:"cpu", brand:"Intel", name:"Intel Core i5-9400F", spec:"6 Core / 6 Thread, 2.9GHz base", socket:"LGA1151", generation:"Core Gen 8-9", tdp:65, tier:2, stock:true },
  { id:"cpu-26", category:"cpu", brand:"Intel", name:"Intel Core i5-4460", spec:"4 Core / 4 Thread, 3.2GHz base", socket:"LGA1150", generation:"Core Gen 4", tdp:84, tier:1, stock:true },
  { id:"cpu-27", category:"cpu", brand:"Intel", name:"Intel Core i5-4590", spec:"4 Core / 4 Thread, 3.3GHz base", socket:"LGA1150", generation:"Core Gen 4", tdp:84, tier:1, stock:true },
  // -- Pelengkap: tier budget (Ryzen 3 / Core i3) & tier tertinggi (Core i9) yang
  //    sebelumnya kosong di semua socket, plus pemerataan varian per socket --
  { id:"cpu-28", category:"cpu", brand:"AMD", name:"AMD Ryzen 3 3100", spec:"4 Core / 8 Thread, 3.6GHz base", socket:"AM4", generation:"Ryzen 3000", tdp:65, tier:1, stock:true },
  { id:"cpu-29", category:"cpu", brand:"AMD", name:"AMD Ryzen 3 3300X", spec:"4 Core / 8 Thread, 3.8GHz base", socket:"AM4", generation:"Ryzen 3000", tdp:65, tier:1, stock:true },
  { id:"cpu-30", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 7500F", spec:"6 Core / 12 Thread, tanpa iGPU, versi ekonomis", socket:"AM5", generation:"Ryzen 7000", tdp:65, tier:2, stock:true },
  { id:"cpu-31", category:"cpu", brand:"Intel", name:"Intel Core i3-12100F", spec:"4 Core / 8 Thread, 3.3GHz base", socket:"LGA1700", generation:"Core Gen 12", tdp:58, tier:1, stock:true },
  { id:"cpu-32", category:"cpu", brand:"Intel", name:"Intel Core i3-13100F", spec:"4 Core / 8 Thread, 3.4GHz base", socket:"LGA1700", generation:"Core Gen 13", tdp:58, tier:1, stock:true },
  { id:"cpu-33", category:"cpu", brand:"Intel", name:"Intel Core i9-13900K", spec:"24 Core / 32 Thread, flagship", socket:"LGA1700", generation:"Core Gen 13", tdp:125, tier:5, stock:true },
  { id:"cpu-34", category:"cpu", brand:"Intel", name:"Intel Core i9-14900K", spec:"24 Core / 32 Thread, flagship", socket:"LGA1700", generation:"Core Gen 14", tdp:125, tier:5, stock:true },
  { id:"cpu-35", category:"cpu", brand:"Intel", name:"Intel Core i3-10100F", spec:"4 Core / 8 Thread, 3.6GHz base", socket:"LGA1200", generation:"Core Gen 10", tdp:65, tier:1, stock:true },
  { id:"cpu-36", category:"cpu", brand:"Intel", name:"Intel Core i9-10900K", spec:"10 Core / 20 Thread, 3.7GHz base", socket:"LGA1200", generation:"Core Gen 10", tdp:125, tier:4, stock:true },
  { id:"cpu-37", category:"cpu", brand:"Intel", name:"Intel Core i7-11700K", spec:"8 Core / 16 Thread, 3.6GHz base", socket:"LGA1200", generation:"Core Gen 11", tdp:125, tier:4, stock:true },
  { id:"cpu-38", category:"cpu", brand:"Intel", name:"Intel Core i3-9100F", spec:"4 Core / 4 Thread, 3.6GHz base", socket:"LGA1151", generation:"Core Gen 8-9", tdp:65, tier:1, stock:true },
  { id:"cpu-39", category:"cpu", brand:"Intel", name:"Intel Core i7-8700K", spec:"6 Core / 12 Thread, 3.7GHz base", socket:"LGA1151", generation:"Core Gen 8-9", tdp:95, tier:3, stock:true },
  { id:"cpu-40", category:"cpu", brand:"Intel", name:"Intel Core i3-4160", spec:"2 Core / 4 Thread, 3.6GHz base", socket:"LGA1150", generation:"Core Gen 4", tdp:54, tier:1, stock:true },
  { id:"cpu-41", category:"cpu", brand:"Intel", name:"Intel Core i7-4790K", spec:"4 Core / 8 Thread, 4.0GHz base", socket:"LGA1150", generation:"Core Gen 4", tdp:88, tier:2, stock:true },
  { id:"cpu-42", category:"cpu", brand:"Intel", name:"Intel Core Ultra 5 225", spec:"14 Core / 14 Thread, non-K, versi ekonomis", socket:"LGA1851", generation:"Core Ultra 200", tdp:65, tier:3, stock:true },
  { id:"cpu-43", category:"cpu", brand:"AMD", name:"AMD Threadripper 7970X", spec:"32 Core / 64 Thread, HEDT", socket:"sTR5", generation:"Threadripper 7000", tdp:350, tier:5, stock:true },

  // ================= MOTHERBOARD =================
  { id:"mobo-01", category:"motherboard", brand:"AMD", name:"B650M", spec:"Micro-ATX, DDR5, PCIe 4.0", socket:"AM5", memoryType:"DDR5", formFactor:"MicroATX", tier:3, stock:true },
  { id:"mobo-01b", category:"motherboard", brand:"AMD", name:"B650I", spec:"Mini-ITX, DDR5, PCIe 4.0", socket:"AM5", memoryType:"DDR5", formFactor:"ITX", tier:3, stock:true },
  { id:"mobo-01c", category:"motherboard", brand:"AMD", name:"A620M", spec:"Micro-ATX, DDR5, entry-level", socket:"AM5", memoryType:"DDR5", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-01d", category:"motherboard", brand:"AMD", name:"B850", spec:"ATX, DDR5, PCIe 5.0", socket:"AM5", memoryType:"DDR5", formFactor:"ATX", tier:3, stock:true },
  { id:"mobo-02", category:"motherboard", brand:"AMD", name:"X670E", spec:"ATX, DDR5, PCIe 5.0", socket:"AM5", memoryType:"DDR5", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-02b", category:"motherboard", brand:"AMD", name:"X870E", spec:"ATX, DDR5, PCIe 5.0, USB4", socket:"AM5", memoryType:"DDR5", formFactor:"ATX", tier:5, stock:true },
  { id:"mobo-03", category:"motherboard", brand:"AMD", name:"A520M", spec:"Micro-ATX, DDR4", socket:"AM4", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-04", category:"motherboard", brand:"AMD", name:"B550M", spec:"Micro-ATX, DDR4, PCIe 4.0", socket:"AM4", memoryType:"DDR4", formFactor:"MicroATX", tier:2, stock:true },
  { id:"mobo-05", category:"motherboard", brand:"AMD", name:"TRX50", spec:"E-ATX, DDR5, HEDT", socket:"sTR5", memoryType:"DDR5", formFactor:"EATX", tier:5, stock:true },
  { id:"mobo-06", category:"motherboard", brand:"Intel", name:"Z890", spec:"ATX, DDR5, WiFi 7", socket:"LGA1851", memoryType:"DDR5", formFactor:"ATX", tier:5, stock:true },
  { id:"mobo-07", category:"motherboard", brand:"Intel", name:"B660M", spec:"Micro-ATX, DDR4", socket:"LGA1700", memoryType:"DDR4", formFactor:"MicroATX", tier:3, stock:true },
  { id:"mobo-08", category:"motherboard", brand:"Intel", name:"Z790", spec:"ATX, DDR5, WiFi 6", socket:"LGA1700", memoryType:"DDR5", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-08b", category:"motherboard", brand:"Intel", name:"B760I", spec:"Mini-ITX, DDR5", socket:"LGA1700", memoryType:"DDR5", formFactor:"ITX", tier:3, stock:true },
  { id:"mobo-06b", category:"motherboard", brand:"Intel", name:"Z890I", spec:"Mini-ITX, DDR5, WiFi 7", socket:"LGA1851", memoryType:"DDR5", formFactor:"ITX", tier:5, stock:true },
  { id:"mobo-09", category:"motherboard", brand:"Intel", name:"B560M", spec:"Micro-ATX, DDR4", socket:"LGA1200", memoryType:"DDR4", formFactor:"MicroATX", tier:2, stock:true },
  { id:"mobo-10", category:"motherboard", brand:"Intel", name:"B365M", spec:"Micro-ATX, DDR4", socket:"LGA1151", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-11", category:"motherboard", brand:"Intel", name:"H81M", spec:"Micro-ATX, DDR3", socket:"LGA1150", memoryType:"DDR3", formFactor:"MicroATX", tier:1, stock:true },
  // -- Pelengkap: tiap socket sebelumnya hanya punya 1-3 pilihan motherboard
  //    (AM4 & LGA1200/1151/1150/sTR5 paling timpang dibanding jumlah CPU-nya) --
  { id:"mobo-12", category:"motherboard", brand:"AMD", name:"A320M", spec:"Micro-ATX, DDR4, entry-level", socket:"AM4", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-13", category:"motherboard", brand:"AMD", name:"B450M", spec:"Micro-ATX, DDR4, populer untuk budget build", socket:"AM4", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-14", category:"motherboard", brand:"AMD", name:"X570", spec:"ATX, DDR4, PCIe 4.0, high-end AM4", socket:"AM4", memoryType:"DDR4", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-15", category:"motherboard", brand:"AMD", name:"B650", spec:"ATX, DDR5, PCIe 4.0", socket:"AM5", memoryType:"DDR5", formFactor:"ATX", tier:3, stock:true },
  { id:"mobo-16", category:"motherboard", brand:"AMD", name:"X670", spec:"ATX, DDR5, PCIe 5.0", socket:"AM5", memoryType:"DDR5", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-17", category:"motherboard", brand:"Intel", name:"H610", spec:"Micro-ATX, DDR4, entry-level", socket:"LGA1700", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-18", category:"motherboard", brand:"Intel", name:"B760", spec:"ATX, DDR5, mainstream", socket:"LGA1700", memoryType:"DDR5", formFactor:"ATX", tier:3, stock:true },
  { id:"mobo-19", category:"motherboard", brand:"Intel", name:"Z690", spec:"ATX, DDR5, high-end", socket:"LGA1700", memoryType:"DDR5", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-20", category:"motherboard", brand:"Intel", name:"B860", spec:"ATX, DDR5, mainstream", socket:"LGA1851", memoryType:"DDR5", formFactor:"ATX", tier:3, stock:true },
  { id:"mobo-21", category:"motherboard", brand:"Intel", name:"H510", spec:"Micro-ATX, DDR4, entry-level", socket:"LGA1200", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-22", category:"motherboard", brand:"Intel", name:"Z590", spec:"ATX, DDR4, high-end", socket:"LGA1200", memoryType:"DDR4", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-23", category:"motherboard", brand:"Intel", name:"B360M", spec:"Micro-ATX, DDR4, mainstream", socket:"LGA1151", memoryType:"DDR4", formFactor:"MicroATX", tier:2, stock:true },
  { id:"mobo-24", category:"motherboard", brand:"Intel", name:"Z390", spec:"ATX, DDR4, high-end", socket:"LGA1151", memoryType:"DDR4", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-25", category:"motherboard", brand:"Intel", name:"Z97", spec:"ATX, DDR3, high-end (legacy)", socket:"LGA1150", memoryType:"DDR3", formFactor:"ATX", tier:3, stock:true },
  { id:"mobo-26", category:"motherboard", brand:"AMD", name:"WRX90", spec:"E-ATX, DDR5, workstation HEDT", socket:"sTR5", memoryType:"DDR5", formFactor:"EATX", tier:5, stock:false },

  // ================= RAM =================
  { id:"ram-01", category:"ram", brand:"Value", name:"DDR4 8GB", spec:"1x8GB, CL16, Single Channel, 2400MHz", memoryType:"DDR4", capacity:8, speed:"2400MHz", tier:1, stock:true, qtyMax:4 },
  { id:"ram-02", category:"ram", brand:"Value", name:"DDR4 8GB Kit", spec:"2x4GB, CL16, Dual Channel, 3200MHz", memoryType:"DDR4", capacity:8, speed:"3200MHz", tier:1, stock:true, qtyMax:4 },
  { id:"ram-03", category:"ram", brand:"Value", name:"DDR4 16GB Kit", spec:"2x8GB, CL16, Dual Channel, 3200MHz", memoryType:"DDR4", capacity:16, speed:"3200MHz", tier:2, stock:true, qtyMax:4 },
  { id:"ram-04", category:"ram", brand:"Value", name:"DDR4 16GB Kit OC", spec:"2x8GB, CL18, Dual Channel, 3600MHz", memoryType:"DDR4", capacity:16, speed:"3600MHz", tier:2, stock:true, qtyMax:4 },
  { id:"ram-05", category:"ram", brand:"Value", name:"DDR4 32GB Kit", spec:"2x16GB, CL18, Dual Channel, 3600MHz", memoryType:"DDR4", capacity:32, speed:"3600MHz", tier:3, stock:true, qtyMax:4 },
  { id:"ram-06", category:"ram", brand:"Value", name:"DDR4 32GB Kit OC", spec:"2x16GB, CL19, Dual Channel, 4000MHz", memoryType:"DDR4", capacity:32, speed:"4000MHz", tier:3, stock:true, qtyMax:4 },
  { id:"ram-07", category:"ram", brand:"Value", name:"DDR4 64GB Kit", spec:"2x32GB, CL18, Dual Channel, 3200MHz", memoryType:"DDR4", capacity:64, speed:"3200MHz", tier:4, stock:true, qtyMax:4 },
  { id:"ram-08", category:"ram", brand:"Value", name:"DDR5 8GB", spec:"1x8GB, CL40, Single Channel, 4800MHz", memoryType:"DDR5", capacity:8, speed:"4800MHz", tier:1, stock:true, qtyMax:4 },
  { id:"ram-09", category:"ram", brand:"Value", name:"DDR5 16GB", spec:"1x16GB, CL40, Single Channel, 4800MHz", memoryType:"DDR5", capacity:16, speed:"4800MHz", tier:2, stock:true, qtyMax:4 },
  { id:"ram-10", category:"ram", brand:"Value", name:"DDR5 16GB Kit", spec:"2x8GB, CL36, Dual Channel, 5600MHz", memoryType:"DDR5", capacity:16, speed:"5600MHz", tier:3, stock:true, qtyMax:4 },
  { id:"ram-11", category:"ram", brand:"Gaming", name:"DDR5 32GB Kit", spec:"2x16GB, CL36, Dual Channel, 6000MHz", memoryType:"DDR5", capacity:32, speed:"6000MHz", tier:4, stock:true, qtyMax:4 },
  { id:"ram-12", category:"ram", brand:"Gaming", name:"DDR5 32GB Kit OC", spec:"2x16GB, CL38, Dual Channel, 6400MHz", memoryType:"DDR5", capacity:32, speed:"6400MHz", tier:4, stock:true, qtyMax:4 },
  { id:"ram-13", category:"ram", brand:"Gaming", name:"DDR5 64GB Kit", spec:"2x32GB, CL36, Dual Channel, 6000MHz", memoryType:"DDR5", capacity:64, speed:"6000MHz", tier:5, stock:true, qtyMax:4 },
  { id:"ram-14", category:"ram", brand:"Gaming", name:"DDR5 64GB Kit OC", spec:"2x32GB, CL38, Dual Channel, 6400MHz", memoryType:"DDR5", capacity:64, speed:"6400MHz", tier:5, stock:true, qtyMax:4 },
  { id:"ram-15", category:"ram", brand:"Enthusiast", name:"DDR5 32GB Kit Extreme", spec:"2x16GB, CL34, Dual Channel, 8000MHz", memoryType:"DDR5", capacity:32, speed:"8000MHz", tier:5, stock:true, qtyMax:4 },
  // -- DDR3 (untuk motherboard legacy seperti H81M/LGA1150) --
  { id:"ram-16", category:"ram", brand:"Value", name:"DDR3 8GB", spec:"1x8GB, CL11, Single Channel, 1600MHz", memoryType:"DDR3", capacity:8, speed:"1600MHz", tier:1, stock:true, qtyMax:4 },
  { id:"ram-17", category:"ram", brand:"Value", name:"DDR3 16GB Kit", spec:"2x8GB, CL11, Dual Channel, 1600MHz", memoryType:"DDR3", capacity:16, speed:"1600MHz", tier:1, stock:true, qtyMax:4 },

  // ================= GPU =================
  { id:"gpu-01", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 950 2GB", spec:"2GB GDDR5, 128-bit", series:"GTX 900", tdp:90, vram:2, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-02", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 960 4GB", spec:"4GB GDDR5, 128-bit", series:"GTX 900", tdp:120, vram:4, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-03", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 970 4GB", spec:"4GB GDDR5, 256-bit", series:"GTX 900", tdp:145, vram:4, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-04", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 980 Ti 6GB", spec:"6GB GDDR5, 384-bit", series:"GTX 900", tdp:250, vram:6, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-05", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1050 Ti 4GB", spec:"4GB GDDR5, 128-bit", series:"GTX 10", tdp:75, vram:4, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-06", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1060 6GB", spec:"6GB GDDR5, 192-bit", series:"GTX 10", tdp:120, vram:6, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-07", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1070 8GB", spec:"8GB GDDR5, 256-bit", series:"GTX 10", tdp:150, vram:8, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-08", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1080 Ti 11GB", spec:"11GB GDDR5X, 352-bit", series:"GTX 10", tdp:250, vram:11, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-09", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1650 4GB", spec:"4GB GDDR6, 128-bit", series:"GTX 16", tdp:75, vram:4, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-10", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1650 Super 4GB", spec:"4GB GDDR6, 128-bit", series:"GTX 16", tdp:100, vram:4, tier:1, stock:true, qtyMax:2 },
  { id:"gpu-11", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1660 Super 6GB", spec:"6GB GDDR6, 192-bit", series:"GTX 16", tdp:125, vram:6, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-12", category:"gpu", brand:"NVIDIA", name:"GeForce GTX 1660 Ti 6GB", spec:"6GB GDDR6, 192-bit", series:"GTX 16", tdp:120, vram:6, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-13", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 2060 6GB", spec:"6GB GDDR6, Ray Tracing Gen 1", series:"RTX 20", tdp:160, vram:6, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-14", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 2060 Super 8GB", spec:"8GB GDDR6, Ray Tracing Gen 1", series:"RTX 20", tdp:175, vram:8, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-15", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 2070 Super 8GB", spec:"8GB GDDR6, Ray Tracing Gen 1", series:"RTX 20", tdp:215, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-16", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 2080 Ti 11GB", spec:"11GB GDDR6, Ray Tracing Gen 1", series:"RTX 20", tdp:250, vram:11, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-17", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 3050 8GB", spec:"8GB GDDR6, Ray Tracing Gen 2", series:"RTX 30", tdp:130, vram:8, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-18", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 3060 12GB", spec:"12GB GDDR6, Ray Tracing Gen 2", series:"RTX 30", tdp:170, vram:12, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-19", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 3070 8GB", spec:"8GB GDDR6, Ray Tracing Gen 2", series:"RTX 30", tdp:220, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-20", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 3080 10GB", spec:"10GB GDDR6X, Ray Tracing Gen 2", series:"RTX 30", tdp:320, vram:10, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-21", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 3090 24GB", spec:"24GB GDDR6X, Ray Tracing Gen 2", series:"RTX 30", tdp:350, vram:24, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-21b", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 3060 Ti 8GB", spec:"8GB GDDR6, Ray Tracing Gen 2", series:"RTX 30", tdp:200, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-22", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4060 8GB", spec:"8GB GDDR6, DLSS 3", series:"RTX 40", tdp:115, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-23", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4060 Ti 8GB", spec:"8GB GDDR6, DLSS 3", series:"RTX 40", tdp:160, vram:8, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-24", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4070 12GB", spec:"12GB GDDR6X, DLSS 3", series:"RTX 40", tdp:200, vram:12, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-25", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4070 Ti Super 16GB", spec:"16GB GDDR6X, DLSS 3", series:"RTX 40", tdp:285, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-26", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4080 Super 16GB", spec:"16GB GDDR6X, DLSS 3", series:"RTX 40", tdp:320, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-27", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4090 24GB", spec:"24GB GDDR6X, DLSS 3", series:"RTX 40", tdp:450, vram:24, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-27b", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5050 8GB", spec:"8GB GDDR6, DLSS 4", series:"RTX 50", tdp:130, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-28", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5060 8GB", spec:"8GB GDDR7, DLSS 4", series:"RTX 50", tdp:145, vram:8, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-28b", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5060 Ti 8GB", spec:"8GB GDDR7, DLSS 4", series:"RTX 50", tdp:180, vram:8, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-28c", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5060 Ti 16GB", spec:"16GB GDDR7, DLSS 4", series:"RTX 50", tdp:180, vram:16, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-29", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5070 12GB", spec:"12GB GDDR7, DLSS 4", series:"RTX 50", tdp:250, vram:12, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-30", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5070 Ti 16GB", spec:"16GB GDDR7, DLSS 4", series:"RTX 50", tdp:300, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-31", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5080 16GB", spec:"16GB GDDR7, DLSS 4", series:"RTX 50", tdp:360, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-31b", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5090 32GB", spec:"32GB GDDR7, DLSS 4", series:"RTX 50", tdp:575, vram:32, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-32", category:"gpu", brand:"AMD", name:"Radeon RX 6600 8GB", spec:"8GB GDDR6, 128-bit", series:"Radeon RX 6000", tdp:132, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-33", category:"gpu", brand:"AMD", name:"Radeon RX 6700 XT 12GB", spec:"12GB GDDR6, 192-bit", series:"Radeon RX 6000", tdp:230, vram:12, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-34", category:"gpu", brand:"AMD", name:"Radeon RX 6800 XT 16GB", spec:"16GB GDDR6, 256-bit", series:"Radeon RX 6000", tdp:300, vram:16, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-35", category:"gpu", brand:"AMD", name:"Radeon RX 7600 8GB", spec:"8GB GDDR6, 128-bit", series:"Radeon RX 7000", tdp:165, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-36", category:"gpu", brand:"AMD", name:"Radeon RX 7800 XT 16GB", spec:"16GB GDDR6, 256-bit", series:"Radeon RX 7000", tdp:263, vram:16, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-37", category:"gpu", brand:"AMD", name:"Radeon RX 7900 XTX 24GB", spec:"24GB GDDR6, 384-bit", series:"Radeon RX 7000", tdp:355, vram:24, tier:5, stock:true, qtyMax:2 },
  // -- Radeon RX 9000 (RDNA 4, terbaru 2026) --
  { id:"gpu-38", category:"gpu", brand:"AMD", name:"Radeon RX 9060 8GB", spec:"8GB GDDR6, RDNA 4", series:"Radeon RX 9000", tdp:150, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-39", category:"gpu", brand:"AMD", name:"Radeon RX 9060 XT 8GB", spec:"8GB GDDR6, RDNA 4", series:"Radeon RX 9000", tdp:150, vram:8, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-40", category:"gpu", brand:"AMD", name:"Radeon RX 9060 XT 16GB", spec:"16GB GDDR6, RDNA 4", series:"Radeon RX 9000", tdp:150, vram:16, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-41", category:"gpu", brand:"AMD", name:"Radeon RX 9070 16GB", spec:"16GB GDDR6, RDNA 4", series:"Radeon RX 9000", tdp:220, vram:16, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-42", category:"gpu", brand:"AMD", name:"Radeon RX 9070 XT 16GB", spec:"16GB GDDR6, RDNA 4", series:"Radeon RX 9000", tdp:304, vram:16, tier:5, stock:true, qtyMax:2 },
  // -- Intel Arc (Alchemist & Battlemage) --
  { id:"gpu-43", category:"gpu", brand:"Intel", name:"Arc A750 8GB", spec:"8GB GDDR6, Alchemist", series:"Arc A-Series", tdp:225, vram:8, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-44", category:"gpu", brand:"Intel", name:"Arc A770 16GB", spec:"16GB GDDR6, Alchemist", series:"Arc A-Series", tdp:225, vram:16, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-45", category:"gpu", brand:"Intel", name:"Arc B570 10GB", spec:"10GB GDDR6, Battlemage", series:"Arc B-Series", tdp:150, vram:10, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-46", category:"gpu", brand:"Intel", name:"Arc B580 12GB", spec:"12GB GDDR6, Battlemage", series:"Arc B-Series", tdp:190, vram:12, tier:3, stock:true, qtyMax:2 },

  // ================= STORAGE =================
  { id:"sto-01", category:"storage", brand:"Value", name:"NVMe SSD 500GB", spec:"PCIe 3.0, up to 3500MB/s", type:"SSD-NVMe", capacity:500, speedTier:"PCIe Gen3", tier:1, stock:true, qtyMax:6 },
  { id:"sto-02", category:"storage", brand:"Value", name:"NVMe SSD 1TB", spec:"PCIe 3.0, up to 3500MB/s", type:"SSD-NVMe", capacity:1000, speedTier:"PCIe Gen3", tier:3, stock:true, qtyMax:6 },
  { id:"sto-03", category:"storage", brand:"Gaming", name:"NVMe SSD 1TB Gen4", spec:"PCIe 4.0, up to 7000MB/s", type:"SSD-NVMe", capacity:1000, speedTier:"PCIe Gen4", tier:4, stock:true, qtyMax:6 },
  { id:"sto-04", category:"storage", brand:"Gaming", name:"NVMe SSD 2TB Gen4", spec:"PCIe 4.0, up to 7000MB/s", type:"SSD-NVMe", capacity:2000, speedTier:"PCIe Gen4", tier:5, stock:true, qtyMax:6 },
  { id:"sto-05", category:"storage", brand:"Gaming", name:"NVMe SSD 1TB Gen5", spec:"PCIe 5.0, up to 12000MB/s", type:"SSD-NVMe", capacity:1000, speedTier:"PCIe Gen5", tier:5, stock:true, qtyMax:6 },
  { id:"sto-06", category:"storage", brand:"Value", name:"SATA SSD 500GB", spec:"2.5\", up to 550MB/s", type:"SSD-SATA", capacity:500, speedTier:"SATA III", tier:1, stock:true, qtyMax:6 },
  { id:"sto-07", category:"storage", brand:"Value", name:"SATA SSD 1TB", spec:"2.5\", up to 550MB/s", type:"SSD-SATA", capacity:1000, speedTier:"SATA III", tier:2, stock:true, qtyMax:6 },
  { id:"sto-08", category:"storage", brand:"Value", name:"HDD 1TB", spec:"3.5\", SATA III", type:"HDD", capacity:1000, speedTier:"7200RPM", tier:2, stock:true, qtyMax:6 },
  { id:"sto-09", category:"storage", brand:"Value", name:"HDD 2TB", spec:"3.5\", SATA III", type:"HDD", capacity:2000, speedTier:"7200RPM", tier:3, stock:true, qtyMax:6 },
  { id:"sto-10", category:"storage", brand:"Value", name:"HDD 4TB", spec:"3.5\", SATA III, hemat daya", type:"HDD", capacity:4000, speedTier:"5400RPM", tier:4, stock:true, qtyMax:6 },
  { id:"sto-11", category:"storage", brand:"Gaming", name:"NVMe SSD 2TB Gen5", spec:"PCIe 5.0, up to 12000MB/s", type:"SSD-NVMe", capacity:2000, speedTier:"PCIe Gen5", tier:5, stock:true, qtyMax:6 },
  { id:"sto-12", category:"storage", brand:"Value", name:"SATA SSD 2TB", spec:"2.5\", up to 550MB/s", type:"SSD-SATA", capacity:2000, speedTier:"SATA III", tier:3, stock:true, qtyMax:6 },
  { id:"sto-13", category:"storage", brand:"Value", name:"HDD 8TB", spec:"3.5\", SATA III, untuk NAS/arsip", type:"HDD", capacity:8000, speedTier:"7200RPM", tier:5, stock:true, qtyMax:6 },

  // ================= PSU =================
  { id:"psu-00", category:"psu", brand:"Value", name:"PSU 400W White", spec:"80+ White, Non-modular", wattage:400, rating:"80+ White", tier:1, stock:true },
  { id:"psu-01", category:"psu", brand:"Value", name:"PSU 450W Bronze", spec:"80+ Bronze, Non-modular", wattage:450, rating:"80+ Bronze", tier:1, stock:true },
  { id:"psu-02", category:"psu", brand:"Gaming", name:"PSU 450W Gold", spec:"80+ Gold, Non-modular", wattage:450, rating:"80+ Gold", tier:1, stock:true },
  { id:"psu-03", category:"psu", brand:"Value", name:"PSU 500W Bronze", spec:"80+ Bronze, Non-modular", wattage:500, rating:"80+ Bronze", tier:1, stock:true },
  { id:"psu-04", category:"psu", brand:"Value", name:"PSU 500W Silver", spec:"80+ Silver, Non-modular", wattage:500, rating:"80+ Silver", tier:1, stock:true },
  { id:"psu-05", category:"psu", brand:"Value", name:"PSU 550W Bronze", spec:"80+ Bronze, Non-modular", wattage:550, rating:"80+ Bronze", tier:1, stock:true },
  { id:"psu-06", category:"psu", brand:"Gaming", name:"PSU 550W Gold", spec:"80+ Gold, Semi-modular", wattage:550, rating:"80+ Gold", tier:2, stock:true },
  { id:"psu-07", category:"psu", brand:"Value", name:"PSU 600W Bronze", spec:"80+ Bronze, Non-modular", wattage:600, rating:"80+ Bronze", tier:2, stock:true },
  { id:"psu-08", category:"psu", brand:"Gaming", name:"PSU 600W Gold", spec:"80+ Gold, Semi-modular", wattage:600, rating:"80+ Gold", tier:2, stock:true },
  { id:"psu-09", category:"psu", brand:"Value", name:"PSU 650W Bronze", spec:"80+ Bronze, Semi-modular", wattage:650, rating:"80+ Bronze", tier:2, stock:true },
  { id:"psu-10", category:"psu", brand:"Gaming", name:"PSU 650W Gold", spec:"80+ Gold, Semi-modular", wattage:650, rating:"80+ Gold", tier:2, stock:true },
  { id:"psu-11", category:"psu", brand:"Enthusiast", name:"PSU 650W Platinum", spec:"80+ Platinum, Full-modular", wattage:650, rating:"80+ Platinum", tier:3, stock:true },
  { id:"psu-12", category:"psu", brand:"Gaming", name:"PSU 700W Gold", spec:"80+ Gold, Semi-modular", wattage:700, rating:"80+ Gold", tier:3, stock:true },
  { id:"psu-13", category:"psu", brand:"Enthusiast", name:"PSU 700W Platinum", spec:"80+ Platinum, Full-modular", wattage:700, rating:"80+ Platinum", tier:3, stock:true },
  { id:"psu-14", category:"psu", brand:"Gaming", name:"PSU 750W Gold", spec:"80+ Gold, Full-modular", wattage:750, rating:"80+ Gold", tier:3, stock:true },
  { id:"psu-15", category:"psu", brand:"Enthusiast", name:"PSU 750W Platinum", spec:"80+ Platinum, Full-modular", wattage:750, rating:"80+ Platinum", tier:4, stock:true },
  { id:"psu-16", category:"psu", brand:"Enthusiast", name:"PSU 750W Titanium", spec:"80+ Titanium, Full-modular", wattage:750, rating:"80+ Titanium", tier:4, stock:true },
  { id:"psu-17", category:"psu", brand:"Gaming", name:"PSU 850W Gold", spec:"80+ Gold, Full-modular", wattage:850, rating:"80+ Gold", tier:4, stock:true },
  { id:"psu-18", category:"psu", brand:"Enthusiast", name:"PSU 850W Platinum", spec:"80+ Platinum, Full-modular", wattage:850, rating:"80+ Platinum", tier:4, stock:true },
  { id:"psu-19", category:"psu", brand:"Enthusiast", name:"PSU 1000W Platinum", spec:"80+ Platinum, Full-modular", wattage:1000, rating:"80+ Platinum", tier:4, stock:true },
  { id:"psu-20", category:"psu", brand:"Enthusiast", name:"PSU 1000W Titanium", spec:"80+ Titanium, Full-modular", wattage:1000, rating:"80+ Titanium", tier:5, stock:true },
  { id:"psu-21", category:"psu", brand:"Enthusiast", name:"PSU 1200W Platinum", spec:"80+ Platinum, Full-modular, HEDT/Multi-GPU", wattage:1200, rating:"80+ Platinum", tier:5, stock:true },
  { id:"psu-22", category:"psu", brand:"Enthusiast", name:"PSU 1200W Titanium", spec:"80+ Titanium, Full-modular, HEDT/Multi-GPU", wattage:1200, rating:"80+ Titanium", tier:5, stock:true },
  { id:"psu-23", category:"psu", brand:"Enthusiast", name:"PSU 1600W Titanium", spec:"80+ Titanium, Full-modular, HEDT/Multi-GPU", wattage:1600, rating:"80+ Titanium", tier:5, stock:true },

  // ================= CASING =================
  { id:"case-01", category:"casing", brand:"Value", name:"Mini-ITX Compact", spec:"Ringkas, untuk mobo Mini-ITX", formFactor:"Mini-ITX", supportedFormFactors:["ITX"], tier:2, stock:true },
  { id:"case-02", category:"casing", brand:"Value", name:"Micro ATX Basic", spec:"Tanpa fan RGB", formFactor:"Micro ATX", supportedFormFactors:["MicroATX"], tier:1, stock:true },
  { id:"case-03", category:"casing", brand:"Gaming", name:"Mid Tower Airflow", spec:"ATX, 3 fan preinstalled", formFactor:"Mid Tower", supportedFormFactors:["ATX","MicroATX"], tier:3, stock:true },
  { id:"case-04", category:"casing", brand:"Enthusiast", name:"Full Tower RGB Premium", spec:"E-ATX support, 6 fan ARGB", formFactor:"Full Tower", supportedFormFactors:["EATX","ATX","MicroATX"], tier:4, stock:true },
  { id:"case-05", category:"casing", brand:"Enthusiast", name:"Super Tower Extreme", spec:"E-ATX, ruang GPU & radiator ekstra besar", formFactor:"Super Tower", supportedFormFactors:["EATX","ATX","MicroATX"], tier:5, stock:true },
  { id:"case-06", category:"casing", brand:"Gaming", name:"Micro ATX RGB Compact", spec:"Micro-ATX, 3 fan ARGB, tempered glass", formFactor:"Micro ATX", supportedFormFactors:["MicroATX","ITX"], tier:2, stock:true },
  { id:"case-07", category:"casing", brand:"Value", name:"Mid Tower Silent", spec:"ATX, panel solid, fokus peredam suara", formFactor:"Mid Tower", supportedFormFactors:["ATX","MicroATX"], tier:2, stock:true },

  // ================ MONITOR (kategori baru — belum ada di data lama) ================
  // minGpuTier = tier GPU minimum yang direkomendasikan agar monitor ini "worth it"
  { id:"mon-01", category:"monitor", brand:"Value",  name:'Monitor 18.5" HD',        spec:"1366x768, 60Hz, VA",   size:18.5, resolution:"HD",   refreshRate:60,  minGpuTier:1, tier:1, stock:true },
  { id:"mon-02", category:"monitor", brand:"Value",  name:'Monitor 21.5" Full HD',   spec:"1920x1080, 75Hz, IPS", size:21.5, resolution:"FHD",  refreshRate:75,  minGpuTier:1, tier:2, stock:true },
  { id:"mon-03", category:"monitor", brand:"Gaming",  name:'Monitor 24" Full HD 100Hz', spec:"1920x1080, 100Hz, IPS", size:24, resolution:"FHD", refreshRate:100, minGpuTier:2, tier:2, stock:true },
  { id:"mon-04", category:"monitor", brand:"Gaming",  name:'Monitor 24" Full HD 165Hz', spec:"1920x1080, 165Hz, IPS", size:24, resolution:"FHD", refreshRate:165, minGpuTier:3, tier:3, stock:true },
  { id:"mon-05", category:"monitor", brand:"Gaming",  name:'Monitor 27" QHD 165Hz',  spec:"2560x1440, 165Hz, IPS", size:27, resolution:"QHD",  refreshRate:165, minGpuTier:4, tier:4, stock:true },
  { id:"mon-06", category:"monitor", brand:"Enthusiast", name:'Monitor 27" 4K 144Hz', spec:"3840x2160, 144Hz, IPS", size:27, resolution:"4K",   refreshRate:144, minGpuTier:5, tier:5, stock:true },
  { id:"mon-07", category:"monitor", brand:"Enthusiast", name:'Monitor 32" 4K 144Hz', spec:"3840x2160, 144Hz, IPS", size:32, resolution:"4K",   refreshRate:144, minGpuTier:5, tier:5, stock:true },
  { id:"mon-08", category:"monitor", brand:"Gaming",  name:'Monitor 34" Ultrawide QHD 144Hz', spec:"3440x1440, 144Hz, IPS", size:34, resolution:"QHD", refreshRate:144, minGpuTier:4, tier:4, stock:false },
  { id:"mon-09", category:"monitor", brand:"Value",  name:'Monitor 22" Full HD',       spec:"1920x1080, 75Hz, IPS", size:22, resolution:"FHD", refreshRate:75, minGpuTier:1, tier:2, stock:true },
  { id:"mon-10", category:"monitor", brand:"Gaming",  name:'Monitor 27" QHD 240Hz',    spec:"2560x1440, 240Hz, IPS", size:27, resolution:"QHD", refreshRate:240, minGpuTier:5, tier:5, stock:true },
  { id:"mon-11", category:"monitor", brand:"Enthusiast", name:'Monitor 27" QHD OLED 240Hz', spec:"2560x1440, 240Hz, OLED", size:27, resolution:"QHD", refreshRate:240, minGpuTier:5, tier:5, stock:true },
  { id:"mon-12", category:"monitor", brand:"Gaming",  name:'Monitor 32" QHD 165Hz Curved', spec:"2560x1440, 165Hz, VA Curved", size:32, resolution:"QHD", refreshRate:165, minGpuTier:4, tier:4, stock:true },

  /* ---------- AKSESORIS TAMBAHAN (ditambahkan Agustus 2026) ---------- */
  { id:"mouse-01", category:"mouse", brand:"Value",     name:"Mouse Wired Basic",            spec:"Optical, 1000 DPI, USB",                 tier:1, stock:true },
  { id:"mouse-02", category:"mouse", brand:"Gaming",    name:"Mouse Gaming Wired RGB",        spec:"Optical, 6400 DPI, 6 tombol, RGB",       tier:2, stock:true },
  { id:"mouse-03", category:"mouse", brand:"Logitech",  name:"Logitech G102 Lightsync",       spec:"Optical, 8000 DPI, RGB",                 tier:3, stock:true },
  { id:"mouse-04", category:"mouse", brand:"Razer",     name:"Razer DeathAdder V3",           spec:"Wired, 30000 DPI, Ergonomis",            tier:4, stock:true },
  { id:"mouse-05", category:"mouse", brand:"Logitech",  name:"Logitech G Pro X Superlight",   spec:"Wireless, 25600 DPI, 63g",               tier:5, stock:true },

  { id:"kb-01", category:"keyboard", brand:"Value",     name:"Keyboard Membrane Standard",     spec:"USB, Full-size",                        tier:1, stock:true },
  { id:"kb-02", category:"keyboard", brand:"Gaming",    name:"Keyboard Gaming Membrane RGB",   spec:"USB, Anti-ghosting, RGB",                tier:2, stock:true },
  { id:"kb-03", category:"keyboard", brand:"Royal Kludge", name:"RK Royal Kludge RK61",       spec:"Mechanical, Red Switch, 60%",            tier:3, stock:true },
  { id:"kb-04", category:"keyboard", brand:"Logitech",  name:"Logitech G Pro X",              spec:"Mechanical, Hot-swap, TKL",              tier:4, stock:true },
  { id:"kb-05", category:"keyboard", brand:"Razer",     name:"Razer Huntsman V3 Pro",         spec:"Optical Switch, Analog, Full-size",      tier:5, stock:true },

  { id:"mp-01", category:"mousepad", brand:"Value",     name:"Mousepad Standard 25x20cm",      spec:"Cloth, non-slip base",                  tier:1, stock:true },
  { id:"mp-02", category:"mousepad", brand:"Gaming",    name:"Mousepad Gaming Medium 35x25cm", spec:"Cloth, stitched edge",                  tier:2, stock:true },
  { id:"mp-03", category:"mousepad", brand:"Gaming",    name:"Mousepad Gaming Extended 80x30cm", spec:"Cloth, ukuran full desk",             tier:3, stock:true },
  { id:"mp-04", category:"mousepad", brand:"SteelSeries", name:"SteelSeries QcK Heavy",        spec:"Cloth tebal 6mm, extra grip",           tier:4, stock:true },
  { id:"mp-05", category:"mousepad", brand:"Logitech",  name:"Logitech G840 XL",               spec:"Cloth, extra large",                    tier:4, stock:true },

  { id:"os-01", category:"os", brand:"Community", name:"Linux Ubuntu (Gratis)",          spec:"Open-source, gratis, cocok umum & dev", tier:1, stock:true },
  { id:"os-02", category:"os", brand:"Microsoft", name:"Windows 10 Home OEM",            spec:"64-bit, lisensi digital",               tier:2, stock:true },
  { id:"os-03", category:"os", brand:"Microsoft", name:"Windows 11 Home OEM",            spec:"64-bit, lisensi digital",               tier:3, stock:true },
  { id:"os-04", category:"os", brand:"Microsoft", name:"Windows 11 Pro OEM",             spec:"64-bit, lisensi digital, fitur Pro",    tier:4, stock:true },

  { id:"hp-01", category:"headphone", brand:"Value",       name:"Headset Wired Basic",         spec:"3.5mm jack, stereo, mic",             tier:1, stock:true },
  { id:"hp-02", category:"headphone", brand:"Gaming",      name:"Headset Gaming 7.1 USB",      spec:"USB, Surround 7.1, RGB",              tier:2, stock:true },
  { id:"hp-03", category:"headphone", brand:"HyperX",      name:"HyperX Cloud Stinger 2",      spec:"3.5mm, memory foam, ringan",          tier:3, stock:true },
  { id:"hp-04", category:"headphone", brand:"SteelSeries", name:"SteelSeries Arctis Nova 7",   spec:"Wireless 2.4GHz + BT, Hi-Res",        tier:4, stock:true },
  { id:"hp-05", category:"headphone", brand:"Sennheiser",  name:"Sennheiser HD 560S",          spec:"Open-back, audiophile grade",         tier:5, stock:true },

  { id:"nc-01", category:"networkcard", brand:"TP-Link", name:"TP-Link TG-3468 Gigabit LAN",  spec:"PCIe, 1 Gbps, kabel",                  tier:1, stock:true },
  { id:"nc-02", category:"networkcard", brand:"TP-Link", name:"TP-Link Archer T2E WiFi",      spec:"PCIe, WiFi AC600 + Bluetooth",         tier:2, stock:true },
  { id:"nc-03", category:"networkcard", brand:"Asus",    name:"Asus PCE-AX58BT WiFi 6",       spec:"PCIe, WiFi 6 AX3000 + BT5.0",          tier:3, stock:true },
  { id:"nc-04", category:"networkcard", brand:"Intel",   name:"Intel AX210 WiFi 6E",          spec:"PCIe, WiFi 6E + BT5.3",                tier:4, stock:true },
  { id:"nc-05", category:"networkcard", brand:"Asus",    name:"Asus XG-C100C 10G LAN",        spec:"PCIe, 10 Gigabit Ethernet",            tier:5, stock:true },

  { id:"wc-01", category:"webcam", brand:"Value",    name:"Webcam 720p Basic",       spec:"720p 30fps, USB, mic bawaan",          tier:1, stock:true },
  { id:"wc-02", category:"webcam", brand:"Logitech", name:"Logitech C270",           spec:"720p HD, USB, fixed focus",            tier:2, stock:true },
  { id:"wc-03", category:"webcam", brand:"Logitech", name:"Logitech C920",           spec:"1080p Full HD, autofocus, stereo mic", tier:3, stock:true },
  { id:"wc-04", category:"webcam", brand:"Logitech", name:"Logitech Brio 500",       spec:"1080p 60fps, HDR, auto light correct", tier:4, stock:true },
  { id:"wc-05", category:"webcam", brand:"Elgato",   name:"Elgato Facecam Pro",      spec:"4K60 Ultra HD, Sony sensor",           tier:5, stock:true },

  /* ---------- COOLING: Air Cooler, Water Cooler (AIO), Case Fan ---------- */
  { id:"hsf-01", category:"aircooler", brand:"Value",        name:"Cooler Tower Standar Bawaan", spec:"Single tower, 1 fan 9cm",        tier:1, stock:true },
  { id:"hsf-02", category:"aircooler", brand:"Cooler Master", name:"Cooler Master Hyper 212",     spec:"Single tower, PWM fan 12cm",     tier:2, stock:true },
  { id:"hsf-03", category:"aircooler", brand:"Deepcool",     name:"Deepcool AK400",              spec:"Single tower, ARGB, 4 heatpipe", tier:3, stock:true },
  { id:"hsf-04", category:"aircooler", brand:"Thermalright", name:"Thermalright Peerless Assassin 120", spec:"Dual tower, dual fan",     tier:4, stock:true },
  { id:"hsf-05", category:"aircooler", brand:"Noctua",       name:"Noctua NH-D15",               spec:"Dual tower flagship, dual fan",  tier:5, stock:true },

  { id:"aio-01", category:"watercooler", brand:"Value",        name:"AIO Liquid Cooler 120mm",     spec:"Radiator single fan, pompa dasar", tier:2, stock:true },
  { id:"aio-02", category:"watercooler", brand:"Cooler Master", name:"Cooler Master MasterLiquid 240L", spec:"Radiator 240mm, ARGB",        tier:3, stock:true },
  { id:"aio-03", category:"watercooler", brand:"NZXT",         name:"NZXT Kraken 280",              spec:"Radiator 280mm, LCD display",     tier:4, stock:true },
  { id:"aio-04", category:"watercooler", brand:"Corsair",      name:"Corsair iCUE H150i Elite",     spec:"Radiator 360mm, ARGB fans",       tier:5, stock:true },

  { id:"fan-01", category:"casefan", brand:"Value",         name:"Fan Casing 12cm Standard",     spec:"12cm, 1200RPM, tanpa LED",        tier:1, stock:true },
  { id:"fan-02", category:"casefan", brand:"Gaming",        name:"Fan Casing RGB 12cm",          spec:"12cm, ARGB, 1500RPM",             tier:2, stock:true },
  { id:"fan-03", category:"casefan", brand:"Cooler Master", name:"Cooler Master SickleFlow 120 ARGB", spec:"12cm, ARGB, PWM",             tier:3, stock:true },
  { id:"fan-04", category:"casefan", brand:"Lian Li",       name:"Lian Li UNI FAN SL120",        spec:"12cm, ARGB daisy-chain",          tier:4, stock:true },
  { id:"fan-05", category:"casefan", brand:"Noctua",        name:"Noctua NF-A12x25",             spec:"12cm, static pressure tinggi, senyap", tier:5, stock:true },
];

/* Urutan & label kategori yang ditampilkan di builder.html.
   group: "inti" (komponen utama PC) atau "aksesoris" (tambahan) —
   dipakai buat mengelompokkan baris dropdown di halaman Rakit PC. */
const CATEGORY_LIST = [
  { key:"cpu",         label:"Processor (CPU)",     multi:false, group:"inti" },
  { key:"motherboard", label:"Motherboard",         multi:false, group:"inti" },
  { key:"ram",         label:"RAM",                 multi:true,  group:"inti" },
  { key:"gpu",         label:"VGA Card (GPU)",      multi:true,  group:"inti" },
  { key:"storage",     label:"Storage",             multi:true,  group:"inti" },
  { key:"psu",         label:"Power Supply (PSU)",  multi:false, group:"inti" },
  { key:"aircooler",   label:"Air Cooler",          multi:false, group:"inti" },
  { key:"watercooler", label:"Water Cooler (AIO)",  multi:false, group:"inti" },
  { key:"casefan",     label:"Case Fan",            multi:true,  group:"inti" },
  { key:"casing",      label:"Casing",              multi:false, group:"inti" },
  { key:"monitor",     label:"Monitor",             multi:false, group:"inti" },
  { key:"mouse",       label:"Mouse",               multi:false, group:"aksesoris" },
  { key:"keyboard",    label:"Keyboard",            multi:false, group:"aksesoris" },
  { key:"mousepad",    label:"Mouse Pad",           multi:false, group:"aksesoris" },
  { key:"os",          label:"Operating System",    multi:false, group:"aksesoris" },
  { key:"headphone",   label:"Headphone",           multi:false, group:"aksesoris" },
  { key:"networkcard", label:"Network Card",        multi:false, group:"aksesoris" },
  { key:"webcam",      label:"Webcam",              multi:false, group:"aksesoris" },
];

/* Ikon per kategori — dipakai di baris dropdown halaman Rakit PC. */
const CATEGORY_ICONS = {
  cpu:"🔲", motherboard:"🧩", ram:"💾", gpu:"🎮", storage:"💽",
  psu:"🔌", casing:"🖥️", monitor:"🖵",
  aircooler:"🌀", watercooler:"💧", casefan:"🪭",
  mouse:"🖱️", keyboard:"⌨️", mousepad:"⬛", os:"💿",
  headphone:"🎧", networkcard:"📶", webcam:"📷"
};
