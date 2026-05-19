const { appendSheetValues, hasGoogleSheetsAuth } = require('../lib/sheetsClient');

const SPREADSHEET_ID = '1A4l7FG54w_qgFIUBCJk53Wo56pdSSdhZLVEmBOTBb9o';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function rsvp(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid request body' });
  }

  const { name, email, attendance } = body;

  if (!name || !email || !attendance) {
    return json(400, { error: 'Missing required fields' });
  }

  if (!hasGoogleSheetsAuth()) {
    return json(500, { error: 'Google Sheets is not configured for this deployment' });
  }

  const attending = attendance === 'yes' ? 'Yes' : attendance === 'maybe' ? 'Interested' : 'No';
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

  try {
    await appendSheetValues({
      spreadsheetId: SPREADSHEET_ID,
      range: 'RSVPs!A:D',
      values: [[timestamp, name, email, attending]]
    });

    return json(200, { success: true, savedTo: 'sheet' });
  } catch (err) {
    console.error('Google Sheets error:', err.message);
    return json(500, { error: 'Failed to save RSVP to Google Sheets' });
  }
};
