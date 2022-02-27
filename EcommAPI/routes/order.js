const router = require('express').Router();
const order = require('../Models/Order')

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//CREATE ORDER
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has deleted.")
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET USER ORDERS
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const Orders = await order.find({ userId: req.params.id });
        res.status(200).json(Orders);
    } catch (error) {
        res.status(500).json(error);
    }
})

// //GET ALL ORDERS FOR ADMIN
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
            { $group: { _id: "$month", total: { $sum: "$sales" } } }
        ])
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;