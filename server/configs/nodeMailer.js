import nodemailer from 'nodemailer'

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Send an email using async/await
const sendEmail =  async ({to, subject, body}) => {
    const responce = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
    });

    console.log("Message sent:", responce.messageId);
};

export default sendEmail