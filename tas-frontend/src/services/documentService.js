export const documentService = {
    listDocuments: async (projectId) => {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const url = projectId
            ? `${apiUrl}/documents?projectId=${projectId}`
            : `${apiUrl}/documents`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al listar documentos');
        }

        return response.json();
    },

    createDocument: async (data) => {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const response = await fetch(`${apiUrl}/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error al crear documento');
        }

        return response.json();
    }
};
