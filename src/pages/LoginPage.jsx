// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
// import './Auth.css'; // <-- ¡Ya no se necesita!

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
            
            const profileResponse = await apiClient.get('/auth/profile/');
            const userType = profileResponse.data.user_type;
            
            localStorage.setItem('userType', userType);

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
        <div className="flex justify-center items-center min-h-screen p-4 sm:p-8 bg-background">
            <div className="bg-card text-card-foreground p-8 sm:p-12 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-primary mb-8">🔒 Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full p-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                    >
                        Entrar
                    </button>
                </form>
                
                {error && (
                    <div className="mt-4 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
                        <span className="font-medium">⚠️ {error}</span>
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    ¿Olvidaste tu contraseña? <Link to="/reset-password" className="font-medium text-primary hover:underline">Recupérala aquí</Link>
                </p>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    ¿No tienes cuenta? <Link to="/register" className="font-medium text-primary hover:underline">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;