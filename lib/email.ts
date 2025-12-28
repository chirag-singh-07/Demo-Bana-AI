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
  <div style="
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
    max-width: 560px;
    margin: 0 auto;
    padding: 48px 40px;
    background-color: #fafafa;
    border: 1px solid #e6e6e6;
    border-radius: 16px;
    color: #111827;
  ">
    <h2 style="
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    ">
      Demp Bana AI
    </h2>

    <p style="
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      text-align: center;
      margin-bottom: 36px;
    ">
      Use the verification code below to confirm your email address.
    </p>

    <div style="text-align: center; margin-bottom: 36px;">
      <span style="
        display: inline-block;
        padding: 18px 36px;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 0.3em;
        background-color: #f4f4f5;
        color: #111827;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      ">
        ${otp}
      </span>
    </div>

    <p style="
      font-size: 13px;
      text-align: center;
      color: #6b7280;
      margin-bottom: 32px;
    ">
      This code expires in <strong>10 minutes</strong>.
    </p>

    <hr style="
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 32px 0;
    " />

    <p style="
      font-size: 12px;
      line-height: 1.5;
      text-align: center;
      color: #9ca3af;
    ">
      If you didn’t request this email, you can safely ignore it.
    </p>
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
