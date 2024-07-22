const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: [ 'admin', 'user' ],
        default: 'user',
    },
    otp: {
        type: Number,
    },
    otpExpire: {
        type: Date
    },
    Gender:{
        type:String,
        enum:["Male","Female","Other"],
        default:null
    },
    DOB:{
        type:String,
        default:null
    },
    City:{
        type:String,
        default:null
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
