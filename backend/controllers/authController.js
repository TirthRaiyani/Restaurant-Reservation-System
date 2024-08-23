const User = require('../models/user.Model')
const jwt = require('jsonwebtoken')
const env = require('../config/env')
const transporter = require('../config/mailer')
const { sendWelcomeEmail } = require('../utils/nodemailer')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const path = require('path');


cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_API_KEY,
    api_secret: "4trNW94BLv-YoOeD2adAYd1Y9bc"
});

exports.registerUser = async (req, res) => {
    try {
        
        const { username, email, password, role, image } = req.body;
        // console.log(req.body)

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ statusCode: 409, message: "User Already Exists", data: existingUser });
        }
        if (!image) {
            return res.status(400).json({ statusCode: 400, message: "Please provide an image for the user." });
        }

        const imageBuffer = Buffer.from(image, 'base64');
        const tempFilePath = path.join(__dirname, './../uploads/', `temp_image_${Date.now()}.jpg`);
        console.log(tempFilePath, "sdfghgfg")

        fs.writeFileSync(tempFilePath, imageBuffer);

        const upload = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'uploads'
        });

        fs.unlinkSync(tempFilePath);

        const user = new User({
            username,
            email,
            password,
            role,
            image: upload.secure_url,
            status: true
        });

        const savedUser = await user.save();
        console.log(savedUser)
        await sendWelcomeEmail(user.email);

        return res.status(200).json({ statusCode: 200, Error: false,  message: "Registered Successfully", data: user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ statusCode: 500, Error: true, success: false, data: null, Message: "Error while creating user" });
    }
};

exports.loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ statusCode: 404, Error: true, success: false, data: null, Message: "user not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ statusCode: 401, Error: true, success: false, data: null, Message: "Invalid credentials" });
        }

        const payload = {
            _id: user._id,
            role:user.role
        };

        const accessToken = jwt.sign(payload, env.SECRET_KEY, {
            expiresIn: '1d'
        });

        const loggedInUser = await User.findById(user._id).select('-password -otp -otpExpire');

        return res.status(200).json({
            error: false,
            statusCode: 200,
            message: "Logged In Successfully",
            data: loggedInUser,
            accessToken
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ statusCode: 500, Error: true, success: false, data: null, Message: "Error while login User" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ statusCode: 404, Error: true, success: false, data: null, Message: "User not found" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        console.log(`Generated OTP: ${otp}`);

        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        console.log(`OTP Expire Time: ${otpExpire}`);

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        const savedUser = await User.findOne({ email }); 
        console.log(`Saved OTP in DB: ${savedUser.otp}`); 

        const mailOptions = {
            from: env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) have requested a password reset. Your OTP for reset password is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');

        res.status(200).send({
            success: true,
            message: "We just sent you a reset password mail!",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ statusCode: 500, Error: true, success: false, data: null, Message: "Server Error" });
    }
};

exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ otp, otpExpire: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ statusCode: 400, error: true, success: false, data: null, message: "Invalid or expired OTP" });
        }

        return res.status(200).json({ statusCode: 200, error: false, success: true, message: "OTP verified successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ statusCode: 500, error: true, message: "OTP verification failed" });
    }
};


exports.resetPassword = async (req, res) => {
    const { password, otp } = req.body;
    console.log(req.body)
   
    try {
        const user = await User.findOne({ otp, otpExpire: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ statusCode: 400, error: true, success: false, data: null, message: "Invalid or expired OTP" });
        }

        user.password = password;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        return res.status(200).json({ error: false, statusCode: 200, message: "Password reset successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ statusCode: 500, error: true, message: "Reset password failed" });
    }
};