import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';

export default function GroupView({ projectId, groupName, onBack, onOpenTasks, onOpenDocument, onOpenProjectChat }) {
    const [projectDocs, setProjectDocs] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            if (!projectId) return;
            try {
                const docs = await documentService.listDocuments(projectId);
                setProjectDocs(docs);
            } catch (err) {
                console.error('Error fetching project documents:', err);
            } finally {
                setLoadingDocs(false);
            }
        };
        fetchDocs();
    }, [projectId]);

    const groupData = {
        'Taller de Aplicaciones': {
            description: 'Desarrollo de aplicaciones móviles',
            materials: [
                { id: 'm1', name: 'Guía de React Native', type: 'pdf', icon: '📕' },
                { id: 'm2', name: 'Plantilla del Proyecto', type: 'zip', icon: '📦' },
                { id: 'm3', name: 'Video: Intro a Firebase', type: 'video', icon: '🎬' },
            ],
            announcements: [
                { id: 'a1', text: 'Entrega del sprint 2: Viernes 24 Ene', urgent: true },
                { id: 'a2', text: 'Reunión de equipo: Miércoles 3pm', urgent: false },
            ]
        },
        'Proyecto Final': {
            description: 'Tesis: Sistema de Gestión Académica',
            materials: [
                { id: 'm1', name: 'Formato APA 7ma Ed.', type: 'pdf', icon: '📕' },
                { id: 'm2', name: 'Plantilla de Tesis', type: 'doc', icon: '📄' },
                { id: 'm3', name: 'Bibliografía recomendada', type: 'pdf', icon: '📚' },
            ],
            announcements: [
                { id: 'a1', text: 'Revisión con asesor: Lunes 27 Ene', urgent: true },
                { id: 'a2', text: 'Avance Cap. 3 para la próxima semana', urgent: false },
            ]
        },
        'Matemáticas III': {
            description: 'Cálculo Multivariable - Sección A',
            materials: [
                { id: 'm1', name: 'Cálculo de Stewart - Cap. 15', type: 'pdf', icon: '📕' },
                { id: 'm2', name: 'Formulario de Integrales', type: 'pdf', icon: '📋' },
                { id: 'm3', name: 'Ejercicios Resueltos Sem. 5', type: 'pdf', icon: '📝' },
                { id: 'm4', name: 'Video: Integrales Dobles', type: 'video', icon: '🎬' },
            ],
            announcements: [
                { id: 'a1', text: '⚠️ Examen Parcial: Sábado 25 Ene - 9am', urgent: true },
                { id: 'a2', text: 'Tarea 5 entrega: Jueves 23 Ene', urgent: true },
                { id: 'a3', text: 'Horario de consultas: Mar y Jue 4-6pm', urgent: false },
            ]
        }
    };

    // Default values if no mock data exists for this specific groupName
    const defaultInfo = {
        description: 'Proyecto colaborativo de este grupo',
        materials: [
            { id: 'd-m1', name: 'Guía General del Curso', type: 'pdf', icon: '📕' },
            { id: 'd-m2', name: 'Cronograma de actividades', type: 'doc', icon: '📝' },
        ],
        announcements: [
            { id: 'd-a1', text: 'Bienvenido al grupo. Coordina tus entregas aquí.', urgent: false },
        ]
    };

    const specificGroup = groupData[groupName] || defaultInfo;
    const announcements = specificGroup.announcements;

    // Combine mock materials with real project documents
    const combinedMaterials = [
        ...specificGroup.materials,
        ...projectDocs.map(doc => ({
            id: doc.id,
            name: doc.title,
            type: 'doc',
            icon: '📄'
        }))
    ];

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
                    <p>{specificGroup.description}</p>
                </div>
                <div className="more-options">•••</div>
            </header>

            <div className="group-view-content">
                <div className="quick-access-section">
                    <h4>Accesos Rápidos</h4>
                    <div className="quick-access-buttons" style={{ flexWrap: 'wrap' }}>
                        <button className="quick-access-btn tasks-btn" onClick={onOpenTasks}>
                            <span className="quick-icon">📋</span>
                            <span>Tareas</span>
                        </button>
                        <button className="quick-access-btn doc-btn" onClick={onOpenDocument}>
                            <span className="quick-icon">📄</span>
                            <span>Documento</span>
                        </button>
                        <button className="quick-access-btn chat-btn" onClick={onOpenProjectChat} style={{ borderLeft: '4px solid var(--primary-color)' }}>
                            <span className="quick-icon">💬</span>
                            <span>Chat</span>
                        </button>
                    </div>
                </div>

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

                <div className="materials-section">
                    <h4>📚 Materiales y Documentos</h4>
                    <div className="materials-list">
                        {loadingDocs && projectDocs.length === 0 && specificGroup.materials.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>Cargando materiales...</p>
                        ) : combinedMaterials.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>No hay materiales disponibles.</p>
                        ) : (
                            combinedMaterials.map((material) => (
                                <div key={material.id} className="material-card">
                                    <span className="material-icon">{material.icon}</span>
                                    <span className="material-name">{material.name}</span>
                                    <span className="material-type">{material.type.toUpperCase()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
