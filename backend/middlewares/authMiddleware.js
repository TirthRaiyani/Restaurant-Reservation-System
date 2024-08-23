const env = require('../config/env')
const jwt = require('jsonwebtoken');
const User = require('../models/user.Model')

const verifyJWT = (async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[ 1 ];
            const decoded = jwt.verify(token, env.SECRET_KEY);
            // console.log(decoded, "decodededededed")
            const user = await User.findById(decoded?._id).select('-password -refreshToken')
            if (!user) {
                return res.json({ statuscode: 404, message: "invalid access token" })
            }
            req.user = user
            // console.log(req.user)
            next()
        }
        catch (error) {
            console.log(error)
             return res.json ({statuscode:401,message: 'Invalid access token!'})
        }
    }
})

const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers[ 'authorization' ];
        if (!authHeader) {
            return res.status(403).json({
                statuscode: 403,
                success: false,
                error: true,
                message: "No Token Provided"
            });
        }

        const token = authHeader.split(" ")[ 1 ];
        if (!token) {
            return res.status(403).json({
                statuscode: 403,
                success: false,
                error: true,
                message: "Invalid Token Format"
            });
        }

        jwt.verify(token, env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    statuscode: 403,
                    success: false,
                    error: true,
                    message: "Unauthorized"
                });
            }

            if (decoded.role === 'admin') {
                req.user = await User.findOne({
                    role: 'admin'
                });
            }

            if (!req.user) {
                return res.status(403).json({
                    statuscode: 403,
                    success: false,
                    error: true,
                    message: "Forbidden: You don't have permission to perform this action."
                });
            }

            next();
        });
    } catch (error) {
        return res.status(500).json({
            statuscode: 500,
            success: false,
            error: true,
            message: "Internal Server Error",
            details: error.message
        });
    }
};
const authenticateSuperAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers[ 'authorization' ];
        if (!authHeader) {
            return res.status(403).json({
                statuscode: 403,
                success: false,
                error: true,
                message: "No Token Provided"
            });
        }

        const token = authHeader.split(" ")[ 1 ];
        if (!token) {
            return res.status(403).json({
                statuscode: 403,
                success: false,
                error: true,
                message: "Invalid Token Format"
            });
        }

        jwt.verify(token, env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    statuscode: 403,
                    success: false,
                    error: true,
                    message: "Unauthorized"
                });
            }

            if (decoded.role === 'superadmin') {
                req.user = await User.findOne({
                    role: 'superadmin'
                });
            }

            if (!req.user) {
                return res.status(403).json({
                    statuscode: 403,
                    success: false,
                    error: true,
                    message: "Forbidden: You don't have permission to perform this action."
                });
            }

            next();
        });
    } catch (error) {
        return res.status(500).json({
            statuscode: 500,
            success: false,
            error: true,
            message: "Internal Server Error",
            details: error.message
        });
    }
};


module.exports = {
    verifyJWT,
    authenticateAdmin,
    authenticateSuperAdmin
}