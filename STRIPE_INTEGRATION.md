# Integración de Stripe - Sistema de Pagos

## Descripción
Este proyecto incluye una integración completa con Stripe para el procesamiento de pagos de citas psicológicas. La implementación permite a los usuarios pagar de forma segura por sus citas antes de que sean confirmadas.

## Archivos Principales

### Hooks
- **`src/hooks/useStripe.js`**: Hook personalizado para manejar la inicialización de Stripe
  - Obtiene la clave pública desde el backend o usa configuración de desarrollo
  - Maneja estados de carga y errores

### Componentes
- **`src/components/PaymentButton.jsx`**: Botón de pago principal
  - Crea sesiones de checkout con Stripe
  - Maneja redirección a Stripe Checkout
  - Incluye fallback para desarrollo cuando el backend no está disponible

- **`src/components/PaymentInfo.jsx`**: Componente informativo sobre el proceso de pago
  - Muestra información de seguridad y métodos de pago aceptados

### Páginas
- **`src/pages/PaymentSuccessPage.jsx`**: Página de confirmación de pago exitoso
  - Verifica el pago con el backend
  - Muestra detalles de la cita confirmada
  - Incluye simulación para desarrollo

- **`src/pages/PaymentCancelPage.jsx`**: Página para pagos cancelados
  - Permite al usuario reintentar el pago
  - Enlaces de navegación útiles

### Configuración
- **`src/config/stripe.js`**: Configuración de Stripe para desarrollo
  - Claves públicas de prueba
  - URLs de retorno

## Flujo de Pago

1. **Selección de Cita**: Usuario selecciona fecha, hora y profesional
2. **Botón de Pago**: Usuario hace clic en "Pagar y Confirmar Cita"
3. **Creación de Sesión**: Se crea una sesión de checkout en Stripe
4. **Redirección**: Usuario es redirigido a Stripe Checkout
5. **Procesamiento**: Stripe procesa el pago
6. **Retorno**: Usuario regresa a la aplicación
7. **Verificación**: Se verifica el pago con el backend
8. **Confirmación**: Se confirma la cita y se notifica al usuario

## Integración con Backend

### Endpoints Esperados
```
GET /payments/stripe-public-key/
- Retorna la clave pública de Stripe

POST /payments/create-checkout-session/
- Crea una sesión de checkout
- Body: { appointment_data, success_url, cancel_url }
- Retorna: { session_id }

POST /payments/verify-payment/
- Verifica un pago completado
- Body: { session_id }
- Retorna: { appointment }
```

### Datos de Cita
```javascript
appointmentData = {
  psychologist: professional.user_id,
  appointment_date: selectedDate.date,
  start_time: selectedTime,
  price: professional.consultation_fee
}
```

## Configuración para Desarrollo

### Sin Backend
El sistema incluye fallbacks para desarrollo:
- Usa claves públicas de prueba
- Simula respuestas exitosas
- Permite testing sin backend completo

### Con Backend
1. Configurar variables de entorno en el backend:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

2. Implementar endpoints de pago según documentación

## Seguridad

- ✅ Las claves secretas nunca se exponen en el frontend
- ✅ Toda la lógica de pago se procesa en el backend
- ✅ Verificación de pagos del lado del servidor
- ✅ URLs de retorno seguras

## Testing

### Tarjetas de Prueba Stripe
```
Éxito: 4242 4242 4242 4242
Falla: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

### Modo Desarrollo
- El sistema detecta automáticamente cuando el backend no está disponible
- Simula flujos de pago exitosos para testing de UI
- Logs detallados en consola para debugging

## Deployment

### Producción
1. Configurar claves de Stripe de producción en el backend
2. Verificar que todos los endpoints estén implementados
3. Configurar webhooks de Stripe para el backend
4. Testing con tarjetas reales en ambiente de prueba

### Variables de Entorno
```bash
# Backend
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend (si es necesario)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... # Solo si no viene del backend
```

## Troubleshooting

### Errores Comunes
1. **"Stripe no está cargado"**: Verificar conexión a internet y clave pública
2. **"Error creando sesión de pago"**: Verificar que el backend esté corriendo
3. **"Datos de cita faltantes"**: Asegurar que fecha, hora y profesional estén seleccionados

### Logs
El sistema incluye logging detallado:
- Inicialización de Stripe
- Creación de sesiones
- Errores de red
- Respuestas del backend

## Próximas Mejoras

- [ ] Soporte para múltiples métodos de pago
- [ ] Pagos recurrentes para sesiones programadas
- [ ] Reembolsos automáticos
- [ ] Notificaciones por email de confirmación
- [ ] Dashboard de pagos para administradores