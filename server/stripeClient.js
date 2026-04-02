const Stripe = require('stripe');
const { StripeSync } = require('stripe-replit-sync');

async function getStripeCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) throw new Error('X-Replit-Token not found');

  const data = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: {
        Accept: 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    }
  ).then((r) => r.json());

  const item = data.items?.[0];
  if (!item) throw new Error('Stripe not connected');

  const secretKey = item.settings?.secret_key || item.settings?.STRIPE_SECRET_KEY;
  const publishableKey = item.settings?.publishable_key || item.settings?.STRIPE_PUBLISHABLE_KEY;

  if (!secretKey) throw new Error('Stripe secret key not found in connection');

  return { secretKey, publishableKey };
}

async function getUncachableStripeClient() {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey, { apiVersion: '2023-10-16' });
}

async function getPublishableKey() {
  const { publishableKey } = await getStripeCredentials();
  return publishableKey;
}

let stripeSyncInstance = null;
async function getStripeSync() {
  if (!stripeSyncInstance) {
    const { secretKey } = await getStripeCredentials();
    stripeSyncInstance = new StripeSync({
      stripeSecretKey: secretKey,
      databaseUrl: process.env.DATABASE_URL,
    });
  }
  return stripeSyncInstance;
}

module.exports = { getUncachableStripeClient, getStripeSync, getPublishableKey };
