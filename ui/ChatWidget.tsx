'use client';

import { useState } from 'react';

interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Mensaje = { role: 'user', content: input };
    setMensajes((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.reply) {
        setMensajes((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMensajes((prev) => [...prev, { role: 'assistant', content: "Ups, hubo un problema al responder. Intentá de nuevo." }]);
      }
    } catch {
      setMensajes((prev) => [...prev, { role: 'assistant', content: "Error de conexión. Probá más tarde." }]);
    }

    setLoading(false);
    setInput('');
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed top-4 right-4 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
        aria-label="Abrir chat"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed top-20 right-4 z-50 w-[350px] h-[500px] bg-white text-black rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
            <span>Chat</span>
            <button onClick={toggleChat} className="font-bold text-lg">
              ✖
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {mensajes.length === 0 && (
              <p className="text-gray-500 italic">¡Hola! ¿En qué te puedo ayudar?</p>
            )}
            {mensajes.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-100 self-end text-right ml-auto'
                    : 'bg-gray-100 self-start text-left'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <p className="text-blue-600 italic">Pensando...</p>}
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-base"
              placeholder="Escribí tu mensaje..."
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
              disabled={loading}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}