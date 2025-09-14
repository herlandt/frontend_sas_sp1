// src/pages/MyAppointmentsPage.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';
import { Link } from 'react-router-dom';

function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await apiClient.get('/appointments/appointments/');
                setAppointments(response.data.results);
            } catch (err) {
                setError('No se pudieron cargar tus citas.');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    if (loading) return <p>Cargando tus citas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="main-content">
            <h1 className="page-title">Mis Citas</h1>
            {appointments.length === 0 ? (
                <p>Aún no has agendado ninguna cita.</p>
            ) : (
                <div className="appointments-list">
                    {appointments.map(appt => (
                        <div key={appt.id} className="professional-card">
                            <p><strong>Psicólogo:</strong> {appt.psychologist_name}</p>
                            <p><strong>Fecha:</strong> {appt.appointment_date}</p>
                            <p><strong>Hora:</strong> {appt.start_time}</p>
                            <p><strong>Estado:</strong> <span className={`status-${appt.status}`}>{appt.status_display}</span></p>
                            {appt.status === 'confirmed' && appt.meeting_link && (
                                <p><strong>Enlace a la sesión:</strong> <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer">Unirse a la videollamada</a></p>
                            )}
                            
                            {/* --- ENLACE AÑADIDO AQUÍ --- */}
                            <Link 
                                to={`/chat/${appt.id}`} 
                                className="btn-primary" 
                                style={{textDecoration: 'none', marginTop: '1rem', display: 'inline-block'}}
                            >
                                Ir al Chat
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyAppointmentsPage;