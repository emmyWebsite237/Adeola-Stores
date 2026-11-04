import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const brevoApiKey = process.env.BREVO_API_KEY;
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://adeolastores.com';
    const resetUrl = `${origin}/forgot-password/reset?email=${encodeURIComponent(cleanEmail)}`;

    // 1. Trigger Supabase Password Reset if Supabase is configured
    let supabaseTriggered = false;
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: resetUrl,
        });
        if (!error) {
          supabaseTriggered = true;
        } else {
          console.warn('[Supabase Auth Reset Notice]:', error.message);
        }
      } catch (sbErr) {
        console.warn('[Supabase Auth Reset Warning]:', sbErr);
      }
    }

    // 2. Send Official Transactional Reset / Confirmation Email via Brevo v3 SMTP API
    let brevoSent = false;
    if (brevoApiKey && !brevoApiKey.includes('placeholder')) {
      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password - Ladydee Minimart</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9f6; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .logo { color: #15803d; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; display: inline-block; }
    h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 12px 0; }
    .btn { display: inline-block; background-color: #15803d; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 12px; margin: 20px 0; }
    .footer { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Ladydee Minimart</div>
    <h1>Reset Your Account Password</h1>
    <p>Hello,</p>
    <p>We received a request to reset the password for your Ladydee Minimart customer account associated with <strong>${cleanEmail}</strong>.</p>
    <p>Click the secure button below to set a new password:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn" target="_blank">Reset My Password</a>
    </div>
    <p style="font-size: 12px; color: #64748b;">If the button above does not work, copy and paste this link into your browser:<br /><a href="${resetUrl}" style="color: #15803d; word-break: break-all;">${resetUrl}</a></p>
    <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <div class="footer">
      Ladydee Minimart &bull; Lagos, Nigeria &bull; Fresh Groceries Delivered to Your Door
    </div>
  </div>
</body>
</html>
      `;

      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            sender: {
              name: 'Ladydee Minimart Stores',
              email: 'emmysammy237@gmail.com',
            },
            to: [
              {
                email: cleanEmail,
              },
            ],
            subject: 'Reset your Ladydee Minimart Password',
            htmlContent: emailHtml,
          }),
        });

        if (brevoResponse.ok) {
          brevoSent = true;
          console.log(`[Brevo]: Transactional password reset sent successfully to ${cleanEmail}`);
        } else {
          const errData = await brevoResponse.json();
          console.error('[Brevo API Error]:', errData);
        }
      } catch (brevoErr) {
        console.error('[Brevo Request Exception]:', brevoErr);
      }
    } else {
      console.warn('[Brevo]: BREVO_API_KEY is not set. Logged reset request for:', cleanEmail);
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been sent to your email address.',
      brevoSent,
      supabaseTriggered,
    });
  } catch (error: any) {
    console.error('[Forgot Password Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process password reset request.' },
      { status: 500 }
    );
  }
}
