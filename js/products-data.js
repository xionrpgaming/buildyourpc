/**
 * XION GAMING — Data Katalog Komponen
 * -------------------------------------------------
 * Ini data CONTOH/PLACEHOLDER. Ganti harga dan spek sesuai
 * stok toko Anda yang sebenarnya. Tambah/hapus item bebas.
 *
 * PRINSIP PENAMAAN: fokus ke TIPE komponen, bukan brand/merek
 * board partner (ASUS, MSI, dst). Contoh: VGA ditulis
 * "GeForce RTX 4060" atau "Radeon RX 6600", bukan
 * "ASUS GeForce RTX 4060 Dual".
 *
 * Field umum:
 *  id       -> unik, tidak boleh sama antar produk
 *  category -> cpu | motherboard | ram | gpu | storage | psu | casing
 *  name     -> nama TIPE produk (tanpa brand)
 *  spec     -> ringkasan spesifikasi (1 baris)
 *  price    -> angka, dalam Rupiah (tanpa titik/koma)
 *
 * Field cluster/filter (harus cocok dengan XION_FILTERS di bawah):
 *  cpu          -> socket, generation
 *  motherboard  -> socket
 *  ram          -> memType, capacity, speed
 *  gpu          -> series
 *  storage      -> type, capacity, speedTier
 *  psu          -> wattage, rating
 *  casing       -> formFactor
 */

