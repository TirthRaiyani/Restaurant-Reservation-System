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
    console.log('Email sent successfully');
};

module.exports = { sendWelcomeEmail };





