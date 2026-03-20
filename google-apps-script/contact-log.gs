const SHEET_NAME = 'Contacts';
const HEADER_ROW = ['Timestamp', 'Name', 'Email', 'Message', 'Source'];

function doPost(e) {
  try {
    const secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    const requestSecret = (e && e.parameter && e.parameter.secret) || '';

    if (secret && secret !== requestSecret) {
      return jsonResponse_({ ok: false, error: 'Unauthorized' }, 401);
    }

    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sheet = getSheet_();

    sheet.appendRow([
      payload.submittedAt || new Date().toISOString(),
      payload.name || '',
      payload.email || '',
      payload.message || '',
      payload.source || 'Website Form',
    ]);

    return jsonResponse_({ ok: true }, 200);
  } catch (error) {
    return jsonResponse_({ ok: false, error: error.message }, 500);
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }

  return sheet;
}

function jsonResponse_(payload, status) {
  return ContentService
    .createTextOutput(JSON.stringify({ ...payload, status }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupWebhookSecret(secret) {
  const normalizedSecret = String(secret || '').trim();

  if (!normalizedSecret) {
    throw new Error("Provide a non-empty string, for example: setupWebhookSecret('your-secret-here')");
  }

  PropertiesService.getScriptProperties().setProperty('WEBHOOK_SECRET', normalizedSecret);
  return 'Webhook secret saved.';
}

function saveWebhookSecretOnce() {
  const secret = 'PASTE_YOUR_WEBHOOK_SECRET_HERE';

  if (secret === 'PASTE_YOUR_WEBHOOK_SECRET_HERE') {
    throw new Error("Edit saveWebhookSecretOnce() first and replace PASTE_YOUR_WEBHOOK_SECRET_HERE with your real secret.");
  }

  return setupWebhookSecret(secret);
}