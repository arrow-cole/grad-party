const Stripe = require('stripe');
const { StripeSync } = require('stripe-replit-sync');

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) throw new Error('X-Replit-Token not found');

  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  const targetEnvironment = isProduction ? 'production' : 'development';

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', 'stripe');
  url.searchParams.set('environment', targetEnvironment);

  const data = await fetch(url.toString(), {
    headers: { Accept: 'application/json', 'X-Replit-Token': xReplitToken },
  }).then((r) => r.json());

  const item = data.items?.[0];
  if (!item || !item.settings?.secret || !item.settings?.publishable) {
    throw new Error(`Stripe ${targetEnvironment} connection not found`);
  }

  return {
    secretKey: item.settings.secret,
    publishableKey: item.settings.publishable,
  };
}

async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, { apiVersion: '2025-08-27.basil' });
}

async function getPublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

let stripeSyncInstance = null;
async function getStripeSync() {
  if (!stripeSyncInstance) {
    const { secretKey } = await getCredentials();
    stripeSyncInstance = new StripeSync({
      poolConfig: {
        connectionString: process.env.DATABASE_URL,
        max: 2,
      },
      stripeSecretKey: secretKey,
    });
  }
  return stripeSyncInstance;
}

module.exports = { getUncachableStripeClient, getStripeSync, getPublishableKey };
