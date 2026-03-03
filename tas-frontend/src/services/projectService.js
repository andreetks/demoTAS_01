const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const projectService = {
    async listProjects() {
        const response = await fetch(`${apiUrl}/projects`, {
            headers: getHeaders()
        });
        if (!response.ok) {
            throw new Error('Error al listar proyectos');
        }
        return response.json();
    },

    async createProject(projectData) {
        const response = await fetch(`${apiUrl}/projects`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Error al crear proyecto');
        }
        return response.json();
    }
};
