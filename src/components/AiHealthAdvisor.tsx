import React, { useState, useEffect } from 'react';
import { X, Bot, Send, Sparkles, User, RefreshCw, HeartPulse, CheckCircle2 } from 'lucide-react';

interface AiHealthAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiHealthAdvisor: React.FC<AiHealthAdvisorProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি ঘরের বাজারের অর্গানিক ফুড & নিউট্রিশন এডভাইজর। খাঁটি মধু, গাওয়া ঘি, ড্রাই ফ্রুটস বা অর্গানিক খাবারের স্বাস্থ্য উপকারিতা এবং ব্যবহার নির্দেশিকা সম্পর্কে যেকোনো প্রশ্ন করুন!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.answer || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: 'খাঁটি ও অর্গানিক খাবার শরীরের রোগ প্রতিরোধ ক্ষমতা বহুগুণ বাড়ায়।',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'সুন্দরবনের মধুর উপকারিতা ও খাঁটি মধু চেনার উপায়',
    'গাওয়া ঘি খাওয়ার সঠিক সময় ও পরিমাণ',
    'কোন বাদাম ওজন কমাতে ও স্মৃতিশক্তি বাড়াতে সেরা?',
    'কোল্ড প্রেসড সরিষার তেলের বৈশিষ্ট্য কি?'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
              <Bot className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h2 className="font-extrabold text-base flex items-center gap-1.5">
                <span>অর্গানিক AI স্বাস্থ্য পরামর্শক</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-[11px] text-emerald-200">Gemini AI দ্বারা পরিচালিত স্বাস্থ্য সহায়িকা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-emerald-50 p-3 border-b border-emerald-100">
          <div className="text-[11px] font-bold text-emerald-900 mb-1.5 flex items-center gap-1">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-700" />
            <span>দ্রুত জিজ্ঞাসা করুন:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="bg-white text-emerald-900 hover:bg-emerald-800 hover:text-amber-300 border border-emerald-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm mt-1">
                  🌱
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-800 text-amber-300 rounded-tr-none font-medium shadow-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span
                  className={`text-[10px] block mt-1.5 text-right ${
                    m.sender === 'user' ? 'text-amber-200/70' : 'text-gray-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center text-xs font-black shrink-0 shadow-sm mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl w-max">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
              <span>ঘরের বাজার AI পরামর্শ তৈরি করছে...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="যেকোনো খাবার বা স্বাস্থ্য বিষয়ক প্রশ্ন লিখুন..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-amber-300 p-2.5 rounded-xl font-bold transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
