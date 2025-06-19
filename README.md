
# World Credit Elite - Sitio Web de Préstamos

Un sitio web completo para World Credit Elite, empresa de préstamos personales con las tasas más competitivas del mercado, desarrollado con HTML5, CSS3 y JavaScript vanilla.

## 🚀 Características

### Funcionalidades Principales
- **Simulador de Préstamos**: Calculadora interactiva con sliders para monto ($50,000 - $5,000,000) y plazo (3-84 meses)
- **Tasas Ultra Competitivas**: 4% - 9% anual (las más bajas del mercado)
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
world-credit-elite/
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

## ⚙️ Configuración Actual

### Email.js Configurado
- **Public Key**: _oTxApvSNAxlvXZJu
- **Service ID**: service_i9indwn
- **Template Notificación**: template_8w52yov
- **Template Confirmación**: template_loy3yej

### Información de Contacto
- **Teléfono**: +1 (514) 416-1603
- **Email**: worldcreditelite@gmail.com
- **WhatsApp**: +15144161603

### Tasas de Interés Ultra Competitivas
- **$50,000 - $200,000**: 7% - 8% anual
- **$200,001 - $1,000,000**: 5% - 7% anual
- **$1,000,001 - $5,000,000**: 4% - 5% anual

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
- Tasas ultra competitivas (4% - 9% anual)
- Persistencia en localStorage
- Compartir simulaciones

### Formulario de Contacto
- Integración Email.js completa
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
- Validación client-side implementada
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
    rate: 6.0
});
```

## 🚀 Deployment

### Hosting Estático Gratuito
El sitio puede desplegarse gratuitamente en:
- **Netlify** (Recomendado)
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**

### Pasos para Netlify (Gratis)
1. Crear cuenta en netlify.com
2. Arrastrar carpeta del proyecto
3. Configurar dominio personalizado (opcional)
4. SSL automático incluido

### Configuración Requerida
1. Subir todos los archivos al servidor
2. Configurar redirects para SPA (opcional)
3. Habilitar SSL/HTTPS (automático en Netlify)
4. Configurar headers de seguridad

## 🔧 Mantenimiento

### Tareas Regulares
- Actualizar tasas de interés si es necesario
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
- **Email**: worldcreditelite@gmail.com
- **Teléfono**: +1 (514) 416-1603
- **WhatsApp**: +15144161603

## 📄 Licencia

Este proyecto está desarrollado específicamente para World Credit Elite. Todos los derechos reservados.

---

**Nota**: El sitio está listo para producción con todas las configuraciones aplicadas. Solo necesitas desplegarlo en tu servicio de hosting preferido.
