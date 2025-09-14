// src/pages/PsychologistAvailabilityPage.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';

function PsychologistAvailabilityPage() {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const weekdays = [
        { id: 0, name: 'Lunes' }, { id: 1, name: 'Martes' },
        { id: 2, name: 'Miércoles' }, { id: 3, name: 'Jueves' },
        { id: 4, name: 'Viernes' }, { id: 5, name: 'Sábado' },
        { id: 6, name: 'Domingo' }
    ];

    const fetchAvailability = async () => {
        try {
            const response = await apiClient.get('/appointments/availability/');
            setAvailability(response.data.results);
        } catch (err) {
            setError('No se pudo cargar tu disponibilidad.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, []);
// src/pages/PsychologistAvailabilityPage.jsx

// ... (toda la lógica de useState, useEffect, etc., se queda igual)

    const handleAddTimeSlot = async (dayId) => {
        const startTime = prompt('Ingresa la hora de inicio (formato HH:MM):', '09:00');
        const endTime = prompt('Ingresa la hora de fin (formato HH:MM):', '12:00');

        if (startTime && endTime) {
            try {
                await apiClient.post('/appointments/availability/', {
                    weekday: dayId,
                    start_time: startTime,
                    end_time: endTime,
                });
                alert('Horario añadido con éxito.');
                fetchAvailability();
            } catch (err) {
                // --- MEJORA DEL MANEJO DE ERRORES ---
                let errorMessage = 'Error al añadir el horario.';
                if (err.response && err.response.data) {
                    // Si el backend envía un error específico, lo mostramos
                    const errorData = err.response.data;
                    errorMessage = Object.values(errorData).join(' ');
                }
                alert(errorMessage);
                // ------------------------------------
            }
        }
    };

// ... (el resto del componente se queda igual)

    const handleDeleteTimeSlot = async (slotId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
            try {
                await apiClient.delete(`/appointments/availability/${slotId}/`);
                alert('Horario eliminado.');
                fetchAvailability(); // Recargar la lista
            } catch (err) {
                alert('No se pudo eliminar el horario.');
            }
        }
    };

    if (loading) return <p>Cargando tu disponibilidad...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="main-content">
            <h1 className="page-title">Gestionar mi Disponibilidad Semanal</h1>
            <p>Define los bloques de tiempo en los que estarás disponible para atender citas.</p>
            <div className="availability-grid">
                {weekdays.map(day => (
                    <div key={day.id} className="professional-card">
                        <h3>{day.name}</h3>
                        {availability.filter(slot => slot.weekday === day.id).map(slot => (
                            <div key={slot.id} className="time-slot-item">
                                <span>{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</span>
                                <button onClick={() => handleDeleteTimeSlot(slot.id)}>&times;</button>
                            </div>
                        ))}
                        <button onClick={() => handleAddTimeSlot(day.id)} className="add-slot-btn">+ Añadir bloque</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PsychologistAvailabilityPage;