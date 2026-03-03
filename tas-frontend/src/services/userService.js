const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const userService = {
    async listMembers() {
        const response = await fetch(`${apiUrl}/auth/users/members`, {
            headers: getHeaders()
        });
        if (!response.ok) {
            throw new Error('Error al listar miembros del grupo');
        }
        return response.json();
    }
};
