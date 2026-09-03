# Go-Live: Warehouse PMT - CBM Calculation

**Urutan wajib: Google Sheets → Apps Script → GitHub → Vercel → Smoke Test → Kalibrasi → Rollout.**
Total ± 25 menit untuk Step 1–5. Jangan lompat urutan — Vercel butuh GitHub, dan app butuh URL Apps Script.

---

## STEP 0 — Siapkan file (2 menit)

File ada di `CBM Counting Applications\App\`:

| File | Wajib upload? | Fungsi |
|---|---|---|
| `index.html` | ✅ | aplikasinya |
| `vercel.json` | ✅ | config deploy |
| `apps-script/Code.gs` | ❌ (arsip) | isinya di-paste ke Apps Script, bukan di-deploy |
| `README.md` | ❌ | dokumentasi |
| `DEPLOY_GUIDE.md` | ❌ | file ini |
| `ASSESSMENT_GUDANG_DAN_METODOLOGI_CBM.md` | ❌ | metodologi & SOP survey |

Yang benar-benar dibutuhkan Vercel cuma `index.html` + `vercel.json`. Sisanya diupload supaya repo jadi arsip lengkap.

---

## STEP 1 — Google Sheets + Apps Script (8 menit)

### 1.1 Buat Sheet
1. Buka **[sheets.new](https://sheets.new)**
2. Rename jadi **`Warehouse PMT - CBM Calculation`**
3. Pakai akun Google. **MODENA tidak pakai Google Workspace** (email `@modena.com` itu Microsoft), jadi akun company tidak bisa dipakai di sini — pakai akun Google pribadi/khusus tim.
   Setelah Sheet jadi: **share ke 1 rekan PMT sebagai Editor**, dan setelah survey selesai **export ke Excel** untuk disimpan di folder company. Sheet ini jadi arsip, bukan satu-satunya salinan.

### 1.2 Paste backend
4. Menu **Extensions → Apps Script**
5. Hapus semua isi `Code.gs` bawaan (`function myFunction() {}`)
6. Buka `apps-script\Code.gs` di Notepad, **copy semua**, paste ke Apps Script
7. Klik **Save** (ikon disket) — rename project jadi `Warehouse PMT CBM Backend` kalau mau rapi

### 1.3 Deploy sebagai Web App
8. Klik **Deploy → New deployment**
9. Klik **ikon gerigi ⚙** di sebelah "Select type" → pilih **Web app**
10. Isi:
    - **Description:** `Warehouse PMT CBM v1`
    - **Execute as:** `Me (email Bapak)`
    - **Who has access:** **`Anyone`**

    ⚠️ Ini titik gagal paling sering. Kalau dipilih `Anyone with Google account`, HP tim akan selalu gagal sync — karena app kirim data tanpa login Google.

11. Klik **Deploy**
12. **Authorize access** → pilih akun → muncul layar *"Google hasn't verified this app"* → klik **Advanced** → **Go to Warehouse PMT CBM Backend (unsafe)** → **Allow**

    Peringatan "unsafe" itu normal untuk script buatan sendiri. Bukan malware.

13. **Copy Web app URL**, bentuknya:
    ```
    https://script.google.com/macros/s/AKfycbx.....................kQ/exec
    ```
    Simpan di Notepad — ini yang dibagikan ke tim.

### 1.4 Tes backend (30 detik)
Buka URL tadi **+ `?action=list`** di browser:
```
https://script.google.com/macros/s/AKfyc.../exec?action=list
```
Harus muncul:
```json
{"ok":true,"rows":[],"summary":{...}}
```
Kalau muncul halaman login Google → akses masih salah, ulangi 1.3 no.10.
Kalau muncul error script → ada baris `Code.gs` yang tidak ke-copy penuh.

> Sheet `CBM_DATA` beserta header-nya dibuat otomatis. Belum muncul sekarang itu normal.

---

## STEP 2 — GitHub (5 menit)

1. Buka **[github.com/new](https://github.com/new)** (login dulu)
2. **Repository name:** `warehouse-pmt-cbm-calculation`
3. Pilih **Public**
   (Private juga bisa dan Vercel tetap gratis, tapi Public lebih sedikit langkah izin.)
4. **Jangan** centang *Add a README file*
5. **Create repository**
6. Di halaman repo kosong, klik link **uploading an existing file**
7. Drag & drop dari folder `App\`:
   - `index.html`
   - `vercel.json`
   - `README.md`
   - `DEPLOY_GUIDE.md`
   - `ASSESSMENT_GUDANG_DAN_METODOLOGI_CBM.md`

   Untuk `apps-script/Code.gs`: drag folder `apps-script` sekalian (GitHub menerima folder).
8. Isi commit message: `Warehouse PMT - CBM Calculation v1.4`
9. **Commit changes**

---

## STEP 3 — Vercel (5 menit)

1. Buka **[vercel.com](https://vercel.com)** → **Sign Up** → **Continue with GitHub** → **Authorize**
2. Dashboard → **Add New… → Project**
3. Cari **`warehouse-pmt-cbm-calculation`** → **Import**
   Kalau repo tidak muncul: klik **Adjust GitHub App Permissions** → beri akses ke repo itu → kembali
4. Halaman Configure Project:
   - **Project Name:** `warehouse-pmt-cbm-calculation` (ini yang jadi URL)
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build and Output Settings:** biarkan kosong semua
   - **Environment Variables:** kosong (tidak dipakai)
5. **Deploy** → tunggu ± 30 detik → muncul layar confetti
6. Klik **Continue to Dashboard** → **Visit**

URL final:
```
https://warehouse-pmt-cbm-calculation.vercel.app
```

Mulai sekarang, **setiap kali `index.html` di GitHub diubah, Vercel auto-deploy dalam ± 30 detik.** Tidak perlu ulang Step 3.

---

## STEP 4 — Smoke Test (WAJIB, 5 menit)

Lakukan sendiri dulu **sebelum** URL disebar ke tim. Tes ini yang menentukan integrasi Sheets benar-benar jalan.

1. Buka `https://warehouse-pmt-cbm-calculation.vercel.app` di **HP**, bukan laptop
2. Tab **Setup**:
   - Nama PIC: `TEST`
   - Gudang: nama gudang
   - URL Apps Script: paste dari Step 1.3
   - **Simpan Setelan**
