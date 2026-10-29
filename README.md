# Kodarvia Fidelización · Fisioterapia Deportiva

PWA de fidelización por puntos para un centro de fisioterapia deportiva en
Antofagasta, Chile. Encargo para **Kodarvia**. Vista de paciente (tarjeta
digital con QR, catálogo de premios, feed de novedades) y panel de
administración (acreditar puntos, registrar canjes, publicar noticias,
exportar actividad a CSV).

Ver también [`MANUAL.md`](./MANUAL.md) para el manual de uso (alternar entre
vistas y simular el escaneo de puntos).

## Stack

- **React 18 + Vite**
- **Tailwind CSS 3** (paleta e identidad visual del briefing)
- **`qrcode.react`** para generar el código QR de cada paciente (sin cámara,
  sin red: el QR se dibuja en el navegador a partir de un ID local)
- **`vite-plugin-pwa`** para el manifest, los íconos y el *service worker*
  (precache del *app shell* para funcionar sin conexión)
- **Sin backend.** Toda la persistencia vive en `localStorage` del
  navegador.

## Cómo arrancar el proyecto

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

### Probar como PWA real (instalación + modo offline)

El modo offline depende del *service worker*, que **no se activa en
`npm run dev`**. Para probarlo como lo haría un paciente real:

```bash
npm run build
npm run preview
```

Abre la URL de `preview` (por defecto `http://localhost:4173`), espera a que
cargue una vez (así el *service worker* precachea la app) y luego:

- **Android (Chrome):** menú ⋮ → "Instalar aplicación" / "Agregar a pantalla
  de inicio".
- **iOS (Safari):** botón Compartir → "Agregar a pantalla de inicio".
- **Modo avión:** activa el modo avión o desconecta la red y vuelve a abrir
  la app: la tarjeta digital del paciente carga igual, porque toda la UI y
  los datos (`localStorage`) ya están en el dispositivo.

## Qué está simulado

Por indicación explícita del briefing, **no hay backend ni integraciones
reales**. Lo siguiente está intencionalmente simulado con datos de ejemplo,
listo para que Kodarvia lo conecte a servicios reales más adelante:

| Función | Qué hace esta demo | Qué falta para producción |
|---|---|---|
| Login / registro de paciente | Busca el correo entre los pacientes guardados en `localStorage`; cualquier clave es válida | Autenticación real (Supabase Auth u otro proveedor), verificación de correo |
| Acceso del panel admin | Usuario/clave fijos (`admin` / `kodarvia2026`), visibles en la propia pantalla de acceso | Autenticación de staff con roles y permisos |
| Código QR del paciente | Se genera y dibuja en el navegador (`qrcode.react`) a partir de un ID único guardado en `localStorage` | Nada adicional: ya es un QR real y escaneable, solo que no hay cámara para leerlo |
| Lectura de QR en el panel admin | El staff escribe o pega el código (o usa los accesos rápidos de la demo) en vez de apuntar una cámara | Lector óptico nativo con la cámara del dispositivo |
| Notificaciones / avisos | El feed de novedades vive en `localStorage` y se actualiza al instante entre vistas | Envío real de push, email o WhatsApp |
| Consentimiento de privacidad | Checkbox con texto de marcador en el registro | Texto legal definitivo redactado por Kodarvia |
| Persistencia de datos | 100% `localStorage` del navegador (pacientes, premios, novedades, historial) | Base de datos real en producción |

**Nota sobre "Supabase" en las skills del encargo:** la ficha de postulación
lista `Supabase` entre las skills requeridas, pero el briefing (avisos de
Kodarvia y la descripción del encargo) es explícito en que **no se conecta
ningún backend**: "Sin backend: todo en localStorage. Kodarvia integra el
backend, las políticas y el despliegue." Este proyecto no usa Supabase ni
ningún otro backend por diseño; toda la persistencia es local, tal como pide
el briefing.

## Datos de ejemplo precargados

La app nunca arranca vacía. Al primer uso se precargan en `localStorage`:

- **5 pacientes ficticios** con historial real (Javiera, Matías, Francisca,
  Diego y Camila), cubriendo los tres niveles: Bronce, Plata y Oro.
- **10 premios** de kinesiología deportiva (evaluación de pisada,
  presoterapia, masaje descontracturante, dry needling, bandas elásticas,
  etc.).
- **5 publicaciones** en el feed de novedades (talleres, promociones,
  consejos kinésicos).
- **Historial de puntos** consistente: el saldo de cada paciente es siempre
  la suma de sus movimientos (acreditaciones y canjes), nunca un número
  suelto.

Ver [`MANUAL.md`](./MANUAL.md) para los correos y códigos QR de cada
paciente demo.

## Cómo reiniciar los datos de ejemplo

Hay dos formas:

1. **Desde la app:** botón **"Reiniciar"** en la esquina superior derecha de
   la barra de navegación (pide confirmación antes de borrar).
2. **Manualmente:** abre las herramientas de desarrollador del navegador →
   pestaña Application/Almacenamiento → Local Storage → elimina las claves
   que empiezan con `kodarvia_fidelizacion_` → recarga la página.

## Estructura del proyecto

```
src/
  data/        constantes, datos semilla y utilidades de localStorage
  context/     AppDataContext: estado global (pacientes, premios, historial…)
  utils/       niveles de fidelización, fechas, CSV, IDs
  components/
    shared/    marca, selector de vista, insignias, notificaciones
    patient/   login/registro, tarjeta con QR, catálogo, novedades
    admin/     acceso admin, búsqueda/escaneo, acreditación, canjes, CSV
```

## Despliegue (URL de previsualización)

Este repositorio no incluye un despliegue propio. Para generar la URL de
previsualización que pide el encargo, el proyecto está listo para publicarse
tal cual (sin variables de entorno ni backend) en cualquier hosting
estático, por ejemplo:

```bash
npm run build        # genera la carpeta dist/
npx vercel deploy dist --prod     # o: npx netlify deploy --prod --dir dist
```

(También funciona con GitHub Pages u otro hosting estático equivalente.)

## Licencia / confidencialidad

Material confidencial del encargo Kodarvia. No redistribuir como trabajo
propio sin autorización.
