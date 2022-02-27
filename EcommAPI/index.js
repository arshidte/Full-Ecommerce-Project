const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const stripeRouter = require('./routes/stripe');


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected");
}).catch((error)=>{
    console.log(error);
})

app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
app.use('/checkout',stripeRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running");
})