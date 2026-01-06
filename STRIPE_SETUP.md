# 💳 Stripe Payment Integration Setup

Complete guide to setting up Stripe payments for the Spanish Business Registration platform.

---

## 📋 Quick Start

### Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Sign in or create a free account
3. Make sure **Test Mode** is enabled (toggle in the top right)
4. Copy your keys:
   - 🔑 **Publishable key** (starts with `pk_test_`)
   - 🔐 **Secret key** (starts with `sk_test_`)

---

## 🖥️ Frontend Setup

### Create `.env.local` file

Create a file named `.env.local` in the `spanish-business-registration-frontend` folder:

```env
# ===========================================
# FRONTEND ENVIRONMENT VARIABLES
# ===========================================

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:2000

# Stripe Configuration (Test Mode)
# Get this from: https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...your_key_here

# Example (replace with your actual key):
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51NxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxW
```

---

## ⚙️ Backend Setup

### Create `.env` file

Create a file named `.env` in the `spanish-business-registratios-backend` folder:

```env
# ===========================================
# BACKEND ENVIRONMENT VARIABLES
# ===========================================

# Stripe Configuration (Test Mode)
# Get this from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_51ABC123...your_secret_key_here

# Stripe Webhook Secret (for production)
# Get this when you set up webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL (for Stripe redirects)
FRONTEND_URL=http://localhost:3000

# MongoDB (already configured in db.py)
# MONGODB_URI=mongodb+srv://...

# JWT Secret (already configured in server.py)
# JWT_SECRET_KEY=your_secret_key
```

### Update `server.py` to load environment variables

Add this at the top of `server.py`:

```python
from dotenv import load_dotenv
load_dotenv()
```

Then install python-dotenv:
```bash
pip install python-dotenv
```

---

## 🧪 Test Card Numbers

Use these test cards to simulate different payment scenarios:

### ✅ Successful Payments

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Visa - Always succeeds |
| `5555 5555 5555 4444` | Mastercard - Always succeeds |
| `3782 822463 10005` | American Express - Always succeeds |

### ❌ Declined Payments

| Card Number | Description |
|------------|-------------|
| `4000 0000 0000 0002` | Generic decline |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 9987` | Lost card |
| `4000 0000 0000 9979` | Stolen card |

### 🔐 3D Secure Authentication

| Card Number | Description |
|------------|-------------|
| `4000 0025 0000 3155` | Requires authentication |
| `4000 0027 6000 3184` | Always fails authentication |

### 📝 For ALL Test Cards

- **Expiry Date**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP Code**: Any 5 digits (e.g., `12345`)
- **Name**: Any name

---

## 🔄 Webhook Setup (Production)

For production, webhooks ensure payment status is securely updated:

### 1. Create Webhook Endpoint

Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)

### 2. Add Your Endpoint

- **Endpoint URL**: `https://your-domain.com/api/payments/webhook`
- **Events to listen for**:
  - `checkout.session.completed`
  - `checkout.session.expired`
  - `payment_intent.payment_failed`
  - `payment_intent.succeeded`

### 3. Copy Webhook Secret

After creating the endpoint, copy the signing secret (`whsec_...`) and add it to your backend `.env` file.

### 4. Test Locally with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:2000/api/payments/webhook

# The CLI will show you a webhook signing secret to use
```

---

## 🚀 Testing the Complete Flow

### 1. Start the Backend

```bash
cd spanish-business-registratios-backend
./venv/bin/python server.py
```

### 2. Start the Frontend

```bash
cd spanish-business-registration-frontend
npm run dev
```

### 3. Test Payment Flow

1. Go to `http://localhost:3000`
2. Login or create an account
3. Start a registration (DIY or Assisted)
4. Fill in all the required information
5. On the review page, check both checkboxes
6. Click "Continue to Payment"
7. On the payment page, click "Pay $XXX"
8. In Stripe Checkout, enter test card: `4242 4242 4242 4242`
9. Complete the payment
10. You should be redirected to the success page with confetti! 🎉

### 4. Check Stripe Dashboard

Go to [Stripe Payments](https://dashboard.stripe.com/test/payments) to see your test payment.

---

## 🔧 Troubleshooting

### Payment not working?

1. **Check API Keys**: Make sure you're using test keys (start with `pk_test_` and `sk_test_`)
2. **Check CORS**: Ensure `http://localhost:3000` is in the backend CORS config
3. **Check Console**: Look for errors in browser console and backend terminal
4. **Check Stripe Dashboard**: Look for failed payments or errors

### Webhook not receiving events?

1. Make sure the endpoint URL is correct
2. For local testing, use Stripe CLI to forward webhooks
3. Check the webhook signing secret is correct

### Getting "Invalid API Key"?

1. Make sure you copied the complete key
2. Check there are no extra spaces
3. Verify you're using the correct environment (test vs live)

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

