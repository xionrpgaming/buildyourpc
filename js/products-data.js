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

   =========================== CATATAN MIGRASI — MOHON DICEK ===========================
   1. tier dihitung OTOMATIS dari urutan harga lama (quintile), bukan dinilai manual
      per produk. Umumnya akurat, tapi kalau ada yang terasa janggal (mis. produk
      lama Anda tahu persis levelnya), tinggal ubah angka tier (1-5) manual di
      barisnya masing-masing.
   2. tdp (CPU & GPU) SAYA ISI berdasarkan spek umum tipe tersebut di pasaran
      (bukan dari data lama Anda, karena data lama tidak punya field ini). Cek lagi
      terutama untuk model yang jarang / edge-case.
   3. GAP DATA yang ditemukan saat migrasi (bukan salah migrasi, tapi memang belum
      ada padanannya di data lama Anda):
        - Casing "Mini-ITX Compact" (case-01) mendukung form factor ITX, TAPI tidak
          ada satupun motherboard ITX di data lama Anda (semua Micro-ATX/ATX/E-ATX).
          Kalau memang jual mobo ITX, tambahkan produknya biar match.
        - Motherboard "H81M" (mobo-11, LGA1150) pakai DDR3, tapi tidak ada produk
          RAM DDR3 di data lama Anda — builder akan menampilkan H81M tapi RAM-nya
          tidak akan ada yang cocok sampai Anda tambahkan RAM DDR3.
   =======================================================================================
   ============================================================ */

