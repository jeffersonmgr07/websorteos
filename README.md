# JudithAlva.com (Sorteos Web)

Landing demo tipo pchujoy.com para sorteos por suscripción.

## Secciones
- Promos para suscriptores
- Próximos premios
- Ganadores
- Eventos
- Planes (Mensual / Trimestral / Anual)
- WhatsApp flotante con animación (ondas)

## Flujo de suscripción
1. Seleccionas un plan
2. Form: Nombres, Apellidos, WhatsApp, DNI, Correo
3. Verificación de correo con código (DEMO en front)
4. Continuar → abre WhatsApp (+51915161364) para pago manual

> Nota: Para verificación real por correo necesitas backend (API + SMTP/SendGrid/etc).

## Deploy en GitHub Pages
1. Sube el repo a GitHub
2. Settings → Pages
3. Build and deployment → Deploy from a branch
4. Selecciona `main` y `/root`
5. Guarda y abre el enlace de GitHub Pages

## Imágenes
Reemplaza:
- `assets/img/logo.png`
- `assets/img/whatsapp.png`
- `assets/img/banner1.jpg`
- `assets/img/prizes/ps5.png`

JudithAlva.com/
├─ index.html
├─ README.md
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  └─ app.js
│  └─ img/
│     ├─ logo.png
│     ├─ whatsapp.png
│     ├─ banner1.jpg
│     ├─ prizes/
│     │  └─ ps5.png
│     └─ winners/
│        └─ placeholder.jpg
