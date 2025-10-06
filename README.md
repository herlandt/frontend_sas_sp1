# Frontend SAS SP1 - Sistema de Clínicas Psicológicas

Sistema frontend multi-tenant para clínicas psicológicas con integración de pagos Stripe.

## Características Principales

- 🏥 **Multi-tenant**: Soporte para múltiples clínicas con dominios separados
- 👥 **Roles de Usuario**: Pacientes, Psicólogos, Administradores de Clínica, Admin Global
- 💳 **Pagos Stripe**: Sistema completo de pagos para citas
- 📅 **Gestión de Citas**: Reserva, cancelación y seguimiento de citas
- 💬 **Chat en Tiempo Real**: Comunicación entre pacientes y psicólogos
- 📋 **Gestión Administrativa**: Dashboards específicos por rol
- 🔒 **Autenticación Unificada**: Token-based auth para API y panel admin

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── PaymentButton.jsx
│   ├── PaymentInfo.jsx
│   ├── Modal.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Páginas principales
│   ├── LoginPage.jsx
│   ├── PaymentSuccessPage.jsx
│   ├── AdminDashboardPage.jsx
│   └── ...
├── hooks/              # Custom hooks
│   └── useStripe.js
├── config/             # Configuración
│   ├── tenants.js      # Multi-tenant config
│   └── stripe.js       # Stripe config
└── api.js             # Cliente API con interceptors
```

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en:
# - http://localhost:5174 (Admin Global)
# - http://bienestar.localhost:5174 (Clínica Bienestar)
# - http://mindcare.localhost:5174 (Clínica MindCare)
```

## Credenciales de Desarrollo

### Admin Global (localhost)
- **URL**: http://localhost:5174
- **Email**: admin@psico.com
- **Password**: admin123

### Clínicas (subdominios)
- **URL**: http://bienestar.localhost:5174 o http://mindcare.localhost:5174
- **Email**: admin@psico.com
- **Password**: admin123

## Autenticación

### ⚠️ Problema Común: Error 401 Unauthorized

Si ves error 401 al acceder a dashboards administrativos, asegúrate de:

1. **Usar SIEMPRE el login de la aplicación** (no el panel Django /admin/)
2. **El LoginPage.jsx está unificado** para usar tokens API en ambos casos
3. **Verificar que el token se guarda** en localStorage como 'authToken'

### Flujo de Autenticación Correcto

1. Usuario va a `/login` en la aplicación React
2. Login usa `/api/auth/login/` endpoint (nunca Django admin)
3. Backend retorna token que se guarda en localStorage
4. `api.js` interceptor añade token a todas las peticiones futuras
5. Rutas protegidas verifican token y redirigen según rol

## Integración Stripe

Ver [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md) para detalles completos.

### Flujo de Pago
1. Usuario selecciona fecha/hora/profesional
2. Clic en "Pagar y Confirmar Cita"
3. Redirección a Stripe Checkout
4. Confirmación y creación automática de cita

## Multi-Tenant

### Configuración de Dominios
- **localhost**: Admin global para gestionar todas las clínicas
- **subdomain.localhost**: Acceso específico a clínica individual

### Detección Automática
```javascript
// Detecta automáticamente el tipo de admin
if (isGlobalAdmin()) {
  // Dashboard global - gestión de todas las clínicas
} else {
  // Dashboard de clínica específica
}
```

## Tecnologías

- **React 19.1.1**: Framework frontend
- **Vite 7.1.6**: Build tool y dev server
- **Tailwind CSS**: Estilos y diseño responsive
- **Stripe**: Procesamiento de pagos
- **Axios**: Cliente HTTP con interceptors
- **React Router**: Navegación y rutas protegidas
- **Lucide React**: Iconografía

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## Troubleshooting

### Error 401 en Dashboard Admin
```bash
# Verificar token en localStorage
console.log(localStorage.getItem('authToken'));

# Si no hay token, hacer login nuevamente en /login
# NO usar el panel Django /admin/
```

### Problemas de Dominio Multi-tenant
```bash
# Agregar a /etc/hosts (macOS/Linux) o C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 bienestar.localhost
127.0.0.1 mindcare.localhost
```

### Puerto en Uso
```bash
# Vite automáticamente encuentra puerto disponible
# Puertos comunes: 5173, 5174, 5175, etc.
```

## Documentación Adicional

- [Integración Stripe](./STRIPE_INTEGRATION.md) - Sistema completo de pagos
- [API Backend](./API_DOCS.md) - Endpoints y autenticación
- [Deployment](./DEPLOYMENT.md) - Guía de despliegue a producción
