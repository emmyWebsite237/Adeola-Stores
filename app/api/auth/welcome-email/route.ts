import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, fullName, username } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = fullName || username || 'Shopper';
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey || brevoApiKey.includes('placeholder')) {
      console.warn('[Welcome Email]: Brevo API key not available or placeholder.');
      return NextResponse.json({ success: true, message: 'Simulated email sent' });
    }

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Ladydee Minimart</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf7; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2ebd8; overflow: hidden; box-shadow: 0 8px 24px rgba(22, 101, 52, 0.08); }
    .header { background: linear-gradient(135deg, #14532d 0%, #166534 100%); padding: 36px 32px; text-align: center; color: #ffffff; }
    .header-badge { display: inline-block; background-color: #fef08a; color: #713f12; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; }
    .header h1 { font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
    .header p { font-size: 13px; color: #bbf7d0; margin: 8px 0 0 0; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
    p { font-size: 14px; line-height: 1.65; color: #475569; margin: 12px 0; }
    .perks-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 20px; margin: 24px 0; }
    .perk-item { display: flex; align-items: flex-start; margin-bottom: 14px; }
    .perk-item:last-child { margin-bottom: 0; }
    .perk-icon { font-size: 20px; margin-right: 12px; line-height: 1.2; }
    .perk-text strong { display: block; font-size: 13px; color: #166534; font-weight: 800; }
    .perk-text span { font-size: 12px; color: #4b5563; }
    .cta-btn { display: block; text-align: center; background-color: #16a34a; color: #ffffff !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 15px 32px; border-radius: 14px; margin: 28px 0 16px 0; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3); }
    .whatsapp-btn { display: block; text-align: center; background-color: #f0fdf4; color: #166534 !important; font-weight: 700; font-size: 12px; text-decoration: none; padding: 10px 24px; border-radius: 12px; border: 1px solid #86efac; }
    .footer { background-color: #0f172a; padding: 24px 32px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6; }
    .footer strong { color: #f8fafc; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="header-badge">🥘 Official Lagos Food Store</span>
      <h1>Ladydee Minimart Stores</h1>
      <p>Rice &bull; Noodles &bull; Cooking Oils &bull; Household Groceries</p>
    </div>

    <div class="body">
      <div class="greeting">E kaabo, ${displayName}! 👋🍲</div>
      <p>
        Thank you for creating an account with <strong>Ladydee Minimart Stores</strong>! Your account is now ready for fast market runs and doorstep dispatch anywhere in Lagos.
      </p>

      <div class="perks-box">
        <div class="perk-item">
          <div class="perk-icon">🍚</div>
          <div class="perk-text">
            <strong>Pantry Staples at Wholesale Rates</strong>
            <span>Big bags of Royal Stallion &amp; Mama Gold Rice, Golden Penny Semo, and Indomie cartons.</span>
          </div>
        </div>
        <div class="perk-item">
          <div class="perk-icon">🍗</div>
          <div class="perk-text">
            <strong>100% Original Sealed Seasonings</strong>
            <span>Knorr Chicken Cubes, Gino Party Jollof Paste, and pure Kings vegetable oil.</span>
          </div>
        </div>
        <div class="perk-item">
          <div class="perk-icon">🛵</div>
          <div class="perk-text">
            <strong>Same-Day Lagos Rider Dispatch</strong>
            <span>Freshly packed and dispatched straight to Ikeja, Lekki, VI, Surulere, and Yaba.</span>
          </div>
        </div>
        <div class="perk-item">
          <div class="perk-icon">👩‍🍳</div>
          <div class="perk-text">
            <strong>Cook Tonight 1-Click Recipe Kits</strong>
            <span>Everything needed for Party Jollof, Fried Rice, and Egusi added straight to your cart.</span>
          </div>
        </div>
      </div>

      <p style="font-size: 13px; color: #64748b;">
        Please make sure you verify your email address via the Supabase confirmation link sent to your inbox to keep your delivery address and order tracking completely secure.
      </p>

      <a href="https://ladydeeminimartstores.vercel.app/shop" class="cta-btn" target="_blank">
        Start Shopping Fresh Groceries 🛒✨
      </a>

      <a href="https://wa.me/2348000000000" class="whatsapp-btn" target="_blank">
        💬 Chat with our Lagos Market Concierge on WhatsApp
      </a>
    </div>

    <div class="footer">
      <strong>Ladydee Minimart Stores</strong><br />
      Lagos, Nigeria &bull; Fresh &bull; Authentic &bull; Delivered with Care ❤️<br />
      Need help? Reach out at support@ladydeestores.com
    </div>
  </div>
</body>
</html>
    `;

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
          email: 'support@ladydeestores.com',
        },
        to: [{ email: cleanEmail, name: displayName }],
        subject: `Welcome to the Ladydee Minimart Family! 🛒🥘 ${displayName}`,
        htmlContent: emailHtml,
      }),
    });

    if (!brevoResponse.ok) {
      const errBody = await brevoResponse.text();
      console.warn('[Brevo Welcome Email]:', brevoResponse.status, errBody);
      return NextResponse.json({ success: false, error: 'Brevo failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Welcome email sent successfully' });
  } catch (err: any) {
    console.error('[Welcome Email Exception]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
