import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

import categoryRoutes from './routes/categoryRouter.js';
import itemRoutes from './routes/itemRouter.js';
import authRoutes from './routes/authRouter.js';
import cartRoutes from './routes/cartRouter.js';
import wishlistRoutes from './routes/wishlistRouter.js';
import userRoutes from './routes/userRouter.js';
import orderRoutes from './routes/orderRouter.js';
import reviewRoutes from './routes/reviewRouter.js';
import aiRoutes from './routes/aiRouter.js';
import paymentRoutes from './routes/paymentRouter.js';

import webhookRoutes from './routes/webhookRouter.js';

import adminRoutes from './routes/adminRouter.js';


import { authMiddleware } from './middlewares/authMiddleware.js';
import { roleMiddleware } from './middlewares/roleMiddleware.js';


import { connectDB } from './config/db.js';

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://luxe.waleedimran.me",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use('/api/webhook', webhookRoutes);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// UnProtected Routes: No need to Login or Special Role
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);

// Protected routes: requires login
app.use(authMiddleware);

app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payment', paymentRoutes);

// Admin-only routes: requires login + Admin Role
app.use('/api/admin', roleMiddleware(['Admin']), adminRoutes);

await connectDB();

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
})