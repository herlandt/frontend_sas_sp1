// src/components/TenantInfo.jsx

import { getCurrentTenant, isMultiTenant } from '../config/tenants';

function TenantInfo() {
    const tenant = getCurrentTenant();
    const isMulti = isMultiTenant();

    if (!isMulti) {
        return null; // No mostrar nada si no estamos en modo multi-tenant
    }

    return (
        <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded-lg">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <span className="text-primary text-xl">🏥</span>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-primary">
                        {tenant.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Dominio: {window.location.hostname}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TenantInfo;