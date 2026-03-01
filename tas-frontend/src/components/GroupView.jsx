import React from 'react';

export default function GroupView({ groupName, onBack, onOpenTasks, onOpenDocument }) {
    // Datos específicos por grupo
    const groupData = {
        'Taller de Aplicaciones': {
            members: [
                { id: 1, name: 'Alex García', role: 'Líder del equipo', avatar: 'A' },
                { id: 2, name: 'María López', role: 'Desarrolladora', avatar: 'M' },
                { id: 3, name: 'Juan Soto', role: 'Diseñador UI', avatar: 'J' },
                { id: 4, name: 'Ana Torres', role: 'QA Tester', avatar: 'AT' },
            ],
            description: 'Desarrollo de aplicaciones móviles',
            materials: [
                { id: 1, name: 'Guía de React Native', type: 'pdf', icon: '📕' },
                { id: 2, name: 'Plantilla del Proyecto', type: 'zip', icon: '📦' },
                { id: 3, name: 'Video: Intro a Firebase', type: 'video', icon: '🎬' },
            ],
            announcements: [
                { id: 1, text: 'Entrega del sprint 2: Viernes 24 Ene', urgent: true },
                { id: 2, text: 'Reunión de equipo: Miércoles 3pm', urgent: false },
            ]
        },
        'Proyecto Final': {
            members: [
                { id: 1, name: 'Alex García', role: 'Coordinador', avatar: 'A' },
                { id: 2, name: 'Carlos Ruiz', role: 'Investigador', avatar: 'C' },
                { id: 3, name: 'Diana Paz', role: 'Redactora', avatar: 'D' },
            ],
            description: 'Tesis: Sistema de Gestión Académica',
            materials: [
                { id: 1, name: 'Formato APA 7ma Ed.', type: 'pdf', icon: '📕' },
                { id: 2, name: 'Plantilla de Tesis', type: 'doc', icon: '📄' },
                { id: 3, name: 'Bibliografía recomendada', type: 'pdf', icon: '📚' },
            ],
            announcements: [
                { id: 1, text: 'Revisión con asesor: Lunes 27 Ene', urgent: true },
                { id: 2, text: 'Avance Cap. 3 para la próxima semana', urgent: false },
            ]
        },
        'Matemáticas III': {
            members: [
                { id: 1, name: 'Prof. Rodríguez', role: 'Docente', avatar: 'PR' },
                { id: 2, name: 'Alex García', role: 'Estudiante', avatar: 'A' },
                { id: 3, name: 'Luis Mendez', role: 'Estudiante', avatar: 'L' },
                { id: 4, name: 'Sara Vega', role: 'Estudiante', avatar: 'S' },
                { id: 5, name: 'Pedro Castillo', role: 'Estudiante', avatar: 'PC' },
            ],
            description: 'Cálculo Multivariable - Sección A',
            materials: [
                { id: 1, name: 'Cálculo de Stewart - Cap. 15', type: 'pdf', icon: '📕' },
                { id: 2, name: 'Formulario de Integrales', type: 'pdf', icon: '📋' },
                { id: 3, name: 'Ejercicios Resueltos Sem. 5', type: 'pdf', icon: '📝' },
                { id: 4, name: 'Video: Integrales Dobles', type: 'video', icon: '🎬' },
            ],
            announcements: [
                { id: 1, text: '⚠️ Examen Parcial: Sábado 25 Ene - 9am', urgent: true },
                { id: 2, text: 'Tarea 5 entrega: Jueves 23 Ene', urgent: true },
                { id: 3, text: 'Horario de consultas: Mar y Jue 4-6pm', urgent: false },
            ]
        }
    };

    const currentGroup = groupData[groupName] || groupData['Taller de Aplicaciones'];
    const members = currentGroup.members;
    const materials = currentGroup.materials || [];
    const announcements = currentGroup.announcements || [];

    return (
        <section id="group-view-screen" className="screen active">
            <header className="chat-header">
                <button className="btn-back" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div className="chat-header-info">
                    <h3>{groupName}</h3>
                    <p>{currentGroup.description}</p>
                </div>
                <div className="more-options">•••</div>
            </header>

            <div className="group-view-content">
                {/* Accesos Rápidos */}
                <div className="quick-access-section">
                    <h4>Accesos Rápidos</h4>
                    <div className="quick-access-buttons">
                        <button className="quick-access-btn tasks-btn" onClick={onOpenTasks}>
                            <span className="quick-icon">📋</span>
                            <span>Tareas</span>
                        </button>
                        <button className="quick-access-btn doc-btn" onClick={onOpenDocument}>
                            <span className="quick-icon">📄</span>
                            <span>Documento</span>
                        </button>
                    </div>
                </div>

                {/* Tablón de Anuncios / Pendientes */}
                {announcements.length > 0 && (
                    <div className="announcements-section">
                        <h4>📌 Pendientes y Anuncios</h4>
                        <div className="announcements-list">
                            {announcements.map((item) => (
                                <div key={item.id} className={`announcement-card ${item.urgent ? 'urgent' : ''}`}>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Materiales del Curso */}
                {materials.length > 0 && (
                    <div className="materials-section">
                        <h4>📚 Materiales</h4>
                        <div className="materials-list">
                            {materials.map((material) => (
                                <div key={material.id} className="material-card">
                                    <span className="material-icon">{material.icon}</span>
                                    <span className="material-name">{material.name}</span>
                                    <span className="material-type">{material.type.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lista de Miembros */}
                <div className="members-section">
                    <h4>👥 Miembros ({members.length})</h4>
                    <div className="members-list">
                        {members.map((member) => (
                            <div key={member.id} className="member-card">
                                <div className="member-avatar">{member.avatar}</div>
                                <div className="member-info">
                                    <span className="member-name">{member.name}</span>
                                    <span className="member-role">{member.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
