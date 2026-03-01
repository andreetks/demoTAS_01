import React, { useState } from 'react';

export default function CollaborativeDoc({ groupName, onBack }) {
    // Documentos y usuarios por grupo
    const docsByGroup = {
        'Taller de Aplicaciones': {
            content: `# UniCollab - Documentación del Proyecto

## Descripción
Aplicación móvil para colaboración académica entre estudiantes universitarios.

## Tecnologías
- React Native / Flutter
- Firebase Authentication
- Cloud Firestore

## Pendientes
- [ ] Finalizar diseño de pantallas
- [ ] Conectar API de notificaciones
- [ ] Optimizar rendimiento`,
            activeUsers: [
                { id: 1, name: 'Alex', color: '#3b82f6' },
                { id: 2, name: 'María', color: '#8b5cf6' },
            ]
        },
        'Proyecto Final': {
            content: `# Tesis: Sistema de Gestión Académica

## Capítulo 1: Introducción
Este proyecto tiene como objetivo desarrollar un sistema integral...

## Capítulo 2: Marco Teórico
2.1 Antecedentes
2.2 Bases Teóricas
2.3 Definición de Términos

## Capítulo 3: Metodología
Enfoque de investigación mixto...

## Referencias
- García, A. (2024). Sistemas de información...`,
            activeUsers: [
                { id: 1, name: 'Diana', color: '#10b981' },
                { id: 2, name: 'Carlos', color: '#f59e0b' },
            ]
        },
        'Matemáticas III': {
            content: `# Apuntes de Cálculo Multivariable

## Tema: Integrales Dobles

### Definición
∫∫_R f(x,y) dA

### Ejemplos resueltos
1. ∫∫ (x + y) dA donde R = [0,1] × [0,2]
   Solución: = 3

2. Calcular el volumen bajo z = x² + y²
   Usar coordenadas polares...

### Tarea para el viernes
- Ejercicios 5.1 al 5.10 del libro`,
            activeUsers: [
                { id: 1, name: 'Prof', color: '#ef4444' },
                { id: 2, name: 'Luis', color: '#6366f1' },
                { id: 3, name: 'Sara', color: '#ec4899' },
            ]
        }
    };

    const currentDoc = docsByGroup[groupName] || docsByGroup['Taller de Aplicaciones'];
    const [content, setContent] = useState(currentDoc.content);
    const activeUsers = currentDoc.activeUsers;

    return (
        <section id="document-screen" className="screen active">
            <header className="chat-header">
                <button className="btn-back" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div className="chat-header-info">
                    <h3>Documento</h3>
                    <p>{groupName}</p>
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
                    {activeUsers.map((user) => (
                        <span key={user.id} className="active-user-tag" style={{ borderColor: user.color }}>
                            <span className="user-dot" style={{ backgroundColor: user.color }}></span>
                            {user.name}
                        </span>
                    ))}
                </div>
                <textarea
                    className="document-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Comienza a escribir..."
                />
            </div>
        </section>
    );
}
