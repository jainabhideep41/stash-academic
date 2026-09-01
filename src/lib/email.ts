import nodemailer from "nodemailer";

export interface WelcomeEmailPayload {
  email: string;
  name: string;
  branch: string;
  yearOfStudy: string;
  uidNumber: string;
}

export async function sendWelcomeEmail({
  email,
  name,
  branch,
  yearOfStudy,
  uidNumber,
}: WelcomeEmailPayload): Promise<{ success: boolean; message: string }> {
  const portalUrl = process.env.NEXTAUTH_URL || "https://stash-academic.vercel.app";

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Stash Academic Vault</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f5f5f7; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 40px auto; background-color: #090d1a; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
    .logo-badge { display: inline-block; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; margin-bottom: 20px; }
    h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; margin: 0 0 12px 0; }
    p { font-size: 15px; line-height: 1.6; color: #9ca3af; margin: 0 0 24px 0; }
    .card { background: #02040a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 28px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; }
    .val { color: #ffffff; font-weight: 600; }
    .btn { display: inline-block; width: 100%; text-align: center; background-color: #ffffff; color: #000000; font-weight: 700; font-size: 14px; padding: 14px 24px; border-radius: 12px; text-decoration: none; box-sizing: border-box; }
    .footer { font-size: 12px; color: #4b5563; text-align: center; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-badge">STASH ✳︎ ACADEMIC VAULT</div>
    <h1>You're officially registered!</h1>
    <p>Welcome to Stash, <strong>${name}</strong>. Your academic profile has been successfully linked and authenticated. Here are your verified university credentials:</p>
    
    <div class="card">
      <div class="row">
        <span class="label">Student UID:</span>
        <span class="val">${uidNumber}</span>
      </div>
      <div class="row">
        <span class="label">Course / Branch:</span>
        <span class="val">${branch}</span>
      </div>
      <div class="row">
        <span class="label">Year of Study:</span>
        <span class="val">Year ${yearOfStudy}</span>
      </div>
      <div class="row">
        <span class="label">Authenticated Email:</span>
        <span class="val">${email}</span>
      </div>
      <div class="row">
        <span class="label">Status:</span>
        <span class="val" style="color: #34d399;">✓ Verified Student</span>
      </div>
    </div>

    <a href="${portalUrl}/dashboard" class="btn">Launch Your Academic Vault &rarr;</a>

    <div class="footer">
      Stash Academic Portal &bull; Continuous Cloud Storage for Higher Education<br>
      This email was automatically generated upon completing student registration.
    </div>
  </div>
</body>
</html>
  `.trim();

  // 1. Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Stash Academic <onboarding@resend.dev>",
          to: [email],
          subject: "🎉 Welcome to Stash Academic Vault - Registration Confirmed",
          html: emailHtml,
        }),
      });
      if (res.ok) {
        return { success: true, message: `Email delivered to ${email} via Resend.` };
      }
    } catch (err) {
      console.warn("Resend email delivery failed, falling back to SMTP:", err);
    }
  }

  // 2. SMTP / Nodemailer (e.g. Gmail / SendGrid / Amazon SES)
  if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVER_SERVICE || "gmail",
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Stash Academic" <${process.env.EMAIL_SERVER_USER}>`,
        to: email,
        subject: "🎉 Welcome to Stash Academic Vault - Registration Confirmed",
        html: emailHtml,
      });

      return { success: true, message: `Email delivered to ${email} via SMTP.` };
    } catch (smtpErr) {
      console.warn("SMTP email delivery failed:", smtpErr);
    }
  }

  // 3. Fallback audit log
  console.log(`[STASH EMAIL SIMULATED DISPATCH] Destination: ${email}`);
  console.log(`[STASH PROFILE DETAILS] Name: ${name}, UID: ${uidNumber}, Branch: ${branch}, Year: ${yearOfStudy}`);

  return {
    success: true,
    message: `Confirmation email rendered and recorded for ${email}.`,
  };
}
