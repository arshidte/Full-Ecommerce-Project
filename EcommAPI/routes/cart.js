const router = require('express').Router();
const Cart = require('../Models/Cart')

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//CREATE PRODUCT

router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has deleted.")
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET USER CART

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.id});
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL CARTS TO ADMIN
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;