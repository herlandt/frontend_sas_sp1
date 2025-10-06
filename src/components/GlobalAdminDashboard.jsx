// src/components/GlobalAdminDashboard.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';
import { Globe, Link as LinkIcon, Building, Users } from 'lucide-react';

function GlobalAdminDashboard() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Datos simulados hasta que se implemente el endpoint del backend
    const mockClinics = [
        {
            id: 1,
            name: 'Clínica Bienestar',
            schema_name: 'bienestar',
            domains: [
                { domain: 'bienestar.localhost', is_primary: true }
            ],
            created_on: '2024-01-15',
            users_count: 45
        },
        {
            id: 2,
            name: 'MindCare Psicología',
            schema_name: 'mindcare',
            domains: [
                { domain: 'mindcare.localhost', is_primary: true }
            ],
            created_on: '2024-02-20',
            users_count: 32
        }
    ];

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                // CORRECCIÓN: La ruta no debe empezar con /api/ porque ya está en la URL base.
                const response = await apiClient.get('/tenants/clinics/');
                // CORRECCIÓN: Extraemos la lista de la propiedad "results" de la respuesta paginada
                setClinics(response.data.results);
            } catch (err) {
                console.warn("Endpoint /tenants/clinics/ no disponible, usando datos simulados:", err);
                // Usar datos simulados mientras se implementa el endpoint
                setTimeout(() => {
                    setClinics(mockClinics);
                    setLoading(false);
                }, 1000);
                return;
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, []);

    if (loading) return <p className="text-center text-muted-foreground">Cargando clínicas del sistema...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">🌐 Dashboard Global</h1>
            <p className="text-muted-foreground mb-8">Gestión centralizada de todas las clínicas y dominios del sistema.</p>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-card p-6 rounded-xl shadow flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full"><Building className="h-6 w-6 text-purple-600" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Clínicas Registradas</p>
                        <p className="text-2xl font-bold text-foreground">{clinics.length}</p>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl shadow flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full"><LinkIcon className="h-6 w-6 text-blue-600" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Dominios Activos</p>
                        <p className="text-2xl font-bold text-foreground">{clinics.reduce((acc, clinic) => acc + clinic.domains.length, 0)}</p>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl shadow flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full"><Users className="h-6 w-6 text-green-600" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                        <p className="text-2xl font-bold text-foreground">{clinics.reduce((acc, clinic) => acc + (clinic.users_count || 0), 0)}</p>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl shadow flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full"><Globe className="h-6 w-6 text-yellow-600" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Estado del Sistema</p>
                        <p className="text-lg font-bold text-green-600">Activo</p>
                    </div>
                </div>
            </div>

            {/* Lista de Clínicas */}
            <div className="bg-card p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold text-foreground mb-4">Lista de Clínicas</h2>
                
                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                        <p className="text-yellow-800 text-sm">
                            ⚠️ <strong>Modo de Desarrollo:</strong> Mostrando datos simulados. 
                            Para datos reales, implementa el endpoint <code>/api/tenants/clinics/</code> en el backend.
                        </p>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="p-4 text-sm font-semibold text-muted-foreground">Nombre de la Clínica</th>
                                <th className="p-4 text-sm font-semibold text-muted-foreground">Schema Name</th>
                                <th className="p-4 text-sm font-semibold text-muted-foreground">Dominio(s)</th>
                                <th className="p-4 text-sm font-semibold text-muted-foreground">Usuarios</th>
                                <th className="p-4 text-sm font-semibold text-muted-foreground">Fecha de Creación</th>
                                <th className="p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clinics.map(clinic => (
                                <tr key={clinic.id} className="border-b border-border hover:bg-muted/50">
                                    <td className="p-4 font-medium text-foreground">{clinic.name}</td>
                                    <td className="p-4 text-muted-foreground font-mono text-sm bg-gray-100 rounded px-2 py-1">{clinic.schema_name}</td>
                                    <td className="p-4 text-muted-foreground">
                                        {clinic.domains.map(domain => (
                                            <div key={domain.domain} className="mb-1">
                                                <a 
                                                    href={`http://${domain.domain}:8000/admin/`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {domain.domain}
                                                </a>
                                                {domain.is_primary && (
                                                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {clinic.users_count || 0} usuarios
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {new Date(clinic.created_on).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <a 
                                                href={`http://${clinic.domains[0].domain}:8000/admin/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90"
                                            >
                                                Ver Admin
                                            </a>
                                            <a 
                                                href={`http://${clinic.domains[0].domain}:5177/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm hover:bg-secondary/90"
                                            >
                                                Ver Frontend
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {clinics.length === 0 && !loading && (
                    <p className="text-center text-muted-foreground p-8">No hay clínicas registradas en el sistema.</p>
                )}
            </div>

            {/* Información adicional */}
            <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Información del Sistema</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Cada clínica opera de forma independiente con su propia base de datos</li>
                    <li>• Los dominios pueden ser configurados para apuntar a diferentes clínicas</li>
                    <li>• El administrador global puede acceder a todas las clínicas</li>
                    <li>• Los datos están completamente aislados entre clínicas</li>
                </ul>
            </div>
        </div>
    );
}

export default GlobalAdminDashboard;