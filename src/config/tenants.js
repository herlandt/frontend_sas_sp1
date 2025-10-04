// src/config/tenants.js

// Configuración de dominios multi-tenant
export const TENANT_CONFIG = {
    // Dominios de desarrollo local
    'bienestar.localhost': {
        name: 'Clínica Bienestar',
        theme: 'bienestar',
        logo: '/logos/bienestar.png',
        colors: {
            primary: '#0066CC',
            secondary: '#00AA44'
        }
    },
    'mindcare.localhost': {
        name: 'MindCare Psicología',
        theme: 'mindcare',
        logo: '/logos/mindcare.png',
        colors: {
            primary: '#6B46C1',
            secondary: '#EC4899'
        }
    },
    // Fallback para desarrollo
    'localhost': {
        name: 'Sistema de Psicología',
        theme: 'default',
        logo: '/logos/default.png',
        colors: {
            primary: '#1F2937',
            secondary: '#3B82F6'
        }
    }
};

// Función para obtener la configuración del tenant actual
export const getCurrentTenant = () => {
    const hostname = window.location.hostname;
    return TENANT_CONFIG[hostname] || TENANT_CONFIG['localhost'];
};

// Función para obtener la URL base de la API
export const getApiBaseURL = () => {
    const hostname = window.location.hostname;
    
    // En desarrollo local
    if (hostname.includes('localhost')) {
        return `http://${hostname}:8000/api`;
    }
    
    // En producción (puedes personalizar según tus dominios de producción)
    return `https://${hostname}/api`;
};

// Función para verificar si estamos en modo multi-tenant
export const isMultiTenant = () => {
    const hostname = window.location.hostname;
    return hostname !== 'localhost' && hostname.includes('localhost');
};