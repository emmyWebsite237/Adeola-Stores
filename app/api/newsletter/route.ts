import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const brevoApiKey = process.env.BREVO_API_KEY;

    // If Brevo API key is not configured, gracefully log and respond
    if (!brevoApiKey || brevoApiKey.includes('placeholder')) {
      console.warn(
        '[Brevo Newsletter]: BREVO_API_KEY is not configured in environment variables. Email logged for collection:',
        email
      );
      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing to weekly market price drops!',
      });
    }

    // Call official Brevo Contacts v3 API
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        updateEnabled: true,
        attributes: {
          STORE: 'Ladydee Minimart Stores',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Brevo API Error]:', errorData);
      // If contact already exists Brevo returns duplicate_parameter error code
      if (errorData?.code === 'duplicate_parameter') {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to our weekly price drops!',
        });
      }
      return NextResponse.json({ error: errorData?.message || 'Could not subscribe to Brevo.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Ladydee weekly grocery updates via Brevo!',
    });
  } catch (err: any) {
    console.error('[Brevo Route Exception]:', err);
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
