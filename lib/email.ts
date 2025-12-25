import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"Demp Bana AI" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code - Demp Bana AI",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #000000;">
        <h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px; letter-spacing: -0.025em;">Demp Bana AI</h2>
        <p style="font-size: 16px; color: #4b5563; text-align: center; margin-bottom: 32px;">Please use the following code to verify your email address.</p>
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="display: inline-block; padding: 16px 32px; font-size: 32px; font-weight: 800; background-color: #f3f4f6; border-radius: 8px; letter-spacing: 0.25em;">${otp}</span>
        </div>
        <p style="font-size: 14px; text-align: center; color: #9ca3af; margin-bottom: 32px;">This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 32px;" />
        <p style="font-size: 12px; text-align: center; color: #9ca3af;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send verification email.");
  }
};