const XION_PRODUCTS = [
  // ================= CPU (cluster: socket, generation) =================
  // -- AM4 --
  { id: "cpu-01", category: "cpu", name: "Ryzen 5 2600", spec: "6 Core / 12 Thread, 3.4GHz base", price: 950000, socket: "AM4", generation: "Ryzen 2000" },
  { id: "cpu-02", category: "cpu", name: "Ryzen 7 2700X", spec: "8 Core / 16 Thread, 3.7GHz base", price: 1350000, socket: "AM4", generation: "Ryzen 2000" },
  { id: "cpu-03", category: "cpu", name: "Ryzen 5 3600", spec: "6 Core / 12 Thread, 3.6GHz base", price: 1250000, socket: "AM4", generation: "Ryzen 3000" },
  { id: "cpu-04", category: "cpu", name: "Ryzen 7 3700X", spec: "8 Core / 16 Thread, 3.6GHz base", price: 1850000, socket: "AM4", generation: "Ryzen 3000" },
  { id: "cpu-05", category: "cpu", name: "Ryzen 5 5600", spec: "6 Core / 12 Thread, 3.5GHz base", price: 1650000, socket: "AM4", generation: "Ryzen 5000" },
  { id: "cpu-06", category: "cpu", name: "Ryzen 7 5700X3D", spec: "8 Core / 16 Thread, 3D V-Cache", price: 3450000, socket: "AM4", generation: "Ryzen 5000" },
  // -- AM5 --
  { id: "cpu-07", category: "cpu", name: "Ryzen 5 7600", spec: "6 Core / 12 Thread, 3.8GHz base", price: 3150000, socket: "AM5", generation: "Ryzen 7000" },
  { id: "cpu-08", category: "cpu", name: "Ryzen 7 7700X", spec: "8 Core / 16 Thread, 4.5GHz base", price: 5350000, socket: "AM5", generation: "Ryzen 7000" },
  { id: "cpu-09", category: "cpu", name: "Ryzen 7 9700X", spec: "8 Core / 16 Thread, 3.8GHz base", price: 6250000, socket: "AM5", generation: "Ryzen 9000" },
  { id: "cpu-10", category: "cpu", name: "Ryzen 9 9950X", spec: "16 Core / 32 Thread, 4.3GHz base", price: 11450000, socket: "AM5", generation: "Ryzen 9000" },
  // -- sTR5 --
  { id: "cpu-11", category: "cpu", name: "Threadripper 7960X", spec: "24 Core / 48 Thread, HEDT", price: 32500000, socket: "sTR5", generation: "Threadripper 7000" },
  { id: "cpu-12", category: "cpu", name: "Threadripper 7980X", spec: "64 Core / 128 Thread, HEDT", price: 89500000, socket: "sTR5", generation: "Threadripper 7000" },
  // -- LGA1851 --
  { id: "cpu-13", category: "cpu", name: "Core Ultra 5 245K", spec: "14 Core / 14 Thread", price: 5450000, socket: "LGA1851", generation: "Core Ultra 200" },
  { id: "cpu-14", category: "cpu", name: "Core Ultra 7 265K", spec: "20 Core / 20 Thread", price: 7450000, socket: "LGA1851", generation: "Core Ultra 200" },
  // -- LGA1700 --
  { id: "cpu-15", category: "cpu", name: "Core i5-12400F", spec: "6 Core / 12 Thread, 2.5GHz base", price: 2150000, socket: "LGA1700", generation: "Core Gen 12" },
  { id: "cpu-16", category: "cpu", name: "Core i7-12700K", spec: "12 Core / 20 Thread", price: 4450000, socket: "LGA1700", generation: "Core Gen 12" },
  { id: "cpu-17", category: "cpu", name: "Core i5-13400F", spec: "10 Core / 16 Thread", price: 2950000, socket: "LGA1700", generation: "Core Gen 13" },
  { id: "cpu-18", category: "cpu", name: "Core i7-13700K", spec: "16 Core / 24 Thread", price: 5450000, socket: "LGA1700", generation: "Core Gen 13" },
  { id: "cpu-19", category: "cpu", name: "Core i5-14400F", spec: "10 Core / 16 Thread", price: 3150000, socket: "LGA1700", generation: "Core Gen 14" },
  { id: "cpu-20", category: "cpu", name: "Core i7-14700K", spec: "20 Core / 28 Thread", price: 5950000, socket: "LGA1700", generation: "Core Gen 14" },
  // -- LGA1200 --
  { id: "cpu-21", category: "cpu", name: "Core i5-10400F", spec: "6 Core / 12 Thread, 2.9GHz base", price: 1450000, socket: "LGA1200", generation: "Core Gen 10" },
  { id: "cpu-22", category: "cpu", name: "Core i5-11400F", spec: "6 Core / 12 Thread, 2.6GHz base", price: 1950000, socket: "LGA1200", generation: "Core Gen 11" },
  // -- LGA1151 --
  { id: "cpu-23", category: "cpu", name: "Core i5-7500", spec: "4 Core / 4 Thread, 3.4GHz base", price: 1050000, socket: "LGA1151", generation: "Core Gen 6-7" },
  { id: "cpu-24", category: "cpu", name: "Core i5-8400", spec: "6 Core / 6 Thread, 2.8GHz base", price: 1250000, socket: "LGA1151", generation: "Core Gen 8-9" },
  { id: "cpu-25", category: "cpu", name: "Core i5-9400F", spec: "6 Core / 6 Thread, 2.9GHz base", price: 1450000, socket: "LGA1151", generation: "Core Gen 8-9" },
  // -- LGA1150 --
  { id: "cpu-26", category: "cpu", name: "Core i5-4460", spec: "4 Core / 4 Thread, 3.2GHz base", price: 850000, socket: "LGA1150", generation: "Core Gen 4" },
  { id: "cpu-27", category: "cpu", name: "Core i5-4590", spec: "4 Core / 4 Thread, 3.3GHz base", price: 900000, socket: "LGA1150", generation: "Core Gen 4" },

  // ================= MOTHERBOARD (cluster: socket) =================
  { id: "mobo-01", category: "motherboard", name: "B650M", spec: "Micro-ATX, DDR5, PCIe 4.0", price: 2450000, socket: "AM5" },
  { id: "mobo-02", category: "motherboard", name: "X670E", spec: "ATX, DDR5, PCIe 5.0", price: 5450000, socket: "AM5" },
  { id: "mobo-03", category: "motherboard", name: "A520M", spec: "Micro-ATX, DDR4", price: 950000, socket: "AM4" },
  { id: "mobo-04", category: "motherboard", name: "B550M", spec: "Micro-ATX, DDR4, PCIe 4.0", price: 1550000, socket: "AM4" },
  { id: "mobo-05", category: "motherboard", name: "TRX50", spec: "E-ATX, DDR5, HEDT", price: 9450000, socket: "sTR5" },
  { id: "mobo-06", category: "motherboard", name: "Z890", spec: "ATX, DDR5, WiFi 7", price: 6250000, socket: "LGA1851" },
  { id: "mobo-07", category: "motherboard", name: "B660M", spec: "Micro-ATX, DDR4", price: 1750000, socket: "LGA1700" },
  { id: "mobo-08", category: "motherboard", name: "Z790", spec: "ATX, DDR5, WiFi 6", price: 3650000, socket: "LGA1700" },
  { id: "mobo-09", category: "motherboard", name: "B560M", spec: "Micro-ATX, DDR4", price: 1250000, socket: "LGA1200" },
  { id: "mobo-10", category: "motherboard", name: "B365M", spec: "Micro-ATX, DDR4", price: 950000, socket: "LGA1151" },
  { id: "mobo-11", category: "motherboard", name: "H81M", spec: "Micro-ATX, DDR3", price: 550000, socket: "LGA1150" },

  // ================= RAM (cluster: memType, capacity, speed) =================
  // -- DDR4 --
  { id: "ram-01", category: "ram", name: "DDR4 8GB", spec: "1x8GB, CL16, Single Channel", price: 320000, memType: "DDR4", capacity: "8GB", speed: "2400MHz" },
  { id: "ram-02", category: "ram", name: "DDR4 8GB Kit", spec: "2x4GB, CL16, Dual Channel", price: 350000, memType: "DDR4", capacity: "8GB", speed: "3200MHz" },
  { id: "ram-03", category: "ram", name: "DDR4 16GB Kit", spec: "2x8GB, CL16, Dual Channel", price: 620000, memType: "DDR4", capacity: "16GB", speed: "3200MHz" },
  { id: "ram-04", category: "ram", name: "DDR4 16GB Kit OC", spec: "2x8GB, CL18, Dual Channel", price: 720000, memType: "DDR4", capacity: "16GB", speed: "3600MHz" },
  { id: "ram-05", category: "ram", name: "DDR4 32GB Kit", spec: "2x16GB, CL18, Dual Channel", price: 1250000, memType: "DDR4", capacity: "32GB", speed: "3600MHz" },
  { id: "ram-06", category: "ram", name: "DDR4 32GB Kit OC", spec: "2x16GB, CL19, Dual Channel", price: 1450000, memType: "DDR4", capacity: "32GB", speed: "4000MHz" },
  { id: "ram-07", category: "ram", name: "DDR4 64GB Kit", spec: "2x32GB, CL18, Dual Channel", price: 2650000, memType: "DDR4", capacity: "64GB", speed: "3200MHz" },
  // -- DDR5 --
  { id: "ram-08", category: "ram", name: "DDR5 8GB", spec: "1x8GB, CL40, Single Channel", price: 550000, memType: "DDR5", capacity: "8GB", speed: "4800MHz" },
  { id: "ram-09", category: "ram", name: "DDR5 16GB", spec: "1x16GB, CL40, Single Channel", price: 750000, memType: "DDR5", capacity: "16GB", speed: "4800MHz" },
  { id: "ram-10", category: "ram", name: "DDR5 16GB Kit", spec: "2x8GB, CL36, Dual Channel", price: 950000, memType: "DDR5", capacity: "16GB", speed: "5600MHz" },
  { id: "ram-11", category: "ram", name: "DDR5 32GB Kit", spec: "2x16GB, CL36, Dual Channel", price: 1550000, memType: "DDR5", capacity: "32GB", speed: "6000MHz" },
  { id: "ram-12", category: "ram", name: "DDR5 32GB Kit OC", spec: "2x16GB, CL38, Dual Channel", price: 1850000, memType: "DDR5", capacity: "32GB", speed: "6400MHz" },
  { id: "ram-13", category: "ram", name: "DDR5 64GB Kit", spec: "2x32GB, CL36, Dual Channel", price: 3150000, memType: "DDR5", capacity: "64GB", speed: "6000MHz" },
  { id: "ram-14", category: "ram", name: "DDR5 64GB Kit OC", spec: "2x32GB, CL38, Dual Channel", price: 3650000, memType: "DDR5", capacity: "64GB", speed: "6400MHz" },

  // ================= GPU (cluster: series) =================
  // -- GTX 900 (Maxwell) --
  { id: "gpu-01", category: "gpu", name: "GeForce GTX 950 2GB", spec: "2GB GDDR5, 128-bit", price: 950000, series: "GTX 900" },
  { id: "gpu-02", category: "gpu", name: "GeForce GTX 960 4GB", spec: "4GB GDDR5, 128-bit", price: 1150000, series: "GTX 900" },
  { id: "gpu-03", category: "gpu", name: "GeForce GTX 970 4GB", spec: "4GB GDDR5, 256-bit", price: 1450000, series: "GTX 900" },
  { id: "gpu-04", category: "gpu", name: "GeForce GTX 980 Ti 6GB", spec: "6GB GDDR5, 384-bit", price: 1950000, series: "GTX 900" },
  // -- GTX 10 (Pascal) --
  { id: "gpu-05", category: "gpu", name: "GeForce GTX 1050 Ti 4GB", spec: "4GB GDDR5, 128-bit", price: 1350000, series: "GTX 10" },
  { id: "gpu-06", category: "gpu", name: "GeForce GTX 1060 6GB", spec: "6GB GDDR5, 192-bit", price: 1850000, series: "GTX 10" },
  { id: "gpu-07", category: "gpu", name: "GeForce GTX 1070 8GB", spec: "8GB GDDR5, 256-bit", price: 2450000, series: "GTX 10" },
  { id: "gpu-08", category: "gpu", name: "GeForce GTX 1080 Ti 11GB", spec: "11GB GDDR5X, 352-bit", price: 3450000, series: "GTX 10" },
  // -- GTX 16 (Turing, tanpa RT) --
  { id: "gpu-09", category: "gpu", name: "GeForce GTX 1650 4GB", spec: "4GB GDDR6, 128-bit", price: 1850000, series: "GTX 16" },
  { id: "gpu-10", category: "gpu", name: "GeForce GTX 1650 Super 4GB", spec: "4GB GDDR6, 128-bit", price: 2050000, series: "GTX 16" },
  { id: "gpu-11", category: "gpu", name: "GeForce GTX 1660 Super 6GB", spec: "6GB GDDR6, 192-bit", price: 2450000, series: "GTX 16" },
  { id: "gpu-12", category: "gpu", name: "GeForce GTX 1660 Ti 6GB", spec: "6GB GDDR6, 192-bit", price: 2650000, series: "GTX 16" },
  // -- RTX 20 --
  { id: "gpu-13", category: "gpu", name: "GeForce RTX 2060 6GB", spec: "6GB GDDR6, Ray Tracing Gen 1", price: 2850000, series: "RTX 20" },
  { id: "gpu-14", category: "gpu", name: "GeForce RTX 2060 Super 8GB", spec: "8GB GDDR6, Ray Tracing Gen 1", price: 3150000, series: "RTX 20" },
  { id: "gpu-15", category: "gpu", name: "GeForce RTX 2070 Super 8GB", spec: "8GB GDDR6, Ray Tracing Gen 1", price: 3650000, series: "RTX 20" },
  { id: "gpu-16", category: "gpu", name: "GeForce RTX 2080 Ti 11GB", spec: "11GB GDDR6, Ray Tracing Gen 1", price: 5450000, series: "RTX 20" },
  // -- RTX 30 --
  { id: "gpu-17", category: "gpu", name: "GeForce RTX 3050 8GB", spec: "8GB GDDR6, Ray Tracing Gen 2", price: 3450000, series: "RTX 30" },
  { id: "gpu-18", category: "gpu", name: "GeForce RTX 3060 12GB", spec: "12GB GDDR6, Ray Tracing Gen 2", price: 4250000, series: "RTX 30" },
  { id: "gpu-19", category: "gpu", name: "GeForce RTX 3070 8GB", spec: "8GB GDDR6, Ray Tracing Gen 2", price: 5450000, series: "RTX 30" },
  { id: "gpu-20", category: "gpu", name: "GeForce RTX 3080 10GB", spec: "10GB GDDR6X, Ray Tracing Gen 2", price: 7450000, series: "RTX 30" },
  { id: "gpu-21", category: "gpu", name: "GeForce RTX 3090 24GB", spec: "24GB GDDR6X, Ray Tracing Gen 2", price: 14450000, series: "RTX 30" },
  // -- RTX 40 --
  { id: "gpu-22", category: "gpu", name: "GeForce RTX 4060 8GB", spec: "8GB GDDR6, DLSS 3", price: 5450000, series: "RTX 40" },
  { id: "gpu-23", category: "gpu", name: "GeForce RTX 4060 Ti 8GB", spec: "8GB GDDR6, DLSS 3", price: 6450000, series: "RTX 40" },
  { id: "gpu-24", category: "gpu", name: "GeForce RTX 4070 12GB", spec: "12GB GDDR6X, DLSS 3", price: 9250000, series: "RTX 40" },
  { id: "gpu-25", category: "gpu", name: "GeForce RTX 4070 Ti Super 16GB", spec: "16GB GDDR6X, DLSS 3", price: 13450000, series: "RTX 40" },
  { id: "gpu-26", category: "gpu", name: "GeForce RTX 4080 Super 16GB", spec: "16GB GDDR6X, DLSS 3", price: 16450000, series: "RTX 40" },
  { id: "gpu-27", category: "gpu", name: "GeForce RTX 4090 24GB", spec: "24GB GDDR6X, DLSS 3", price: 27450000, series: "RTX 40" },
  // -- RTX 50 --
  { id: "gpu-28", category: "gpu", name: "GeForce RTX 5060 8GB", spec: "8GB GDDR7, DLSS 4", price: 6450000, series: "RTX 50" },
  { id: "gpu-29", category: "gpu", name: "GeForce RTX 5070 12GB", spec: "12GB GDDR7, DLSS 4", price: 10450000, series: "RTX 50" },
  { id: "gpu-30", category: "gpu", name: "GeForce RTX 5070 Ti 16GB", spec: "16GB GDDR7, DLSS 4", price: 14950000, series: "RTX 50" },
  { id: "gpu-31", category: "gpu", name: "GeForce RTX 5080 16GB", spec: "16GB GDDR7, DLSS 4", price: 19450000, series: "RTX 50" },
  // -- Radeon RX 6000 --
  { id: "gpu-32", category: "gpu", name: "Radeon RX 6600 8GB", spec: "8GB GDDR6, 128-bit", price: 3950000, series: "Radeon RX 6000" },
  { id: "gpu-33", category: "gpu", name: "Radeon RX 6700 XT 12GB", spec: "12GB GDDR6, 192-bit", price: 5950000, series: "Radeon RX 6000" },
  { id: "gpu-34", category: "gpu", name: "Radeon RX 6800 XT 16GB", spec: "16GB GDDR6, 256-bit", price: 8450000, series: "Radeon RX 6000" },
  // -- Radeon RX 7000 --
  { id: "gpu-35", category: "gpu", name: "Radeon RX 7600 8GB", spec: "8GB GDDR6, 128-bit", price: 5250000, series: "Radeon RX 7000" },
  { id: "gpu-36", category: "gpu", name: "Radeon RX 7800 XT 16GB", spec: "16GB GDDR6, 256-bit", price: 9450000, series: "Radeon RX 7000" },
  { id: "gpu-37", category: "gpu", name: "Radeon RX 7900 XTX 24GB", spec: "24GB GDDR6, 384-bit", price: 16450000, series: "Radeon RX 7000" },

  // ================= STORAGE (cluster: type, capacity, speedTier) =================
  { id: "sto-01", category: "storage", name: "NVMe SSD 500GB", spec: "PCIe 3.0, up to 3500MB/s", price: 420000, type: "NVMe SSD", capacity: "500GB", speedTier: "PCIe Gen3" },
  { id: "sto-02", category: "storage", name: "NVMe SSD 1TB", spec: "PCIe 3.0, up to 3500MB/s", price: 750000, type: "NVMe SSD", capacity: "1TB", speedTier: "PCIe Gen3" },
  { id: "sto-03", category: "storage", name: "NVMe SSD 1TB Gen4", spec: "PCIe 4.0, up to 7000MB/s", price: 1150000, type: "NVMe SSD", capacity: "1TB", speedTier: "PCIe Gen4" },
  { id: "sto-04", category: "storage", name: "NVMe SSD 2TB Gen4", spec: "PCIe 4.0, up to 7000MB/s", price: 2150000, type: "NVMe SSD", capacity: "2TB", speedTier: "PCIe Gen4" },
  { id: "sto-05", category: "storage", name: "NVMe SSD 1TB Gen5", spec: "PCIe 5.0, up to 12000MB/s", price: 1950000, type: "NVMe SSD", capacity: "1TB", speedTier: "PCIe Gen5" },
  { id: "sto-06", category: "storage", name: "SATA SSD 500GB", spec: "2.5\", up to 550MB/s", price: 380000, type: "SATA SSD", capacity: "500GB", speedTier: "SATA III" },
  { id: "sto-07", category: "storage", name: "SATA SSD 1TB", spec: "2.5\", up to 550MB/s", price: 650000, type: "SATA SSD", capacity: "1TB", speedTier: "SATA III" },
  { id: "sto-08", category: "storage", name: "HDD 1TB", spec: "3.5\", SATA III", price: 550000, type: "HDD", capacity: "1TB", speedTier: "7200RPM" },
  { id: "sto-09", category: "storage", name: "HDD 2TB", spec: "3.5\", SATA III", price: 850000, type: "HDD", capacity: "2TB", speedTier: "7200RPM" },
  { id: "sto-10", category: "storage", name: "HDD 4TB", spec: "3.5\", SATA III, hemat daya", price: 1450000, type: "HDD", capacity: "4TB", speedTier: "5400RPM" },

  // ================= PSU (cluster: wattage, rating) =================
  { id: "psu-01", category: "psu", name: "PSU 450W Bronze", spec: "80+ Bronze, Non-modular", price: 420000, wattage: "450W", rating: "80+ Bronze" },
  { id: "psu-02", category: "psu", name: "PSU 450W Gold", spec: "80+ Gold, Non-modular", price: 550000, wattage: "450W", rating: "80+ Gold" },
  { id: "psu-03", category: "psu", name: "PSU 500W Bronze", spec: "80+ Bronze, Non-modular", price: 480000, wattage: "500W", rating: "80+ Bronze" },
  { id: "psu-04", category: "psu", name: "PSU 500W Silver", spec: "80+ Silver, Non-modular", price: 550000, wattage: "500W", rating: "80+ Silver" },
  { id: "psu-05", category: "psu", name: "PSU 550W Bronze", spec: "80+ Bronze, Non-modular", price: 550000, wattage: "550W", rating: "80+ Bronze" },
  { id: "psu-06", category: "psu", name: "PSU 550W Gold", spec: "80+ Gold, Semi-modular", price: 680000, wattage: "550W", rating: "80+ Gold" },
  { id: "psu-07", category: "psu", name: "PSU 600W Bronze", spec: "80+ Bronze, Non-modular", price: 600000, wattage: "600W", rating: "80+ Bronze" },
  { id: "psu-08", category: "psu", name: "PSU 600W Gold", spec: "80+ Gold, Semi-modular", price: 750000, wattage: "600W", rating: "80+ Gold" },
  { id: "psu-09", category: "psu", name: "PSU 650W Bronze", spec: "80+ Bronze, Semi-modular", price: 700000, wattage: "650W", rating: "80+ Bronze" },
  { id: "psu-10", category: "psu", name: "PSU 650W Gold", spec: "80+ Gold, Semi-modular", price: 850000, wattage: "650W", rating: "80+ Gold" },
  { id: "psu-11", category: "psu", name: "PSU 650W Platinum", spec: "80+ Platinum, Full-modular", price: 1050000, wattage: "650W", rating: "80+ Platinum" },
  { id: "psu-12", category: "psu", name: "PSU 700W Gold", spec: "80+ Gold, Semi-modular", price: 950000, wattage: "700W", rating: "80+ Gold" },
  { id: "psu-13", category: "psu", name: "PSU 700W Platinum", spec: "80+ Platinum, Full-modular", price: 1250000, wattage: "700W", rating: "80+ Platinum" },
  { id: "psu-14", category: "psu", name: "PSU 750W Gold", spec: "80+ Gold, Full-modular", price: 1150000, wattage: "750W", rating: "80+ Gold" },
  { id: "psu-15", category: "psu", name: "PSU 750W Platinum", spec: "80+ Platinum, Full-modular", price: 1450000, wattage: "750W", rating: "80+ Platinum" },
  { id: "psu-16", category: "psu", name: "PSU 750W Titanium", spec: "80+ Titanium, Full-modular", price: 1750000, wattage: "750W", rating: "80+ Titanium" },
  { id: "psu-17", category: "psu", name: "PSU 850W Gold", spec: "80+ Gold, Full-modular", price: 1650000, wattage: "850W", rating: "80+ Gold" },
  { id: "psu-18", category: "psu", name: "PSU 850W Platinum", spec: "80+ Platinum, Full-modular", price: 1950000, wattage: "850W", rating: "80+ Platinum" },
  { id: "psu-19", category: "psu", name: "PSU 1000W Platinum", spec: "80+ Platinum, Full-modular", price: 2450000, wattage: "1000W", rating: "80+ Platinum" },
  { id: "psu-20", category: "psu", name: "PSU 1000W Titanium", spec: "80+ Titanium, Full-modular", price: 2850000, wattage: "1000W", rating: "80+ Titanium" },
  { id: "psu-21", category: "psu", name: "PSU 1200W Platinum", spec: "80+ Platinum, Full-modular, HEDT/Multi-GPU", price: 3450000, wattage: "1200W", rating: "80+ Platinum" },
  { id: "psu-22", category: "psu", name: "PSU 1200W Titanium", spec: "80+ Titanium, Full-modular, HEDT/Multi-GPU", price: 3950000, wattage: "1200W", rating: "80+ Titanium" },
  { id: "psu-23", category: "psu", name: "PSU 1600W Titanium", spec: "80+ Titanium, Full-modular, HEDT/Multi-GPU", price: 5450000, wattage: "1600W", rating: "80+ Titanium" },

  // ================= CASING (cluster: formFactor) =================
  { id: "case-01", category: "casing", name: "Mini-ITX Compact", spec: "Ringkas, untuk mobo Mini-ITX", price: 550000, formFactor: "Mini-ITX" },
  { id: "case-02", category: "casing", name: "Micro ATX Basic", spec: "Tanpa fan RGB", price: 380000, formFactor: "Micro ATX" },
  { id: "case-03", category: "casing", name: "Mid Tower Airflow", spec: "ATX, 3 fan preinstalled", price: 650000, formFactor: "Mid Tower" },
  { id: "case-04", category: "casing", name: "Full Tower RGB Premium", spec: "E-ATX support, 6 fan ARGB", price: 1450000, formFactor: "Full Tower" },
  { id: "case-05", category: "casing", name: "Super Tower Extreme", spec: "E-ATX, ruang GPU & radiator ekstra besar", price: 2650000, formFactor: "Super Tower" },
];

