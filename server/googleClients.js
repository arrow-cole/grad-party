const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const DEFAULT_SERVICE_ACCOUNT_KEY_FILE = path.join(__dirname, '..', 'google-service-account.json');

function parseServiceAccountCredentials() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return null;
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }

  return credentials;
}

function hasGoogleSheetsServiceAccountAuth() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      fs.existsSync(DEFAULT_SERVICE_ACCOUNT_KEY_FILE)
  );
}

function hasReplitConnectorAuth() {
  return Boolean(
    process.env.REPLIT_CONNECTORS_HOSTNAME &&
      (process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL)
  );
}

function hasGoogleSheetsAuth() {
  return hasGoogleSheetsServiceAccountAuth() || hasReplitConnectorAuth();
}

async function getAccessToken(connectorName) {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + `/api/v2/connection?include_secrets=true&connector_names=${connectorName}`,
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error(`${connectorName} not connected`);
  }
  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  if (hasGoogleSheetsServiceAccountAuth()) {
    const auth = new google.auth.GoogleAuth({
      credentials: parseServiceAccountCredentials() || undefined,
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_SERVICE_ACCOUNT_KEY_FILE,
      scopes: [SHEETS_SCOPE]
    });

    return google.sheets({ version: 'v4', auth });
  }

  const accessToken = await getAccessToken('google-sheet');
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function getUncachableGmailClient() {
  const accessToken = await getAccessToken('google-mail');
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

module.exports = {
  getUncachableGoogleSheetClient,
  getUncachableGmailClient,
  hasGoogleSheetsAuth,
  hasReplitConnectorAuth
};
