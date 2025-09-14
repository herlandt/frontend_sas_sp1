// src/pages/PasswordResetConfirmPage.jsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import './Auth.css';

function PasswordResetConfirmPage() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { uid, token } = useParams(); // Lee el uid y token de la URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setError('');
        setMessage('');

        try {
            await apiClient.post('/auth/password-reset-confirm/', {
                uid,
                token,
                new_password: password,
                new_password_confirm: passwordConfirm,
            });
            setMessage('¡Tu contraseña ha sido restablecida con éxito! Ahora puedes iniciar sesión.');
            setTimeout(() => navigate('/login'), 3000); // Redirige al login después de 3 segundos
        } catch (err) {
            setError('El enlace es inválido o ha expirado. Por favor, solicita un nuevo restablecimiento.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">🔒 Establecer Nueva Contraseña</h2>
                {message ? (
                    <p style={{ color: 'green' }}>{message}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Nueva Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Confirmar Nueva Contraseña</label>
                            <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary">Guardar Contraseña</button>
                    </form>
                )}
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default PasswordResetConfirmPage;