import nodemailer from 'nodemailer';

export default function sendMail(receiverEmail, OTP) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "uffanmehmoodkhan02@gmail.com",
            pass: "ysvy ncjj oruq gpjh"
        }
    });

    let mailOptions = {
        from: "uffanmehmoodkhan02@gmail.com",
        to: receiverEmail,
        subject: "Your Dashboard - OTP Code",
        text: "Here is your OTP code for verification: " + OTP,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
}


// let transporter = nodemailer.createTransport({
//     service: 'gmail', auth: {
//         user: "uffanmehmoodkhan02@gmail.com", pass: "ysvy ncjj oruq gpjh"
//     }
// });
//
// let mailOptions = {
//     from: 'uffanmehmoodkhan02@gmail.com',
//     to: 'l227947@lhr.nu.edu.pk',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };
//
// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });