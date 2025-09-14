// src/pages/ProfessionalDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api';

function ProfessionalDetailPage() {
    const [professional, setProfessional] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams(); // <-- LÍNEA CLAVE QUE SOLUCIONA EL ERROR

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const profPromise = apiClient.get(`/professionals/${id}/`);
                const schedulePromise = apiClient.get(`/appointments/psychologist/${id}/schedule/`);
                
                const [profResponse, scheduleResponse] = await Promise.all([profPromise, schedulePromise]);

                setProfessional(profResponse.data);
                setSchedule(scheduleResponse.data);
            } catch (err) {
                setError('No se pudo cargar la información del profesional.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleBookAppointment = async (date, startTime) => {
        const confirmation = window.confirm(`¿Confirmas agendar una cita el ${date} a las ${startTime}?`);
        if (confirmation) {
            try {
           await apiClient.post('/appointments/appointments/', {
                    
                    // --- ESTE ES EL ARREGLO ---
                    // Antes enviabas 'id' (el ID del Perfil desde useParams)
                    // Ahora enviamos el ID de Usuario correcto que vino de la API.
                    psychologist: professional.user_id, 
                    // -------------------------

                    appointment_date: date,
                    start_time: startTime,
                });
                alert('¡Cita agendada exitosamente!');
                
                // Volvemos a cargar los datos para que el horario aparezca como "Ocupado"
                const scheduleResponse = await apiClient.get(`/appointments/psychologist/${id}/schedule/`);
                setSchedule(scheduleResponse.data);
            } catch (err) {
                alert('Error al agendar la cita. Es posible que el horario ya no esté disponible.');
            }
        }
    };

    if (loading) return <p>Cargando perfil y disponibilidad...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!professional) return <p>No hay datos para mostrar.</p>;

    return (
        <main className="main-content">
            <Link to="/dashboard">{"< Volver a la lista"}</Link>
            <hr />
            <div className="professional-card" style={{ marginTop: '2rem' }}>
                <h1>{professional.full_name}</h1>
                <p><strong>Biografía:</strong> {professional.bio}</p>
                <p><strong>Formación:</strong> {professional.education}</p>
                <p><strong>Especialidades:</strong> {professional.specializations.map(s => s.name).join(', ')}</p>
            </div>
            <div className="professional-card" style={{ marginTop: '2rem' }}>
                <h2 className="page-title">Disponibilidad de la Semana</h2>
                {schedule && schedule.schedule.map(day => (
                    <div key={day.date} className="day-schedule">
                        <h4>{day.day_name}, {day.date}</h4>
                        <div className="time-slots">
                            {day.is_available && day.time_slots.length > 0 ? (
                                day.time_slots.map(slot => (
                                    slot.is_available ? (
                                        <button key={slot.start_time} className="slot-button available" onClick={() => handleBookAppointment(day.date, slot.start_time)}>
                                            {slot.start_time}
                                        </button>
                                    ) : (
                                        <button key={slot.start_time} className="slot-button booked" disabled>
                                            Ocupado
                                        </button>
                                    )
                                ))
                            ) : (
                                <p>No hay horarios disponibles este día.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default ProfessionalDetailPage;