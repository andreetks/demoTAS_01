import React, { useState } from 'react';
import { projectService } from '../services/projectService';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const newProject = await projectService.createProject({
                name,
                description
            });
            onProjectCreated(newProject);
            setName('');
            setDescription('');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Crear Nuevo Proyecto</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="projectName">Nombre del Proyecto</label>
                        <input
                            type="text"
                            id="projectName"
                            placeholder="Ej. Taller de Aplicaciones"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="projectDesc">Descripción</label>
                        <textarea
                            id="projectDesc"
                            placeholder="Breve descripción del proyecto"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                background: 'var(--dark-bg)',
                                minHeight: '100px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Proyecto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
