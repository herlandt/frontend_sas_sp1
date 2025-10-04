// src/services/globalAdminAuth.js

// Servicio especial de autenticación para el Administrador Global
// El admin global NO usa /api/auth/ sino que accede directamente al Django Admin

export const globalAdminLogin = async (email, password) => {
    // Verificar credenciales hardcodeadas para el admin global
    if (email === 'admin@psico.com' && password === 'admin') {
        // Simular autenticación exitosa para el admin global
        const globalAdminUser = {
            id: 'global-admin',
            email: 'admin@psico.com',
            first_name: 'Administrador',
            last_name: 'Global',
            user_type: 'global-admin',
            is_global_admin: true
        };

        // Guardar en localStorage con prefijo especial
        localStorage.setItem('globalAdminToken', 'global-admin-session');
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('currentUser', JSON.stringify(globalAdminUser));

        return {
            token: 'global-admin-session',
            user: globalAdminUser
        };
    } else {
        throw new Error('Credenciales incorrectas para administrador global');
    }
};

export const isGlobalAdminAuthenticated = () => {
    return localStorage.getItem('globalAdminToken') === 'global-admin-session';
};

export const globalAdminLogout = () => {
    localStorage.removeItem('globalAdminToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('currentUser');
};

// Obtener datos administrativos globales (simulado por ahora)
export const getGlobalAdminData = async () => {
    // Aquí más adelante podrías hacer llamadas a endpoints administrativos especiales
    // Por ahora retornamos datos simulados
    return {
        total_clinics: 2,
        clinic_names: ['Clínica Bienestar', 'Clínica MindCare'],
        total_users: 15, // Simulado
        system_status: 'Operativo'
    };
};