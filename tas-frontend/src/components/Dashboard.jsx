import React from 'react';

export default function Dashboard({ onOpenChat, onLogout }) {
    const groups = [
        { id: 1, name: 'Taller de Aplicaciones', lastMsg: '¿A qué hora nos...?', time: '10:30', color: 'color-1' },
        { id: 2, name: 'Proyecto Final', lastMsg: 'Archivo adjunto: Entrega.pdf', time: 'Ayer', color: 'color-2' },
        { id: 3, name: 'Matemáticas III', lastMsg: 'Alex: Gracias!', time: 'Ayer', color: 'color-3' },
    ];

    return (
        <section id="dashboard-screen" className="screen active">
            <header className="main-header">
                <div className="header-text">
                    <h2>Hola, Alex 👋</h2>
                    <p>Tus grupos académicos</p>
                </div>
                <div className="user-avatar-small">A</div>
            </header>

            <div className="groups-list">
                {groups.map((group) => (
                    <div key={group.id} className="group-card" onClick={() => onOpenChat(group.name)}>
                        <div className={`group-icon ${group.color}`}>
                            {group.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="group-info">
                            <h3>{group.name}</h3>
                            <p>{group.lastMsg}</p>
                        </div>
                        <div className="group-time">{group.time}</div>
                    </div>
                ))}
            </div>

            <button className="fab-create" title="Crear Grupo">
                +
            </button>

            <button
                title="Cerrar sesión"
                onClick={onLogout}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px', /* Al lado izquierdo para no tapar el botón de crear grupo a la derecha */
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px', /* Cuadrado con bordes suaves */
                    backgroundColor: '#ff4757',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                {'🚪'}
            </button>
        </section>
    );
}
