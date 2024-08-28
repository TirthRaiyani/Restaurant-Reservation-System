exports.authenticateAdmin = async (req, res, next) => {
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
exports.authenticateSuperAdmin = async (req, res, next) => {
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
