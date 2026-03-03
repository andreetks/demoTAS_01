import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [groupId, setGroupId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const endpoint = isRegister ? '/auth/register' : '/auth/login';

            const payload = isRegister
                ? { name, email, password, groupId: groupId ? groupId : undefined }
                : { email, password };

            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || (isRegister ? 'Error en el registro. Quizás el correo ya esté en uso.' : 'Credenciales inválidas'));
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            onLogin();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="login-screen" className="screen active">
            <div className="login-content">
                <div className="logo-container">
                    <div className="logo-icon">U</div>
                    <h1>UNICOLLAB</h1>
                    <p>Conecta, Colabora, Crea.</p>
                </div>

                <form id="login-form" onSubmit={handleSubmit}>
                    {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    {isRegister && (
                        <div className="input-group">
                            <label htmlFor="name">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={isRegister}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email">Correo Institucional</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="estudiante@uni.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {isRegister && (
                        <div className="input-group">
                            <label htmlFor="groupId">ID de Grupo (Opcional)</label>
                            <input
                                type="text"
                                id="groupId"
                                placeholder="ID de tu proyecto"
                                value={groupId}
                                onChange={(e) => setGroupId(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Ingresar')}
                    </button>

                    <p className="forgot-password" onClick={() => {
                        setIsRegister(!isRegister);
                        setError('');
                    }} style={{ cursor: 'pointer', marginTop: '15px' }}>
                        {isRegister ? '¿Ya tienes cuenta? Inicia sesión aquí' : 'Nuevos usuarios: Crear una cuenta'}
                    </p>
                </form>
            </div>
        </section>
    );
}
