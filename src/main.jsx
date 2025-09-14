// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, Outlet } from 'react-router-dom';

// Importaciones de Páginas
import App from './App.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfessionalsPage from './pages/ProfessionalsPage.jsx';
import ProfessionalDetailPage from './pages/ProfessionalDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyAppointmentsPage from './pages/MyAppointmentsPage.jsx';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage.jsx';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage.jsx';
import PsychologistDashboard from './pages/PsychologistDashboard.jsx';
import PsychologistAvailabilityPage from './pages/PsychologistAvailabilityPage.jsx';
import PsychologistProfilePage from './pages/PsychologistProfilePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
// Importaciones de Componentes
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css';

// --- LAYOUTS ---

// Layout para el Paciente
function DashboardLayout() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };
    return (
        <div>
            <nav className="navbar">
                <Link to="/dashboard" className="navbar-brand">Psico SAS</Link>
                <div>
                    <Link to="/my-appointments" style={{ marginRight: '1rem', color: '#2a573e', fontWeight: 'bold' }}>Mis Citas</Link>
                    <Link to="/profile" style={{ marginRight: '1rem', color: '#2a573e', fontWeight: 'bold' }}>Mi Perfil</Link>
                    <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

// Layout para el Psicólogo
function PsychologistLayout() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };
    return (
      
        <div>
            <nav className="navbar">
                <Link to="/psychologist-dashboard" className="navbar-brand">Psico SAS (Psicólogo)</Link>
                <div>
                    {/* 2. AÑADE EL ENLACE A "MI PERFIL" */}
                    <Link to="/psychologist-profile" style={{ marginRight: '1rem', color: '#2a573e', fontWeight: 'bold' }}>Mi Perfil</Link>
                    <Link to="/psychologist-availability" style={{ marginRight: '1rem', color: '#2a573e', fontWeight: 'bold' }}>Mi Disponibilidad</Link>
                    <Link to="/psychologist-dashboard" style={{ marginRight: '1rem', color: '#2a573e', fontWeight: 'bold' }}>Mis Citas</Link>
                    <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}


// --- PÁGINA DE INICIO (PÚBLICA) ---
function HomePage() {
    return (
        <div>
            <h1>Página de Inicio</h1>
            <nav>
                <Link to="/login">Iniciar Sesión</Link> | <Link to="/register">Registrarse</Link>
            </nav>
        </div>
    );
}

// --- RENDERIZADO PRINCIPAL ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<PasswordResetRequestPage />} />
        <Route path="/reset-password/:uid/:token" element={<PasswordResetConfirmPage />} />
        
        {/* --- Rutas Protegidas para el Paciente --- */}
        <Route element={<ProtectedRoute userType="patient"><DashboardLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<ProfessionalsPage />} />
          <Route path="my-appointments" element={<MyAppointmentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="professional/:id" element={<ProfessionalDetailPage />} />
          <Route path="chat/:appointmentId" element={<ChatPage />} />
        </Route>
        
        {/* --- Rutas Protegidas para el Psicólogo --- */}
        <Route element={<ProtectedRoute userType="professional"><PsychologistLayout /></ProtectedRoute>}>
          <Route path="psychologist-dashboard" element={<PsychologistDashboard />} />
          <Route path="psychologist-availability" element={<PsychologistAvailabilityPage />} />
           <Route path="psychologist/chat/:appointmentId" element={<ChatPage />} />
          <Route path="psychologist-profile" element={<PsychologistProfilePage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);