// src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api'; // Usamos nuestro api helper

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Efecto para cargar los datos del perfil del usuario
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get('/users/profile/');
                setProfileData(response.data);
            } catch (err) {
                setError('No se pudo cargar tu perfil.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Función para manejar los cambios en el formulario
    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    // Función para guardar los cambios
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put('/users/profile/', profileData);
            alert('¡Perfil actualizado con éxito!');
        } catch (err) {
            alert('Hubo un error al actualizar tu perfil.');
        }
    };

    if (loading) return <p>Cargando tu perfil...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="main-content">
            <h1 className="page-title">Tu Perfil Personal</h1>
            <form onSubmit={handleSubmit} className="professional-card">
                <div className="input-group">
                    <label>Nombre</label>
                    <input type="text" name="first_name" value={profileData.first_name || ''} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Apellido</label>
                    <input type="text" name="last_name" value={profileData.last_name || ''} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Cédula de Identidad</label>
                    <input type="text" name="ci" value={profileData.ci || ''} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Teléfono</label>
                    <input type="text" name="phone" value={profileData.phone || ''} onChange={handleChange} />
                </div>
                 <div className="input-group">
                    <label>Fecha de Nacimiento</label>
                    <input type="date" name="date_of_birth" value={profileData.date_of_birth || ''} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Dirección</label>
                    <textarea name="address" value={profileData.address || ''} onChange={handleChange} rows="3"></textarea>
                </div>
                
                <button type="submit" className="btn-primary">Guardar Cambios</button>
            </form>
        </div>
    );
}

export default ProfilePage;