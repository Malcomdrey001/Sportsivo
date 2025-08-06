const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { product, currency, success_url, cancel_url } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100, // Stripe uses cents
        },
        quantity: 1,
      }],
      success_url,
      cancel_url,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log('Server running on http://localhost:4242'));