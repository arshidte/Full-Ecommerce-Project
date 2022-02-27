const router = require('express').Router();
const user = require('../Models/User');
const CryptoJs = require('crypto-js');
const jwt = require("jsonwebtoken")

router.post('/register', async (req,res)=>{
    const newUser = new user({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password,process.env.PAS_SEC).toString(),
        isAdmin: req.body.isAdmin
    })

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Login

router.post('/login',async (req,res)=>{
    try {
        const User = await user.findOne({ username: req.body.username });
        !User && res.status(401).json("Wrong credentials");

        const hashedPassword = CryptoJs.AES.decrypt(
            User.password,
            process.env.PAS_SEC
            );
        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json("Wrong credentials")

        const accessToken = jwt.sign(
            {id:User._id,
            isAdmin:User.isAdmin},
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        )

        const { password, ...others } = User._doc;

        res.status(200).json({...others, accessToken});
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;