const PRODUCTS = [
  // ================= CPU =================
  { id:"cpu-01", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 2600", spec:"6 Core / 12 Thread, 3.4GHz base", socket:"AM4", generation:"Ryzen 2000", tdp:65, tier:1, stock:true },
  { id:"cpu-02", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 2700X", spec:"8 Core / 16 Thread, 3.7GHz base", socket:"AM4", generation:"Ryzen 2000", tdp:105, tier:2, stock:true },
  { id:"cpu-03", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 3600", spec:"6 Core / 12 Thread, 3.6GHz base", socket:"AM4", generation:"Ryzen 3000", tdp:65, tier:1, stock:true },
  { id:"cpu-04", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 3700X", spec:"8 Core / 16 Thread, 3.6GHz base", socket:"AM4", generation:"Ryzen 3000", tdp:65, tier:2, stock:true },
  { id:"cpu-05", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 5600", spec:"6 Core / 12 Thread, 3.5GHz base", socket:"AM4", generation:"Ryzen 5000", tdp:65, tier:2, stock:true },
  { id:"cpu-06", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 5700X3D", spec:"8 Core / 16 Thread, 3D V-Cache", socket:"AM4", generation:"Ryzen 5000", tdp:105, tier:3, stock:true },
  { id:"cpu-07", category:"cpu", brand:"AMD", name:"AMD Ryzen 5 7600", spec:"6 Core / 12 Thread, 3.8GHz base", socket:"AM5", generation:"Ryzen 7000", tdp:65, tier:3, stock:true },
  { id:"cpu-08", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 7700X", spec:"8 Core / 16 Thread, 4.5GHz base", socket:"AM5", generation:"Ryzen 7000", tdp:105, tier:4, stock:true },
  { id:"cpu-09", category:"cpu", brand:"AMD", name:"AMD Ryzen 7 9700X", spec:"8 Core / 16 Thread, 3.8GHz base", socket:"AM5", generation:"Ryzen 9000", tdp:65, tier:5, stock:true },
  { id:"cpu-10", category:"cpu", brand:"AMD", name:"AMD Ryzen 9 9950X", spec:"16 Core / 32 Thread, 4.3GHz base", socket:"AM5", generation:"Ryzen 9000", tdp:170, tier:5, stock:true },
  { id:"cpu-11", category:"cpu", brand:"AMD", name:"AMD Threadripper 7960X", spec:"24 Core / 48 Thread, HEDT", socket:"sTR5", generation:"Threadripper 7000", tdp:350, tier:5, stock:true },
  { id:"cpu-12", category:"cpu", brand:"AMD", name:"AMD Threadripper 7980X", spec:"64 Core / 128 Thread, HEDT", socket:"sTR5", generation:"Threadripper 7000", tdp:350, tier:5, stock:true },
  { id:"cpu-13", category:"cpu", brand:"Intel", name:"Intel Core Ultra 5 245K", spec:"14 Core / 14 Thread", socket:"LGA1851", generation:"Core Ultra 200", tdp:125, tier:4, stock:true },
  { id:"cpu-14", category:"cpu", brand:"Intel", name:"Intel Core Ultra 7 265K", spec:"20 Core / 20 Thread", socket:"LGA1851", generation:"Core Ultra 200", tdp:125, tier:5, stock:true },
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

  // ================= MOTHERBOARD =================
  { id:"mobo-01", category:"motherboard", brand:"AMD", name:"B650M", spec:"Micro-ATX, DDR5, PCIe 4.0", socket:"AM5", memoryType:"DDR5", formFactor:"MicroATX", tier:3, stock:true },
  { id:"mobo-02", category:"motherboard", brand:"AMD", name:"X670E", spec:"ATX, DDR5, PCIe 5.0", socket:"AM5", memoryType:"DDR5", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-03", category:"motherboard", brand:"AMD", name:"A520M", spec:"Micro-ATX, DDR4", socket:"AM4", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-04", category:"motherboard", brand:"AMD", name:"B550M", spec:"Micro-ATX, DDR4, PCIe 4.0", socket:"AM4", memoryType:"DDR4", formFactor:"MicroATX", tier:2, stock:true },
  { id:"mobo-05", category:"motherboard", brand:"AMD", name:"TRX50", spec:"E-ATX, DDR5, HEDT", socket:"sTR5", memoryType:"DDR5", formFactor:"EATX", tier:5, stock:true },
  { id:"mobo-06", category:"motherboard", brand:"Intel", name:"Z890", spec:"ATX, DDR5, WiFi 7", socket:"LGA1851", memoryType:"DDR5", formFactor:"ATX", tier:5, stock:true },
  { id:"mobo-07", category:"motherboard", brand:"Intel", name:"B660M", spec:"Micro-ATX, DDR4", socket:"LGA1700", memoryType:"DDR4", formFactor:"MicroATX", tier:3, stock:true },
  { id:"mobo-08", category:"motherboard", brand:"Intel", name:"Z790", spec:"ATX, DDR5, WiFi 6", socket:"LGA1700", memoryType:"DDR5", formFactor:"ATX", tier:4, stock:true },
  { id:"mobo-09", category:"motherboard", brand:"Intel", name:"B560M", spec:"Micro-ATX, DDR4", socket:"LGA1200", memoryType:"DDR4", formFactor:"MicroATX", tier:2, stock:true },
  { id:"mobo-10", category:"motherboard", brand:"Intel", name:"B365M", spec:"Micro-ATX, DDR4", socket:"LGA1151", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-11", category:"motherboard", brand:"Intel", name:"H81M", spec:"Micro-ATX, DDR3", socket:"LGA1150", memoryType:"DDR3", formFactor:"MicroATX", tier:1, stock:true },

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
  { id:"gpu-22", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4060 8GB", spec:"8GB GDDR6, DLSS 3", series:"RTX 40", tdp:115, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-23", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4060 Ti 8GB", spec:"8GB GDDR6, DLSS 3", series:"RTX 40", tdp:160, vram:8, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-24", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4070 12GB", spec:"12GB GDDR6X, DLSS 3", series:"RTX 40", tdp:200, vram:12, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-25", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4070 Ti Super 16GB", spec:"16GB GDDR6X, DLSS 3", series:"RTX 40", tdp:285, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-26", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4080 Super 16GB", spec:"16GB GDDR6X, DLSS 3", series:"RTX 40", tdp:320, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-27", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4090 24GB", spec:"24GB GDDR6X, DLSS 3", series:"RTX 40", tdp:450, vram:24, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-28", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5060 8GB", spec:"8GB GDDR7, DLSS 4", series:"RTX 50", tdp:145, vram:8, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-29", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5070 12GB", spec:"12GB GDDR7, DLSS 4", series:"RTX 50", tdp:250, vram:12, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-30", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5070 Ti 16GB", spec:"16GB GDDR7, DLSS 4", series:"RTX 50", tdp:300, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-31", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 5080 16GB", spec:"16GB GDDR7, DLSS 4", series:"RTX 50", tdp:360, vram:16, tier:5, stock:true, qtyMax:2 },
  { id:"gpu-32", category:"gpu", brand:"AMD", name:"Radeon RX 6600 8GB", spec:"8GB GDDR6, 128-bit", series:"Radeon RX 6000", tdp:132, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-33", category:"gpu", brand:"AMD", name:"Radeon RX 6700 XT 12GB", spec:"12GB GDDR6, 192-bit", series:"Radeon RX 6000", tdp:230, vram:12, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-34", category:"gpu", brand:"AMD", name:"Radeon RX 6800 XT 16GB", spec:"16GB GDDR6, 256-bit", series:"Radeon RX 6000", tdp:300, vram:16, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-35", category:"gpu", brand:"AMD", name:"Radeon RX 7600 8GB", spec:"8GB GDDR6, 128-bit", series:"Radeon RX 7000", tdp:165, vram:8, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-36", category:"gpu", brand:"AMD", name:"Radeon RX 7800 XT 16GB", spec:"16GB GDDR6, 256-bit", series:"Radeon RX 7000", tdp:263, vram:16, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-37", category:"gpu", brand:"AMD", name:"Radeon RX 7900 XTX 24GB", spec:"24GB GDDR6, 384-bit", series:"Radeon RX 7000", tdp:355, vram:24, tier:5, stock:true, qtyMax:2 },

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

  // ================= PSU =================
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
];

/* Urutan & label kategori yang ditampilkan di builder.html */
const CATEGORY_LIST = [
  { key:"cpu",         label:"Processor (CPU)", multi:false },
  { key:"motherboard", label:"Motherboard",     multi:false },
  { key:"ram",         label:"RAM",             multi:true  },
  { key:"gpu",         label:"VGA Card (GPU)",  multi:true  },
  { key:"storage",     label:"Storage",         multi:true  },
  { key:"psu",         label:"Power Supply (PSU)", multi:false },
  { key:"casing",      label:"Casing",          multi:false },
  { key:"monitor",     label:"Monitor",         multi:false },
];
