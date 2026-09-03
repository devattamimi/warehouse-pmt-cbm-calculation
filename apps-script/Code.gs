/**
 * Warehouse PMT - CBM Calculation — Backend Google Apps Script
 * Parts Management, Customer Care Dept — MODENA
 *
 * Deploy: Extensions > Apps Script > Deploy > New deployment
 *         Type: Web app | Execute as: Me | Who has access: Anyone
 * Copy URL .../exec ke tab Setup di aplikasi.
 */

var SHEET_NAME = 'CBM_DATA';

var COLS = ['id','ts','pic','wh','mode','zone','rack','tipe','isi',
            'p','l','t','levels','qty','fill','unitCbm','grossCbm','occCbm',
            'footM2','shelfM2','note','locator'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(COLS);
    styleHeader_(sh);
    sh.setFrozenRows(1);
    return sh;
  }
  // Perbaiki header kalau ada kolom baru (kolom baru selalu DITAMBAH di akhir COLS,
  // jadi data lama tetap sejajar dan tidak perlu dimigrasi).
  if (sh.getLastColumn() < COLS.length) {
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS]);
    styleHeader_(sh);
    sh.setFrozenRows(1);
  }
  return sh;
}

function styleHeader_(sh) {
  sh.getRange(1, 1, 1, COLS.length).setFontWeight('bold')
    .setBackground('#0E2A47').setFontColor('#FFFFFF');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** POST { action:'append', rows:[ {...}, ... ] } */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var body = JSON.parse(e.postData.contents);
    if (body.action !== 'append') return json_({ ok: false, error: 'unknown action' });

    var rows = body.rows || [];
    if (!rows.length) return json_({ ok: true, added: 0 });

    var sh = getSheet_();

    // anti-duplikat: kumpulkan id yang sudah ada
    var existing = {};
    var last = sh.getLastRow();
    if (last > 1) {
      var ids = sh.getRange(2, 1, last - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) existing[String(ids[i][0])] = true;
    }

    var out = [];
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (!row || !row.id || existing[String(row.id)]) continue;
      existing[String(row.id)] = true;
      var line = [];
      for (var c = 0; c < COLS.length; c++) {
        var v = row[COLS[c]];
        line.push(v === undefined || v === null ? '' : v);
      }
      out.push(line);
    }

    if (out.length) {
      sh.getRange(sh.getLastRow() + 1, 1, out.length, COLS.length).setValues(out);
    }
    return json_({ ok: true, added: out.length, skipped: rows.length - out.length });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/** GET ?action=list  |  GET ?action=summary */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'list';
    var sh = getSheet_();
    var last = sh.getLastRow();
    if (last < 2) return json_({ ok: true, rows: [], summary: emptySummary_() });

    var values = sh.getRange(2, 1, last - 1, COLS.length).getValues();
    var rows = [];
    for (var i = 0; i < values.length; i++) {
      var o = {};
      for (var c = 0; c < COLS.length; c++) o[COLS[c]] = values[i][c];
      rows.push(o);
    }

    if (action === 'summary') return json_({ ok: true, summary: summarize_(rows) });
    return json_({ ok: true, rows: rows, summary: summarize_(rows) });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function emptySummary_() {
  return { occCbm: 0, grossCbm: 0, rakCbm: 0, footM2: 0, shelfM2: 0,
           nBin: 0, nKarton: 0, nSlot: 0, nRak: 0, nEntry: 0, byZone: {} };
}

function summarize_(rows) {
  var s = emptySummary_();
  s.nEntry = rows.length;
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var qty = Number(r.qty) || 0;
    if (r.mode === 'RAK') {
      s.rakCbm  += Number(r.grossCbm) || 0;
      s.footM2  += Number(r.footM2)  || 0;
      s.shelfM2 += Number(r.shelfM2) || 0;
      s.nRak    += qty;
    } else {
      s.occCbm   += Number(r.occCbm)   || 0;
      s.grossCbm += Number(r.grossCbm) || 0;
      if (r.mode === 'BIN') s.nBin += qty;
      else if (r.mode === 'KARTON') s.nKarton += qty;
      else if (r.mode === 'NOPACK') s.nSlot += qty;
      var z = r.zone || '(kosong)';
      s.byZone[z] = (s.byZone[z] || 0) + (Number(r.occCbm) || 0);
    }
  }
  return s;
}
