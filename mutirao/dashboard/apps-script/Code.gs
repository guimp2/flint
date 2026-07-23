const SPREADSHEET_ID = '1hJHXy7LlO7hXVroqMYRFHAGB9o4B78OVgqBWGKdKxR4';
const SHEET_NAME = 'BH';

function doGet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`A aba ${SHEET_NAME} não foi encontrada.`);

    const values = sheet.getDataRange().getDisplayValues();
    const headers = values.shift().map(value => String(value || '').trim());
    const rows = values
      .filter(row => row.some(value => String(value || '').trim() !== ''))
      .map(row => {
        const object = {};
        headers.forEach((header, index) => object[header] = String(row[index] || '').trim());
        return object;
      });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, updatedAt: new Date().toISOString(), rows }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
