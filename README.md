# PERSONAL FINANCE — PWA

Aplikasi pencatatan keuangan pribadi bertema Dark Purple Glassmorphism. Kini dilengkapi dukungan PWA agar dapat dipasang dari Chrome dan dibuka tanpa address bar.

## File PWA tambahan
- `manifest.webmanifest`: nama, ikon, warna, dan mode standalone.
- `service-worker.js`: cache file aplikasi agar bisa dibuka offline setelah kunjungan pertama.
- `icons/`: ikon aplikasi 192px dan 512px.

## Cara memasang di Android
1. Upload seluruh isi folder ini ke hosting HTTPS (misalnya GitHub Pages atau Netlify). Jangan hanya upload `index.html`; semua folder dan file harus ikut.
2. Buka URL HTTPS website di Google Chrome Android.
3. Tunggu halaman selesai dimuat, lalu buka menu titik tiga Chrome.
4. Pilih `Install app` / `Pasang aplikasi` atau `Add to Home screen` / `Tambahkan ke layar utama`.
5. Konfirmasi. Jalankan melalui ikon PERSONAL FINANCE di layar utama. Dengan `display: standalone`, aplikasi terbuka tanpa address bar browser.

## Penting tentang data
Data transaksi menggunakan LocalStorage browser. Setelah dipasang, gunakan aplikasi dari ikon yang sama dan jangan hapus data situs/aplikasi. Data dari Preview Acode atau browser lain tidak otomatis berpindah. Ekspor CSV secara berkala untuk cadangan.

## Hosting gratis
- GitHub Pages: buat repository, upload seluruh isi folder, aktifkan Settings → Pages → Deploy from a branch.
- Netlify: deploy folder situs melalui dashboard Netlify. Pastikan URL akhirnya menggunakan HTTPS.

PWA tidak menghasilkan file APK. Pemasangan dilakukan Chrome sebagai aplikasi web.
