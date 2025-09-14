// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loginResponse = await apiClient.post('/auth/login/', formData);
            localStorage.setItem('authToken', loginResponse.data.token);
            
            // Después del login, preguntamos quién es el usuario
            const profileResponse = await apiClient.get('/auth/profile/');
            const userType = profileResponse.data.user_type;
            
            // Guardamos el tipo de usuario para usarlo en las rutas protegidas
            localStorage.setItem('userType', userType);

            // Redirigimos según el tipo
            if (userType === 'professional') {
                navigate('/psychologist-dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">🔒 Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-primary">Entrar</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p className="redirect">
                    ¿Olvidaste tu contraseña? <Link to="/reset-password">Recupérala aquí</Link>
                </p>
                <p className="redirect">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;