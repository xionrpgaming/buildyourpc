# Xion Gaming — Website Rakit PC

Website statis (HTML/CSS/JS biasa, tanpa backend/database) untuk memilih
komponen PC, cek kompatibilitas otomatis, lihat estimasi skor kekuatan
rakitan, simpan/muat rakitan via kode unik, lalu kirim ke WhatsApp untuk
tanya harga & ketersediaan. Cocok untuk hosting gratis di GitHub Pages.

## Struktur file

```
xion-gaming/
├── index.html            Halaman beranda
├── builder.html           Halaman "Rakit PC" (filter, grid produk, ringkasan)
├── css/style.css          Semua styling + animasi
├── js/products-data.js    DATA PRODUK — edit di sini
├── js/app.js              Logika filter, kompatibilitas, skor, simpan/muat, WhatsApp
└── js/animations.js       Efek visual (scroll-reveal, particle, form kode di beranda)
```

## 1. Edit data produk

Buka `js/products-data.js`, array `PRODUCTS`. Field yang tersedia beda-beda
per kategori — lihat komentar di bagian atas file itu untuk daftar lengkapnya.
Yang penting untuk kompatibilitas & skor:

| Field | Dipakai di | Fungsi |
|---|---|---|
| `socket` | cpu, motherboard | dicocokkan: CPU harus sama socket dengan motherboard |
| `memoryType` | motherboard, ram | dicocokkan: RAM harus sama tipe dengan yang dibutuhkan motherboard |
| `formFactor` / `supportedFormFactors` | motherboard, casing | dicocokkan: ukuran motherboard harus muat di casing |
| `tdp` | cpu, gpu | dipakai menghitung estimasi kebutuhan watt PSU |
| `tier` (1–5) | semua kategori | dipakai menghitung Build Score — **ini estimasi**, sesuaikan kalau Anda punya acuan performa yang lebih akurat |
| `stock` (true/false) | semua kategori | dipakai filter "In Stock" |

**Tidak ada field harga** di data ini — sengaja dihapus karena harga & stok
final dikonfirmasi admin lewat WhatsApp, dan apa pun yang ada di file JS ini
bisa dilihat siapa saja lewat "View Source" browser.

`CATEGORY_LIST` di bagian bawah file menentukan kategori mana yang tampil
dan mana yang boleh pilih lebih dari satu (`multi:true` — saat ini RAM, VGA
Card, Storage).

## 2. Ganti nomor WhatsApp

Buka `js/app.js`, baris paling atas:

```js
const WA_NUMBER = "6285814565849";
```

Format: kode negara + nomor tanpa angka 0 di depan, tanpa spasi/strip.

## 3. Fitur "Simpan / Muat Rakitan via Kode"

Karena situs ini statis (tanpa server/database), kode unik yang dibuat
**berisi rakitannya sendiri** (di-encode base64), bukan sekadar nomor
referensi ke database. Jadi kode itu bisa dimasukkan dari perangkat mana pun
dan akan memuat ulang rakitan yang persis sama — tanpa perlu server.

- Tombol **"Simpan Rakitan Ini"** di panel kanan `builder.html` men-generate
  kode ini dan menampilkannya untuk disalin.
- Kolom **"Muat Rakitan"** (di bar atas builder.html, dan di panel kanan)
  menerima kode itu dan mengembalikan pilihan komponennya.
- Kolom kecil di hero `index.html` ("Sudah punya kode rakitan?") mengarahkan
  ke `builder.html?code=...` yang otomatis memuat kode itu saat halaman dibuka.
- Kode juga otomatis disertakan di pesan WhatsApp setiap kali pelanggan
  klik "Pesan / Tanya via WhatsApp", supaya admin & pelanggan sama-sama
  punya catatan rakitannya.
- Email yang diisi saat menyimpan **hanya tersimpan lokal di browser
  pelanggan** (localStorage, untuk daftar "Tersimpan di perangkat ini") dan
  ikut disebut di catatan — bukan dikirim ke server mana pun, karena situs
  statis memang tidak punya tempat penyimpanan terpusat.