const XION_CATEGORIES = [
  { key: "cpu", label: "Processor", icon: "cpu" },
  { key: "motherboard", label: "Motherboard", icon: "motherboard" },
  { key: "ram", label: "RAM", icon: "ram" },
  { key: "gpu", label: "VGA Card", icon: "gpu" },
  { key: "storage", label: "Storage", icon: "storage" },
  { key: "psu", label: "Power Supply", icon: "psu" },
  { key: "casing", label: "Casing", icon: "casing" },
];

/**
 * XION_FILTERS — daftar filter per kategori di halaman Rakit PC.
 * Satu kategori boleh punya LEBIH DARI SATU filter (array).
 * Filter-filter ini saling "cascading" — pilihan pada satu filter
 * akan mempersempit opsi yang muncul di filter lain pada kategori
 * yang sama (lihat app.js).
 * "key" harus cocok dengan field di XION_PRODUCTS.
 * "order" (opsional) menentukan urutan tampil chip.
 */
const XION_FILTERS = {
  cpu: [
    { key: "socket", label: "Socket", order: ["AM5", "AM4", "sTR5", "LGA1851", "LGA1700", "LGA1200", "LGA1151", "LGA1150"] },
    { key: "generation", label: "Generasi", order: ["Ryzen 9000", "Ryzen 7000", "Ryzen 5000", "Ryzen 3000", "Ryzen 2000", "Threadripper 7000", "Core Ultra 200", "Core Gen 14", "Core Gen 13", "Core Gen 12", "Core Gen 11", "Core Gen 10", "Core Gen 8-9", "Core Gen 6-7", "Core Gen 5", "Core Gen 4"] },
  ],
  motherboard: [
    { key: "socket", label: "Socket", order: ["AM5", "AM4", "sTR5", "LGA1851", "LGA1700", "LGA1200", "LGA1151", "LGA1150"] },
  ],
  ram: [
    { key: "memType", label: "Tipe", order: ["DDR4", "DDR5"] },
    { key: "capacity", label: "Kapasitas", order: ["8GB", "16GB", "32GB", "64GB"] },
    { key: "speed", label: "Speed", order: ["2400MHz", "3200MHz", "3600MHz", "4000MHz", "4800MHz", "5600MHz", "6000MHz", "6400MHz"] },
  ],
  gpu: [
    { key: "series", label: "Generasi", order: ["GTX 900", "GTX 10", "GTX 16", "RTX 20", "RTX 30", "RTX 40", "RTX 50", "Radeon RX 6000", "Radeon RX 7000"] },
  ],
  storage: [
    { key: "type", label: "Tipe", order: ["NVMe SSD", "SATA SSD", "HDD"] },
    { key: "capacity", label: "Kapasitas", order: ["500GB", "1TB", "2TB", "4TB"] },
    { key: "speedTier", label: "Kecepatan", order: ["PCIe Gen3", "PCIe Gen4", "PCIe Gen5", "SATA III", "7200RPM", "5400RPM"] },
  ],
  psu: [
    { key: "wattage", label: "Watt", order: ["450W", "500W", "550W", "600W", "650W", "700W", "750W", "850W", "1000W", "1200W", "1600W"] },
    { key: "rating", label: "Sertifikasi", order: ["80+ White", "80+ Bronze", "80+ Silver", "80+ Gold", "80+ Platinum", "80+ Titanium"] },
  ],
  casing: [
    { key: "formFactor", label: "Form Factor", order: ["Mini-ITX", "Micro ATX", "Mid Tower", "Full Tower", "Super Tower"] },
  ],
};
