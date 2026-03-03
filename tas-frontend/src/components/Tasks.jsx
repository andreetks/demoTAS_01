import React, { useState } from 'react';

export default function Tasks({ groupName, onBack }) {
    // Tareas específicas por grupo
    const tasksByGroup = {
        'Taller de Aplicaciones': [
            { id: 1, name: 'Diseñar wireframes de UI', responsible: 'Juan Soto', status: 'completed' },
            { id: 2, name: 'Implementar login con Firebase', responsible: 'María López', status: 'in-progress' },
            { id: 3, name: 'Crear componentes React', responsible: 'Alex García', status: 'in-progress' },
            { id: 4, name: 'Pruebas de integración', responsible: 'Ana Torres', status: 'pending' },
        ],
        'Proyecto Final': [
            { id: 1, name: 'Revisión de literatura', responsible: 'Diana Paz', status: 'completed' },
            { id: 2, name: 'Desarrollo del marco teórico', responsible: 'Carlos Ruiz', status: 'completed' },
            { id: 3, name: 'Implementación del prototipo', responsible: 'Alex García', status: 'in-progress' },
            { id: 4, name: 'Redactar conclusiones', responsible: 'Diana Paz', status: 'pending' },
            { id: 5, name: 'Preparar presentación final', responsible: 'Carlos Ruiz', status: 'pending' },
        ],
        'Matemáticas III': [
            { id: 1, name: 'Ejercicios Cap. 5 - Integrales', responsible: 'Todos', status: 'completed' },
            { id: 2, name: 'Resolver práctica de derivadas', responsible: 'Alex García', status: 'in-progress' },
            { id: 3, name: 'Preparar exposición de Teorema de Green', responsible: 'Luis Mendez', status: 'pending' },
            { id: 4, name: 'Entregar tarea de series', responsible: 'Sara Vega', status: 'pending' },
        ]
    };

    const defaultTasks = [
        { id: 'd-1', name: 'Organizar primera reunión', responsible: 'Coordinador', status: 'pending' },
        { id: 'd-2', name: 'Definir objetivos del proyecto', responsible: 'Todos', status: 'pending' },
        { id: 'd-3', name: 'Reparto de responsabilidades', responsible: 'Todos', status: 'pending' },
    ];

    const [tasks, setTasks] = useState(tasksByGroup[groupName] || defaultTasks);

    const statusLabels = {
        'pending': 'Pendiente',
        'in-progress': 'En Progreso',
        'completed': 'Completado'
    };

    const toggleStatus = (taskId) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const statusOrder = ['pending', 'in-progress', 'completed'];
                const currentIndex = statusOrder.indexOf(task.status);
                const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                return { ...task, status: nextStatus };
            }
            return task;
        }));
    };

    return (
        <section id="tasks-screen" className="screen active">
            <header className="chat-header">
                <button className="btn-back" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div className="chat-header-info">
                    <h3>Tareas</h3>
                    <p>{groupName}</p>
                </div>
            </header>

            <div className="tasks-content">
                <div className="tasks-list">
                    {tasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <div className="task-info">
                                <h4 className="task-name">{task.name}</h4>
                                <p className="task-responsible">👤 {task.responsible}</p>
                            </div>
                            <button
                                className={`status-badge status-${task.status}`}
                                onClick={() => toggleStatus(task.id)}
                            >
                                {statusLabels[task.status]}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
