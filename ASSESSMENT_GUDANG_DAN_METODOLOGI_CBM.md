# Assessment Gudang Spare Parts & Metodologi Hitung CBM

**Untuk:** Pak Deva — Parts Management, Customer Care Dept, MODENA
**Basis:** 85 foto gudang, diambil 03 September 2026, 08:23–08:43 WIB
**Tujuan:** menetapkan cara hitung CBM aset spare parts saat ini sebagai dasar sizing gudang baru
**Disclaimer:** semua dimensi di dokumen ini adalah **estimasi visual dari foto**, belum ada satu pun yang diukur fisik. Angka final hanya boleh keluar dari survey lapangan lewat aplikasi.

---

## 1. Ringkasan Kondisi

Gudang saat ini bukan satu ruang tunggal, melainkan **beberapa ruang/koridor terpisah dengan karakter penyimpanan yang sangat berbeda**. Ini adalah temuan paling penting: satu metode hitung tunggal (misalnya "hitung semua bin") akan meleset besar, karena porsi CBM yang signifikan justru **tidak berada di dalam bin**.

Yang terlihat di foto:

| Kondisi | Implikasi ke perhitungan CBM |
|---|---|
| Rak besi siku 5–6 level penuh bin plastik | Bisa dihitung cepat lewat kelas ukuran bin + % isi |
| Rak sekat kayu berisi kaca, door panel, sheet metal berdiri vertikal | **Tidak bisa** pakai logika bin. Mode **No Package**: ukur slot + % isi |
| Blue-film cabinet / oven cavity di shelf paling atas | Barang besar tak beraturan — masuk mode Karton |
| Tumpukan lantai & pallet (gasket door, regulator, karton besar) | Volume besar, sering terlewat kalau hanya hitung rak. Mode Karton, % dipakai sebagai kepadatan |
| Area FOC, Receiving, Inspection dengan barang menumpuk tanpa rak | Harus disurvey terpisah, mode Karton |
| Barang menonjol keluar bin (>100% isi) | Butuh skala % isi yang bisa lebih dari 100% |
| Material packing (karton lipat, plastik, insulasi roll) | Perlu keputusan: masuk aset atau tidak (lihat §5) |
| Unit appliance utuh (mesin cuci, dryer bongkar) | Bukan spare part — harus dipisah, jangan dicampur |

**Kesimpulan awal:** kalau hitungan hanya mengandalkan rak + bin, estimasi CBM berpotensi **under-count cukup besar**, karena area lantai/FOC/receiving dan rak kaca menyimpan volume yang tidak kecil. Aplikasi ini karena itu dibuat 4 mode, bukan 1.

---

## 2. Klasifikasi Objek Penyimpanan (hasil pengamatan foto)

### 2.1 Bin plastik (dominan di zona rak A–D)
Di foto terlihat banyak variasi warna (merah solid, biru mesh, kuning mesh, louvre bin biru, putih industri). **Warna tidak dipakai sebagai pembeda** — yang menentukan CBM hanya ukuran. Karena itu katalog disederhanakan menjadi tiga kelas:

| Kelas | Perkiraan awal (dalam, cm) | Contoh di foto |
|---|---|---|
| **Bin Kecil (S)** | 35 × 22 × 15 | louvre bin miring, tray kecil |
| **Bin Sedang (M)** | 52 × 35 × 25 | mayoritas bin mesh biru/kuning |
| **Bin Besar (L)** | 60 × 40 × 30 | bin solid besar, bin putih industri |

Bin yang tidak masuk ketiganya diinput lewat tombol **Bin Custom** — P×L×T diisi manual saat itu juga, tanpa menambah katalog.

> ⚠️ **Titik kritis akurasi.** Seluruh CBM bin bergantung pada tiga angka ini. Selisih 2 cm pada tinggi bin, dikali ribuan bin, bisa menggeser total puluhan sampai ratusan m³. **Kalibrasi fisik 1 sampel per kelas ukuran adalah langkah wajib pertama, bukan opsional.**

