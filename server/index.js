const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');
const {
  getUncachableGoogleSheetClient,
  getUncachableGmailClient,
  hasGoogleSheetsAuth,
  hasReplitConnectorAuth
} = require('./googleClients');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const RSVP_STORAGE_PATH = process.env.RSVP_STORAGE_PATH || path.join(__dirname, '..', 'data', 'rsvps.csv');

const SPREADSHEET_ID = '1A4l7FG54w_qgFIUBCJk53Wo56pdSSdhZLVEmBOTBb9o';
const NOTIFY_EMAIL = 'graduation@aaronsgrad.us';

app.use(cors());
app.use(express.json());

function toCsvValue(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

async function appendLocalRsvp(row) {
  const directory = path.dirname(RSVP_STORAGE_PATH);
  await fs.mkdir(directory, { recursive: true });

  try {
    await fs.access(RSVP_STORAGE_PATH);
  } catch {
    await fs.writeFile(RSVP_STORAGE_PATH, 'Timestamp,Name,Email,Attending\n');
  }

  await fs.appendFile(RSVP_STORAGE_PATH, `${row.map(toCsvValue).join(',')}\n`);
}

app.post('/api/rsvp', async (req, res) => {
  const { name, email, attendance } = req.body;

  if (!name || !email || !attendance) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const attendanceLabel = attendance === 'yes' ? 'Yes' : attendance === 'maybe' ? 'Interested' : 'No';
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const rsvpRow = [timestamp, name, email, attendanceLabel];

  try {
    await appendLocalRsvp(rsvpRow);
  } catch (err) {
    console.error('Local RSVP storage error:', err.message);
    return res.status(500).json({ error: 'Failed to save RSVP' });
  }

  if (!hasGoogleSheetsAuth()) {
    return res.json({ success: true, savedTo: 'local' });
  }

  try {
    const sheets = await getUncachableGoogleSheetClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'RSVPs!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rsvpRow]
      }
    });
  } catch (err) {
    console.error('Google Sheets error:', err.message);
    return res.json({ success: true, savedTo: 'local', warning: 'Saved locally but failed to save to Google Sheets' });
  }

  if (!hasReplitConnectorAuth()) {
    return res.json({ success: true, savedTo: 'local-and-sheet' });
  }

  try {
    const gmail = await getUncachableGmailClient();
    const subject = `New RSVP from ${name}`;
    const body = `You have a new RSVP submission:\n\nName: ${name}\nEmail: ${email}\nAttending: ${attendanceLabel}\nSubmitted: ${timestamp}`;

    const emailLines = [
      `From: me`,
      `To: ${NOTIFY_EMAIL}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      ``,
      body
    ];
    const rawEmail = Buffer.from(emailLines.join('\n')).toString('base64url');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: rawEmail }
    });
  } catch (err) {
    console.error('Gmail error:', err.message);
    return res.json({ success: true, savedTo: 'local-and-sheet', warning: 'Saved RSVP but failed to send email' });
  }

  res.json({ success: true, savedTo: 'local-and-sheet-and-email' });
});

const buildDir = path.join(__dirname, '..', 'build');
app.use(express.static(buildDir));
app.use((req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
