/* ============================================================
   XION GAMING — DATA PRODUK
   ------------------------------------------------------------
   Semua data di bawah ini masih CONTOH/PLACEHOLDER.
   Ganti nama, spek, dan atribut kompatibilitas dengan produk
   toko Anda yang sebenarnya sebelum go-live.

   Field kompatibilitas yang WAJIB diisi benar (dipakai untuk
   auto-filter & cek kecocokan di builder.html):
     - cpu.socket            -> harus sama dengan motherboard.socket
     - motherboard.memoryType -> harus sama dengan ram.memoryType
     - motherboard.formFactor -> dicek terhadap casing.supportedFormFactors
     - cpu.tdp / gpu.tdp     -> dipakai hitung estimasi kebutuhan watt PSU
     - tier (1-5)            -> dipakai untuk Build Score & rekomendasi monitor

   qtyMax menandai kategori yang boleh dipilih lebih dari satu unit
   (RAM, Storage, VGA/GPU untuk multi-GPU build).
   ============================================================ */

const PRODUCTS = [
  // ================= CPU =================
  { id:"cpu-01", category:"cpu", brand:"AMD",   name:"AMD Ryzen 5 5600",        spec:"6 Core / 12 Thread, 3.5GHz",       socket:"AM4",     tdp:65,  tier:2, stock:true },
  { id:"cpu-02", category:"cpu", brand:"AMD",   name:"AMD Ryzen 5 7600",        spec:"6 Core / 12 Thread, 3.8GHz",       socket:"AM5",     tdp:65,  tier:3, stock:true },
  { id:"cpu-03", category:"cpu", brand:"AMD",   name:"AMD Ryzen 7 7700X",       spec:"8 Core / 16 Thread, 4.5GHz",       socket:"AM5",     tdp:105, tier:4, stock:true },
  { id:"cpu-04", category:"cpu", brand:"AMD",   name:"AMD Ryzen 9 9950X3D",     spec:"16 Core / 32 Thread, 4.3GHz",      socket:"AM5",     tdp:170, tier:5, stock:true },
  { id:"cpu-05", category:"cpu", brand:"Intel", name:"Intel Core i5-12400F",    spec:"6 Core / 12 Thread, 2.5GHz",       socket:"LGA1700", tdp:65,  tier:2, stock:true },
  { id:"cpu-06", category:"cpu", brand:"Intel", name:"Intel Core i5-13400F",    spec:"10 Core / 16 Thread, 2.5GHz",      socket:"LGA1700", tdp:65,  tier:3, stock:true },
  { id:"cpu-07", category:"cpu", brand:"Intel", name:"Intel Core i7-14700K",    spec:"20 Core / 28 Thread, 3.4GHz",      socket:"LGA1700", tdp:125, tier:4, stock:true },
  { id:"cpu-08", category:"cpu", brand:"Intel", name:"Intel Core i9-14900K",    spec:"24 Core / 32 Thread, 3.2GHz",      socket:"LGA1700", tdp:125, tier:5, stock:false },

  // ============= MOTHERBOARD =============
  { id:"mobo-01", category:"motherboard", brand:"AMD",   name:"A520M Gaming",        spec:"Micro-ATX, DDR4",  socket:"AM4",     memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-02", category:"motherboard", brand:"AMD",   name:"B550 Gaming Plus",    spec:"ATX, DDR4",        socket:"AM4",     memoryType:"DDR4", formFactor:"ATX",       tier:2, stock:true },
  { id:"mobo-03", category:"motherboard", brand:"AMD",   name:"B650M-K",             spec:"Micro-ATX, DDR5",  socket:"AM5",     memoryType:"DDR5", formFactor:"MicroATX", tier:3, stock:true },
  { id:"mobo-04", category:"motherboard", brand:"AMD",   name:"X670E AORUS Elite",   spec:"ATX, DDR5",        socket:"AM5",     memoryType:"DDR5", formFactor:"ATX",       tier:4, stock:true },
  { id:"mobo-05", category:"motherboard", brand:"Intel", name:"H610M-K",             spec:"Micro-ATX, DDR4",  socket:"LGA1700", memoryType:"DDR4", formFactor:"MicroATX", tier:1, stock:true },
  { id:"mobo-06", category:"motherboard", brand:"Intel", name:"B760M DS3H",          spec:"Micro-ATX, DDR5",  socket:"LGA1700", memoryType:"DDR5", formFactor:"MicroATX", tier:3, stock:true },
  { id:"mobo-07", category:"motherboard", brand:"Intel", name:"Z790 AORUS Pro",      spec:"ATX, DDR5",        socket:"LGA1700", memoryType:"DDR5", formFactor:"ATX",       tier:4, stock:true },
  { id:"mobo-08", category:"motherboard", brand:"Intel", name:"Z790I ITX",           spec:"Mini-ITX, DDR5",   socket:"LGA1700", memoryType:"DDR5", formFactor:"ITX",       tier:4, stock:false },

  // ================= RAM =================
  { id:"ram-01", category:"ram", brand:"Value",   name:"RAM DDR4 8GB 3200MHz",    spec:"1x8GB, 3200MHz",  memoryType:"DDR4", capacity:8,  tier:1, stock:true, qtyMax:4 },
  { id:"ram-02", category:"ram", brand:"Value",   name:"RAM DDR4 16GB 3200MHz",   spec:"1x16GB, 3200MHz", memoryType:"DDR4", capacity:16, tier:2, stock:true, qtyMax:4 },
  { id:"ram-03", category:"ram", brand:"Gaming",  name:"RAM DDR4 16GB RGB 3600MHz",spec:"1x16GB, 3600MHz, RGB", memoryType:"DDR4", capacity:16, tier:3, stock:true, qtyMax:4 },
  { id:"ram-04", category:"ram", brand:"Value",   name:"RAM DDR5 16GB 5200MHz",   spec:"1x16GB, 5200MHz", memoryType:"DDR5", capacity:16, tier:3, stock:true, qtyMax:4 },
  { id:"ram-05", category:"ram", brand:"Gaming",  name:"RAM DDR5 32GB RGB 6000MHz",spec:"1x32GB, 6000MHz, RGB", memoryType:"DDR5", capacity:32, tier:4, stock:true, qtyMax:4 },
  { id:"ram-06", category:"ram", brand:"Enthusiast", name:"RAM DDR5 48GB 6400MHz",spec:"1x48GB, 6400MHz", memoryType:"DDR5", capacity:48, tier:5, stock:true, qtyMax:4 },

  // ================= GPU =================
  { id:"gpu-01", category:"gpu", brand:"Intel",  name:"Intel UHD Graphics 730 (Integrated)", spec:"iGPU, tanpa VRAM khusus", vram:0,  tdp:0,   tier:1, stock:true, qtyMax:1 },
  { id:"gpu-02", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 3050",        spec:"8GB GDDR6",   vram:8,  tdp:130, tier:2, stock:true, qtyMax:2 },
  { id:"gpu-03", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4060",        spec:"8GB GDDR6",   vram:8,  tdp:115, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-04", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4070 Super",  spec:"12GB GDDR6X", vram:12, tdp:220, tier:4, stock:true, qtyMax:2 },
  { id:"gpu-05", category:"gpu", brand:"NVIDIA", name:"GeForce RTX 4090",        spec:"24GB GDDR6X", vram:24, tdp:450, tier:5, stock:false, qtyMax:2 },
  { id:"gpu-06", category:"gpu", brand:"AMD",    name:"Radeon RX 7600",          spec:"8GB GDDR6",   vram:8,  tdp:165, tier:3, stock:true, qtyMax:2 },
  { id:"gpu-07", category:"gpu", brand:"AMD",    name:"Radeon RX 7900 XTX",      spec:"24GB GDDR6",  vram:24, tdp:355, tier:5, stock:true, qtyMax:2 },

  // ================ STORAGE ================
  { id:"sto-01", category:"storage", brand:"Value",  name:"SSD SATA 480GB",   spec:"SATA III, ~500MB/s",   type:"SSD-SATA", capacity:480,  tier:1, stock:true, qtyMax:6 },
  { id:"sto-02", category:"storage", brand:"Value",  name:"SSD NVMe 500GB",   spec:"NVMe Gen3, ~3500MB/s", type:"SSD-NVMe", capacity:500,  tier:2, stock:true, qtyMax:6 },
  { id:"sto-03", category:"storage", brand:"Gaming",  name:"SSD NVMe 1TB",     spec:"NVMe Gen4, ~7000MB/s", type:"SSD-NVMe", capacity:1000, tier:3, stock:true, qtyMax:6 },
  { id:"sto-04", category:"storage", brand:"Gaming",  name:"SSD NVMe 2TB",     spec:"NVMe Gen4, ~7000MB/s", type:"SSD-NVMe", capacity:2000, tier:4, stock:true, qtyMax:6 },
  { id:"sto-05", category:"storage", brand:"Value",  name:"HDD 1TB",          spec:"7200RPM, 3.5\"",       type:"HDD",      capacity:1000, tier:1, stock:true, qtyMax:6 },
  { id:"sto-06", category:"storage", brand:"Value",  name:"HDD 2TB",          spec:"7200RPM, 3.5\"",       type:"HDD",      capacity:2000, tier:1, stock:true, qtyMax:6 },

  // ================= PSU =================
  { id:"psu-01", category:"psu", brand:"Value",  name:"PSU 450W 80+",         spec:"450W, non-modular", wattage:450, tier:1, stock:true },
  { id:"psu-02", category:"psu", brand:"Value",  name:"PSU 550W 80+ Bronze",  spec:"550W, non-modular", wattage:550, tier:2, stock:true },
  { id:"psu-03", category:"psu", brand:"Gaming",  name:"PSU 650W 80+ Bronze",  spec:"650W, semi-modular",wattage:650, tier:3, stock:true },
  { id:"psu-04", category:"psu", brand:"Gaming",  name:"PSU 750W 80+ Gold",    spec:"750W, full-modular",wattage:750, tier:4, stock:true },
  { id:"psu-05", category:"psu", brand:"Enthusiast", name:"PSU 1000W 80+ Gold",spec:"1000W, full-modular",wattage:1000,tier:5, stock:true },

  // ================ CASING ================
  { id:"case-01", category:"casing", brand:"Value",  name:"Casing Micro-ATX Basic",   spec:"Mendukung Micro-ATX/ITX", supportedFormFactors:["MicroATX","ITX"], tier:1, stock:true },
  { id:"case-02", category:"casing", brand:"Gaming",  name:"Casing ATX Airflow RGB",   spec:"Mendukung ATX/MicroATX/ITX", supportedFormFactors:["ATX","MicroATX","ITX"], tier:3, stock:true },
  { id:"case-03", category:"casing", brand:"Gaming",  name:"Casing Mid Tower Tempered Glass", spec:"Mendukung ATX/MicroATX/ITX", supportedFormFactors:["ATX","MicroATX","ITX"], tier:3, stock:true },
  { id:"case-04", category:"casing", brand:"Enthusiast", name:"Casing Full Tower", spec:"Mendukung ATX/MicroATX/ITX, E-ATX ready", supportedFormFactors:["ATX","MicroATX","ITX"], tier:4, stock:true },
  { id:"case-05", category:"casing", brand:"Value",  name:"Casing Mini-ITX Compact",  spec:"Khusus Mini-ITX",  supportedFormFactors:["ITX"], tier:2, stock:true },

  // ================ MONITOR ================
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
