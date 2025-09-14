// src/pages/MyAppointmentsPage.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';
import { Link } from 'react-router-dom';

function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Esta función se mantiene igual: carga las citas al inicio
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

    useEffect(() => {
        fetchAppointments();
    }, []);

    // --- NUEVA FUNCIÓN ---
    // Manejador genérico para confirmar o cancelar una cita
    const handleUpdateStatus = async (apptId, newStatus) => {
        const actionText = newStatus === 'cancelled' ? 'cancelar' : 'confirmar';
        
        if (!window.confirm(`¿Estás seguro de que quieres ${actionText} esta cita?`)) {
            return;
        }

        try {
            // Hacemos el PATCH al backend para actualizar el estado
            // Asumimos que el backend devuelve la cita actualizada
            const response = await apiClient.patch(`/appointments/appointments/${apptId}/`, {
                status: newStatus
            });
            
            // Actualizamos el estado local de React para que la UI cambie al instante
            // sin tener que recargar la página.
            setAppointments(prevAppointments => 
                prevAppointments.map(appt => 
                    appt.id === apptId ? response.data : appt 
                )
            );
            alert(`¡Cita ${actionText}da exitosamente!`);

        } catch (err) {
            alert(`Error al ${actionText} la cita. Por favor, inténtalo de nuevo.`);
        }
    };
    // --- FIN DE NUEVA FUNCIÓN ---


    if (loading) return <p>Cargando tus citas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="main-content">
            <h1 className="page-title">Mis Citas</h1>
            
            {/* ---- SECCIÓN DE CITAS ACTUALIZADA ---- */}
            {appointments.length === 0 ? (
                <div className="empty-state">
                    <h3>Aún no tienes citas</h3>
                    <p>Puedes <Link to="/dashboard">explorar psicólogos</Link> para agendar tu primera sesión.</p>
                </div>
            ) : (
                <div className="appointments-list agenda-grid"> {/* Reutilizamos la clase del dashboard */}
                    {appointments.map(appt => (
                        <div key={appt.id} className="clinic-card"> {/* Reutilizamos la tarjeta de clínica */}
                            
                            <header className="card-top">
                                <div className="avatar">P</div> {/* Puedes cambiar esto si tienes las iniciales del psicólogo */}
                                <div className="card-id">
                                    <h3 className="patient-name">{appt.psychologist_name}</h3>
                                    {/* Usamos las 'pills' de estado que ya definiste */}
                                    <span className={`pill pill-${appt.status}`}>{appt.status_display}</span>
                                </div>
                            </header>

                            <div className="card-info">
                                <div className="kv"><span>Fecha</span><strong>{appt.appointment_date}</strong></div>
                                <div className="kv"><span>Hora</span><strong>{appt.start_time}</strong></div>
                            </div>
                            
                            {appt.status === 'confirmed' && appt.meeting_link && (
                                <div className="kv link-row">
                                    <span>Enlace</span>
                                    <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer" className="session-link">
                                      Unirse a videollamada
                                    </a>
                                </div>
                            )}
                            
                            {/* --- NUEVO: CONTENEDOR DE ACCIONES CONDICIONALES --- */}
                            <footer className="card-actions">

                                {/* 1. Acciones para citas PENDIENTES */}
                                {appt.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleUpdateStatus(appt.id, 'confirmed')} className="btn-primary">
                                            Confirmar
                                        </button>
                                        <Link to={`/chat/${appt.id}`} className="btn-secondary">Chat</Link>
                                        <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} className="btn-danger">
                                            Cancelar
                                        </button>
                                    </>
                                )}

                                {/* 2. Acciones para citas CONFIRMADAS */}
                                {appt.status === 'confirmed' && (
                                    <>
                                        <Link to={`/chat/${appt.id}`} className="btn-primary">Ir al Chat</Link>
                                        <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} className="btn-danger">
                                            Cancelar Cita
                                        </button>
                                    </>
                                )}

                                {/* 3. Sin acciones si está completada o cancelada */}
                                {['completed', 'cancelled'].includes(appt.status) && (
                                    <em className="muted">Cita {appt.status_display.toLowerCase()}</em>
                                )}
                            </footer>
                        </div>
                    ))}
                </div>
            )}
            {/* ---- FIN DE SECCIÓN ACTUALIZADA ---- */}
        </div>
    );
}

export default MyAppointmentsPage;