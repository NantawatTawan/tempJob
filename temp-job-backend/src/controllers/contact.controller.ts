import { RequestHandler } from "express";
import { handleSendEmail } from "../services/contact.service";

export const sendContactEmail: RequestHandler = async (req, res, next) => {
  try {
    const { from, subject, text } = req.body as {
      from?: string;
      subject?: string;
      text?: string;
    };

    if (!from || !subject || !text) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    await handleSendEmail({ from, subject, text });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in controller sending email:", error);
    // ถ้าอยากให้ middleware จัดการ error ต่อ ให้ใช้ next(error)
    // next(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