Penyederhanaan ini punya trade-off yang perlu disadari: bin dengan warna berbeda tapi ukuran mirip akan dianggap sama. Kalau di lapangan ternyata ada dua bin yang sama-sama "sedang" tapi tingginya beda jauh (misalnya 25 cm vs 16 cm), jangan dipaksa masuk kelas M — pakai **Bin Custom**, atau tambah satu kelas baru di tab Setup.

### 2.2 Barang tanpa kemasan / No Package (rak sekat kayu)
Rak dengan sekat kayu vertikal, isi kaca oven, door panel, sheet metal, grill kawat — disimpan **berdiri**. Tidak masuk akal diukur per lembar (ribuan lembar, tipis, tinggi variasi). Metode yang benar — mode **No Package**: **ukur ruang sekatnya, isi % keterisian**.

### 2.3 Karton box
Dua populasi berbeda:
- **Box kecil–sedang di rak** (part elektronik, motor, komponen) — relatif seragam per kelompok.
- **Box besar di lantai/pallet** — gasket door, regulator LPG, panel besar, box appliance.

Metode: ukur 1 box representatif, input jumlah box identik. Untuk box, volume luar = volume ruang yang dipakai, jadi % isi default 100%.

### 2.4 Tumpukan lantai / pallet
Area receiving, FOC, dan beberapa sudut punya tumpukan tanpa rak — tinggi bervariasi, tidak rapi, banyak rongga. Ditangani oleh **mode Karton yang sama**: ukur **alas × tinggi**, qty = 1, dan isi % sebagai **kepadatan** (bukan keterisian box). Pilihan isi tersedia: Karton campuran, Kaca/Panel, Unit besar/Appliance, Material packing, Barang FOC, Barang Receiving, Lainnya.

### 2.5 Rak (infrastruktur)
Terlihat minimal 5 tipe: rak besi siku lubang (dominan), rak heavy duty biru (pallet racking), rak sekat kayu, rak louvre bin, dan level mezzanine berpagar kawat. Ini **bukan aset barang**, tapi wajib didata untuk tahu kapasitas & footprint eksisting.

### 2.6 Zona yang terlihat dari signage
`RACK A1–A10`, `B1–B5`, `C…`, `D1–D10 (COOLING)`, `GLASS AREA`, `FOC AREA`, `RECEIVING AREA`, `INSPECTION AREA`, `COMPRESSOR AREA`, plus mezzanine dan koridor small parts. Daftar zona ini dipakai sebagai autocomplete di aplikasi — mohon dikoreksi kalau ada yang keliru atau kurang.

**Zona dan rak bersifat opsional di aplikasi**, supaya survey tidak tersendat kalau ada area yang belum punya penamaan. Konsekuensinya: entry tanpa zona akan masuk kelompok `(kosong)` di ringkasan per zona dan tidak bisa direkonsiliasi per area. Untuk area yang sudah punya label rak, tetap disarankan diisi — sekali ketik, nilainya bertahan untuk entry berikutnya.

---

## 3. Dua Angka CBM yang Harus Dibedakan

Ini keputusan metodologi paling menentukan, dan sudah dikunci: **aplikasi menghitung keduanya.**

| Istilah | Rumus | Untuk apa |
|---|---|---|
| **Occupied CBM** (CBM barang) | Σ volume bin/slot/box × % isi | Volume barang riil. Angka "berapa CBM aset yang kita punya". |
| **Gross CBM** (CBM ruang terpakai) | Σ volume bin/slot/box (100%) | Volume **ruang penyimpanan** yang benar-benar dipakai. |
| **Rack Envelope CBM** | Σ P×L×T rak | Kapasitas kasar rak eksisting. |
| **Utilisasi bin** | Occupied ÷ Gross | Seberapa efisien bin diisi. Kalau rendah → gudang baru bisa lebih kecil dari kelihatannya. |

**Kenapa jangan pakai Occupied saja untuk sizing gudang baru:** barang di dalam bin punya rongga (void). Bin yang isinya 60% tetap memakan 100% ruang rak. Kalau gudang baru disizing dari Occupied CBM saja, raknya akan kurang. Sebaliknya kalau pakai Gross saja tanpa lihat utilisasi, kita membekukan inefisiensi lama ke gudang baru — bayar sewa untuk udara.

