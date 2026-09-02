import { MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LiveChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Sphere, your shopping assistant. How can I help?' },
  ]);
  const [sending, setSending] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = text.trim();
    setMessages((m) => [...m, { from: 'me', text: msg }]);
    setText('');
    setSending(true);
    try {
      await api.post('/messages', {
        name: user?.name || 'Guest',
        email: user?.email || 'guest@shopsphere.com',
        message: msg,
      });
      setMessages((m) => [
        ...m,
        { from: 'bot', text: 'Thanks! Our support team received your message and will reply shortly.' },
      ]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, we could not send that. Try the contact page.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg"
        aria-label="Open live chat"
      >
        <MessageCircle />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <p className="font-semibold">Live Support</p>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.from === 'me' ? 'ml-auto bg-accent text-white' : 'bg-slate-100'}`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t p-3">
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="btn-primary px-3" disabled={sending}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
