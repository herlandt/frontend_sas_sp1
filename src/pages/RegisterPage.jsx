// src/pages/RegisterPage.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function RegisterPage() {
    // Esta es la lógica que faltaba
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.password_confirm) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
            navigate('/login');
        } catch (err) {
            const errorData = err.response.data;
            const errorMessages = Object.keys(errorData).map(key => `${key}: ${errorData[key].join(', ')}`).join(' | ');
            setError(errorMessages || 'Ocurrió un error en el registro.');
        }
    };

    // Tu JSX (que está perfecto)
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">✨ Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Nombre de Usuario</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Nombre</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Apellido</label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Confirmar Contraseña</label>
                        <input type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-primary">Registrarse</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p className="redirect">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;