Cara pakai yang benar: **sizing dari Gross, lalu koreksi dengan target utilisasi yang lebih baik.** Modul "Simulasi Gudang Baru" di aplikasi persis melakukan itu.

---

## 4. Rumus yang Dipakai Aplikasi

Semua dimensi input dalam **sentimeter**, output dalam **m³**.

```
volume_unit (m³) = (P × L × T) / 1.000.000

BIN       : gross = volume_unit × qty        ; occupied = gross × (%isi/100)
NO PACK   : gross = volume_slot × qty        ; occupied = gross × (%isi/100)
KARTON    : gross = volume_box  × qty        ; occupied = gross × (%isi/100)
            (tumpukan: P×L×T = alas × tinggi, qty=1, % = kepadatan)
RAK       : envelope = P×L×T × qty           ; occupied = 0  (TIDAK masuk CBM barang)
            footprint (m²) = (P×L/10.000) × qty
            luas shelf (m²) = (P×L/10.000) × jumlah_level × qty
```

**Skala % isi** yang disediakan: 0 / 10 / 25 / 50 / 75 / 90 / 100 / 110 / 125 / 150.
Nilai di atas 100% dipakai untuk bin yang **barangnya menonjol keluar** — kondisi ini nyata terlihat di foto dan kalau dipaksa 100% akan under-count.

**Simulasi gudang baru:**
```
V_barang    = Occupied × (1 + growth%)
V_bin       = V_barang ÷ target_isi_bin%      (default 80%)
V_rak       = V_bin ÷ densitas_rak%           (default 55%)
Luas_rak    = V_rak ÷ tinggi_rak_rencana
Luas_lantai = Luas_rak × faktor_gang          (default 1,8×)
```
Semua asumsi (growth, target isi, densitas, tinggi rak, faktor gang) bisa diubah langsung di aplikasi supaya bisa main skenario di depan management.

---

## 5. Keputusan yang Masih Perlu Pak Deva Tetapkan

Ini pertanyaan yang muncul dari foto dan **harus dijawab sebelum survey mulai**, karena mempengaruhi angka akhir:

1. **Material packing** (karton lipat, plastik roll, insulasi, bubble wrap — terlihat menumpuk banyak di satu ruang) — masuk hitungan CBM atau dipisah? Volumenya tidak kecil, tapi ini consumable, bukan spare part.
2. **Unit appliance utuh** (mesin cuci, microwave, dryer bongkaran) — masuk atau dikeluarkan? Kalau untuk sizing gudang baru, tetap butuh ruang, jadi saran saya **tetap dihitung tapi diberi zona sendiri** agar bisa difilter.
3. **Barang FOC & Receiving** — status transit atau stok tetap? Kalau transit, tetap perlu ruang, jadi hitung tapi tandai zona.
4. **Barang rusak / scrap** — kalau ada rencana disposal sebelum pindah, jangan dihitung ke gudang baru; tandai zona terpisah.
5. **Rak mana yang ikut pindah** — kalau rak eksisting ikut dibawa, sizing gudang baru harus pakai dimensi rak yang sudah ada, bukan rak rencana baru.

Saran saya: buat zona khusus untuk poin 1–4 (`PACKING`, `APPLIANCE`, `FOC`, `SCRAP`) supaya bisa di-include/exclude belakangan tanpa survey ulang.

---

## 6. SOP Survey Lapangan

### Tahap 0 — Kalibrasi (½ hari, 1 orang) — WAJIB DULUAN
Ambil 1 sampel fisik untuk **Bin Kecil, Bin Sedang, dan Bin Besar**. Ukur **dimensi dalam** (P × L × T) pakai meteran. Update di tab **Setup** aplikasi, tandai **Terkalibrasi**. Sebar hasil kalibrasi ke seluruh HP tim (screenshot katalognya) supaya semua pakai angka yang sama. Bin di luar tiga kelas itu tidak perlu dikalibrasi — di lapangan pakai **Bin Custom**.

### Tahap 1 — Survey rak (mode RAK)
Per zona: ukur 1 rak representatif, hitung berapa rak identik di zona itu, input 1 entry. Ini cepat — mungkin < 1 jam untuk seluruh gudang, dan langsung memberi angka kapasitas + footprint eksisting.

