// src/pages/PsychologistDashboard.jsx

import { useState, useEffect, useMemo } from 'react';
import apiClient from '../api';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

function PsychologistDashboard() {
  // ---- Estado base ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---- Estado UI ----
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | confirmed | cancelled | completed
  const [query, setQuery] = useState(''); // búsqueda por paciente/fecha/hora

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

  const handleOpenModal = (appointment) => {
    setSelectedAppt(appointment);
    setMeetingLink(appointment.meeting_link || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppt(null);
    setMeetingLink('');
  };

  const handleLinkSubmit = async (e) => {
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

  // ---- Helpers de UI ----
  const getInitials = (fullName = '') => {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  };

  const groupByDateLabel = (list) => {
    const groups = {};
    for (const a of list) {
      const label = a.appointment_date; // YYYY-MM-DD
      if (!groups[label]) groups[label] = [];
      groups[label].push(a);
    }
    // ordenar fechas desc
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  };

  // ---- Derivados ----
  const filteredAppointments = useMemo(() => {
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

  const stats = useMemo(() => {
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

  if (loading) return <p>Cargando tus citas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <div className="main-content clinic-wrap">
        {/* Encabezado */}
        <header className="clinic-header">
          <div>
            <h1 className="clinic-title">Agenda Clínica</h1>
            <p className="clinic-subtitle">Coordina tus sesiones con claridad y calma.</p>
          </div>
          <div className="clinic-actions">
            
          
          </div>
        </header>

        {/* Métricas */}
        <section className="clinic-stats">
          <div className="cstat"><span>Total</span><strong>{stats.total}</strong></div>
          <div className="cstat cstat-pending"><span>Pendientes</span><strong>{stats.pending}</strong></div>
          <div className="cstat cstat-confirmed"><span>Confirmadas</span><strong>{stats.confirmed}</strong></div>
          <div className="cstat cstat-cancelled"><span>Canceladas</span><strong>{stats.cancelled}</strong></div>
          <div className="cstat cstat-completed"><span>Completadas</span><strong>{stats.completed}</strong></div>
        </section>

        {/* Filtros y búsqueda */}
        <section className="clinic-controls">
          <div className="chipset">
            {['all','pending','confirmed','cancelled','completed'].map(s => (
              <button
                key={s}
                className={`chip ${statusFilter===s ? 'chip-active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'Todas' :
                 s === 'pending' ? 'Pendientes' :
                 s === 'confirmed' ? 'Confirmadas' :
                 s === 'cancelled' ? 'Canceladas' : 'Completadas'}
              </button>
            ))}
          </div>
          <div className="clinic-search">
            <input
              type="text"
              placeholder="Buscar paciente, fecha u hora…"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Agenda agrupada por fecha */}
        <section className="clinic-agenda">
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>Sin resultados</h3>
              <p>Prueba otro filtro o término de búsqueda.</p>
            </div>
          ) : (
            groupByDateLabel(filteredAppointments).map(([date, items]) => (
              <div className="agenda-group" key={date}>
                <div className="agenda-date">
                  <span className="date-badge">{date}</span>
                  <span className="date-count">{items.length} {items.length>1?'citas':'cita'}</span>
                </div>

                <div className="agenda-grid">
                  {items.map(appt => (
                    <article key={appt.id} className="clinic-card">
                      <header className="card-top">
                        <div className="avatar">{getInitials(appt.patient_name)}</div>
                        <div className="card-id">
                          <h3 className="patient-name">{appt.patient_name}</h3>
                          <span className={`pill pill-${appt.status}`}>{appt.status_display}</span>
                        </div>
                      </header>

                      <div className="card-info">
                        <div className="kv"><span>Hora</span><strong>{appt.start_time}</strong></div>
                        <div className="kv link-row">
                          <span>Enlace</span>
                          {appt.meeting_link ? (
                            <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer" className="session-link">
                              Abrir videollamada
                            </a>
                          ) : (
                            <em className="muted">No añadido</em>
                          )}
                        </div>
                      </div>

                      <footer className="card-actions">
                        <button onClick={() => handleOpenModal(appt)} className="btn-primary">
                          {appt.meeting_link ? 'Editar enlace' : 'Añadir enlace'}
                        </button>
                        <Link to={`/psychologist/chat/${appt.id}`} className="btn-secondary">
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
        <h2 className="modal-title">Gestionar enlace de videollamada</h2>
        {selectedAppt && (
          <p className="modal-subtitle">
            Cita con <strong>{selectedAppt.patient_name}</strong> — {selectedAppt.appointment_date} {selectedAppt.start_time}
          </p>
        )}
        <form onSubmit={handleLinkSubmit}>
          <div className="input-group">
            <label>Enlace (Google Meet, Zoom, etc.)</label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={handleCloseModal}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default PsychologistDashboard;
