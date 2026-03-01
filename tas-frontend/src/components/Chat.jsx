import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ groupName, onBack }) {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hola a todos! ¿Cuándo nos reunimos?', sender: 'Juan Soto', type: 'received', time: '10:28' },
        { id: 2, text: 'Yo puedo mañana después de clases.', sender: 'Yo', type: 'sent', time: '10:29' },
        { id: 3, text: 'Perfecto, nos vemos en la biblioteca.', sender: 'Maria Lopez', type: 'received', time: '10:30' },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        const newMessage = {
            id: Date.now(),
            text: input,
            sender: 'Yo',
            type: 'sent',
            time: timeString
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');

        // Respuesta automática
        setTimeout(() => {
            const replies = ["¡Entendido!", "Vale, nos vemos.", "¿Podrías repetir eso?", "👍", "De acuerdo."];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            const replyMsg = {
                id: Date.now() + 1,
                text: randomReply,
                sender: 'Compañero',
                type: 'received',
                time: timeString
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 1500);
    };

    return (
        <section id="chat-screen" className="screen active">
            <header className="chat-header">
                <button className="btn-back" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div className="chat-header-info">
                    <h3 id="chat-title">{groupName}</h3>
                    <p>4 miembros activos</p>
                </div>
                <div className="chat-header-actions">
                    <div className="more-options">•••</div>
                </div>
            </header>

            <div className="chat-messages" id="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        {msg.type === 'received' && (
                            <div className="message-avatar">{msg.sender.charAt(0)}</div>
                        )}
                        <div className="message-bubble">
                            {msg.type === 'received' && (
                                <div className="message-sender">{msg.sender}</div>
                            )}
                            <p>{msg.text}</p>
                            <span className="message-time">{msg.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <button className="btn-attach">+</button>
                <input
                    type="text"
                    id="message-input"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn-send" onClick={handleSend}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </section>
    );
}
