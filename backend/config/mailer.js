const nodemailer = require('nodemailer');
const env = require('./env')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user:env.EMAIL_USER,
        pass:env.EMAIL_PASSWORD
    },
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

});

transporter.verify((error) => {
    if (error) {
        console.error('Nodemailer transporter error:', error);
    } else {
        console.log('Nodemailer transporter is ready');
    }
});
module.exports = transporter;