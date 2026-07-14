import express from 'express';
import { upload } from '../middlewares/upload.js';
import { deleteUploadedFile } from '../utils/deleteUploadedFile.js';

import Category from '../models/Category.js';
import Item from '../models/Item.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// ---------- CATEGORY ROUTERS ----------

// POST: ADD CATEGORY
router.post('/add-category', upload('categories').single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = new Category({
            name,
            description,
            image: req.file ? req.file.filename : ''
        })

        await category.save();

        res.status(201).json({
            message: "Successfully Added Category!",
            category,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: `This Category Name is already registered.`,
            });
        }

        res.status(400).json({ message: err.message });
    }
});


// DELETE: DELETE CATEGORY BY NAME
router.delete('/delete-category/:id', async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });

        if (!category) return res.status(404).json({ message: 'Category Not Found' });

        await Category.deleteOne({ _id: req.params.id });

        // Clean up the category's image from disk
        deleteUploadedFile('categories', category.image);

        res.status(200).json({ message: 'Category deleted Successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: UPDATE CATEGORY BY NAME
router.put('/update-category/:id', upload('categories').single('image'), async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ _id: req.params.id });

        if (!existingCategory) return res.status(404).json({ message: 'Category Not Found' });

        const updateData = {
            name: req.body.name,
            description: req.body.description,
        }

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updated = await Category.findOneAndUpdate(
            { _id: req.params.id },
            updateData,
            { new: true }
        );

        // A new image was uploaded and replaced the old one - remove the old file
        if (req.file && existingCategory.image) {
            deleteUploadedFile('categories', existingCategory.image);
        }

        res.status(200).json({ message: 'Category Updated Successfully' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: `This Category Name is already registered.`,
            });
        }

        res.status(400).json({ message: err.message });
    }
});



// ---------- ITEM ROUTERS ----------

// ADD NEW ITEM
router.post('/add-item', upload('items').single('image'), async (req, res) => {
    try {
        const { name, description, originalPrice, discountedPrice, stock, category } = req.body;

        const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

        const item = new Item({
            name,
            description,
            originalPrice,
            discountedPrice,
            discountPercentage,
            stock,
            category,
            image: req.file ? req.file.filename : ''
        });

        await item.save();

        res.status(201).json({
            message: "Successfully Added Category!",
            item,
        });
    }

    catch (err) {
        res.status(400).json({ message: err.message });
    }

});

// UPDATE ITEM
router.put('/update-item/:id', upload('items').single('image'), async (req, res) => {
    try {
        const existingItem = await Item.findOne({ _id: req.params.id });

        if (!existingItem) return res.status(404).json({ message: 'Item Not Found' });

        const { name, description, originalPrice, discountedPrice, stock, category } = req.body;

        const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

        const updatedItem = ({
            name,
            description,
            originalPrice,
            discountedPrice,
            discountPercentage,
            stock,
            category,
        });

        if(req.file) {
            updatedItem.image = req.file.filename;
        }

        const updated = await Item.findOneAndUpdate(
            { _id: req.params.id },
            updatedItem,
            { new: true }
        );

        // A new image was uploaded and replaced the old one - remove the old file
        if (req.file && existingItem.image) {
            deleteUploadedFile('items', existingItem.image);
        }

        res.status(200).json({ message: 'Item Updated Successfully' });
    }

    catch (err) {
        res.status(400).json({ message: err.message });
    }

});

// DELETE ITEM
router.delete('/delete-item/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        // Clean up the item's image from disk
        deleteUploadedFile('items', item.image);

        res.json({
            message: "Item deleted successfully",
        });
    }

    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});


// ---------- ORDER ROUTERS ----------

// GET: ALL USERS
router.get('/all-orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.product')
            .sort({ createdAt: 1 });

        res.json(orders);
    }

    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

// PUT: UPDATE STATUS
router.put('/update-order/:orderId', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while updating status" });
    }
});

// DELETE: DELETE AN ORDER
router.delete('/delete-order/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // RESTOCK ITEMS
        if(order.status !== 'Delivered') {
            for(const item of order.items) {
                const product = await Item.findOne({ _id: item.product.toString() });

                if(product) {
                    product.stock += item.quantity;
                    product.save();
                }
            }
        }

        await Order.findByIdAndDelete(req.params.orderId);

        res.status(200).json({ message: "Order deleted successfully" });
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while deleting order" });
    }
});



// ---------- USER ROUTERS ----------
router.get('/all-users', async (req, res) => {
    try {
        const user = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });;

        res.json(user);
    }

    catch (err) {
        console.log("SERVER ERROR:", err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
})


// ---------- DASHBOARD ROUTERS ----------
router.get('/dashboard', async (req, res) => {
    try {
        const totalProducts = await Item.countDocuments({});
        const totalUsers = await User.countDocuments({});
        const totalOrders = await Order.countDocuments({});

        const recentOrders = await Order
            .find()
            .populate('user', 'username')
            .select("user totalPrice status createdAt")
            .sort({ createdAt: -1 })
            .limit(4);

        const recentUsers = await User
            .find()
            .select('_id username email createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        // FOR TOTAL REVENUE

        const revenue = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered'
                }
            },

            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);

        const totalRevenue = revenue.length ? revenue[0].totalRevenue : 0;


        // FOR MONTHLY REVENUE
        const orderRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered'
                }
            },

            {
                $group: {
                    _id: { $month: '$createdAt' },
                    revenue: { $sum: '$totalPrice' }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const revenueData = months.map((month, index) => {
            const found = orderRevenue.find(
                item => item._id === index + 1
            );

            return {
                month,
                revenue: found ? found.revenue : 0
            }
        });

        const currentMonth = new Date().getMonth(); // curr July -> 6

        const lastSixMonths = [];

        for(let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            lastSixMonths.push(revenueData[monthIndex]);
        }


        // NUMBER OF ORDERS ON STATUS
        const orderStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusData = {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
        }

        orderStatus.forEach(item => {
            statusData[item._id] = item.count;
        });


        return res.json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
            recentOrders,
            recentUsers,
            revenueData: lastSixMonths,
            statusData,
        })
    }

    catch (err) {
        console.log(err);
    }
});



export default router;