3. Badge kanan atas harus berubah `OFFLINE` → **`SYNCED`**
4. Tab **Input**: pilih **BIN Sedang**, qty `10`, isi `90%` → **SIMPAN**
5. Tab **Data** → tekan **⬆ Sync ke Sheets** → harus muncul toast **"✓ 1 entry tersinkron"**
6. Buka Google Sheet → tab **`CBM_DATA`** harus terisi 1 baris dengan angka `occCbm` yang sama
7. Tekan **⬇ Tarik data tim** → harus muncul *"Tidak ada data baru"* (artinya GET jalan dan anti-duplikat bekerja)
8. **Hapus baris tes** di Sheet, dan hapus data di HP lewat Setup → *Zona bahaya → Hapus semua data di HP ini*

Kalau langkah 5 gagal → balik ke Step 1.3 no.10 (`Anyone`).
Kalau langkah 5 sukses tapi Sheet kosong → Bapak buka Sheet yang berbeda dari yang dipasangi Apps Script.

> Catatan: sync **tidak akan jalan** kalau app dibuka dari file `C:\...\index.html` (browser memblokir). Harus lewat URL Vercel.

---

## STEP 5 — Kalibrasi Ukuran Bin (½ hari, WAJIB sebelum survey)

1. Satu orang ukur fisik **dimensi dalam** (P × L × T, cm) untuk **Bin Kecil, Bin Sedang, Bin Besar**
2. Update di **Setup → Katalog Ukuran Bin** → tekan **Tandai kalibrasi** tiap ukuran
3. **Screenshot** katalog yang sudah terkalibrasi
4. Sebar screenshot ke grup PMT — tiap anggota menyamakan angkanya di HP masing-masing

> ⚠️ Katalog disimpan **per-HP dan tidak ikut sync**. Kalau angkanya beda antar HP, CBM-nya juga beda dan hasilnya tidak bisa digabung. Ini penyebab error nomor satu.
>
> Bin di luar 3 ukuran itu tidak perlu dikalibrasi — pakai **Bin Custom** dan ukur langsung di lapangan.

---

## STEP 6 — Rollout ke Tim