> **Kalau ke depannya Anda mau pencarian rakitan lintas-perangkat berdasarkan
> email** (tanpa perlu simpan kodenya), itu perlu backend/database sungguhan
> (misalnya Firebase, Google Sheets API, atau server kecil) — di luar
> kemampuan GitHub Pages murni. Beri tahu saya kalau mau dikembangkan ke arah
> situ.

### 3a. Aktifkan pengiriman kode otomatis ke email (EmailJS)

Tombol "Simpan & Kirim ke Email Saya" mengirim kode ke email pengguna
lewat [EmailJS](https://www.emailjs.com) (gratis s/d 200 email/bulan,
langsung dari browser, tanpa server). Sampai di-setup, kode tetap dibuat
dan tampil di layar — hanya bagian kirim-emailnya yang dilewati.

1. Daftar gratis di https://www.emailjs.com
2. **Email Services → Add New Service** → hubungkan Gmail/Outlook toko
   Anda → catat **Service ID** (contoh: `service_abc123`)
3. **Email Templates → Create New Template**. Isi:
   - To Email: `{{to_email}}`
   - Subject: `Kode Rakitan PC Kamu - Xion Gaming`
   - Isi email: pakai variabel `{{build_code}}`, `{{build_summary}}`,
     `{{site_url}}` (susun bebas, ini isinya masing-masing kode rakitan,
     ringkasan komponen, dan link langsung untuk memuatnya lagi)
   - Simpan → catat **Template ID** (contoh: `template_xyz789`)
4. **Account → General** → catat **Public Key**
5. Buka `js/app.js`, cari `EMAILJS_CONFIG` di dekat bagian bawah file,
   tempel ketiga nilai itu:
   ```js
   const EMAILJS_CONFIG = {
     publicKey: "...",
     serviceId: "...",
     templateId: "...",
   };
   ```
6. Upload ulang `js/app.js` — selesai, tombol kirim email langsung aktif.


## 4. Animasi

`css/style.css` (bagian bawah) dan `js/animations.js` menambahkan:
- Circuit-line & particle mengambang di hero halaman beranda.
- Scroll-reveal (fade + slide up) untuk kartu fitur & kategori.
- Gauge Build Score yang mengisi + angka menghitung naik saat rakitan berubah.
- Hover/klik micro-interaction pada kartu produk, tombol, dan nav.
- Toast notifikasi kecil untuk aksi simpan/muat/salin kode.

Semua animasi dibuat orisinal (CSS/SVG/JS biasa) — bukan aset dari situs
manapun, supaya tidak ada masalah hak cipta dan tidak butuh koneksi ke
sumber eksternal.

## 5. Coba di komputer sendiri (sebelum upload)

Buka `index.html` dua kali klik di file explorer — langsung jalan di
browser, tidak perlu server atau instalasi apa pun.

## 6. Upload ke GitHub & aktifkan GitHub Pages

1. Buat/gunakan repository GitHub (public).
2. Upload semua file & folder di dalam folder `xion-gaming/` ini ke repo
   (lewat "Add file → Upload files", atau `git push`).
3. Di repo: **Settings → Pages** → Source: **Deploy from a branch** →
   branch `main`, folder `/ (root)` → **Save**.
4. Tunggu 1–2 menit, link situsnya muncul di halaman Settings → Pages,
   biasanya `https://<username-anda>.github.io/<nama-repo>/`.

Setiap kali file di-upload ulang / di-push, situs otomatis ter-update dalam
beberapa menit.

## Catatan penting

- Ini bukan toko online dengan pembayaran otomatis — pelanggan memilih
  komponen, sistem mengecek kompatibilitas & memberi skor, lalu tombol
  WhatsApp membuka chat dengan rincian rakitan (termasuk kode-nya) sudah
  terisi otomatis. Harga & pembayaran tetap manual lewat chat dengan admin.
- Pilihan komponen di layar tersimpan sementara di `localStorage` browser
  pelanggan (supaya tidak hilang saat reload), terpisah dari fitur kode di
  atas.
