const User = require('../models/user.Model')
// const env = require('../config/env')

exports.editProfile = async (req, res) => {
    const { username, email, Gender, DOB, City } = req.body;

    try {
        const userId = req.user._id; 

        const updateFields = {
            username,
            email,
            Gender,
            City,
        };

        if (DOB) {
            updateFields.DOB = new Date(DOB).toISOString().split('T')[ 0 ]; 
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password -role -timestamp');

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

exports.getAllUser = async(req,res) =>{
try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
    
            const searchQuery = req.query.search || '';
    
            const sortField = req.query.sortBy || '_id';
            const sortOrder = req.query.order || 'asc';
    
            const sortOptions = {};
            sortOptions[ sortField ] = sortOrder === 'desc' ? -1 : 1;
    
            const query = {
                $or: [
                    { username: { $regex: searchQuery, $options: 'i' } }
                ]
            };
    
            const users = await User.find(query)
                .select('-password -refreshToken')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
    
            if (!users.length) {
                throw new ApiError(404, 'No users found');
            }
    
    res.status(200).json({ statusCode: 200, data: users, Message: 'Total user retrieved' });;
        }
        catch (error) {
    console.log(error.message);
    return res.status(500).json({ statusCode: 500, error: true, message: "Failed to retrive User" })
}}

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
