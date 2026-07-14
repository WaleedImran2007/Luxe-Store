A modern full-stack e-commerce web application built using the **MERN Stack**. LUXE Store provides a seamless shopping experience with secure authentication, an admin dashboard, AI-powered assistance, Stripe payment integration, and much more.

---

## 🌐 Live Demo

> https://luxe.waleedimran.me

---

## 📸 Screenshots

### 🏠 Home Page
<p align="center">
  <img src="https://github.com/user-attachments/assets/4098f759-808f-42d7-830f-a3fcc969753c" alt="Home Page" width="90%" />
</p>

---

### 🛍️ Shop
<p align="center">
  <img src="https://github.com/user-attachments/assets/ae11fee3-39b7-426a-ad45-960f2d940703" alt="Shop Page" width="90%" />
</p>

---

### 💳 Checkout
<p align="center">
  <img src="https://github.com/user-attachments/assets/7831a2bd-dc6d-4a3c-b8d8-9afc6c0642d0" alt="Checkout Page" width="90%" />
</p>

---

### 📊 Admin Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/9985c308-9e24-4d12-9d7a-05c53e37706d" alt="Admin Dashboard" width="90%" />
</p>

---

### 🤖 AI Assistant
<p align="center">
  <img src="https://github.com/user-attachments/assets/55ede97f-7060-43da-9bc0-2ad6f21b6e4d" alt="AI Assistant" width="400" />
</p>


---

# ✨ Features

## 👤 Authentication

- JWT Authentication
- Email Verification
- Secure Login & Registration
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Access Control

---

## 🛒 Shopping

- Browse Products
- Product Categories
- Product Search
- Filters
- Sorting
- Pagination
- Product Details
- Ratings & Reviews

---

## ❤️ Wishlist

- Add to Wishlist
- Remove from Wishlist
- Persistent Wishlist

---

## 🛍 Cart

- Add Items
- Update Quantity
- Remove Items
- Live Cart Total

---

## 💳 Checkout

- Cash on Delivery
- Stripe Checkout Integration
- Stripe Webhooks
- Order Confirmation
- Order Cancellation Page

> **Note:** Stripe is implemented in **Test Mode** because live Stripe merchant accounts are not currently available in Pakistan. The implementation follows the same production architecture using Checkout Sessions and Webhooks.

---

## 📦 Orders

- Place Orders
- View Order History
- Order Status Tracking

---

## ⭐ Reviews

- Add Review
- Edit Review
- Product Rating Calculation
- Average Rating

---

## 🤖 AI Shopping Assistant

Powered using:

- Groq LLM
- Retrieval-Augmented Generation (RAG)
- HuggingFace Embeddings
- Custom Tool Calling

Capabilities:

- Product Recommendations
- Product Comparison
- Store FAQs
- Shipping Information
- Payment Information
- Return Policy
- Knowledge Base Search

---

## 🛠 Admin Dashboard

- Dashboard Analytics
- Product Management
- Category Management
- Order Management
- Revenue Statistics
- Monthly Revenue Chart
- Recent Orders
- Recent Users

---

# 🧰 Tech Stack

## Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- Context API
- Chart.js
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer

---

## AI

- Groq API
- HuggingFace Transformers
- RAG
- Tool Calling

---

## Payment

- Stripe Checkout
- Stripe Webhooks

---

## Email

- Resend API

---

# 📁 Project Structure

```text
LUXE Store
│
├── frontend
│   ├── src
│   ├── public
│   └── ...
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── models
│   ├── middleware
│   └── ...
│
└── README.md
```

---

# 🚀 Installation

## Clone the repository

```bash
git clone https://github.com/WaleedImran2007/luxe-store.git
```

---

## Backend

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=
MONGO_URI=
JWT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=

FRONTEND_URL=
```

Run backend

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=
```

Run frontend

```bash
npm run dev
```

---

# 📊 Future Improvements

- Recently Viewed Products
- Coupon System
- Inventory Alerts
- Multi-language Support
- Email Notifications
- Easypaisa Integration
- JazzCash Integration

---

# 👨‍💻 Author

**Waleed Imran**

- GitHub: https://github.com/WaleedImran2007
- LinkedIn: https://www.linkedin.com/in/waleed-imran-00ba01358/

---

# 📜 License

This project is built for learning and portfolio purposes.

---

⭐ If you found this project interesting, consider giving it a star!
