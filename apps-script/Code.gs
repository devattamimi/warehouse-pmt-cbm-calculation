/**
 * Warehouse PMT - CBM Calculation — Backend Google Apps Script     v1.5
 * Parts Management, Customer Care Dept — MODENA
 *
 * Deploy: Extensions > Apps Script > Deploy > New deployment
 *         Type: Web app | Execute as: Me | Who has access: Anyone
 * Copy URL .../exec ke tab Setup di aplikasi.
 *
 * ⚠ Setiap kali file ini diubah, WAJIB:
 *   Deploy > Manage deployments > pensil > Version: New version > Deploy.
 *   Menekan Save saja TIDAK membuat perubahan aktif.
 *
 * Dua sheet, sengaja dipisah:
 *   CBM_DATA    volume barang (BIN / KARTON / NOPACK)
 *   INFRA_DATA  aset gudang (rak, bin, lampu, meja, ...) — BUKAN CBM
 *
 * v1.5:
 *  · doPost sekarang UPSERT by id, bukan skip-duplikat. Tanpa ini, tombol
 *    Edit di app tidak pernah bisa memperbaiki baris yang sudah tersinkron.
 *  · Kolom 'tanggal' dan 'jam' ditambahkan DI AKHIR COLS, diisi dari waktu
 *    lokal HP. Kolom 'ts' lama tetap ada (isinya UTC) supaya 344 baris yang
 *    sudah ada tidak bergeser. Kolom ts boleh di-hide di spreadsheet.
 *  · action appendInfra / listinfra untuk sheet INFRA_DATA.
 */

var SHEET_NAME  = 'CBM_DATA';
var INFRA_SHEET = 'INFRA_DATA';

/* Kolom baru SELALU ditambah di AKHIR array, supaya data lama tetap sejajar. */
var COLS = ['id','ts','pic','wh','mode','zone','rack','tipe','isi',
            'p','l','t','levels','qty','fill','unitCbm','grossCbm','occCbm',
            'footM2','shelfM2','note','locator','tanggal','jam'];

var INFRA_COLS = ['id','ts','tanggal','jam','pic','wh','jenis','varian',
                  'rack','locator','p','l','t','levels','qty',
                  'volM3','footM2','shelfM2','note'];

/* ---------------------------------------------------------------- sheets */

function sheetFor_(name, cols) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, cols.length).setValues([cols]);
    styleHeader_(sh, cols.length);
    sh.setFrozenRows(1);
    return sh;
  }
  if (sh.getLastColumn() < cols.length) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]);
    styleHeader_(sh, cols.length);
    sh.setFrozenRows(1);
  }
  return sh;
}
function getSheet_()      { return sheetFor_(SHEET_NAME,  COLS); }
function getInfraSheet_() { return sheetFor_(INFRA_SHEET, INFRA_COLS); }

function styleHeader_(sh, n) {
  sh.getRange(1, 1, 1, n).setFontWeight('bold')
    .setBackground('#0E2A47').setFontColor('#FFFFFF');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ POST */
/**
 * POST { action:'append'      , rows:[...] }  -> CBM_DATA
 * POST { action:'appendInfra' , rows:[...] }  -> INFRA_DATA
 *
 * UPSERT by id: baris dengan id yang sama DITIMPA di tempat, bukan ditambah.
 * Jadi menekan Sync berkali-kali aman, dan hasil Edit di app benar-benar
 * memperbaiki baris yang sudah ada.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    var sh, cols;
    if (action === 'append')            { sh = getSheet_();      cols = COLS; }
    else if (action === 'appendInfra')  { sh = getInfraSheet_(); cols = INFRA_COLS; }
    else return json_({ ok: false, error: 'unknown action: ' + action });

    var rows = body.rows || [];
    if (!rows.length) return json_({ ok: true, added: 0, updated: 0 });

    // peta id -> nomor baris
    var pos = {};
    var last = sh.getLastRow();
    if (last > 1) {
      var ids = sh.getRange(2, 1, last - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        var key = String(ids[i][0]);
        if (key) pos[key] = i + 2;
      }
    }

    var appendRows = [], updated = 0;
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (!row || !row.id) continue;
      var line = [];
      for (var c = 0; c < cols.length; c++) {
        var v = row[cols[c]];
        line.push(v === undefined || v === null ? '' : v);
      }
      var at = pos[String(row.id)];
      if (at) {
        sh.getRange(at, 1, 1, cols.length).setValues([line]);
        updated++;
      } else {
        appendRows.push(line);
        pos[String(row.id)] = -1; // cegah duplikat dalam satu kiriman
      }
    }

    if (appendRows.length) {
      sh.getRange(sh.getLastRow() + 1, 1, appendRows.length, cols.length).setValues(appendRows);
    }
    return json_({ ok: true, added: appendRows.length, updated: updated });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/* ------------------------------------------------------------------- GET */
/**
 * GET ?action=list       -> baris CBM_DATA   + summary
 * GET ?action=listinfra  -> baris INFRA_DATA + summary infra
 * GET ?action=summary    -> summary CBM saja
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'list';

    if (action === 'listinfra') {
      var rowsI = readRows_(getInfraSheet_(), INFRA_COLS);
      return json_({ ok: true, rows: rowsI, summary: summarizeInfra_(rowsI) });
    }

    var rows = readRows_(getSheet_(), COLS);
    if (action === 'summary') return json_({ ok: true, summary: summarize_(rows) });
    return json_({ ok: true, rows: rows, summary: summarize_(rows) });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function readRows_(sh, cols) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, cols.length).getValues();
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    if (!values[i][0]) continue;               // baris tanpa id dilewati
    var o = {};
    for (var c = 0; c < cols.length; c++) o[cols[c]] = values[i][c];
    rows.push(o);
  }
  return rows;
}

/* --------------------------------------------------------------- summary */

function emptySummary_() {
  return { occCbm: 0, grossCbm: 0, nBin: 0, nKarton: 0, nSlot: 0, nEntry: 0, byRack: {} };
}

/* Entry lama bermode 'RAK' TIDAK dihitung sebagai CBM barang — dulu mode itu
   memang cuma envelope rak, sekarang sudah pindah ke INFRA_DATA. */
function summarize_(rows) {
  var s = emptySummary_();
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (r.mode === 'RAK' || r.mode === 'INFRA') continue;
    var qty = Number(r.qty) || 0;
    s.nEntry++;
    s.occCbm   += Number(r.occCbm)   || 0;
    s.grossCbm += Number(r.grossCbm) || 0;
    if (r.mode === 'BIN') s.nBin += qty;
    else if (r.mode === 'KARTON') s.nKarton += qty;
    else if (r.mode === 'NOPACK') s.nSlot += qty;
    var k = r.rack || r.zone || '(tanpa rak)';
    s.byRack[k] = (s.byRack[k] || 0) + (Number(r.occCbm) || 0);
  }
  return s;
}

function summarizeInfra_(rows) {
  var s = { nEntry: rows.length, nUnit: 0, nRak: 0, nBin: 0,
            footM2: 0, shelfM2: 0, byJenis: {} };
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i], qty = Number(r.qty) || 0, j = r.jenis || 'Lainnya';
    s.nUnit += qty;
    s.byJenis[j] = (s.byJenis[j] || 0) + qty;
    if (j === 'Rak') {
      s.nRak    += qty;
      s.footM2  += Number(r.footM2)  || 0;
      s.shelfM2 += Number(r.shelfM2) || 0;
    }
    if (j === 'Bin') s.nBin += qty;
  }
  return s;
}
