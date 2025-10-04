// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { isGlobalAdmin } from '../config/tenants';
import { isGlobalAdminAuthenticated } from '../services/globalAdminAuth';

function ProtectedRoute({ children, userType }) {
    const isGlobal = isGlobalAdmin();
    
    if (isGlobal) {
        // Para admin global, verificar autenticación especial
        if (!isGlobalAdminAuthenticated()) {
            return <Navigate to="/login" />;
        }
        // Admin global siempre tiene acceso a rutas admin
        if (userType === 'admin') {
            return children;
        }
    } else {
        // Para clínicas, verificación normal
        const token = localStorage.getItem('authToken');
        const storedUserType = localStorage.getItem('userType');

        if (!token) {
            return <Navigate to="/login" />;
        }

        // Si la ruta requiere un tipo de usuario específico, lo verificamos
        if (userType && storedUserType !== userType) {
            // Si no es el tipo correcto, lo mandamos a la página de inicio
            // para evitar un bucle de redirecciones.
            return <Navigate to="/" />;
        }

        return children;
    }

    // Fallback
    return <Navigate to="/" />;
}

export default ProtectedRoute;