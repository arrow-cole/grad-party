const express = require('express');
const cors = require('cors');
const { getUncachableGoogleSheetClient, getUncachableGmailClient } = require('./googleClients');

const app = express();
const PORT = 3001;

const SPREADSHEET_ID = '1Fko6l1fIvmWYjZnAbakthVuTXQUAHsXEhpmB_lzzcT0';
const NOTIFY_EMAIL = 'graduation@aaroncole.dev';

app.use(cors());
app.use(express.json());

app.post('/api/rsvp', async (req, res) => {
  const { name, email, attendance } = req.body;

  if (!name || !email || !attendance) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const attendanceLabel = attendance === 'yes' ? 'Yes' : attendance === 'maybe' ? 'Interested' : 'No';
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

  try {
    const sheets = await getUncachableGoogleSheetClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, name, email, attendanceLabel]]
      }
    });
  } catch (err) {
    console.error('Google Sheets error:', err.message);
    return res.status(500).json({ error: 'Failed to save to Google Sheets' });
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
    return res.status(500).json({ error: 'Saved to sheet but failed to send email' });
  }

  res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RSVP server running on port ${PORT}`);
});
