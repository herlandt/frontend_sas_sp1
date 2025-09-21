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
import './index.css'; // <-- Importa el nuevo index.css

// --- Botones Genéricos (reemplazando btn-primary, etc.) ---
const btnPrimary = "px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center";
const btnSecondary = "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-center";
const btnDestructive = "px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:bg-destructive/90 transition-colors text-center";
const navLink = "text-sidebar-foreground font-medium hover:text-primary transition-colors";

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
            <nav className="flex justify-between items-center p-4 px-8 bg-sidebar text-sidebar-foreground shadow-md border-b border-sidebar-border">
                <Link to="/dashboard" className="text-xl font-bold text-primary">Psico SAS</Link>
                <div className="flex items-center gap-6">
                    <Link to="/my-appointments" className={navLink}>Mis Citas</Link>
                    <Link to="/profile" className={navLink}>Mi Perfil</Link>
                    <button onClick={handleLogout} className={btnDestructive}>Cerrar Sesión</button>
                </div>
            </nav>
            <div className="p-4 sm:p-8 bg-background min-h-screen">
              <Outlet />
            </div>
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
            <nav className="flex justify-between items-center p-4 px-8 bg-sidebar text-sidebar-foreground shadow-md border-b border-sidebar-border">
                <Link to="/psychologist-dashboard" className="text-xl font-bold text-primary">Psico SAS (Psicólogo)</Link>
                <div className="flex items-center gap-6">
                    <Link to="/psychologist-profile" className={navLink}>Mi Perfil</Link>
                    <Link to="/psychologist-availability" className={navLink}>Mi Disponibilidad</Link>
                    <Link to="/psychologist-dashboard" className={navLink}>Mis Citas</Link>
                    <button onClick={handleLogout} className={btnDestructive}>Cerrar Sesión</button>
                </div>
            </nav>
            <div className="p-4 sm:p-8 bg-background min-h-screen">
              <Outlet />
            </div>
        </div>
    );
}


// --- PÁGINA DE INICIO (PÚBLICA) ---
function HomePage() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-8 bg-background">
            <h1 className="text-4xl font-bold text-primary mb-8">Bienvenido a Psico SAS</h1>
            <nav className="flex gap-4">
                <Link to="/login" className={btnPrimary}>Iniciar Sesión</Link>
                <Link to="/register" className={btnSecondary}>Registrarse</Link>
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