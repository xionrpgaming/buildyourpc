/**
 * XION GAMING — Data Katalog Komponen
 * -------------------------------------------------
 * Ini data CONTOH/PLACEHOLDER. Ganti harga, nama, dan spek
 * sesuai stok toko Anda yang sebenarnya. Tambah/hapus item
 * bebas, formatnya konsisten per kategori di bawah.
 *
 * Field:
 *  id       -> unik, tidak boleh sama antar produk
 *  category -> salah satu dari: cpu, motherboard, ram, gpu, storage, psu, casing
 *  name     -> nama produk
 *  spec     -> ringkasan spesifikasi (1 baris)
 *  price    -> angka, dalam Rupiah (tanpa titik/koma)
 */

const XION_PRODUCTS = [
  // ---------- CPU ----------
  { id: "cpu-01", category: "cpu", name: "AMD Ryzen 5 5600", spec: "6 Core / 12 Thread, 3.5GHz base, Socket AM4", price: 1650000 },
  { id: "cpu-02", category: "cpu", name: "AMD Ryzen 7 5700X3D", spec: "8 Core / 16 Thread, 3D V-Cache, Socket AM4", price: 3450000 },
  { id: "cpu-03", category: "cpu", name: "Intel Core i5-12400F", spec: "6 Core / 12 Thread, 2.5GHz base, Socket LGA1700", price: 2150000 },
  { id: "cpu-04", category: "cpu", name: "Intel Core i5-13400F", spec: "10 Core / 16 Thread, Socket LGA1700", price: 2950000 },

  // ---------- MOTHERBOARD ----------
  { id: "mobo-01", category: "motherboard", name: "ASUS Prime A520M-K", spec: "Socket AM4, Micro-ATX, DDR4", price: 950000 },
  { id: "mobo-02", category: "motherboard", name: "MSI B550M PRO-VDH", spec: "Socket AM4, Micro-ATX, DDR4, PCIe 4.0", price: 1550000 },
  { id: "mobo-03", category: "motherboard", name: "ASRock B660M-HDV", spec: "Socket LGA1700, Micro-ATX, DDR4", price: 1750000 },
  { id: "mobo-04", category: "motherboard", name: "Gigabyte Z790 UD AX", spec: "Socket LGA1700, ATX, DDR5, WiFi 6", price: 3650000 },

  // ---------- RAM ----------
  { id: "ram-01", category: "ram", name: "V-Color 8GB DDR4-3200", spec: "1x8GB, CL16, Single Channel", price: 320000 },
  { id: "ram-02", category: "ram", name: "Team T-Force 16GB DDR4-3200", spec: "2x8GB, CL16, Dual Channel", price: 620000 },
  { id: "ram-03", category: "ram", name: "Corsair Vengeance 32GB DDR4-3600", spec: "2x16GB, CL18, Dual Channel", price: 1250000 },
  { id: "ram-04", category: "ram", name: "G.Skill Trident Z5 32GB DDR5-6000", spec: "2x16GB, CL36, Dual Channel", price: 1850000 },

  // ---------- GPU ----------
  { id: "gpu-01", category: "gpu", name: "NVIDIA RTX 3050 8GB", spec: "8GB GDDR6, 128-bit", price: 3450000 },
  { id: "gpu-02", category: "gpu", name: "AMD Radeon RX 6600 8GB", spec: "8GB GDDR6, 128-bit", price: 3950000 },
  { id: "gpu-03", category: "gpu", name: "NVIDIA RTX 4060 8GB", spec: "8GB GDDR6, DLSS 3", price: 5450000 },
  { id: "gpu-04", category: "gpu", name: "NVIDIA RTX 4070 12GB", spec: "12GB GDDR6X, DLSS 3", price: 9250000 },

  // ---------- STORAGE ----------
  { id: "sto-01", category: "storage", name: "SSD NVMe 500GB", spec: "PCIe 3.0, up to 2000MB/s", price: 420000 },
  { id: "sto-02", category: "storage", name: "SSD NVMe 1TB", spec: "PCIe 3.0, up to 2100MB/s", price: 750000 },
  { id: "sto-03", category: "storage", name: "SSD NVMe 1TB Gen4", spec: "PCIe 4.0, up to 5000MB/s", price: 1150000 },
  { id: "sto-04", category: "storage", name: "HDD 1TB 7200RPM", spec: "3.5\", SATA III", price: 550000 },

  // ---------- PSU ----------
  { id: "psu-01", category: "psu", name: "PSU 450W 80+ Bronze", spec: "Non-modular", price: 420000 },
  { id: "psu-02", category: "psu", name: "PSU 550W 80+ Bronze", spec: "Non-modular", price: 550000 },
  { id: "psu-03", category: "psu", name: "PSU 650W 80+ Gold", spec: "Semi-modular", price: 850000 },
  { id: "psu-04", category: "psu", name: "PSU 750W 80+ Gold", spec: "Full-modular", price: 1150000 },

  // ---------- CASING ----------
  { id: "case-01", category: "casing", name: "Micro ATX Basic", spec: "Micro-ATX, tanpa fan RGB", price: 380000 },
  { id: "case-02", category: "casing", name: "Mid Tower Airflow", spec: "ATX, 3 fan preinstalled", price: 650000 },
  { id: "case-03", category: "casing", name: "Mid Tower RGB Tempered Glass", spec: "ATX, panel kaca, 4 fan ARGB", price: 950000 },
  { id: "case-04", category: "casing", name: "Full Tower RGB Premium", spec: "E-ATX support, 6 fan ARGB", price: 1450000 },
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
