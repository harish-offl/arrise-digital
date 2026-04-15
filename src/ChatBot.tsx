import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Minimize2 } from 'lucide-react';

interface QA { patterns: string[]; answer: string; }

const KB: QA[] = [
  { patterns: ['hello','hi','hey','good morning','good evening','start'], answer: "Hey there! 👋 I'm Arri, ARRISE DIGITAL's AI assistant.\n\nAsk me about our services, pricing, or anything else!" },
  { patterns: ['service','what do you do','offer','provide','help with'], answer: "We offer 11 core services:\n\n📱 Social Media Marketing\n✍️ Content Creation\n🎬 Video Editing\n🤖 AI Automation\n💻 Website Development\n🎨 Graphic Design\n📸 Photography\n📊 Meta Ads\n🧭 Brand Strategy\n🤖 AI Chatbot\n📧 Email Automation\n\nWhich one interests you?" },
  { patterns: ['price','cost','pricing','budget','how much','rate','fee','package'], answer: "Our pricing is flexible:\n\n💰 Starter — Under ₹25,000\n💰 Growth — ₹25,000–₹50,000\n💰 Pro — ₹50,000–₹1,00,000\n💰 Enterprise — Above ₹1,00,000\n\nWant a custom quote? WhatsApp us or fill the contact form!" },
  { patterns: ['ai chatbot','chatbot','chat bot','bot development'], answer: "Our AI Chatbot service includes:\n\n🤖 Custom-trained chatbots (like me!)\n💬 WhatsApp & website integration\n🎯 Lead capture & qualification\n📊 Conversation analytics\n🔄 24/7 automated responses\n\nInterested?" },
  { patterns: ['email automation','email marketing','newsletter','drip','workflow'], answer: "Our Email Automation covers:\n\n📧 Welcome & onboarding sequences\n✅ Lead nurture workflows\n🔔 Form submission confirmations\n📣 Promotional campaigns\n📊 Open rate & click tracking\n\nWant to know more?" },
  { patterns: ['social media','instagram','facebook','smm'], answer: "Our Social Media Marketing includes:\n\n✅ Profile optimization\n✅ Content calendar & strategy\n✅ Daily/weekly posting\n✅ Engagement management\n✅ Growth analytics\n\nWe've helped 100+ clients grow!" },
  { patterns: ['website','web development','web dev','landing page'], answer: "We build fast, modern websites:\n\n🚀 React / Next.js\n🎨 Custom UI/UX design\n📱 Fully responsive\n⚡ SEO optimized\n\nPortfolio: Vaigai Namma Taxi, URS Choice, Lio Maxx." },
  { patterns: ['video','editing','reel','youtube','short'], answer: "Our Video Editing covers:\n\n🎬 Reels & Shorts editing\n🎞️ Cinematic color grading\n✨ Motion graphics\n🎵 Sound design\n\n500+ videos edited!" },
  { patterns: ['meta ads','facebook ads','paid ads','advertising','ppc'], answer: "Our Meta Ads service:\n\n🎯 Precise audience targeting\n📈 ROI-focused campaigns\n🔬 A/B testing\n📊 Weekly performance reports\n\nCampaigns for 50+ businesses!" },
  { patterns: ['graphic','design','logo','branding','poster'], answer: "Our Graphic Design services:\n\n🎨 Logo & brand identity\n📦 Packaging design\n📣 Marketing collateral\n🖼️ Social media creatives" },
  { patterns: ['team','who','founder','annamalai','viswanath','rojith'], answer: "Meet the ARRISE DIGITAL team:\n\n👨‍💻 Annamalai — Creative Lead (SMM & Design, 3+ yrs)\n🎬 Viswanath — Media Production (Ads & Video, 2+ yrs)\n🧠 Rojith — Digital Strategist (Tech Lead, 3+ yrs)" },
  { patterns: ['contact','reach','call','phone','whatsapp','get in touch'], answer: "Reach us through:\n\n📱 WhatsApp: +91 73051 15192\n📧 Email: arrisedigital@gmail.com\n📸 Instagram: @arrisedigital\n\nWe reply within 24 hours!" },
  { patterns: ['location','where','madurai','office','based'], answer: "We're based in Madurai, Tamil Nadu 🌟\n\nWe work with clients across India and internationally!" },
  { patterns: ['get started','begin','onboard','process','how does it work'], answer: "Getting started is easy:\n\n1️⃣ Fill the contact form or WhatsApp us\n2️⃣ Free 30-min discovery call\n3️⃣ Custom proposal sent\n4️⃣ Onboarding & kickoff\n5️⃣ We deliver results 🚀" },
  { patterns: ['thank','thanks','awesome','great','perfect'], answer: "You're welcome! 😊 Anything else I can help with?" },
  { patterns: ['bye','goodbye','see you','later'], answer: "Goodbye! 👋 Reach us anytime on WhatsApp: +91 73051 15192. Have a great day! 🌟" },
];