### Tahap 2 — Sapu isi rak (mode BIN / NO PACK / KARTON)
Kerja per **rak**, level demi level. Di satu level biasanya bin-nya seragam → 1 entry bisa mewakili banyak bin (`qty` + `% isi` rata-rata). Kalau di satu level campur ukuran, buat entry terpisah per kelas ukuran. Bin non-standar → **Bin Custom**.

### Tahap 3 — Area non-rak (mode KARTON)
Lantai, FOC, Receiving, mezzanine, koridor. Ukur footprint tumpukan pakai meteran, tinggi diperkirakan (atau pakai tinggi rak di sebelahnya sebagai acuan), qty = 1, dan % diisi sebagai kepadatan tumpukan.

### Pembagian tim & alat
- **Alat minimum:** meteran 5 m (per orang), HP, spidol/lakban untuk menandai rak yang sudah dihitung.
- **Tandai rak yang sudah selesai** dengan lakban warna — ini yang paling sering bikin double-count kalau dilewat.
- Sebaiknya 1 zona = 1 PIC, jangan dua orang di zona sama.
- Tekan **Sync** tiap selesai satu zona, jangan menunggu sampai akhir hari.

### Aturan anti double-count (non-negotiable)
- Bin di dalam rak → mode BIN. **Jangan** dihitung lagi sebagai tumpukan di mode KARTON.
- Karton **di dalam** bin sudah masuk % isi bin — jangan dihitung terpisah.
- Mode RAK murni kapasitas, tidak pernah menambah CBM barang.
- 1 slot kaca = 1 entry NO PACK. Lembarannya tidak diukur satu per satu.
- Zona/rak opsional, tapi **isi kalau areanya punya label** — ini kunci rekonsiliasi antar-PIC dan pengecekan kewajaran per zona.

---

## 7. Estimasi Effort (kasar, perlu dikoreksi Pak)

Asumsi: 1 entry ≈ 30–60 detik termasuk ukur.

| Tahap | Perkiraan entry | Perkiraan waktu |
|---|---|---|
| Kalibrasi ukuran bin | 3 | ½ hari |
| Survey rak | 30–60 | 1–2 jam |
| Sapu isi rak (bin / no pack / karton) | 400–900 | 2–4 hari-orang |
| Area non-rak | 50–120 | ½–1 hari-orang |

Dengan 4 orang PMT paralel, realistis **2–3 hari kerja** untuk seluruh gudang. Angka ini sangat sensitif ke jumlah rak sebenarnya — sesudah Tahap 1 selesai, estimasinya bisa dipertajam.

---

## 8. Validasi Hasil Sebelum Dipakai ke Management

Sebelum angka final dipakai untuk negosiasi gudang baru, lakukan 3 cek ini:

1. **Cek silang volumetrik.** Total Gross CBM tidak boleh melebihi Rack Envelope CBM + volume area lantai. Kalau melebihi → ada double-count.
2. **Cek kewajaran per zona.** Bandingkan CBM per zona dengan luas fisik zona itu. Zona 20 m² tidak mungkin menampung 200 m³ barang.
3. **Sampling ulang 5%.** Ambil 5% entry secara acak, ukur ulang oleh orang berbeda. Kalau deviasi >10%, metode ukur perlu disamakan lagi.

---

## 9. Yang Belum Bisa Dijawab dari Foto

Supaya jelas batas asesmen ini — hal-hal berikut **tidak bisa** disimpulkan dari foto dan harus datang dari lapangan:

- Luas lantai gudang saat ini (m²) dan tinggi bersih bangunan.
- Jumlah rak sebenarnya per zona.
- Dimensi asli bin (ketiga kelas ukuran di katalog aplikasi masih estimasi).
- Berapa banyak stok yang berstatus slow moving / no demand — ini relevan karena kalau ada program disposal sebelum pindah, CBM target bisa turun signifikan dan gudang baru bisa lebih kecil. Data ini ada di dashboard PMT (kategori moving), bisa disandingkan setelah survey selesai.

---

*Dokumen ini adalah basis metodologi. Setelah survey Tahap 1 selesai, kirim data awalnya — saya bantu review kewajaran angkanya sebelum lanjut ke tahap berikutnya.*
