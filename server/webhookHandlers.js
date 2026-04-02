const { getStripeSync } = require('./stripeClient');

class WebhookHandlers {
  static async processWebhook(payload, signature) {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'Webhook payload must be a Buffer. Ensure webhook route is before express.json().'
      );
    }
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);
  }
}

module.exports = { WebhookHandlers };
