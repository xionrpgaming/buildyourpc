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
 * Field cluster (dipakai untuk filter per kategori — lihat
 * XION_FILTERS di bawah):
 *  cpu          -> socket   (AM4, AM5, LGA1700, ...)
 *  motherboard  -> socket
 *  ram          -> memType  (DDR4, DDR5)
 *  gpu          -> family   (GeForce RTX, GeForce GTX, Radeon)
 *  storage      -> type     (NVMe SSD, SATA SSD, HDD)
 *  psu          -> wattage  (450W, 550W, 650W, 750W)
 *  casing       -> formFactor (Micro ATX, Mid Tower, Full Tower)
 */

const XION_PRODUCTS = [
  // ---------- CPU (cluster: socket) ----------
  { id: "cpu-01", category: "cpu", name: "Ryzen 5 5600", spec: "6 Core / 12 Thread, 3.5GHz base", price: 1650000, socket: "AM4" },
  { id: "cpu-02", category: "cpu", name: "Ryzen 7 5700X3D", spec: "8 Core / 16 Thread, 3D V-Cache", price: 3450000, socket: "AM4" },
  { id: "cpu-03", category: "cpu", name: "Ryzen 5 7600", spec: "6 Core / 12 Thread, 3.8GHz base", price: 3150000, socket: "AM5" },
  { id: "cpu-04", category: "cpu", name: "Core i5-12400F", spec: "6 Core / 12 Thread, 2.5GHz base", price: 2150000, socket: "LGA1700" },
  { id: "cpu-05", category: "cpu", name: "Core i5-13400F", spec: "10 Core / 16 Thread", price: 2950000, socket: "LGA1700" },

  // ---------- MOTHERBOARD (cluster: socket) ----------
  { id: "mobo-01", category: "motherboard", name: "A520M", spec: "Micro-ATX, DDR4", price: 950000, socket: "AM4" },
  { id: "mobo-02", category: "motherboard", name: "B550M", spec: "Micro-ATX, DDR4, PCIe 4.0", price: 1550000, socket: "AM4" },
  { id: "mobo-03", category: "motherboard", name: "B650M", spec: "Micro-ATX, DDR5, PCIe 4.0", price: 2450000, socket: "AM5" },
  { id: "mobo-04", category: "motherboard", name: "B660M", spec: "Micro-ATX, DDR4", price: 1750000, socket: "LGA1700" },
  { id: "mobo-05", category: "motherboard", name: "Z790", spec: "ATX, DDR5, WiFi 6", price: 3650000, socket: "LGA1700" },

  // ---------- RAM (cluster: memType) ----------
  { id: "ram-01", category: "ram", name: "DDR4 8GB 3200MHz", spec: "1x8GB, CL16, Single Channel", price: 320000, memType: "DDR4" },
  { id: "ram-02", category: "ram", name: "DDR4 16GB 3200MHz Kit", spec: "2x8GB, CL16, Dual Channel", price: 620000, memType: "DDR4" },
  { id: "ram-03", category: "ram", name: "DDR4 32GB 3600MHz Kit", spec: "2x16GB, CL18, Dual Channel", price: 1250000, memType: "DDR4" },
  { id: "ram-04", category: "ram", name: "DDR5 32GB 6000MHz Kit", spec: "2x16GB, CL36, Dual Channel", price: 1850000, memType: "DDR5" },

  // ---------- GPU (cluster: family) ----------
  { id: "gpu-01", category: "gpu", name: "GeForce GTX 1660 Super 6GB", spec: "6GB GDDR6, 192-bit", price: 2450000, family: "GeForce GTX" },
  { id: "gpu-02", category: "gpu", name: "GeForce RTX 3050 8GB", spec: "8GB GDDR6, 128-bit", price: 3450000, family: "GeForce RTX" },
  { id: "gpu-03", category: "gpu", name: "Radeon RX 6600 8GB", spec: "8GB GDDR6, 128-bit", price: 3950000, family: "Radeon" },
  { id: "gpu-04", category: "gpu", name: "GeForce RTX 4060 8GB", spec: "8GB GDDR6, DLSS 3", price: 5450000, family: "GeForce RTX" },
  { id: "gpu-05", category: "gpu", name: "Radeon RX 7600 8GB", spec: "8GB GDDR6, 128-bit", price: 5250000, family: "Radeon" },
  { id: "gpu-06", category: "gpu", name: "GeForce RTX 4070 12GB", spec: "12GB GDDR6X, DLSS 3", price: 9250000, family: "GeForce RTX" },

  // ---------- STORAGE (cluster: type) ----------
  { id: "sto-01", category: "storage", name: "NVMe SSD 500GB", spec: "PCIe 3.0, up to 2000MB/s", price: 420000, type: "NVMe SSD" },
  { id: "sto-02", category: "storage", name: "NVMe SSD 1TB", spec: "PCIe 3.0, up to 2100MB/s", price: 750000, type: "NVMe SSD" },
  { id: "sto-03", category: "storage", name: "NVMe SSD 1TB Gen4", spec: "PCIe 4.0, up to 5000MB/s", price: 1150000, type: "NVMe SSD" },
  { id: "sto-04", category: "storage", name: "SATA SSD 500GB", spec: "2.5\", up to 550MB/s", price: 380000, type: "SATA SSD" },
  { id: "sto-05", category: "storage", name: "HDD 1TB 7200RPM", spec: "3.5\", SATA III", price: 550000, type: "HDD" },

  // ---------- PSU (cluster: wattage) ----------
  { id: "psu-01", category: "psu", name: "PSU 450W", spec: "80+ Bronze, Non-modular", price: 420000, wattage: "450W" },
  { id: "psu-02", category: "psu", name: "PSU 550W", spec: "80+ Bronze, Non-modular", price: 550000, wattage: "550W" },
  { id: "psu-03", category: "psu", name: "PSU 650W", spec: "80+ Gold, Semi-modular", price: 850000, wattage: "650W" },
  { id: "psu-04", category: "psu", name: "PSU 750W", spec: "80+ Gold, Full-modular", price: 1150000, wattage: "750W" },

  // ---------- CASING (cluster: formFactor) ----------
  { id: "case-01", category: "casing", name: "Micro ATX Basic", spec: "Tanpa fan RGB", price: 380000, formFactor: "Micro ATX" },
  { id: "case-02", category: "casing", name: "Mid Tower Airflow", spec: "ATX, 3 fan preinstalled", price: 650000, formFactor: "Mid Tower" },
  { id: "case-03", category: "casing", name: "Mid Tower RGB Tempered Glass", spec: "ATX, panel kaca, 4 fan ARGB", price: 950000, formFactor: "Mid Tower" },
  { id: "case-04", category: "casing", name: "Full Tower RGB Premium", spec: "E-ATX support, 6 fan ARGB", price: 1450000, formFactor: "Full Tower" },
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
 * XION_FILTERS — atribut mana yang dipakai untuk cluster/filter
 * di tiap kategori pada halaman Rakit PC. "key" harus cocok
 * dengan field di XION_PRODUCTS. "label" untuk teks di UI.
 */
const XION_FILTERS = {
  cpu: { key: "socket", label: "Socket" },
  motherboard: { key: "socket", label: "Socket" },
  ram: { key: "memType", label: "Tipe" },
  gpu: { key: "family", label: "Chipset" },
  storage: { key: "type", label: "Tipe" },
  psu: { key: "wattage", label: "Wattage" },
  casing: { key: "formFactor", label: "Form Factor" },
};
