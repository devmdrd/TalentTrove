const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const sendOTPByEmail = (email, otp) => {
  const text = `Your OTP for registration is: ${otp}`;
  return sendEmail(email, "OTP Verification", text);
};

const sendPasswordResetEmail = (email, resetLink) => {
  const html = `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;
  return sendEmail(email, "Password Reset Request", null, html);
};

const sendPasswordEmail = (email, password) => {
  const html = `
    <p>Hello,</p>
    <p>Your application has been approved. You can now log in using the credentials below:</p>
    <ul>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Password:</strong> ${password}</li>
    </ul>
    <p>Please log in and change your password immediately for security purposes.</p>
  `;
  return sendEmail(email, "Account Approved – Login Credentials", null, html);
};

module.exports = {
  sendOTPByEmail,
  sendPasswordResetEmail,
  sendPasswordEmail,
};
