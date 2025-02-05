const Joi = require('joi');
const validateRequest = (schema) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ statuscode: 400, error: true, success: "false",data:null, message: errorMessage });
        }
        next()
    };
};

const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().min(3),
    image: Joi.string().required()
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = {
    validateRequest,
    registerSchema,
    loginSchema
};

