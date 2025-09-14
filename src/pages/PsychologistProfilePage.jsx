// src/pages/PsychologistProfilePage.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';

function PsychologistProfilePage() {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get('/professionals/profile/');
                setProfile(response.data);
            } catch (err) {
                setError('No se pudo cargar tu perfil profesional.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Usamos .put() para actualizar el perfil completo
            await apiClient.put('/professionals/profile/', profile);
            alert('Perfil actualizado con éxito.');
        } catch (err) {
            alert('Hubo un error al guardar tu perfil.');
        }
    };

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="main-content">
            <h1 className="page-title">Mi Perfil Profesional</h1>
            <form onSubmit={handleSubmit} className="professional-card">
                <div className="input-group">
                    <label>Número de Licencia</label>
                    <input type="text" name="license_number" value={profile.license_number || ''} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Biografía</label>
                    <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows="5"></textarea>
                </div>
                <div className="input-group">
                    <label>Formación Académica</label>
                    <textarea name="education" value={profile.education || ''} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="input-group">
                    <label>Años de Experiencia</label>
                    <input type="number" name="experience_years" value={profile.experience_years || 0} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Tarifa por Consulta (Bs.)</label>
                    <input type="number" step="0.01" name="consultation_fee" value={profile.consultation_fee || 0} onChange={handleChange} />
                </div>
                 <div className="input-group">
                    <label>Ciudad</label>
                    <input type="text" name="city" value={profile.city || ''} onChange={handleChange} />
                </div>
                <button type="submit" className="btn-primary">Guardar Perfil</button>
            </form>
        </div>
    );
}

export default PsychologistProfilePage;