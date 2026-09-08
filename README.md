# Warehouse PMT - CBM Calculation  ·  v1.5

Aplikasi mobile untuk survey volume (CBM) barang spare parts di gudang PMT
sebelum relokasi, plus pendataan infrastruktur gudang.

**Creator:** Deva — Parts Management, Customer Care Department, MODENA
**Live:** https://warehouse-pmt-cbm-calculation.vercel.app

---

## Empat mode input

| Mode | Untuk apa | Masuk CBM? |
|---|---|---|
| **BIN** | bin/krat di rak — pilih Kecil / Sedang / Besar / Custom | ya |
| **KARTON** | box karton & tumpukan lantai/pallet | ya |
| **NO PACK** | barang tanpa kemasan langsung di rak (kaca, door, casing) | ya |
| **INFRA** | aset gudang: rak, bin kosong, lampu, meja, dll | **tidak** |

CBM yang dipakai untuk sizing gudang baru adalah **Occupied** (gross × % isi),
bukan gross. Angka gross hanya untuk melihat utilisasi bin.

---

## Yang berubah di v1.5

1. **Zona/Area dihapus.** Lokasi sekarang cuma **Rak** (kiri) + **Bin Locator**
   (kanan), keduanya opsional dan tetap bisa dilipat lewat tombol `ubah/tutup`.
   Semua agregasi & filter yang dulu per-zona sekarang **per-rak**, dengan
   fallback ke kolom `zone` lama supaya 344 baris data yang sudah ada tetap
   terbaca saat Tarik Data Tim.
2. **Tombol Scan dihapus** beserta seluruh kode scanner (ZXing, BarcodeDetector,
   torch). Bin Locator diketik manual. File jadi lebih ringan dan tidak lagi
   butuh internet untuk memuat pembaca barcode.
3. **Urutan tab:** BIN → KARTON → NO PACK → INFRA.
4. **Pilihan isi diganti** sesuai part MODENA:
   - Karton: Glass Panel, Compressor, Gasket, Door, Casing, Chimney, Body, Lainnya
   - No Pack: Glass Panel, Basket, Compressor, Gasket, Door, Casing, Chimney, Body, Lainnya
5. **Mode RAK → INFRASTRUCTURE.** Jenis: Rak, Bin, Lampu, Meja, Kursi,
   Trolley/Hand pallet, Tangga, Lemari/Locker, APAR, Kipas/Blower, Lainnya.
   Rak & Meja wajib dimensi; Rak juga minta jumlah level. Bin ambil dimensi
   otomatis dari katalog (Custom kalau tak standar). Lampu & sejenisnya cukup
   pilih varian + qty, kolom dimensi disembunyikan **dan tidak disimpan**.
   Data INFRA masuk sheet **`INFRA_DATA`** yang terpisah dari `CBM_DATA`.
6. **5 Entry Terakhir** kini menampilkan tipe + dimensi, qty, % isi, dan punya
   tombol **Edit** (✎). Edit memuat entry kembali ke form dan **menimpa** baris
   yang sama, tidak membuat baris baru.
7. **Download CSV → XLSX**, dua sheet (`CBM` dan `INFRA`).
8. **Kolom `tanggal` dan `jam` dipisah** dan diambil dari **waktu lokal HP**.

---

## Kenapa jam sebelumnya salah

v1.4 hanya menulis satu kolom `ts` berisi `new Date().toISOString()` — itu
**UTC**. Di WIB (UTC+7) jamnya tampak mundur 7 jam: entry jam 20:47 WIB tertulis
`2026-09-08T13:47:35.337Z`. v1.5 menambah kolom `tanggal` (`YYYY-MM-DD`) dan
`jam` (`HH:MM:SS`) dari waktu lokal HP.

Kolom `ts` **sengaja dipertahankan** dan kolom baru ditambahkan di **akhir**
`COLS`, supaya 344 baris yang sudah ada di spreadsheet tidak bergeser. Kolom
`ts` boleh di-hide saja di Google Sheets.

---

## Kenapa XLSX dibuat sendiri, bukan pakai SheetJS

Aplikasi dipakai di dalam gudang yang sinyalnya tidak bisa diandalkan. SheetJS
dari CDN akan gagal dimuat saat offline dan tombol export mati tanpa penjelasan.
v1.5 membangun file .xlsx langsung di dalam app: ZIP *stored* + CRC32 sendiri,
sel `inlineStr`. Tidak ada dependensi eksternal sama sekali, jalan penuh offline.
Sudah diuji: file hasilnya dibaca normal oleh openpyxl dan Excel.

---

## Arsitektur

```
index.html  (single file, offline-first via localStorage)
     │  POST no-cors  →  ?action=append      →  CBM_DATA
     │  POST no-cores →  ?action=appendInfra →  INFRA_DATA
     │  GET  ?action=list  +  ?action=listinfra   (verifikasi & tarik data tim)
     ▼
Google Apps Script Web App  →  Google Spreadsheet
```

**Sinkronisasi.** Apps Script menjawab POST dengan redirect 302 ke
`script.googleusercontent.com` yang sering tanpa header CORS — data **masuk**
tapi `fetch()` melempar error, sehingga entry terlihat "gagal sync" padahal
sukses. Karena itu POST dikirim `mode:'no-cors'` (fire-and-forget), lalu status
ditentukan dengan **membaca ulang isi Sheet**. Yang dipercaya adalah isi Sheet,
bukan respons POST.

**Upsert by id.** Sejak v1.5 `doPost` menimpa baris dengan id yang sama, bukan
melewatinya. Tanpa ini tombol Edit tidak akan pernah bisa memperbaiki baris yang
sudah tersinkron. Menekan Sync berkali-kali tetap aman.

---

## Batasan yang perlu diketahui

- **Menghapus entry (✕) hanya menghapus di HP.** Baris yang sudah tersinkron
  tetap ada di Google Sheets dan harus dihapus manual di spreadsheet. Kalau
  salah input, **lebih baik pakai Edit (✎)** daripada hapus lalu input ulang.
- **Katalog ukuran bin disimpan per-HP** dan tidak ikut sync. Semua anggota tim
  harus menyamakan angkanya di tab Setup.
- Angka CBM adalah **snapshot** saat survey; sebutkan tanggalnya di laporan.

---

## File

```
index.html                 aplikasi (single file)
apps-script/Code.gs        backend Google Apps Script
vercel.json                config deploy
DEPLOY_GUIDE.md            langkah pasang & deploy
ASSESSMENT_GUDANG_DAN_METODOLOGI_CBM.md   metodologi & hasil assessment foto
README.md                  dokumen ini
```
