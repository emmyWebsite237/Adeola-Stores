/* ============================================================
   Ladydee Minimart Store — /api/checkout/ai-payout
   ------------------------------------------------------------
   POST /api/checkout/ai-payout   { cartItems, totalAmount, userEmail }

   Reviews the basket before payment: flags companion items you may have
   forgotten and writes a short friendly receipt summary. The OpenAI key
   stays on the server.

   Degrades gracefully: with no OPENAI_API_KEY it still returns a usable
   receipt summary, so the checkout flow never breaks because the AI
   add-on is not configured.
   ============================================================ */
import { getSettings } from '../../lib/settings.js';

const FALLBACK_SUMMARY = 'Thank you for your order! We are preparing your items for dispatch.';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const cartItems = body.cartItems;
  const totalAmount = Number(body.totalAmount || 0);
  const userEmail = body.userEmail || 'Guest';

  if (!Array.isArray(cartItems) || cartItems.length === 0 || !totalAmount) {
    return res.status(400).json({ success: false, error: 'cartItems (non-empty array) and totalAmount are required' });
  }

  const cfg = await getSettings();
  if (!cfg.openai_api_key) {
    return res.status(200).json({
      success: true,
      aiConfigured: false,
      aiAnalysis: FALLBACK_SUMMARY,
      clientSecret: 'mock_gateway_payout_intent_secret_token'
    });
  }

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + cfg.openai_api_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: cfg.openai_model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI grocery agent inside a checkout flow. Review the item array, flag smart companion items the shopper may have forgotten, and write a succinct, friendly 3-sentence receipt summary.'
          },
          {
            role: 'user',
            content: 'Analyse this order for ' + userEmail + '. Cart items: ' + JSON.stringify(cartItems) + '. Total: ' + totalAmount + '.'
          }
        ],
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      const detail = await aiResponse.text();
      console.error('OpenAI rejected the payout review:', aiResponse.status, detail);
      return res.status(200).json({
        success: true,
        aiConfigured: true,
        aiAnalysis: FALLBACK_SUMMARY,
        clientSecret: 'mock_gateway_payout_intent_secret_token'
      });
    }

    const aiData = await aiResponse.json();
    const text = (aiData.choices && aiData.choices[0] && aiData.choices[0].message && aiData.choices[0].message.content) || FALLBACK_SUMMARY;

    return res.status(200).json({
      success: true,
      aiConfigured: true,
      aiAnalysis: text,
      clientSecret: 'mock_gateway_payout_intent_secret_token'
    });
  } catch (error) {
    console.error('AI payout pipeline failed:', error);
    return res.status(200).json({
      success: true,
      aiConfigured: true,
      aiAnalysis: FALLBACK_SUMMARY,
      clientSecret: 'mock_gateway_payout_intent_secret_token'
    });
  }
}
