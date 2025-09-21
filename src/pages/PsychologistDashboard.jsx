// src/pages/PsychologistDashboard.jsx

import { useState, useEffect, useMemo } from 'react';
import apiClient from '../api';
import Modal from '../components/Modal'; // Tu Modal refactorizado
import { Link } from 'react-router-dom';

// --- Constantes de Clases de Tailwind ---
const btnPrimary = "px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm";
const btnSecondary = "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-sm";
const btnGhost = "px-4 py-2 bg-transparent border border-secondary text-secondary rounded-lg font-semibold hover:bg-secondary/10 transition-colors";

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

function PsychologistDashboard() {
  // ---- Tu lógica de estado (no cambia) ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  const fetchAppointments = async () => { /* ...tu función no cambia... */ 
    try {
      const response = await apiClient.get('/appointments/appointments/');
      setAppointments(response.data.results);
    } catch (err) {
      setError('No se pudieron cargar tus citas.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchAppointments(); }, []);
  const handleOpenModal = (appointment) => { /* ...tu función no cambia... */ 
    setSelectedAppt(appointment);
    setMeetingLink(appointment.meeting_link || '');
    setIsModalOpen(true);
  };
  const handleCloseModal = () => { /* ...tu función no cambia... */ 
    setIsModalOpen(false);
    setSelectedAppt(null);
    setMeetingLink('');
  };
  const handleLinkSubmit = async (e) => { /* ...tu función no cambia... */ 
    e.preventDefault();
    if (!selectedAppt) return;
    try {
      await apiClient.patch(`/appointments/appointments/${selectedAppt.id}/`, {
        meeting_link: meetingLink,
      });
      alert('¡Enlace guardado con éxito!');
      handleCloseModal();
      fetchAppointments();
    } catch (err) {
      alert('No se pudo guardar el enlace.');
    }
  };
  const getInitials = (fullName = '') => { /* ...tu función no cambia... */ 
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  };
  const groupByDateLabel = (list) => { /* ...tu función no cambia... */ 
    const groups = {};
    for (const a of list) {
      const label = a.appointment_date; // YYYY-MM-DD
      if (!groups[label]) groups[label] = [];
      groups[label].push(a);
    }
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  };
  const filteredAppointments = useMemo(() => { /* ...tu función no cambia... */ 
    return appointments
      .filter(a => (statusFilter === 'all' ? true : a.status === statusFilter))
      .filter(a => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (a.patient_name || '').toLowerCase().includes(q)
          || (a.appointment_date || '').toLowerCase().includes(q)
          || (a.start_time || '').toLowerCase().includes(q);
      });
  }, [appointments, statusFilter, query]);
  const stats = useMemo(() => { /* ...tu función no cambia... */ 
    const total = appointments.length;
    const by = (s) => appointments.filter(a => a.status === s).length;
    return {
      total,
      pending: by('pending'),
      confirmed: by('confirmed'),
      cancelled: by('cancelled'),
      completed: by('completed'),
    };
  }, [appointments]);

  if (loading) return <p className="text-center text-muted-foreground">Cargando tus citas...</p>;
  if (error) return <p className="text-center text-destructive">{error}</p>;

  // --- AHORA VIENE EL JSX REFACTORIZADO ---
  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <header className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-primary">Agenda Clínica</h1>
            <p className="text-lg text-muted-foreground">Coordina tus sesiones con claridad y calma.</p>
          </div>
        </header>

        {/* Métricas */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
            <span className="text-sm text-muted-foreground">Total</span>
            <strong className="block text-2xl font-bold text-primary">{stats.total}</strong>
          </div>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
            <span className="text-sm text-muted-foreground">Pendientes</span>
            <strong className="block text-2xl font-bold text-yellow-600">{stats.pending}</strong>
          </div>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
            <span className="text-sm text-muted-foreground">Confirmadas</span>
            <strong className="block text-2xl font-bold text-green-600">{stats.confirmed}</strong>
          </div>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
            <span className="text-sm text-muted-foreground">Canceladas</span>
            <strong className="block text-2xl font-bold text-destructive">{stats.cancelled}</strong>
          </div>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
            <span className="text-sm text-muted-foreground">Completadas</span>
            <strong className="block text-2xl font-bold text-gray-600">{stats.completed}</strong>
          </div>
        </section>

        {/* Filtros y búsqueda */}
        <section className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all','pending','confirmed','cancelled','completed'].map(s => (
              <button
                key={s}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${statusFilter === s 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'Todas' :
                 s === 'pending' ? 'Pendientes' :
                 s === 'confirmed' ? 'Confirmadas' :
                 s === 'cancelled' ? 'Canceladas' : 'Completadas'}
              </button>
            ))}
          </div>
          <div className="md:w-1/3">
            <input
              type="text"
              placeholder="Buscar paciente, fecha u hora…"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </section>

        {/* Agenda agrupada por fecha */}
        <section className="flex flex-col gap-8">
          {filteredAppointments.length === 0 ? (
            <div className="bg-card text-center p-12 rounded-xl">
              <h3 className="text-xl font-semibold text-card-foreground">Sin resultados</h3>
              <p className="text-muted-foreground">Prueba otro filtro o término de búsqueda.</p>
            </div>
          ) : (
            groupByDateLabel(filteredAppointments).map(([date, items]) => (
              <div className="bg-card p-6 rounded-xl shadow-lg" key={date}>
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <span className="px-4 py-1 bg-secondary text-secondary-foreground rounded-full font-semibold">{date}</span>
                  <span className="text-muted-foreground font-medium">{items.length} {items.length > 1 ? 'citas' : 'cita'}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                  {items.map(appt => (
                    <article key={appt.id} className="bg-background border border-border p-5 rounded-xl shadow flex flex-col gap-4">
                      <header className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                          {getInitials(appt.patient_name)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">{appt.patient_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPillClasses(appt.status)}`}>
                            {appt.status_display}
                          </span>
                        </div>
                      </header>

                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Hora</span>
                          <strong className="text-foreground">{appt.start_time}</strong>
                        </div>
                        <div className="flex justify-between items-center text-sm py-2">
                          <span className="text-muted-foreground">Enlace</span>
                          {appt.meeting_link ? (
                            <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                              Abrir videollamada
                            </a>
                          ) : (
                            <em className="text-muted-foreground">No añadido</em>
                          )}
                        </div>
                      </div>

                      <footer className="flex gap-2 justify-end mt-auto">
                        <button onClick={() => handleOpenModal(appt)} className={btnPrimary}>
                          {appt.meeting_link ? 'Editar enlace' : 'Añadir enlace'}
                        </button>
                        <Link to={`/psychologist/chat/${appt.id}`} className={btnSecondary}>
                          Abrir chat
                        </Link>
                      </footer>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* Modal para enlace */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-semibold text-primary mb-2">Gestionar enlace</h2>
        {selectedAppt && (
          <p className="text-muted-foreground mb-6">
            Cita con <strong>{selectedAppt.patient_name}</strong> — {selectedAppt.appointment_date} {selectedAppt.start_time}
          </p>
        )}
        <form onSubmit={handleLinkSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Enlace (Google Meet, Zoom, etc.)</label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              required
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type_button className={btnGhost} onClick={handleCloseModal}>Cancelar</button>
            <button type="submit" className={btnPrimary}>Guardar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default PsychologistDashboard;