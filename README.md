# Website SAGRI (PT Satya Agro Indonesia)

Situs statis (Astro) dengan panel admin Decap CMS di `/admin/`, menggantikan WordPress lama di
satyaagroindonesia.com. Polanya sama dengan website SLI dan Refinol: tidak ada PHP, database, atau plugin di server,
jadi tidak ada celah seperti WordPress lama. Semua konten berupa file di repo ini, dan setiap perubahan dari admin
tercatat sebagai commit di GitHub.

## Coba di komputer sendiri

```
npm install
npm run dev          # website di http://localhost:4321
npm run cms          # (terminal kedua) admin lokal di http://localhost:4321/admin/index.html (tanpa login)
```

## Struktur konten (semua bisa diedit lewat /admin/)

| Menu admin | Isi | Lokasi file |
| --- | --- | --- |
| Produk | 15 produk + Paket Clean Beat: jenis, sifat, bahan aktif, kode grup, tanaman, keunggulan, sasaran, cara pakai, foto hama | `src/content/produk/*.md` |
| Artikel | Cerita Sagri (kegiatan lapangan) dan Pengetahuan | `src/content/artikel/*.md` |
| Halaman | Beranda, Tentang Kami, Kontak Kami, dan halaman baru, disusun dari blok | `src/content/halaman/*.md` |
| Pengaturan | Logo, alamat, telepon, WhatsApp, email, medsos, menu, teks jenis produk, halaman solusi tanaman, jenis kegiatan | `src/data/site.json` |

Halaman yang dibuat otomatis dari data produk:

- `/produk/`: katalog per jenis (paket, insektisida, fungisida, herbisida, ZPT).
- `/produk/nama-produk/`: detail produk.
- `/solusi/padi/`, `/solusi/jagung/`, `/solusi/hortikultura/`, `/solusi/bawang/`: produk yang dicentang untuk tanaman itu.
- `/cerita-sagri/` dan `/pengetahuan/`: daftar artikel per kategori.

Jenis blok halaman: Hero pilih tanaman, Judul halaman, Produk andalan (otomatis dari produk bertanda Andalan),
Jenis produk (otomatis), Testimoni petani, Artikel terbaru (otomatis), Teks, Teks dengan foto, Galeri, Ajakan dengan
tombol, Kontak dan form WhatsApp.

Label hitam-putih "GRUP" di setiap produk meniru kotak kode cara kerja (IRAC/FRAC/HRAC) di kemasan. Isi kodenya di
kolom "Kode grup di kemasan", satu kode per baris.

Nama halaman `beranda`, `produk`, `solusi`, `artikel`, `cerita-sagri`, `pengetahuan`, `admin`, dan `api` sudah dipakai sistem.

## Online-kan (Cloudflare Pages)

1. Upload folder ini ke repo GitHub baru, yaitu `websiteiipgroup-cell/website-sai`
   (kalau namanya beda, ganti `repo` di `public/admin/config.yml`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → hubungkan repo.
   Build command: `npm run build`, output: `dist`.
3. Cek hasilnya di alamat `*.pages.dev`.
4. Siapkan login admin (sekali saja). Login berjalan di domain website sendiri (`/api/auth`, kodenya di folder
   `functions/`), jadi tidak terganggu kalau ISP memblokir `*.workers.dev` atau `*.pages.dev`.
   - GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*:
     - Application name: `Admin Website SAGRI`
     - Homepage URL: `https://satyaagroindonesia.com`
     - Authorization callback URL: `https://satyaagroindonesia.com/api/callback`
       (untuk tes sebelum domain pindah, isi dulu `https://website-sai.pages.dev/api/callback`,
       lalu ganti setelah domain tersambung).
   - Klik *Generate a new client secret*, salin Client ID dan Client Secret.
   - Cloudflare Pages → `website-sai` → Settings → Variables and Secrets, tambahkan:
     - `GITHUB_CLIENT_ID` = Client ID
     - `GITHUB_CLIENT_SECRET` = Client Secret (pilih tipe *Secret*)
   - Deploy ulang (Deployments → Retry deployment), lalu buka `/admin/` dan klik *Login with GitHub*.
   - Yang bisa masuk hanya akun GitHub yang punya akses ke repo ini (undang di repo → Settings → Collaborators).
5. Hubungkan domain. **Jangan sentuh subdomain `msa.satyaagroindonesia.com`** (aplikasi petugas) dan record MX (email).
   - Cloudflare Pages → `website-sai` → Custom domains → tambahkan `satyaagroindonesia.com` dan `www.satyaagroindonesia.com`.
   - Kalau DNS ada di cPanel: Zone Editor → ubah record `www` menjadi CNAME ke `website-sai.pages.dev`, lalu
     cPanel → Redirects → arahkan `satyaagroindonesia.com` ke `https://www.satyaagroindonesia.com/` (301).
     Kalau begitu, ganti juga `site` di `astro.config.mjs` dan `site_url` di `public/admin/config.yml` ke alamat www.
   - Kalau DNS sudah di Cloudflare: cukup tambahkan custom domain, Cloudflare membuat record-nya sendiri.
6. Setelah website baru tampil, hapus WordPress lama dari `public_html/satyaagroindonesia.com`
   (sisakan `.htaccess` untuk redirect kalau dipakai), hapus database `intp3437_db_satyaagro`, dan hapus file backup
   Softaculous lama (berisi password database dalam teks biasa).

## Alamat lama

`public/_redirects` memetakan alamat WordPress lama ke alamat baru, termasuk semua halaman produk
(`/sagri-zeb/` → `/produk/sagri-zeb-85-wp/`), halaman solusi (`/solusi-padi-revisi/` → `/solusi/padi/`),
artikel (`/2023/01/06/product-training-tim-sulawesi/` → `/artikel/product-training-tim-sulawesi/`), dan `/wp-admin/`.

## Yang perlu dicek atau diisi

- **Nama bahan aktif** sudah diseragamkan ke ejaan Indonesia (contoh: Azoksistorbin → azoksistrobin, Metoksifenosida →
  metoksifenozida, Hexaconazole → heksakonazol). Cocokkan dengan label resmi tiap kemasan.
- **Kode grup Sagri Clear** di gambar lama tertulis 1B | 4B. Klotianidin biasanya grup 4A, jadi cek kemasan.
- **Sagri Fix** di situs lama ada dua versi nama: "Sagri Fix 15/15/15 SL" dan "Sagri Fix 45 SL". Yang dipakai yang pertama.
- **Sagri Storm** tidak punya daftar gulma sasaran dan foto gulma. Sagri Panca dan Sagri Fix belum punya foto hama atau gejala.
- **One Day Promo** belum punya foto (foto lama berlabel Farmer Field Day).
- Foto kemasan produk lama (2023) resolusinya kecil (500 px). Ganti dengan foto kemasan baru minimal 900 × 900.
- Facebook dan YouTube di situs lama ada dua alamat berbeda. Yang dipakai: facebook.com/ptsatyaagroindonesia dan youtube.com/@sagri_id.
- Artikel lama dipindahkan apa adanya; typo di isi artikel belum dibetulkan.
