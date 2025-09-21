// src/pages/MyAppointmentsPage.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';
import { Link } from 'react-router-dom';

// --- Constantes de Clases de Tailwind ---
// (Puedes moverlas a main.jsx si quieres usarlas globalmente)
const btnPrimary = "px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm text-center";
const btnSecondary = "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-sm text-center";
const btnDestructive = "px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:bg-destructive/90 transition-colors text-sm text-center";

// Helper para las "pills" de estado
const getPillClasses = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-muted text-muted-foreground';
  }
};


function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Tu lógica de JS (fetchAppointments, handleUpdateStatus) no cambia ---
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

    const handleUpdateStatus = async (apptId, newStatus) => {
        const actionText = newStatus === 'cancelled' ? 'cancelar' : 'confirmar';
        
        if (!window.confirm(`¿Estás seguro de que quieres ${actionText} esta cita?`)) {
            return;
        }

        try {
            const response = await apiClient.patch(`/appointments/appointments/${apptId}/`, {
                status: newStatus
            });
            
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
    // --- Fin de la lógica de JS ---


    if (loading) return <p className="text-center text-muted-foreground">Cargando tus citas...</p>;
    if (error) return <p className="text-center text-destructive">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-8">Mis Citas</h1>
            
            {appointments.length === 0 ? (
                <div className="bg-card text-card-foreground p-12 rounded-xl text-center shadow-lg">
                    <h3 className="text-2xl font-semibold text-primary mb-2">Aún no tienes citas</h3>
                    <p className="text-muted-foreground">
                        Puedes <Link to="/dashboard" className="font-medium text-primary hover:underline">explorar psicólogos</Link> para agendar tu primera sesión.
                    </p>
                </div>
            ) : (
                // Reemplazamos .agenda-grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map(appt => (
                        // Reemplazamos .clinic-card
                        <div key={appt.id} className="bg-background border border-border p-5 rounded-xl shadow flex flex-col gap-4">
                            
                            {/* Reemplazamos .card-top */}
                            <header className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                                  {appt.psychologist_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-primary">{appt.psychologist_name}</h3>
                                    {/* Reemplazamos .pill */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPillClasses(appt.status)}`}>
                                        {appt.status_display}
                                    </span>
                                </div>
                            </header>

                            {/* Reemplazamos .card-info y .kv */}
                            <div className="border-t border-border pt-4 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Fecha</span>
                                    <strong className="text-foreground">{appt.appointment_date}</strong>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Hora</span>
                                    <strong className="text-foreground">{appt.start_time}</strong>
                                </div>
                            
                                {appt.status === 'confirmed' && appt.meeting_link && (
                                    <div className="flex justify-between items-center text-sm pt-2 mt-2 border-t border-border/50">
                                        <span className="text-muted-foreground">Enlace</span>
                                        <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                                          Unirse a videollamada
                                        </a>
                                    </div>
                                )}
                            </div>
                            
                            {/* Reemplazamos .card-actions */}
                            <footer className="flex flex-col sm:flex-row gap-2 justify-end mt-auto pt-4 border-t border-border">
                                {/* 1. Acciones para citas PENDIENTES */}
                                {appt.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleUpdateStatus(appt.id, 'confirmed')} className={btnPrimary}>
                                            Confirmar
                                        </button>
                                        <Link to={`/chat/${appt.id}`} className={btnSecondary}>Chat</Link>
                                        <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} className={btnDestructive}>
                                            Cancelar
                                        </button>
                                    </>
                                )}

                                {/* 2. Acciones para citas CONFIRMADAS */}
                                {appt.status === 'confirmed' && (
                                    <>
                                        <Link to={`/chat/${appt.id}`} className={btnPrimary}>Ir al Chat</Link>
                                        <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} className={btnDestructive}>
                                            Cancelar Cita
                                        </button>
                                    </>
                                )}

                                {/* 3. Sin acciones */}
                                {['completed', 'cancelled'].includes(appt.status) && (
                                    <em className="text-muted-foreground text-sm text-right w-full">Cita {appt.status_display.toLowerCase()}</em>
                                )}
                            </footer>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyAppointmentsPage;