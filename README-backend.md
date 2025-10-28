# Nerozy - Backend

This backend provides a simple Express + Mongoose API for authentication (OTP/email), products and orders.

Setup

1. Copy `.env.example` to `.env` and fill values (MONGODB_URI, SMTP_EMAIL, SMTP_PASS, JWT_SECRET).
2. Install dependencies:

   npm install

3. Start server:

   npm run server

Auth

- POST /api/auth/signup { name, email, password? } -> sends OTP to email
- POST /api/auth/verify-otp { email, code } -> verifies and returns JWT
- POST /api/auth/login { email, password? } -> password login or sends OTP

Products and Orders

- Public product list: GET /api/products
- Admin protected product create/update/delete
- Create order: POST /api/orders (authenticated)

Notes

- Do not commit real secrets. Use environment variables and a secure secret for JWT.
