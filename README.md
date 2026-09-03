# Warehouse PMT - CBM Calculation

Aplikasi mobile untuk menghitung total **CBM (m³)** spare parts di gudang, sebagai dasar sizing gudang baru.

**Creator:** Deva — Parts Management, Customer Care Department
**Versi:** 1.0 (September 2026)

---

## Fitur

- **4 mode input** — Bin, No Package (kaca/panel di slot), Karton/Tumpukan, Rak
- **Katalog ukuran bin** — Kecil / Sedang / Besar (tidak dibedakan warna) + **Bin Custom** untuk ukuran non-standar yang diisi manual
- **% isi 0–150%** (mendukung bin yang barangnya menonjol keluar)
- **Dua angka CBM** — Occupied (barang) dan Gross (ruang terpakai) + utilisasi
- **Data rak** — kapasitas envelope, footprint m², luas shelf m²
- **Simulasi gudang baru** — growth, target isi bin, densitas rak, tinggi rak, faktor gang
- **Offline-first** — semua tersimpan di HP, sync kapan saja
- **Sync Google Sheets** — data seluruh PMT tergabung otomatis, anti-duplikat
- **Export CSV + share WhatsApp**

## Tech Stack

- Pure HTML / CSS / JavaScript, single file (`index.html`)
- Google Apps Script Web App + Google Sheets sebagai backend
- LocalStorage untuk offline
- Deploy: GitHub → Vercel (static)

## Struktur

```
index.html                              aplikasi (single file)
vercel.json                             config deploy Vercel
apps-script/Code.gs                     backend Google Apps Script
DEPLOY_GUIDE.md                         langkah deploy end-to-end
ASSESSMENT_GUDANG_DAN_METODOLOGI_CBM.md assessment gudang + metodologi & SOP
```

## Rumus Inti

```
volume_unit (m³) = (P × L × T cm) / 1.000.000
occupied = volume_unit × qty × (%isi / 100)
gross    = volume_unit × qty
RAK: envelope = P×L×T×qty ; footprint = (P×L/10.000)×qty ; shelf = footprint × level
```

Mode **RAK tidak pernah menambah CBM barang** — murni data kapasitas.

## Sebelum Dipakai

1. Isi **Nama PIC** dan **URL Apps Script** di tab Setup.
2. **Kalibrasi katalog ukuran bin** — ukur fisik 1 sampel Bin Kecil / Sedang / Besar, update dimensi dalam (cm), tandai *Terkalibrasi*. Dimensi bawaan hanya estimasi awal.
3. Zona & rak **opsional**; kalau diisi, nilainya tetap tersimpan antar entry dan setelah app ditutup.
4. Baca aturan anti double-count di tab Setup.

Detail metodologi dan SOP survey ada di `ASSESSMENT_GUDANG_DAN_METODOLOGI_CBM.md`.
