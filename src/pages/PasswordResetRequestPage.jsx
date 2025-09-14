// src/pages/PasswordResetRequestPage.jsx

import { useState } from 'react';
import apiClient from '../api';
import { Link } from 'react-router-dom';
import './Auth.css';

function PasswordResetRequestPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await apiClient.post('/auth/password-reset/', { email });
            setMessage('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.');
        } catch (err) {
            setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">🔑 Recuperar Contraseña</h2>
                {message ? (
                    <p style={{ color: 'green' }}>{message}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p style={{ color: '#555', marginBottom: '1rem' }}>
                            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                        </p>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Enviar Instrucciones</button>
                    </form>
                )}
                {error && <p className="error">{error}</p>}
                <p className="redirect">
                    <Link to="/login">Volver a Iniciar Sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default PasswordResetRequestPage;    