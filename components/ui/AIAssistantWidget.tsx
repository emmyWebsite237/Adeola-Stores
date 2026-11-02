'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ChefHat,
  Truck,
  Wallet,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickLink?: { text: string; href: string };
}

const KNOWLEDGE_RESPONSES: Array<{
  triggers: string[];
  reply: string;
  quickLink?: { text: string; href: string };
}> = [
  {
    triggers: ['jollof', 'jollof rice', 'rice recipe'],
    reply:
      'For authentic party Jollof Rice, you need: Mama Gold / Royal Stallion Long Grain Rice, Gino / Tasty Tom Tomato Paste, fresh Ata Rodo (scotch bonnet), Tatashe, Onions, Knorr Chicken Cubes, Thyme, Curry, and Kings Pure Vegetable Oil! You can buy the complete pre-packed bundle in one click on our Recipes page.',
    quickLink: { text: 'View Jollof Rice Recipe 🥘', href: '/cook' },
  },
  {
    triggers: ['delivery', 'deliver', 'timeline', 'shipping', 'lagos', 'dispatch', 'how long'],
    reply:
      'We deliver across Lagos Mainland and Island! Orders placed before 12:00 PM are dispatched for Same-Day Delivery. Orders after 12 PM arrive next morning. Plus, orders ₦50,000 and above qualify for FREE delivery automatically.',
    quickLink: { text: 'See Delivery Terms & Zones 🚚', href: '/terms' },
  },
  {
    triggers: ['wallet', 'deposit', 'pin', 'balance', 'fund'],
    reply:
      'Your Ladydee Wallet allows fast, card-less checkouts! You can top up using Paystack (Bank transfer, Card, USSD), set your secret 4-digit security PIN in your Account, and pay instantly during checkout.',
    quickLink: { text: 'Manage Ladydee Wallet 💳', href: '/account' },
  },
  {
    triggers: ['egusi', 'soup', 'swallow', 'semovita', 'poundo'],
    reply:
      'For rich Egusi Soup, pick up Hand-Peeled Melon Seed (Egusi), Pure Red Palm Oil, Ground Crayfish, Stockfish, Dried Catfish, and Fresh Ugwu or Bitterleaf! We also stock Golden Penny Semovita and Ola-Ola Poundo Yam.',
    quickLink: { text: 'Explore Soups & Recipes 🍲', href: '/cook' },
  },
  {
    triggers: ['hours', 'open', 'contact', 'call', 'whatsapp', 'phone', 'location'],
    reply:
      'Ladydee Minimart operates Monday to Saturday from 7:30 AM to 7:00 PM. You can reach our Lagos market concierge directly via WhatsApp or phone at the contact numbers listed on our contact page.',
    quickLink: { text: 'Open Contact Desk 💬', href: '/contact' },
  },
  {
    triggers: ['payment', 'paystack', 'transfer', 'card', 'pod', 'pay on delivery'],
    reply:
      'We accept online payments via Paystack (Debit Cards, Bank Transfer, USSD, OPay) and Ladydee Wallet. Please note: Pay on Delivery is currently coming soon and temporarily paused while we upgrade logistics.',
    quickLink: { text: 'Proceed to Checkout 🛒', href: '/checkout' },
  },
  {
    triggers: ['18', 'age', 'birth', 'date of birth', 'minor'],
    reply:
      'Under our commercial policy, shoppers must be 18 years or older to register an account and place orders independently on Ladydee Minimart.',
    quickLink: { text: 'Read Terms & Age Policy 📄', href: '/terms' },
  },
];

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! 👋 I am DeeBot, your free 24/7 Ladydee Grocery Concierge. How can I help you shop today? Ask me about fresh ingredients, recipe guides, delivery zones, or your wallet!',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
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

    // AI Bot intelligent matching
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matched = KNOWLEDGE_RESPONSES.find((k) =>
        k.triggers.some((trig) => lower.includes(trig))
      );

      let botText = '';
      let link: { text: string; href: string } | undefined = undefined;

      if (matched) {
        botText = matched.reply;
        link = matched.quickLink;
      } else {
        botText =
          `I would love to help you with that! Ladydee Minimart provides fresh Lagos foodstuffs including Yams, Rice, Palm Oil, Frozen Chicken, Titus, and Seasoning Cubes. Try asking me: "Ingredients for Jollof", "How does delivery work?", or "How to fund wallet".`;
        link = { text: 'Browse All Groceries 🛒', href: '/shop' };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: botText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickLink: link,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Animated Assistant Launcher Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 select-none">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open DeeBot AI Assistant"
            className="group relative flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-700 via-brand-green to-emerald-600 text-white shadow-xl shadow-emerald-900/30 hover:scale-105 transition-all cursor-pointer border-2 border-emerald-400"
          >
            {/* Animated Pulse Ring */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
            </span>

            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <Bot className="w-4 h-4 text-white" />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black tracking-tight leading-none flex items-center gap-1">
                DeeBot AI <Sparkles className="w-3 h-3 text-amber-300" />
              </span>
              <span className="text-[10px] text-emerald-100 font-semibold leading-tight mt-0.5">
                Market Concierge
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-h-[82vh] h-[520px] bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 flex flex-col overflow-hidden animate-bounceModal">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#14532d] to-[#166534] p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 text-xl">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">DeeBot AI Assistant</h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 text-[9px] font-black uppercase">
                    Free 24/7
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 font-medium">
                  Ladydee Minimart Concierge
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              type="button"
              onClick={() => handleSend('Ingredients for Jollof Rice')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/50 cursor-pointer"
            >
              🥘 Jollof Ingredients
            </button>
            <button
              type="button"
              onClick={() => handleSend('Lagos delivery timeline & fee')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/50 cursor-pointer"
            >
              🚚 Delivery Info
            </button>
            <button
              type="button"
              onClick={() => handleSend('How does Ladydee wallet work?')}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold whitespace-nowrap hover:bg-emerald-100/50 cursor-pointer"
            >
              💳 Wallet Guide
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fbfdfb] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-green text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-emerald-100 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.quickLink && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-100">
                      <Link
                        href={m.quickLink.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg text-[11px]"
                      >
                        <span>{m.quickLink.text}</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-emerald-100 w-24 text-slate-400">
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
            className="p-3 bg-white border-t border-emerald-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about groceries, delivery, recipes..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white disabled:opacity-40 transition-all cursor-pointer"
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