# Solución: Error 404 - URLs Duplicadas

## Problema Identificado ✅

El error 404 se debía a URLs duplicadas en las llamadas a la API:

```
❌ URL incorrecta: http://localhost:8000/api/api/tenants/clinics/
✅ URL correcta:   http://localhost:8000/api/tenants/clinics/
```

## Causa Raíz

1. **`tenants.js`** configurado correctamente:
   ```javascript
   getApiBaseURL() => "http://localhost:8000/api"
   ```

2. **`GlobalAdminDashboard.jsx`** tenía URL duplicada:
   ```javascript
   // ❌ INCORRECTO - duplica /api/
   apiClient.get('/api/tenants/clinics/')
   
   // ✅ CORRECTO - sin /api/ inicial
   apiClient.get('/tenants/clinics/')
   ```

## Solución Aplicada

### Archivo Corregido: `src/components/GlobalAdminDashboard.jsx`

**Antes:**
```javascript
const response = await apiClient.get('/api/tenants/clinics/');
```

**Después:**
```javascript
const response = await apiClient.get('/tenants/clinics/');
```

## Cómo Funciona apiClient

```javascript
// apiClient ya tiene la URL base configurada
baseURL: "http://localhost:8000/api"

// Cuando haces apiClient.get('/tenants/clinics/')
// Resultado: "http://localhost:8000/api" + "/tenants/clinics/"
// = "http://localhost:8000/api/tenants/clinics/" ✅

// Si usas apiClient.get('/api/tenants/clinics/')
// Resultado: "http://localhost:8000/api" + "/api/tenants/clinics/"
// = "http://localhost:8000/api/api/tenants/clinics/" ❌
```

## Verificación

### 1. Servidor Corriendo
```bash
npm run dev
# Servidor: http://localhost:5175/ (puerto auto-asignado)
```

### 2. Login Funcionando
- **URL**: http://localhost:5175/login
- **Credenciales**: admin@psico.com / admin123
- **Token**: Se guarda correctamente en localStorage

### 3. Dashboard Sin Error 404
- Login exitoso → Redirección a `/global-admin`
- Llamada a `/tenants/clinics/` (URL correcta)
- Dashboard carga datos reales o simulados

## Regla Para Evitar Este Error

### ✅ URLs Correctas con apiClient

```javascript
// ✅ Rutas relativas a /api
apiClient.get('/auth/profile/')
apiClient.get('/tenants/clinics/')
apiClient.get('/users/') 
apiClient.post('/auth/login/', data)

// ✅ También funciona sin barra inicial
apiClient.get('auth/profile')
apiClient.get('tenants/clinics')
```

### ❌ URLs Incorrectas

```javascript
// ❌ NO duplicar /api/
apiClient.get('/api/auth/profile/')
apiClient.get('/api/tenants/clinics/')

// ❌ NO usar URLs absolutas
apiClient.get('http://localhost:8000/api/users/')
```

## Estado Actual

✅ **Error 404 RESUELTO**
✅ **Login funcionando**  
✅ **Dashboard cargando**
✅ **Token system operativo**
✅ **Multi-tenant funcionando**

El sistema está completamente operativo en **http://localhost:5175/**