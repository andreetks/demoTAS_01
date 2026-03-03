import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Chat({ room, onBack }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const socketRef = useRef();
    const [currentUserId, setCurrentUserId] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!room) return;

        const token = localStorage.getItem('token');
        if (token) {
            const payload = parseJwt(token);
            if (payload) {
                setCurrentUserId(payload.sub);
            }
        }

        socketRef.current = io(`${apiUrl}/chat`, {
            auth: { token }
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join_room', { roomId: room.id });
        });

        socketRef.current.on('room_history', (history) => {
            const myId = parseJwt(token)?.sub;
            const formattedHistory = history.map(msg => ({
                id: msg.id,
                text: msg.content,
                sender: msg.userName,
                type: msg.userId === myId ? 'sent' : 'received',
                time: formatTime(msg.createdAt)
            }));
            setMessages(formattedHistory);
        });

        socketRef.current.on('new_message', (msg) => {
            const myId = parseJwt(token)?.sub;
            setMessages(prev => [...prev, {
                id: msg.id,
                text: msg.content,
                sender: msg.userName,
                type: msg.userId === myId ? 'sent' : 'received',
                time: formatTime(msg.createdAt)
            }]);
        });

        socketRef.current.on('exception', (err) => {
            console.error('Socket error:', err);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [room, apiUrl]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !socketRef.current) return;

        socketRef.current.emit('send_message', {
            roomId: room.id,
            content: input
        });

        setInput('');
    };

    if (!room) return null;

    return (
        <section id="chat-screen" className="screen active">
            <header className="chat-header">
                <button className="btn-back" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div className="chat-header-info">
                    <h3 id="chat-title">{room.name}</h3>
                    <p>{room.type === 'private' ? 'Chat Privado' : 'Chat de Grupo'}</p>
                </div>
                <div className="chat-header-actions">
                    <div className="more-options">•••</div>
                </div>
            </header>

            <div className="chat-messages" id="chat-messages">
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        <p>No hay mensajes todavía. ¡Comienza la conversación!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.type}`}>
                            {msg.type === 'received' && (
                                <div className="message-avatar">
                                    {msg.sender.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="message-bubble">
                                {msg.type === 'received' && (
                                    <div className="message-sender">{msg.sender}</div>
                                )}
                                <p>{msg.text}</p>
                                <span className="message-time">{msg.time}</span>
                            </div>
                        </div>
                    ))
                )}
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
                <button className="btn-send" onClick={handleSend} disabled={!input.trim()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </section>
    );
}
