import nodemailer from "nodemailer";

interface EmailPayload {
  from: string;
  subject: string;
  text: string;
}

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = Number(process.env.EMAIL_PORT);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const RECIPIENT_EMAIL = "tempjob.cs@gmail.com";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const handleSendEmail = async (payload: EmailPayload) => {
  const { from, subject, text } = payload;

  const mailOptions = {
    from: `"${from}" <${EMAIL_USER}>`,
    to: RECIPIENT_EMAIL,
    subject: `[TempJob Contact] - ${subject}`,
    text: `
      คุณได้รับข้อความใหม่จาก: ${from}
      ------------------------------------------
      ${text}
      ------------------------------------------
    `,
    replyTo: from,
  };

  try {
    console.log("Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email.");
  }
};
