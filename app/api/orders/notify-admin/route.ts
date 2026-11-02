import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'emmysammy237@gmail.com';
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey || brevoApiKey.includes('placeholder')) {
      console.warn('[Notify Admin]: Brevo API key not available or placeholder.');
      return NextResponse.json({ success: true, message: 'Simulated email sent' });
    }

    const {
      reference,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_zone,
      items,
      subtotal,
      delivery_fee,
      total,
      payment_method,
    } = order;

    const itemsRows = Array.isArray(items)
      ? items
          .map(
            (i: any) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2ebd8;">${i.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2ebd8; text-align: center;">${i.qty}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2ebd8; text-align: right;">₦${Number(i.price).toLocaleString()}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2ebd8; text-align: right; font-weight: bold;">₦${(Number(i.price) * Number(i.qty)).toLocaleString()}</td>
          </tr>`
          )
          .join('')
      : '';

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>New Order Alert - Ladydee Minimart</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7faf7; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 18px; border: 1px solid #e2ebd8; overflow: hidden; }
    .header { background: #166534; padding: 24px; color: #ffffff; text-align: center; }
    .badge { background: #fef08a; color: #713f12; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: bold; }
    .content { padding: 24px; }
    .info-table td { padding: 6px 0; font-size: 13px; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    .items-table th { background: #f0fdf4; padding: 10px; text-align: left; font-size: 11px; color: #166534; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">🛒 NEW CUSTOMER ORDER</span>
      <h2 style="margin: 8px 0 0 0; font-size: 22px;">₦${Number(total || 0).toLocaleString()}</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #bbf7d0;">Ref: <strong>${reference || 'N/A'}</strong></p>
    </div>

    <div class="content">
      <h3 style="font-size: 14px; color: #166534; margin-top: 0;">Customer &amp; Delivery Details:</h3>
      <table class="info-table" style="width: 100%;">
        <tr><td><strong>Customer Name:</strong></td><td>${customer_name || 'N/A'}</td></tr>
        <tr><td><strong>Phone Number:</strong></td><td><a href="tel:${customer_phone}">${customer_phone || 'N/A'}</a></td></tr>
        <tr><td><strong>Email:</strong></td><td>${customer_email || 'N/A'}</td></tr>
        <tr><td><strong>Delivery Zone:</strong></td><td>${delivery_zone || 'Lagos'}</td></tr>
        <tr><td><strong>Full Address:</strong></td><td>${delivery_address || 'N/A'}</td></tr>
        <tr><td><strong>Payment Method:</strong></td><td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">${payment_method || 'Paid Online'}</span></td></tr>
      </table>

      <h3 style="font-size: 14px; color: #166534; margin-top: 24px; margin-bottom: 8px;">Order Items:</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 12px; text-align: right; font-size: 13px;">
        <div>Subtotal: <strong>₦${Number(subtotal || 0).toLocaleString()}</strong></div>
        <div style="margin-top: 4px;">Delivery Fee: <strong>₦${Number(delivery_fee || 0).toLocaleString()}</strong></div>
        <div style="margin-top: 8px; font-size: 16px; color: #166534; font-weight: bold;">Grand Total: ₦${Number(total || 0).toLocaleString()}</div>
      </div>
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
          name: 'Ladydee Minimart Alert',
          email: 'emmysammy237@gmail.com',
        },
        to: [{ email: adminEmail, name: 'Store Admin' }],
        subject: `🛒 New Order: ${reference || 'Grocery Order'} - ₦${Number(total || 0).toLocaleString()} (${customer_name || 'Customer'})`,
        htmlContent: emailHtml,
      }),
    });

    if (!brevoResponse.ok) {
      const err = await brevoResponse.text();
      console.warn('[Notify Admin Brevo Error]:', err);
      return NextResponse.json({ success: false, error: err }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Admin order notification sent' });
  } catch (error: any) {
    console.error('[Notify Admin Exception]:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}