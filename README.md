
# CréditoFácil MX - Sitio Web de Préstamos

Un sitio web completo para una empresa de préstamos personales en México, desarrollado con HTML5, CSS3 y JavaScript vanilla.

## 🚀 Características

### Funcionalidades Principales
- **Simulador de Préstamos**: Calculadora interactiva con sliders para monto ($50,000 - $5,000,000) y plazo (3-84 meses)
- **Formulario de Contacto**: Integración con Email.js y validación client-side
- **Diseño Responsive**: Mobile-first con Flexbox y CSS Grid
- **Integración WhatsApp**: Botón flotante y enlaces directos
- **Validación reCAPTCHA v3**: Protección contra spam
- **Cumplimiento Legal**: Páginas de términos, privacidad y LFPDPPP

### Páginas Incluidas
1. **index.html** - Página principal con hero, beneficios y CTA
2. **simulador.html** - Calculadora de préstamos interactiva
3. **contact.html** - Formulario de solicitud con validaciones
4. **faq.html** - Preguntas frecuentes con acordeón
5. **terminos.html** - Términos y condiciones completos
6. **privacidad.html** - Aviso de privacidad conforme LFPDPPP
7. **compromisos.html** - Compromisos de la empresa

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con variables CSS, Flexbox y Grid
- **JavaScript ES6+**: Funcionalidades interactivas
- **Email.js**: Envío de emails sin backend
- **Google reCAPTCHA v3**: Protección contra bots
- **Google Fonts**: Tipografía Inter para mejor legibilidad

## 📁 Estructura del Proyecto

```
creditofacil-mx/
├── index.html              # Página principal
├── simulador.html          # Simulador de préstamos
├── contact.html            # Formulario de contacto
├── faq.html               # Preguntas frecuentes
├── terminos.html          # Términos y condiciones
├── privacidad.html        # Aviso de privacidad
├── compromisos.html       # Compromisos de la empresa
├── css/
│   └── styles.css         # Estilos principales
├── js/
│   ├── main.js           # Funcionalidades principales
│   ├── simulator.js      # Lógica del simulador
│   ├── contact.js        # Manejo del formulario
│   └── faq.js           # Acordeón de FAQ
└── README.md
```

## ⚙️ Configuración

### 1. Email.js Setup
1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura tu servicio de email (Gmail, Outlook, etc.)
3. Crea templates para:
   - Notificación a la empresa
   - Confirmación al cliente
4. Reemplaza en `js/contact.js`:
   ```javascript
   emailjs.init("YOUR_EMAILJS_USER_ID");
   // ...
   'YOUR_SERVICE_ID'
   'YOUR_TEMPLATE_ID'
   ```

### 2. reCAPTCHA v3 Setup
1. Obtén claves en [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Reemplaza en los archivos HTML:
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
   ```
3. Actualiza en `js/contact.js`:
   ```javascript
   grecaptcha.execute('YOUR_SITE_KEY', { action: 'loan_application' })
   ```

### 3. Personalización
- **Colores**: Modifica las variables CSS en `:root`
- **Tasas de interés**: Ajusta en `js/simulator.js`
- **Información de contacto**: Actualiza números de teléfono y emails
- **Términos legales**: Revisa y ajusta según tu jurisdicción

## 🎨 Características del Diseño

### Sistema de Colores
- **Primario**: Verde (`#059669`) - Confianza y crecimiento
- **Secundario**: Azul (`#1e40af`) - Profesionalismo
- **Acento**: Amarillo (`#f59e0b`) - Llamadas a la acción

### Responsive Design
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: 768px, 1024px, 1200px
- **Flexbox y Grid**: Layout moderno y flexible

### Accesibilidad
- Contraste mínimo AA
- Navegación por teclado
- Textos alternativos
- Tamaños de toque adecuados

## 📱 Funcionalidades Específicas

### Simulador de Préstamos
- Cálculo de pagos mensuales con fórmula PMT
- Tasas variables según monto y plazo
- Persistencia en localStorage
- Compartir simulaciones

### Formulario de Contacto
- Validación en tiempo real
- Formateo automático de teléfono
- Guardado de borradores
- Mensajes de error en español
- Modal de confirmación

### FAQ Interactivo
- Acordeón con categorías
- Función de búsqueda
- Enlaces directos a preguntas
- Seguimiento de interacciones

## 🔒 Seguridad y Cumplimiento

### LFPDPPP (Ley Federal de Protección de Datos)
- Aviso de privacidad completo
- Derechos ARCO claramente explicados
- Formularios de contacto del oficial de privacidad

### Mejores Prácticas
- Validación client-side y server-side recomendada
- reCAPTCHA v3 para protección
- Encriptación SSL requerida
- Sanitización de entradas

## 📊 Analytics y Tracking

### Eventos Configurados
- Interacciones del simulador
- Envíos de formularios
- Navegación entre páginas
- Errores JavaScript
- Tiempo de carga

### Implementación
```javascript
// Ejemplo de tracking
trackEvent('loan_simulation', {
    amount: 500000,
    term: 24,
    rate: 18.0
});
```

## 🚀 Deployment

### Hosting Estático
El sitio puede desplegarse en cualquier servicio de hosting estático:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

### Configuración Requerida
1. Subir todos los archivos al servidor
2. Configurar redirects para SPA (opcional)
3. Habilitar SSL/HTTPS
4. Configurar headers de seguridad

## 🔧 Mantenimiento

### Tareas Regulares
- Actualizar tasas de interés
- Revisar formularios de contacto
- Actualizar términos legales
- Monitorear analytics
- Backup de configuraciones

### Actualizaciones Recomendadas
- Revisar dependencias (Email.js, reCAPTCHA)
- Actualizar contenido legal anualmente
- Optimizar imágenes y performance
- Probar en nuevos dispositivos/navegadores

## 📞 Soporte

Para soporte técnico o consultas sobre implementación:
- Email: desarrollo@creditofacil.mx
- Documentación: Ver archivos incluidos
- Issues: Revisar código comentado

## 📄 Licencia

Este proyecto está desarrollado específicamente para CréditoFácil MX. Todos los derechos reservados.

---

**Nota**: Recuerda personalizar todos los datos de contacto, términos legales y configuraciones antes del despliegue en producción.
