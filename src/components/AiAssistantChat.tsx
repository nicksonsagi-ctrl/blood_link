import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, Minimize2, Maximize2, RotateCcw, AlertCircle, PhoneCall, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiAssistantChatProps {
  embedded?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  defaultPrompt?: string;
}

const QUICK_PROMPTS = [
  { label: '🩸 Blood Compatibility', prompt: 'Can you show me the blood compatibility chart? Who is the universal donor and recipient?' },
  { label: '🏥 Jaffna Blood Bank', prompt: 'What are the contact details and emergency hotline for Teaching Hospital Jaffna Blood Bank?' },
  { label: '⏱️ 90-Day Donation Rule', prompt: 'What is the 90-day donation interval rule in Sri Lanka, and why does my status say Already Donated?' },
  { label: '🚑 Emergency Hotlines', prompt: 'What are the 24/7 emergency blood and ambulance hotlines in Sri Lanka?' },
];

export const AiAssistantChat: React.FC<AiAssistantChatProps> = ({
  embedded = false,
  isOpen = false,
  onClose,
  defaultPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'வணக்கம் / Welcome to **LifeLink AI Assistant**! 🩸\n\nI can help you with **blood compatibility, emergency hospital contacts in Jaffna & Sri Lanka, 90-day donation interval rules, and finding eligible donors**.\n\nYou can chat with me in English, தமிழ் (Tamil), or Tanglish!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (defaultPrompt && defaultPrompt.trim()) {
      handleSend(defaultPrompt);
    }
  }, [defaultPrompt]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build history for API
      const history = messages.slice(-6).map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history })
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'I am ready to help. Please dial 1923 for immediate blood emergencies.';

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'assistant',
        text: '⚠️ Network connection issue. For urgent hospital blood transfusions, please call **Teaching Hospital Jaffna Blood Bank** directly at **+94 21 222 2261** or the **National Blood Center Hotline at 1923**.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'reset-1',
        sender: 'assistant',
        text: 'Chat conversation refreshed. How can I help you with blood donation, donor matching, or hospital contacts today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Render markdown text simply
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold replacement
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-neutral-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 pl-1">
            <span className="text-[#DC0A20] font-bold text-xs leading-5">•</span>
            <span className="flex-1 text-xs leading-relaxed">{formattedLine.slice(0)}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          {formattedLine}
        </p>
      );
    });
  };

  if (!embedded && !isOpen) return null;

  const containerClasses = embedded
    ? 'bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col h-[520px] overflow-hidden'
    : 'fixed bottom-5 right-5 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-neutral-200 shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-200 ' +
      (isMinimized ? 'h-14' : 'h-[540px]');

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white p-3.5 flex items-center justify-between shrink-0 select-none border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#DC0A20] to-rose-500 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">LifeLink AI Assistant</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-neutral-300">24/7 Smart Emergency & Donor Guide</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-neutral-400">
          <button
            onClick={resetChat}
            className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {!embedded && (
            <>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                  title="Close assistant"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Info Banner */}
          <div className="bg-rose-50/70 border-b border-rose-100 px-3 py-1.5 flex items-center justify-between text-[10px] text-rose-900 shrink-0">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#DC0A20]" />
              National Blood Hotline: <strong>1923</strong> &middot; Jaffna: <strong>021-222-2261</strong>
            </span>
            <span className="text-neutral-500 font-medium">EN / தமிழ் / Tanglish</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-[#DC0A20] text-white rounded-br-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedText(m.text)}
                </div>
                <span className="text-[9.5px] text-neutral-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-white border border-neutral-200/80 rounded-2xl px-3 py-2 w-fit shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#DC0A20] animate-spin" />
                <span className="text-[11px] font-medium">LifeLink AI is consulting medical protocol...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.prompt)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 bg-neutral-100 hover:bg-[#FFF0F2] hover:text-[#DC0A20] hover:border-[#DC0A20]/30 text-neutral-700 text-[10.5px] font-medium rounded-lg border border-neutral-200 transition-colors shrink-0 disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about blood groups, donors, Jaffna hospitals..."
                className="flex-1 text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#DC0A20] focus:bg-white transition-colors"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-xl bg-[#DC0A20] hover:bg-[#B80020] text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
