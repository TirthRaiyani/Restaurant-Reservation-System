const env = require('../config/env')
const jwt = require('jsonwebtoken');
const User = require('../models/user.Model')

const verifyJWT = (async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[ 1 ];
            const decoded = jwt.verify(token, env.SECRET_KEY);
            const user = await User.findById(decoded?._id).select('-password -refreshToken')
            if (!user) {
                return res.json({ statuscode: 404, message: "invalid access token" })
            }
            req.user = user
            next()
        }
        catch (error) {
            console.log(error)
            throw new (401, 'Invalid access token!')
        }
    }
})

module.exports = {
    verifyJWT,
}