function getReply(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const qa of KB) {
    if (qa.patterns.some(p => lower.includes(p))) return qa.answer;
  }
  return "I'm not sure about that, but our team can help! 💬\n\n📱 WhatsApp: +91 73051 15192\n📧 Email: arrisedigital@gmail.com\n\nWe reply within 24 hours!";
}

interface Msg { id: number; role: 'bot' | 'user'; text: string; time: string; }
const QUICK = ['Our Services', 'Pricing', 'AI Chatbot', 'Email Automation', 'Get Started'];
const ts = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ChatBot() {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState<Msg[]>([
    { id: 0, role: 'bot', text: "Hi! I'm Arri 👋, ARRISE DIGITAL's AI assistant.\n\nAsk me about our services, pricing, or anything else!", time: ts() },
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef           = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => { if (open) { setUnread(0); inputRef.current?.focus(); } }, [open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs(p => [...p, { id: Date.now(), role: 'user', text: t, time: ts() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { id: Date.now() + 1, role: 'bot', text: getReply(t), time: ts() }]);
      if (!open) setUnread(u => u + 1);
    }, 700 + Math.random() * 500);
  };

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)} aria-label="Open AI Chat"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg,#7B3FE4,#2D8CFF)', boxShadow: '0 8px 28px rgba(123,63,228,0.5)' }}>
        {open ? <X size={22} className="text-white" /> : <Bot size={22} className="text-white" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-44 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ width: 'min(380px, calc(100vw - 24px))', height: '520px', background: 'rgba(8,8,16,0.97)', border: '1px solid rgba(123,63,228,0.4)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(123,63,228,0.3),rgba(45,140,255,0.15))' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7B3FE4,#2D8CFF)' }}>
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">Arri — AI Assistant</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/40 text-xs">ARRISE DIGITAL · Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/70 transition-colors p-1">
              <Minimize2 size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(123,63,228,0.4) transparent' }}>
            {msgs.map(m => (
              <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${m.role === 'bot' ? 'bg-gradient-to-br from-violet-600 to-blue-500' : 'bg-gradient-to-br from-pink-600 to-violet-600'}`}>
                  {m.role === 'bot' ? <Bot size={13} className="text-white" /> : <User size={13} className="text-white" />}
                </div>
                <div className={`max-w-[78%] flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line"
                    style={m.role === 'bot'
                      ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.88)', borderRadius: '4px 16px 16px 16px' }
                      : { background: 'linear-gradient(135deg,#7B3FE4,#2D8CFF)', color: '#fff', borderRadius: '16px 4px 16px 16px' }}>
                    {m.text}
                  </div>
                  <span className="text-white/25 text-[10px] px-1">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="px-4 py-3 flex items-center gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '4px 16px 16px 16px' }}>
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                      style={{ animation: `chatBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 whitespace-nowrap"
                style={{ background: 'rgba(123,63,228,0.18)', border: '1px solid rgba(123,63,228,0.35)', color: 'rgba(255,255,255,0.75)' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-white/85 text-sm placeholder-white/25 outline-none" />
              <button onClick={() => send(input)} disabled={!input.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:scale-110 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7B3FE4,#2D8CFF)' }}>
                <Send size={14} className="text-white" />
              </button>
            </div>
            <p className="text-white/20 text-[10px] text-center mt-2">Powered by ARRISE DIGITAL AI</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
      `}</style>
    </>
  );
}
