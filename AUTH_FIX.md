# Solución al Error 401 Unauthorized

## Problema Identificado

El sistema tenía **dos tipos de login diferentes** que causaban confusión:

1. **Panel Django Admin** (`/admin/`): Usa sesiones y cookies
2. **API REST** (`/api/auth/login/`): Usa tokens de autenticación

### El Error
- Usuario iniciaba sesión en panel Django → Obtenía cookie de sesión
- Aplicación React intentaba acceder a API → **No tenía token** → Error 401
- Las cookies del panel Django **NO SIRVEN** para la API REST

## Solución Implementada

### ✅ Unificación del Login

**Antes** (problemático):
```javascript
if (isGlobalAdmin()) {
  // ❌ Usaba globalAdminLogin (cookies Django)
  await globalAdminLogin(email, password);
} else {
  // ✅ Usaba API REST (tokens)
  await apiClient.post('/auth/login/', formData);
}
```

**Después** (corregido):
```javascript
// ✅ SIEMPRE usa API REST para ambos casos
const loginResponse = await apiClient.post('/auth/login/', formData);
localStorage.setItem('authToken', loginResponse.data.token);
```

### ✅ Token Unificado

- **Guardado**: `localStorage.setItem('authToken', token)`
- **Lectura**: `localStorage.getItem('authToken')`
- **Envío automático**: Interceptor en `api.js` añade token a todas las peticiones

### ✅ Interceptor Configurado

```javascript
// api.js - Se ejecuta antes de cada petición
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});
```

## Verificación

### ✅ Credenciales Correctas
- **Email**: admin@psico.com
- **Password**: admin123
- **Funciona para**: Admin Global Y Admin de Clínica

### ✅ Flujo Correcto
1. Usuario va a `/login` (React app)
2. Envía credenciales a `/api/auth/login/`
3. Backend valida y retorna token
4. Token se guarda en localStorage
5. Todas las peticiones futuras incluyen token automáticamente
6. Dashboard carga sin error 401 ✅

## Archivos Modificados

- `src/pages/LoginPage.jsx` → Lógica unificada de login
- `src/components/PaymentButton.jsx` → Token consistente 
- `src/pages/PaymentSuccessPage.jsx` → Token consistente
- `README.md` → Documentación actualizada

## Lecciones Aprendidas

1. **Un solo sistema de auth**: Django REST Framework con tokens
2. **Interceptors son clave**: Automatización de headers
3. **Consistencia en nombres**: Siempre `authToken` 
4. **Debugging sistemático**: Console.log para verificar tokens
5. **Documentación clara**: Prevenir confusión futura

## Testing

```bash
# Verificar token después del login
console.log(localStorage.getItem('authToken'));

# Debe mostrar algo como: "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
# Si es null → problema en login
# Si existe → problema en interceptor o backend
```