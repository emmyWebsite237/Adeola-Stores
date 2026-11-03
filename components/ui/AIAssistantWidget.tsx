'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  Move,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { RECIPES } from '@/data/recipes';
import { formatNaira } from '@/lib/utils';
import { Product } from '@/types/product';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickLink?: { text: string; href: string };
  matchedProducts?: Product[];
  suggestedPrompts?: string[];
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Position coordinates: { x, y } in pixels from top-left of viewport
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  // Drag tracking refs
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    hasDragged: boolean;
  }>({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    hasDragged: false,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'E kaabo! 👋 I am DeeBot, your 24/7 Ladydee Grocery & Cooking Concierge. How can I help you today? You can ask me about product prices, Nigerian recipe ingredients, Lagos delivery, or how to use your wallet!',
      timestamp: 'Just now',
      suggestedPrompts: [
        'How much is rice?',
        'Jollof rice ingredients 🥘',
        'Lagos delivery fee & timeline 🚚',
        'How to fund Ladydee wallet 💳',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMounted(true);
    // Initialize position from localStorage or default to bottom-right
    try {
      const saved = localStorage.getItem('deebot_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          // Clamp to current viewport
          const clampedX = Math.min(Math.max(10, parsed.x), window.innerWidth - 75);
          const clampedY = Math.min(Math.max(10, parsed.y), window.innerHeight - 75);
          setPosition({ x: clampedX, y: clampedY });
          return;
        }
      }
    } catch {}

    // Default: bottom-right
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(10, window.innerWidth - 80);
      const defaultY = Math.max(10, window.innerHeight - (window.innerWidth < 640 ? 110 : 80));
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Touch & Mouse Drag Handlers
  const handleStartDrag = (clientX: number, clientY: number) => {
    if (!position) return;
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startPosX: position.x,
      startPosY: position.y,
      hasDragged: false,
    };
  };

  const handleMoveDrag = useCallback((clientX: number, clientY: number) => {
    const { startX, startY, startPosX, startPosY } = dragRef.current;
    const dx = clientX - startX;
    const dy = clientY - startY;

    if (Math.hypot(dx, dy) > 6) {
      dragRef.current.hasDragged = true;
    }

    if (dragRef.current.hasDragged && typeof window !== 'undefined') {
      const newX = Math.min(Math.max(10, startPosX + dx), window.innerWidth - 75);
      const newY = Math.min(Math.max(10, startPosY + dy), window.innerHeight - 75);
      setPosition({ x: newX, y: newY });
    }
  }, []);

  const handleEndDrag = () => {
    if (dragRef.current.hasDragged) {
      // Save position to localStorage
      if (position) {
        try {
          localStorage.setItem('deebot_pos', JSON.stringify(position));
        } catch {}
      }
    } else {
      // It was a tap/click, toggle assistant open
      setIsOpen((prev) => !prev);
    }
  };

  // Mouse Listeners
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStartDrag(e.clientX, e.clientY);

    const onMouseMove = (moveEvt: MouseEvent) => {
      handleMoveDrag(moveEvt.clientX, moveEvt.clientY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      handleEndDrag();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Touch Listeners
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      handleStartDrag(t.clientX, t.clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      handleMoveDrag(t.clientX, t.clientY);
    }
  };

  const onTouchEnd = () => {
    handleEndDrag();
  };

  // Local Intelligence Engine
  const generateLocalResponse = (query: string): Omit<ChatMessage, 'id' | 'timestamp' | 'sender'> => {
    const q = query.toLowerCase().trim();

    // 1. Check for product price / search inquiries
    const foundProds = PRODUCTS.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = p.category.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const short = (p.short || '').toLowerCase();
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      return (
        name.includes(q) ||
        words.some((w) => name.includes(w) || cat.includes(w) || desc.includes(w) || short.includes(w))
      );
    }).slice(0, 3);

    const isPriceOrProductQuery =
      q.includes('price') ||
      q.includes('how much') ||
      q.includes('cost') ||
      q.includes('buy') ||
      q.includes('do you have') ||
      q.includes('stock') ||
      q.includes('sell') ||
      q.includes('rice') ||
      q.includes('oil') ||
      q.includes('beans') ||
      q.includes('tomato') ||
      q.includes('milk') ||
      q.includes('titus') ||
      q.includes('indomie') ||
      q.includes('crayfish') ||
      q.includes('maggi') ||
      q.includes('knorr') ||
      q.includes('garri') ||
      q.includes('yam');

    if (foundProds.length > 0 && isPriceOrProductQuery) {
      return {
        text: `Here are the exact live items we have in stock matching "${query}":`,
        matchedProducts: foundProds,
        quickLink: { text: 'Browse All Groceries in Shop 🛒', href: '/shop' },
        suggestedPrompts: [
          'What are your delivery fees?',
          'Do you have any discount codes?',
          'How does the wallet work?',
        ],
      };
    }

    // 2. Recipe Inquiries
    const matchedRecipe = RECIPES.find((r) => {
      const name = r.name.toLowerCase();
      const headline = r.headline.toLowerCase();
      const cat = r.category.toLowerCase();
      return (
        q.includes(r.slug) ||
        name.includes(q) ||
        q.split(/\s+/).some((w) => w.length > 3 && (name.includes(w) || headline.includes(w) || cat.includes(w)))
      );
    });

    if (matchedRecipe || q.includes('cook') || q.includes('recipe') || q.includes('prepare') || q.includes('jollof') || q.includes('egusi') || q.includes('soup') || q.includes('noodles')) {
      if (matchedRecipe) {
        const ingredientsList = matchedRecipe.ingredients
          .slice(0, 5)
          .map((i) => `• ${i.name} (${i.amount})`)
          .join('\n');

        return {
          text: `🥘 **${matchedRecipe.name}**\n\n${matchedRecipe.headline}\n\n**Key Ingredients:**\n${ingredientsList}\n\nYou can order all pre-portioned ingredients together in 1 click!`,
          quickLink: { text: `View Full Recipe & Instructions 🍳`, href: `/cook/${matchedRecipe.slug}` },
          suggestedPrompts: [
            'How long does Lagos delivery take?',
            'What coupons are active?',
            'Check my cart',
          ],
        };
      }

      return {
        text: `We have chef-curated Nigerian recipes including Smoky Party Jollof, Gourmet Indomie Supreme, Egusi Soup, and Fried Rice with one-click ingredient bundles!`,
        quickLink: { text: 'Explore All Recipes & Bundles 🥘', href: '/cook' },
        suggestedPrompts: ['Jollof rice recipe', 'Delivery zones and fees', 'Wallet payment guide'],
      };
    }

    // 3. Lagos Delivery
    if (
      q.includes('delivery') ||
      q.includes('deliver') ||
      q.includes('shipping') ||
      q.includes('dispatch') ||
      q.includes('lagos') ||
      q.includes('mainland') ||
      q.includes('island') ||
      q.includes('ikeja') ||
      q.includes('lekki') ||
      q.includes('how long')
    ) {
      return {
        text: `🚚 **Lagos Delivery Guide:**\n\n• **Mainland:** ₦2,500\n• **Island:** ₦3,500\n• **Same-Day Delivery:** Orders placed before 12:00 PM are dispatched same-day.\n• **FREE Delivery:** Automatically applied on all orders ₦50,000 and above!`,
        quickLink: { text: 'View Delivery Policies 📄', href: '/terms' },
        suggestedPrompts: ['Any coupon codes?', 'How to pay with wallet?', 'Contact customer care'],
      };
    }

    // 4. Wallet & Payments
    if (
      q.includes('wallet') ||
      q.includes('pin') ||
      q.includes('deposit') ||
      q.includes('fund') ||
      q.includes('balance') ||
      q.includes('topup')
    ) {
      return {
        text: `💳 **Ladydee Wallet System:**\n\n1. **Deposit:** Top up your balance securely via Paystack using card, bank transfer, or USSD.\n2. **Security PIN:** Set a 4-digit payment PIN inside your Account.\n3. **Instant Checkout:** Pay for any order at checkout in 1 second by entering your 4-digit PIN!`,
        quickLink: { text: 'Go to Wallet & PIN Settings 💳', href: '/account' },
        suggestedPrompts: ['Can I pay on delivery?', 'What are current discounts?', 'How much is vegetable oil?'],
      };
    }

    // 5. Pay on Delivery
    if (
      q.includes('pay on delivery') ||
      q.includes('pod') ||
      q.includes('cash on delivery') ||
      q.includes('pay when receive')
    ) {
      return {
        text: `⚠️ **Pay on Delivery Update:**\n\nPay on Delivery is currently **Coming Soon** while we finalize our automated dispatch logistics. In the meantime, you can pay safely using **Paystack** (Cards, Transfer, USSD) or your **Ladydee Wallet**!`,
        quickLink: { text: 'Proceed to Checkout 🛒', href: '/checkout' },
        suggestedPrompts: ['How do I fund my wallet?', 'What are your delivery fees?', 'Browse fresh food'],
      };
    }

    // 6. Discounts & Coupons
    if (
      q.includes('coupon') ||
      q.includes('discount') ||
      q.includes('promo') ||
      q.includes('voucher') ||
      q.includes('code') ||
      q.includes('deal') ||
      q.includes('offer')
    ) {
      return {
        text: `🏷️ **Active Promo Codes:**\n\n• **WELCOME10**: 10% off your order for new shoppers.\n• **ADEOLA5**: 5% off any grocery cart.\n• **FREEDEL**: Free delivery on orders ₦20,000+.\n\nJust enter the code at checkout!`,
        quickLink: { text: 'Use Coupons in Cart 🛒', href: '/cart' },
        suggestedPrompts: ['How much is rice?', 'Delivery timeline', 'Wallet payment guide'],
      };
    }

    // 7. Store Hours & Contact
    if (
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('whatsapp') ||
      q.includes('call') ||
      q.includes('open') ||
      q.includes('hours') ||
      q.includes('closing') ||
      q.includes('location') ||
      q.includes('address')
    ) {
      return {
        text: `📍 **Ladydee Minimart Store:**\n\n• **Location:** Lagos, Nigeria\n• **Working Hours:** Monday to Saturday: 7:30 AM – 7:00 PM (Closed Sundays)\n• **Support:** Call or WhatsApp our dispatch team anytime for instant help!`,
        quickLink: { text: 'Open Contact Desk 💬', href: '/contact' },
        suggestedPrompts: ['What products do you have?', 'Delivery fees', 'Check active coupons'],
      };
    }

    // 8. Age & Registration
    if (q.includes('18') || q.includes('age') || q.includes('birth') || q.includes('register') || q.includes('sign up')) {
      return {
        text: `👤 **Registration & Age Policy:**\n\nYou must be 18 years or older to register and place orders. You can sign up with your email or use the one-tap **"Continue with Google"** button!`,
        quickLink: { text: 'Read Terms of Service 📄', href: '/terms' },
        suggestedPrompts: ['How much is Kings vegetable oil?', 'Lagos delivery timeline', 'Fund wallet'],
      };
    }

    // 9. Greetings & Pleasantries
    if (
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('hey') ||
      q.includes('good morning') ||
      q.includes('good afternoon') ||
      q.includes('good evening') ||
      q.includes('how are you') ||
      q.includes('bawo') ||
      q.includes('kedu')
    ) {
      return {
        text: `Hello! 😊 Welcome to Ladydee Minimart. How is your day going? I am ready to help you with groceries, quick Lagos delivery, prices, or authentic Nigerian meal ideas!`,
        suggestedPrompts: [
          'What is on special offer today?',
          'Ingredients for Jollof Rice 🥘',
          'Delivery zones & fees 🚚',
        ],
      };
    }

    // Fallback with rich options
    return {
      text: `I'm here to help you shop smart! You can ask me anything about our Lagos foodstuffs (Rice, Titus, Vegetable Oil, Tomato Paste, Egusi, Spices), delivery fees, recipe bundles, or your digital wallet.`,
      quickLink: { text: 'Explore All Groceries 🛒', href: '/shop' },
      suggestedPrompts: [
        'How much is rice?',
        'How long does delivery take?',
        'What discount codes can I use?',
      ],
    };
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Step 1: Attempt to call the live AI endpoint (/api/ai/chat)
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isLiveAI && data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: 'bot-' + Date.now(),
              sender: 'bot',
              text: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              suggestedPrompts: [
                'Tell me about Lagos delivery',
                'Show me active coupons',
                'Browse fresh food',
              ],
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fallback to local intelligent engine
    }

    // Step 2: Use enhanced local neural brain
    setTimeout(() => {
      const localResult = generateLocalResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          ...localResult,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  if (!mounted || !position) return null;

  return (
    <>
      {/* Draggable Floating Assistant Launcher Bubble */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 49,
            touchAction: 'none',
          }}
          className="select-none cursor-grab active:cursor-grabbing group"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative flex items-center">
            {/* Draggable button */}
            <button
              type="button"
              aria-label="Open DeeBot AI Assistant (Drag to reposition)"
              className="relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 text-white shadow-2xl shadow-emerald-950/40 border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-transform"
            >
              {/* Animated Status Pulse */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white" />
              </span>

              {/* Bot Avatar Icon */}
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                <Bot className="w-4 h-4 text-white" />
              </div>

              {/* Text label */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-black tracking-tight flex items-center gap-1">
                  DeeBot AI <Sparkles className="w-3 h-3 text-amber-300" />
                </span>
                <span className="text-[9px] text-emerald-100 font-semibold leading-tight">
                  Drag to move • Tap to chat
                </span>
              </div>

              {/* Move Indicator Icon */}
              <div className="sm:hidden text-emerald-200">
                <Move className="w-3 h-3 opacity-60" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[400px] max-h-[85vh] h-[550px] bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 flex flex-col overflow-hidden animate-bounceModal"
          style={{ maxWidth: '400px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#14532d] to-[#166534] p-3.5 sm:p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 text-xl shadow-inner">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">DeeBot AI</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                    Active 24/7
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 font-medium">
                  Ladydee Concierge • Live Catalog Connected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome-' + Date.now(),
                      sender: 'bot',
                      text: 'Conversation reset! What can I help you find or cook today? 🛒',
                      timestamp: 'Just now',
                      suggestedPrompts: [
                        'How much is rice?',
                        'Jollof rice ingredients 🥘',
                        'Lagos delivery info 🚚',
                      ],
                    },
                  ]);
                }}
                title="Restart chat"
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="px-3 py-2 bg-emerald-50/80 border-b border-emerald-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              type="button"
              onClick={() => handleSend('How much is rice?')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/70 transition-colors shadow-2xs"
            >
              🍚 Price of Rice
            </button>
            <button
              type="button"
              onClick={() => handleSend('Jollof rice ingredients')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/70 transition-colors shadow-2xs"
            >
              🥘 Jollof Recipe
            </button>
            <button
              type="button"
              onClick={() => handleSend('Lagos delivery fee & timeline')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/70 transition-colors shadow-2xs"
            >
              🚚 Delivery Info
            </button>
            <button
              type="button"
              onClick={() => handleSend('How to fund Ladydee wallet')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/70 transition-colors shadow-2xs"
            >
              💳 Wallet & PIN
            </button>
            <button
              type="button"
              onClick={() => handleSend('What coupon codes are active?')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/70 transition-colors shadow-2xs"
            >
              🏷️ Promo Codes
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fbfdfb] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-brand-green text-white rounded-tr-none shadow-emerald-900/10'
                      : 'bg-white border border-emerald-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="font-normal">{m.text}</p>

                  {/* Matched Live Product Mini-Cards */}
                  {m.matchedProducts && m.matchedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-emerald-100 pt-2.5">
                      {m.matchedProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200/60 transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                              <ShoppingBag className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-emerald-800">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-slate-500">{p.size}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-extrabold text-brand-green">
                              {formatNaira(p.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Button Link */}
                  {m.quickLink && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-100/70">
                      <Link
                        href={m.quickLink.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/60 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                      >
                        <span>{m.quickLink.text}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Suggested Follow-up Prompts */}
                {m.suggestedPrompts && m.suggestedPrompts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[88%]">
                    {m.suggestedPrompts.map((prmt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(prmt)}
                        className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-full px-2.5 py-0.5 transition-colors cursor-pointer text-left"
                      >
                        {prmt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-emerald-100 w-24 text-slate-400 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-emerald-100 flex items-center gap-2 shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. price of oil, jollof recipe...)"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white disabled:opacity-40 transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
