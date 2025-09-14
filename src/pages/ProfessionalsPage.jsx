// src/pages/ProfessionalsPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api'; // Usa nuestro api helper

function ProfessionalsPage() {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const response = await apiClient.get('/professionals/');
                setProfessionals(response.data.professionals);
            } catch (err) {
                setError('No se pudieron cargar los profesionales.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfessionals();
    }, []);

    if (loading) return <p>Cargando profesionales...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (professionals.length === 0) return <p>No hay psicólogos disponibles.</p>;

    return (
        <div>
            <h1 className="page-title">Psicólogos Disponibles</h1>
            <div className="professionals-list">
                {professionals.map(prof => (
                    <Link to={`/professional/${prof.id}`} key={prof.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="professional-card">
                            <h3>{prof.full_name}</h3>
                            <p><strong>Especialidades:</strong> {prof.specializations.map(s => s.name).join(', ')}</p>
                            <p><strong>Años de experiencia:</strong> {prof.experience_years}</p>
                            <p><strong>Tarifa:</strong> Bs. {prof.consultation_fee}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ProfessionalsPage;