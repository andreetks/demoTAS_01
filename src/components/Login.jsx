import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simular delay de red
        setTimeout(() => {
            setLoading(false);
            onLogin();
        }, 800);
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
                    <div className="input-group">
                        <label htmlFor="email">Correo Institucional</label>
                        <input type="text" id="email" placeholder="estudiante@uni.edu" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Cargando...' : 'Ingresar'}
                    </button>
                    <p className="forgot-password">¿Olvidaste tu contraseña?</p>
                </form>
            </div>
        </section>
    );
}
