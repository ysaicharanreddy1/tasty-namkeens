import React, { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';

const PHONE = '919908478783';

export default function WhatsAppChat() {
  // Directly open as a box when website opens
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    const text = message.trim() || 'Hello, I have a query about Tasty Namkeens products.';
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank');
    setMessage('');
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window Box */}
      {open ? (
        <div className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-300">
          {/* Header with WhatsApp icon and Down Arrow mark to compress */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.68-1.318A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.239 0-4.322-.727-6.008-1.957l-.42-.311-2.783.784.728-2.665-.342-.543A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
              </div>
              <span className="font-semibold text-sm">Let's chat on WhatsApp</span>
            </div>
            {/* Top Right Down Arrow mark to compress box into symbol */}
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
              title="Minimize chat"
            >
              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="bg-[#ECE5DD] px-4 py-5 min-h-[190px]">
            <div className="bg-white rounded-lg px-3 py-2 shadow-sm inline-block max-w-[85%]">
              <p className="text-sm text-gray-800">How can I help you? :)</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="bg-[#F0F0F0] px-3 py-2.5 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your message..."
              className="flex-1 bg-white rounded-full px-4 py-2 text-sm border-none outline-none placeholder-gray-400 focus:ring-1 focus:ring-[#075E54]"
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 rounded-full bg-[#075E54] text-white flex items-center justify-center hover:bg-[#064E46] transition-colors shrink-0"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Compressed Icon-Sized WhatsApp Symbol at Bottom Right */
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          title="Open WhatsApp Chat"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.68-1.318A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.239 0-4.322-.727-6.008-1.957l-.42-.311-2.783.784.728-2.665-.342-.543A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
          </svg>
        </button>
      )}
    </div>
  );
}
