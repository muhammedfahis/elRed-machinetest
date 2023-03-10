var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    from: process.env.EMAIL,
    host: 'smtp.gmail.com', // hostname 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    },
   
});

module.exports = {
    transporter
};