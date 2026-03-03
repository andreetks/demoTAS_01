import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import CreateProjectModal from './CreateProjectModal';

export default function Dashboard({ onOpenProject, onOpenPrivateChat, onLogout }) {
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projectsData, membersData] = await Promise.all([
                projectService.listProjects(),
                userService.listMembers()
            ]);
            setProjects(projectsData);
            setMembers(membersData);
            setError(null);
        } catch (err) {
            setError('No se pudo cargar la información');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProjectCreated = (newProject) => {
        setProjects([...projects, newProject]);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const colors = ['color-1', 'color-2', 'color-3'];

    return (
        <section id="dashboard-screen" className="screen active">
            <header className="main-header">
                <div className="header-text">
                    <h2>Panel Principal 👋</h2>
                    <p>Gestiona tus proyectos y mensajes</p>
                </div>
                <div className="user-avatar-small">U</div>
            </header>

            <div className="dashboard-content">
                <div className="section-header">
                    <h3>Proyectos</h3>
                </div>

                <div className="groups-list" style={{ flex: 'none', overflowY: 'visible', padding: '0', maxWidth: '100%' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>Cargando...</p>
                    ) : projects.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '15px' }}>
                            <p>No tienes proyectos vinculados.</p>
                        </div>
                    ) : (
                        projects.map((project, index) => (
                            <div key={project.id} className="group-card" onClick={() => onOpenProject(project)}>
                                <div className={`group-icon ${colors[index % colors.length]}`}>
                                    {getInitials(project.name)}
                                </div>
                                <div className="group-info">
                                    <h3>{project.name}</h3>
                                    <p>{project.description || 'Sin descripción'}</p>
                                </div>
                                <div className="group-time">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="section-header">
                    <h3>Mensajes Directos</h3>
                </div>

                <div className="members-list-container">
                    {!loading && members.map((member) => (
                        <div
                            key={member.id}
                            onClick={() => onOpenPrivateChat(member)}
                            className="member-dm-item"
                        >
                            <div className="member-dm-avatar">
                                {getInitials(member.name)}
                            </div>
                            <span className="member-dm-name">
                                {member.name.split(' ')[0]}
                            </span>
                        </div>
                    ))}
                    {!loading && members.length === 0 && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No hay otros miembros en tu grupo aún.</p>
                    )}
                </div>
            </div>

            <button
                className="fab-create"
                title="Crear Proyecto"
                onClick={() => setIsModalOpen(true)}
            >
                +
            </button>

            <button
                title="Cerrar sesión"
                onClick={onLogout}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px',
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

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </section>
    );
}