Kirim ke grup PMT (template siap kirim):

> **WAREHOUSE PMT - CBM CALCULATION**
>
> 1. Buka: `https://warehouse-pmt-cbm-calculation.vercel.app`
> 2. Chrome: ⋮ → **Add to Home screen** · iPhone: Share → **Add to Home Screen**
> 3. Buka tab **Setup**, isi Nama (nama sendiri, konsisten), Gudang, lalu paste URL ini:
>    `<URL Apps Script>`
> 4. Tekan **Simpan Setelan**, pastikan badge kanan atas jadi **SYNCED**
> 5. Samakan **Katalog Ukuran Bin** dengan screenshot terlampir
> 6. Tekan **⬆ Sync ke Sheets** setiap selesai 1 zona — jangan tunggu sore
>
> Aturan: bin di rak = mode **BIN** · kaca/panel di sekat = **NO PACK** · box & tumpukan lantai = **KARTON** · rak = **RAK** (rak tidak menambah CBM barang).

Urutan survey: **Tahap 1 mode RAK dulu** (cepat, langsung dapat kapasitas), baru **Tahap 2 sapu isi rak**, terakhir **Tahap 3 area lantai/FOC/Receiving**. Detail di `ASSESSMENT_GUDANG_DAN_METODOLOGI_CBM.md`.

---

## Update Aplikasi Setelah Live

**Ubah `index.html`:** GitHub → klik file → ikon pensil ✏ → paste versi baru → Commit. Vercel deploy otomatis. Tim cukup **Ctrl+F5** / tutup-buka app.

**Ubah `Code.gs`:** Save saja **tidak cukup**. Wajib:
**Deploy → Manage deployments → ikon pensil ✏ → Version: `New version` → Deploy**
URL tetap sama, tidak perlu ganti setting di HP tim.

**Rollback:** Vercel → tab **Deployments** → pilih deployment lama → **⋯ → Promote to Production**.

---

## Troubleshooting

| Gejala | Penyebab & solusi |
|---|---|
| Badge tetap `OFFLINE` | URL Apps Script belum disimpan di tab Setup |
| "Gagal sync — cek koneksi/URL" | Access bukan **Anyone**; atau URL tidak berakhiran `/exec`; atau app dibuka dari file lokal, bukan URL Vercel |
| Buka URL Apps Script malah minta login | Salah pilih access. Ulangi Deploy dengan **Anyone** |
| Sync sukses tapi Sheet kosong | Apps Script terpasang di Sheet lain. Cek dari Sheet yang benar: Extensions → Apps Script |
| Data tim tidak muncul | Tekan **⬇ Tarik data tim**; pastikan URL identik di semua HP |
| Entry dobel di Sheets | Tidak akan terjadi — backend menolak `id` yang sudah ada |
| Perubahan Code.gs tidak berefek | Belum **New version** saat re-deploy |
| CBM terasa terlalu kecil | Katalog belum dikalibrasi, atau area lantai/FOC belum disurvey pakai mode **KARTON** |
| CBM terasa terlalu besar | Double-count: bin dihitung dua kali (BIN + KARTON), atau rak dihitung sebagai barang |
| Bin ukurannya beda dari 3 standar | Pakai **Bin Custom** — ukur saat itu juga, tidak menambah katalog |
| Data hilang setelah clear browser | Data lokal di localStorage. **Sync tiap selesai satu zona** |

---

## Catatan Keamanan

- Web App di-set `Anyone` supaya HP tim bisa kirim data tanpa login Google. Pengamanannya adalah **kerahasiaan URL** — jangan sebar di luar tim PMT.
- Isi sheet hanya dimensi, lokasi, dan nama PIC. Tidak ada data pribadi atau finansial.
- Kalau URL bocor / ada data sampah masuk: Apps Script → **Deploy → Manage deployments → Archive**, buat deployment baru, sebar URL baru ke tim. Data lama di Sheet tetap aman.
- Repo Public berarti kode aplikasi bisa dilihat publik — itu tidak apa-apa, karena **URL Apps Script tidak pernah ditulis di dalam kode**; tiap HP mengisinya sendiri di tab Setup. Jangan pernah hardcode URL itu ke `index.html` lalu di-push ke repo public.
