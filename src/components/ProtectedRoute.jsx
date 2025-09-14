// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, userType }) {
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

export default ProtectedRoute;