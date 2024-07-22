const transporter = require('../config/mailer');
const env = require('../config/env')

const sendWelcomeEmail = async (email, username) => {
    const mailOptions = {
        from: env.EMAIL_USER,
        to: email,
        subject: 'Welcome Done',
        text: `Hello ${username},\n\nWelcome to Gotham`,

    };

    await transporter.sendMail(mailOptions);
};

// const sendResetEmail = async (email, token) => {


//     const mailOptions = {
//         from: env.EMAIL_USER,
//         to: email,
//         subject: 'Password Reset Request',
//         text: `You are receiving this email because you (or someone else) have requested a password reset. Your OTP for reset password is ${otp}`,
//     };

//     try {
//         await transporter.sendResetEmail(mailOptions);
//         console.log('Password reset email sent successfully');
//     } catch (error) {
//         console.error('Error sending password reset email:', error);
//     }
// };

module.exports = { sendWelcomeEmail };





