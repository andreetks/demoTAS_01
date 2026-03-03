import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { documentService } from '../services/documentService';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CollaborativeDoc({ projectId, groupName, onBack }) {
    const [documents, setDocuments] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [content, setContent] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showNewDocForm, setShowNewDocForm] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState('');
    const [error, setError] = useState('');
    const socketRef = useRef(null);
    const isRemoteUpdate = useRef(false);
    const saveTimeoutRef = useRef(null);
    const contentRef = useRef('');

    // Keep contentRef in sync with state
    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    // Load document list for this project
    useEffect(() => {
        loadDocuments();
    }, [projectId]);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const docs = await documentService.listDocuments(projectId);
            setDocuments(docs);
        } catch (err) {
            console.error('Error loading documents:', err);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    // Load document content via REST API when a document is selected
    useEffect(() => {
        if (!activeDoc) return;

        // Load content via REST
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/documents/${activeDoc.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((doc) => {
                const rawContent = doc.content;
                const textContent = typeof rawContent === 'object' && rawContent !== null && rawContent.text !== undefined
                    ? rawContent.text
                    : (typeof rawContent === 'string' ? rawContent : '');
                setContent(textContent);
                contentRef.current = textContent;
            })
            .catch((err) => console.error('Error loading document:', err));

        // Connect WebSocket for live sync only
        const socket = io(`${apiUrl}/documents`, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join_document', { documentId: activeDoc.id });
        });

        socket.on('content_updated', ({ content: newContent }) => {
            isRemoteUpdate.current = true;
            setContent(newContent);
            contentRef.current = newContent;
        });

        socket.on('user_joined', (user) => {
            setActiveUsers((prev) => {
                if (prev.find((u) => u.id === user.id)) return prev;
                return [...prev, user];
            });
        });

        socket.on('user_left', ({ userId }) => {
            setActiveUsers((prev) => prev.filter((u) => u.id !== userId));
        });

        return () => {
            if (socket.connected) {
                socket.emit('leave_document', { documentId: activeDoc.id });
            }
            socket.disconnect();
            socketRef.current = null;
        };
    }, [activeDoc]);

    // Handle local text changes
    const handleContentChange = useCallback((e) => {
        const newContent = e.target.value;
        setContent(newContent);
        contentRef.current = newContent;

        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        // Send update to other users via WebSocket
        if (socketRef.current && activeDoc) {
            socketRef.current.emit('update_content', {
                documentId: activeDoc.id,
                content: newContent,
            });
        }

        // Auto-save after 2 seconds of inactivity
        setSaved(false);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            saveToServer();
        }, 2000);
    }, [activeDoc]);

    // Save via REST API — always reads latest content from ref
    const saveToServer = useCallback(() => {
        if (!activeDoc) return;
        setSaving(true);
        setSaved(false);
        const token = localStorage.getItem('token');
        const currentContent = contentRef.current;

        fetch(`${apiUrl}/documents/${activeDoc.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content: { text: currentContent } }),
        })
            .then((res) => {
                setSaving(false);
                if (res.ok) {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 3000);
                } else {
                    console.error('Save failed with status:', res.status);
                }
            })
            .catch((err) => {
                console.error('Error saving document:', err);
                setSaving(false);
            });
    }, [activeDoc]);

    // Manual save
    const handleSave = useCallback(() => {
        saveToServer();
    }, [saveToServer]);

    // Create new document
    const handleCreateDocument = async () => {
        if (!newDocTitle.trim()) return;
        try {
            setError('');
            const newDoc = await documentService.createDocument({
                title: newDocTitle.trim(),
                content: { text: '' },
                projectId: projectId || undefined,
            });
            setDocuments((prev) => [...prev, newDoc]);
            setNewDocTitle('');
            setShowNewDocForm(false);
            setActiveDoc(newDoc);
        } catch (err) {
            setError('Error al crear el documento');
        }
    };

    // Go back to document list
    const handleBackToList = () => {
        // Save before leaving
        if (activeDoc && contentRef.current) {
            const token = localStorage.getItem('token');
            fetch(`${apiUrl}/documents/${activeDoc.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: { text: contentRef.current } }),
            }).catch(() => { });
        }
        setActiveDoc(null);
        setContent('');
        setActiveUsers([]);
        loadDocuments();
    };

    // ─── Document List View ─────────────────────────────
    if (!activeDoc) {
        return (
            <section id="document-screen" className="screen active">
                <header className="chat-header">
                    <button className="btn-back" onClick={onBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div className="chat-header-info">
                        <h3>Documentos</h3>
                        <p>{groupName || 'Proyecto'}</p>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                        onClick={() => setShowNewDocForm(true)}
                    >
                        + Nuevo
                    </button>
                </header>

                <div className="document-content" style={{ padding: '20px' }}>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    {showNewDocForm && (
                        <div style={{
                            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
                            padding: '16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                placeholder="Nombre del documento..."
                                value={newDocTitle}
                                onChange={(e) => setNewDocTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateDocument()}
                                style={{
                                    flex: 1, padding: '10px 14px', borderRadius: '8px',
                                    border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none'
                                }}
                                autoFocus
                            />
                            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }} onClick={handleCreateDocument}>Crear</button>
                            <button onClick={() => setShowNewDocForm(false)} style={{
                                padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px'
                            }}>✕</button>
                        </div>
                    )}

                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>Cargando documentos...</p>
                    ) : documents.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '60px' }}>
                            <p style={{ fontSize: '48px', marginBottom: '10px' }}>📄</p>
                            <p>No hay documentos todavía.</p>
                            <p>Crea uno nuevo para empezar a colaborar.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => setActiveDoc(doc)}
                                    style={{
                                        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
                                        padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                >
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>📝 {doc.title}</h4>
                                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                                            Modificado: {new Date(doc.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // ─── Document Editor View ───────────────────────────
    return (
        <section id="document-screen" className="screen active">
            <header className="chat-header">
                <button className="btn-back" onClick={handleBackToList}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div className="chat-header-info">
                    <h3>{activeDoc.title}</h3>
                    <p>{saving ? '💾 Guardando...' : saved ? '✅ Guardado!' : '📝 Editando'}</p>
                </div>
                <div className="active-users">
                    {activeUsers.map((user) => (
                        <div
                            key={user.id}
                            className="active-user-dot"
                            style={{ backgroundColor: user.color }}
                            title={`${user.name} editando`}
                        >
                            {user.name.charAt(0)}
                        </div>
                    ))}
                </div>
            </header>

            <div className="document-content">
                <div className="active-users-bar">
                    <span className="users-label">👥 Usuarios activos:</span>
                    {activeUsers.length === 0 ? (
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Solo tú</span>
                    ) : (
                        activeUsers.map((user) => (
                            <span key={user.id} className="active-user-tag" style={{ borderColor: user.color }}>
                                <span className="user-dot" style={{ backgroundColor: user.color }}></span>
                                {user.name}
                            </span>
                        ))
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            marginLeft: 'auto', padding: '6px 14px',
                            background: saving ? '#94a3b8' : saved ? '#10b981' : '#3b82f6',
                            color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '13px', fontWeight: '500', transition: 'background 0.2s',
                        }}
                    >
                        {saving ? '⏳ Guardando...' : saved ? '✅ Guardado!' : '💾 Guardar'}
                    </button>
                </div>
                <textarea
                    className="document-editor"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Comienza a escribir..."
                />
            </div>
        </section>
    );
}
