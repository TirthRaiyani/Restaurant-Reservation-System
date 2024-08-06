const User = require('../models/user.Model')
const env = require('../config/env')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const path = require('path');
// const upload = require('../utils/uploads')


cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_API_KEY,
    api_secret: "4trNW94BLv-YoOeD2adAYd1Y9bc"
});

exports.editProfile = async (req, res) => {
    const { username, email, Gender, DOB, City, Area } = req.body;

    try {
        const userId = req.user._id;

        const updateFields = {
            username,
            email,
            Gender,
            City,
            Area
        };

        if (DOB) {
            updateFields.DOB = new Date(DOB).toISOString().split('T')[ 0 ];
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password -role -timestamp');
        console.log(updateFields)

        if (!updatedUser) {
            return res.status(404).json({ statusCode: 404, error: true, message: "User not found" });
        }

        return res.status(200).json({ statusCode: 200, error: false, message: "Profile updated successfully", data: updatedUser });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ statusCode: 500, error: true, message: "Profile update failed" });
    }
};


exports.getAllUserCount = async(req,res) =>{
    try {
       
            const searchQuery = req.query.search || '';

            const query = {
                $or: [
                    { username: { $regex: searchQuery, $options: 'i' } }
                ]
            };

            const count = await User.countDocuments(query);

            res.status(200).json({statusCode: 200, count : count, Message:'Total user count retrieved'});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ statusCode: 500, error: true, message: "Failed to retrive count" })
    }
}


exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password -timestamp');

        if (!users.length) {
            return res.status(404).json({ statusCode: 404, Success: false, Error: true, Message: 'No Users found' });
        }

        res.status(200).json({ statusCode: 200, Success: true, Error: false, data: users, Message: 'Users fetched successfully' });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ statusCode: 500, Success: false, Error: true, Message: "Something went wrong while fetching Users" });
    }
};

exports.deleteUser = async (req, res) => {

    try {
        const userId = req.params.id;
        if (!userId) {
            throw new ApiError(404, 'User not found');
        }
        const user = await User.findByIdAndDelete(userId);

        res.status(200).json({ statusCode: 200, data: user, Message: 'User deleted Successfully' });
    }
    catch (error) {
        console.error("Error during delete:", error);
        return res.status(500).json({ statusCode: 500, error: true, message: "Failed to delete User" });
    }
};
exports.getUserByToken = async (req, res) => {
    try {
        const userId = req.user._id; 

        const user = await User.findById(userId).select('-password -role -timestamp');

        if (!user) {
            return res.status(404).json({ statusCode: 404, error: true, message: "User not found" });
        }

        return res.status(200).json({ statusCode: 200, error: false, message: "User retrieved successfully", data: user });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ statusCode: 500, error: true, message: "Failed to retrieve user" });
    }
};
