const express = require('express');
const cors = require('cors');
const path = require('path');
const { runMigrations } = require('stripe-replit-sync');
const { getUncachableGoogleSheetClient, getUncachableGmailClient } = require('./googleClients');
const { getUncachableStripeClient, getStripeSync, getPublishableKey } = require('./stripeClient');
const { WebhookHandlers } = require('./webhookHandlers');

const app = express();
const PORT = process.env.PORT || 3001;

const SPREADSHEET_ID = '1A4l7FG54w_qgFIUBCJk53Wo56pdSSdhZLVEmBOTBb9o';
const NOTIFY_EMAIL = 'graduation@aaroncole.dev';

// Stripe webhook MUST be registered before express.json()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) return res.status(400).json({ error: 'Missing signature' });
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      await WebhookHandlers.processWebhook(req.body, sig);
      res.status(200).json({ received: true });
    } catch (err) {
      console.error('Webhook error:', err.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(cors());
app.use(express.json());

// RSVP route
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
      range: 'RSVPs!A:D',
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

// Stripe: get publishable key
app.get('/api/donate/config', async (req, res) => {
  try {
    const publishableKey = await getPublishableKey();
    res.json({ publishableKey });
  } catch (err) {
    console.error('Stripe config error:', err.message);
    res.status(500).json({ error: 'Stripe not configured' });
  }
});

// Stripe: create payment intent for donation
app.post('/api/donate/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Amount must be at least $1' });
  }

  try {
    const stripe = await getUncachableStripeClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      description: "Aaron's Graduation Donation",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe payment intent error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Serve React frontend
const buildDir = path.join(__dirname, '..', 'build');
app.use(express.static(buildDir));
app.use((req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('DATABASE_URL not set — skipping Stripe schema migration');
    return;
  }
  try {
    await runMigrations({ databaseUrl, schema: 'stripe' });
    console.log('Stripe schema ready');
    const stripeSync = await getStripeSync();
    const webhookBaseUrl = `https://${(process.env.REPLIT_DOMAINS || '').split(',')[0]}`;
    await stripeSync.findOrCreateManagedWebhook(`${webhookBaseUrl}/api/stripe/webhook`);
    stripeSync.syncBackfill().catch((err) => console.error('Stripe backfill error:', err));
  } catch (err) {
    console.warn('Stripe init skipped (not yet connected):', err.message);
  }
}

initStripe().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});
