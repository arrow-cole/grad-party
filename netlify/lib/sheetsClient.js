const crypto = require('crypto');

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function getServiceAccountJson() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.google_service_account_json;
}

function getServiceAccountCredentials() {
  const serviceAccountJson = getServiceAccountJson();
  if (!serviceAccountJson) {
    return null;
  }

  const credentials = JSON.parse(serviceAccountJson);
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }

  return credentials;
}

function hasGoogleSheetsAuth() {
  return Boolean(getServiceAccountCredentials());
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createSignedJwt(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now
    })
  );
  const unsigned = `${header}.${payload}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(credentials.private_key, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  return `${unsigned}.${signature}`;
}

async function getAccessToken(credentials) {
  const assertion = createSignedJwt(credentials);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function appendSheetValues({ spreadsheetId, range, values }) {
  const credentials = getServiceAccountCredentials();
  if (!credentials) {
    throw new Error('Google Sheets credentials are not configured');
  }

  const accessToken = await getAccessToken(credentials);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/` +
    `${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API failed (${res.status}): ${text}`);
  }

  return res.json();
}

module.exports = {
  appendSheetValues,
  hasGoogleSheetsAuth
};
