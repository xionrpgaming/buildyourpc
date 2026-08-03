# Xion Gaming — Website Rakit PC

Website statis (HTML/CSS/JS biasa, tanpa backend) untuk pilih komponen PC,
lihat total harga otomatis, dan kirim pesanan ke WhatsApp. Cocok untuk
hosting gratis di GitHub Pages.

## Struktur file

```
xion-gaming/
├── index.html          Halaman beranda (hero, kategori, paket rakitan)
├── builder.html         Halaman "Rakit PC" (pilih komponen + ringkasan)
├── css/style.css        Semua styling
├── js/products-data.js  DATA PRODUK — edit di sini
└── js/app.js             Logika keranjang & link WhatsApp
```

## 1. Ganti data produk (harga, nama, spek)

Buka `js/products-data.js`. Setiap produk formatnya:

```js
{ id: "cpu-05", category: "cpu", name: "Nama Produk", spec: "Ringkasan spek", price: 2000000 },
```

- `id` harus unik, tidak boleh sama dengan produk lain.
- `category` harus salah satu dari: `cpu`, `motherboard`, `ram`, `gpu`, `storage`, `psu`, `casing`.
- `price` angka biasa tanpa titik/koma (contoh: `2000000` untuk Rp 2.000.000).
- Tinggal copy-paste baris yang ada, ganti isinya, atau hapus baris untuk menghapus produk.

Semua data saat ini masih **contoh/placeholder** — ganti dengan produk & harga toko Anda yang sebenarnya sebelum go-live.

## 2. Ganti nomor WhatsApp

Buka `js/app.js`, baris paling atas:

```js
const WA_NUMBER = "6285814565849";
```

Format: kode negara + nomor tanpa angka 0 di depan, tanpa spasi/strip (`62` untuk Indonesia).

## 3. Coba di komputer sendiri (sebelum upload)

Cukup buka file `index.html` dua kali klik di file explorer — sudah langsung jalan
di browser, tidak perlu server atau instalasi apa pun.

## 4. Upload ke GitHub & aktifkan GitHub Pages

1. Buat repository baru di GitHub (public), misal namanya `xion-gaming`.
2. Upload semua file & folder di dalam folder `xion-gaming/` ini ke repo tersebut
   (lewat web GitHub "Add file → Upload files", atau lewat `git push` kalau sudah biasa pakai git).
3. Di repo, buka **Settings → Pages**.
4. Di bagian "Build and deployment" → Source, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu **Save**.
6. Tunggu 1–2 menit, GitHub akan menampilkan link website Anda, biasanya berbentuk:
   `https://<username-anda>.github.io/xion-gaming/`

Setiap kali Anda meng-edit file (misal ganti harga) dan upload ulang / push,
website akan otomatis ter-update dalam beberapa menit.

## Catatan penting

- Ini bukan toko online dengan pembayaran otomatis — pelanggan memilih komponen,
  lalu tombol "Pesan via WhatsApp" membuka chat WhatsApp dengan rincian pesanan
  yang sudah terisi otomatis. Pembayaran & konfirmasi tetap manual lewat chat.
- Pilihan komponen pelanggan tersimpan di browser mereka masing-masing
  (`localStorage`), bukan di server — jadi tidak ada data pesanan yang tersimpan
  di pihak Anda kecuali yang masuk ke WhatsApp.
- Kalau nanti butuh: pembayaran online otomatis, database produk terpusat, atau
  panel admin, itu perlu backend tambahan (di luar GitHub Pages) — beri tahu saya
  kalau mau dikembangkan ke arah situ.
