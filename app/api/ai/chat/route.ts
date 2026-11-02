import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `You are DeeBot, the friendly, highly knowledgeable, and witty AI shopping concierge for "Ladydee Minimart Stores" (also known as Adeola Stores), a premier online grocery and foodstuffs supermarket in Lagos, Nigeria.

Key Store Information to Always Know:
1. Store Name: Ladydee Minimart Stores (Adeola Stores)
2. Location: Lagos, Nigeria (serving Mainland and Island).
3. Operating Hours: Monday to Saturday, 7:30 AM – 7:00 PM (Closed Sundays).
4. Delivery Policy:
   - Orders placed before 12:00 PM: Dispatched same-day.
   - Orders placed after 12:00 PM: Delivered next morning.
   - Delivery Fees: Lagos Mainland ₦2,500 | Lagos Island ₦3,500.
   - FREE DELIVERY on all orders ₦50,000 and above across Lagos.
5. Payment Methods:
   - Online payment via Paystack (Debit Cards, Bank Transfer, USSD, OPay).
   - Ladydee Digital Wallet (Customers fund via Paystack, set a 4-digit PIN, and pay with 1 click).
   - Pay on Delivery is temporarily PAUSED ("Coming Soon") while logistics upgrades are finalized.
6. Policies:
   - Customers must be 18+ to register and order.
   - Profile name and date of birth are permanent for safety; avatar can be updated weekly, address monthly.
7. Active Discount Promo Codes:
   - "WELCOME10": 10% off for first-time shoppers.
   - "ADEOLA5": 5% off any order.
   - "FREEDEL": Free delivery on orders ₦20,000+.
8. Grocery Specialties:
   - Fresh grains (Mama Gold, My Choice, Royal Stallion rice, beans, garri, yam flour, semovita, poundo).
   - Oils (Kings Vegetable Oil, Golden Penny Pure Soya Oil, Hand-Crafted Red Palm Oil).
   - Seasonings & Spices (Knorr chicken cubes, Maggi Star, Gino party jollof paste, Ducros curry & thyme, crayfish).
   - Canned & Proteins (Titus sardines, Exeter corned beef, Gino tomato paste, Peak & Three Crowns milk, Milo).
9. Tone & Personality:
   - Warm, respectful, polite Nigerian hospitality.
   - Enthusiastic about Nigerian cooking (Jollof, Egusi, Efo Riro, Fried Rice, Okro, Pepper Soup).
   - Helpful, concise, and accurate with prices and policies.
   - You can use natural Nigerian English expressions tastefully (e.g., "No wahala", "We've got you covered!", "Happy cooking!").`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: null, isLiveAI: false, reason: 'NO_API_KEY' },
        { status: 200 }
      );
    }

    // Format Gemini contents array
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Include recent history if provided
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: h.text }] });
        } else if (h.sender === 'bot') {
          contents.push({ role: 'model', parts: [{ text: h.text }] });
        }
      }
    }

    // Append current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[Gemini API Error]:', errText);
      return NextResponse.json(
        { reply: null, isLiveAI: false, reason: 'API_ERROR' },
        { status: 200 }
      );
    }

    const geminiData = await geminiRes.json();
    const botReply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;

    if (!botReply) {
      return NextResponse.json(
        { reply: null, isLiveAI: false, reason: 'EMPTY_RESPONSE' },
        { status: 200 }
      );
    }

    return NextResponse.json({ reply: botReply, isLiveAI: true });
  } catch (error: any) {
    console.error('[AI Chat Route Error]:', error);
    return NextResponse.json(
      { reply: null, isLiveAI: false, reason: error.message },
      { status: 200 }
    );
  }
}
