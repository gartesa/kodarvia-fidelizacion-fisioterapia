# Manual de uso — Kodarvia Fidelización

Manual breve para navegar la demo: cómo alternar entre la vista de paciente
y el panel de administración, y cómo simular el escaneo de puntos del QR.

## 1. Barra superior (siempre visible)

En la franja azul superior hay dos controles, disponibles en cualquier
pantalla de la app:

- **Paciente / Administración** — dos pestañas para alternar entre la vista
  del paciente y el panel de gestión del centro. Cada vista recuerda su
  propia sesión (puedes entrar como paciente, cambiar a Administración y
  volver a Paciente sin perder el inicio de sesión).
- **Reiniciar** — restaura todos los datos de ejemplo a su estado inicial
  (pide confirmación con un segundo toque).

## 2. Vista de paciente

### Ingresar

En "Ingresar", escribe el correo y la clave de la cuenta. Los **pacientes de
ejemplo precargados** no tienen clave propia: aceptan cualquier valor no
vacío, para agilizar la demo. Un **paciente creado desde "Registrarme"**
debe ingresar exactamente la clave que definió al registrarse. Para
agilizar la demo con los pacientes de ejemplo, los chips bajo el formulario
autocompletan el correo de cada uno:

| Paciente | Correo |
|---|---|
| Javiera Soto Pizarro | `javiera.soto@gmail.com` |
| Matías Contreras Vega | `matias.contreras@gmail.com` |
| Francisca Muñoz Rojas | `francisca.munoz@gmail.com` |
| Diego Araya Fernández | `diego.araya@gmail.com` |
| Camila Vergara Espinoza | `camila.vergara@gmail.com` |

### Registrarme

La pestaña "Registrarme" crea un paciente nuevo (nombre, correo, clave,
teléfono y disciplina opcionales) y exige aceptar el checkbox de
consentimiento de privacidad antes de continuar. No se puede registrar dos
veces el mismo correo. El paciente nuevo arranca con un bono de bienvenida
de 50 puntos y queda con sesión iniciada de inmediato; esa clave es la que
deberá usar la próxima vez que entre desde "Ingresar".

### Pestañas inferiores

- **Tarjeta** — nivel de fidelización, puntos, código QR y barra de progreso
  al siguiente nivel.
- **Premios** — catálogo canjeable. El botón se bloquea automáticamente si
  el paciente no tiene puntos suficientes; con un primer toque pide
  confirmación y con el segundo registra el canje.
- **Novedades** — avisos del centro, con indicador de no leídos y botón
  "Marcar como leído" por aviso.

## 3. Panel de administración

### Acceso

Usuario y clave de demostración (quedan visibles en la propia pantalla de
acceso):

```
Usuario: admin
Clave:   kodarvia2026
```

### Cómo simular el escaneo de puntos del QR

El personal no usa una cámara real (eso lo integrará Kodarvia en
producción). En su lugar:

1. En la pestaña **Pacientes**, ve al bloque **"Simular lectura de código
   QR"**.
2. Escribe o pega el código que aparece impreso bajo el QR en la tarjeta del
   paciente (visible en la vista de paciente → Tarjeta → "Código de
   tarjeta"). Los códigos de los pacientes de ejemplo son:

   | Paciente | Código QR |
   |---|---|
   | Javiera Soto Pizarro | `KDV-PAT-0001` |
   | Matías Contreras Vega | `KDV-PAT-0002` |
   | Francisca Muñoz Rojas | `KDV-PAT-0003` |
   | Diego Araya Fernández | `KDV-PAT-0004` |
   | Camila Vergara Espinoza | `KDV-PAT-0005` |

3. Pulsa **"Simular escaneo"**. La app imita brevemente la latencia de un
   lector óptico y abre la ficha del paciente encontrado.

Alternativamente, puedes **buscar por nombre o correo** en el campo de
abajo y tocar directamente la tarjeta del paciente en los resultados — útil
cuando el paciente no tiene su QR a mano.

### Acreditar puntos por sesión

Dentro de la ficha del paciente: elige un monto rápido (bono, sesión,
sesión extendida) o escribe un monto y motivo personalizados, y pulsa
**"Acreditar puntos"**. El saldo y el historial se actualizan al instante
(la propia pantalla muestra en milisegundos cuánto demoró la actualización).

### Registrar un canje

En la misma ficha, elige un premio del listado y pulsa **"Registrar
canje"**. El botón queda deshabilitado si el paciente no alcanza los puntos
necesarios para ese premio.

### Editar los datos de un paciente

En el bloque **"Datos del paciente"** de la ficha, pulsa **"Editar
datos"** para modificar nombre, correo, teléfono y disciplina. El teléfono
usa el mismo selector internacional (bandera + prefijo de país) que el
registro de paciente. Pulsa **"Guardar cambios"** para confirmar o
**"Cancelar"** para descartar. No es posible editar el historial de puntos
ni de canjes desde aquí — eso se gestiona siempre con **"Acreditar
puntos"** y **"Registrar canje"**.

### Eliminar un paciente

Al final de la ficha, en el bloque **"Zona de riesgo"**, pulsa **"Eliminar
paciente"**. La app pide confirmación explícita (**"Sí, eliminar"** /
**"Cancelar"**) antes de borrar: es una acción permanente que quita al
paciente de `localStorage` y de la lista de búsqueda.

### Publicar novedades y promociones

Pestaña **Novedades**: elige una categoría (Novedad, Promoción, Taller,
Consejo, Catálogo), escribe título y contenido, y pulsa **"Publicar en el
feed"**. La publicación aparece de inmediato en el feed de todos los
pacientes, sin recargar la página.

### Editar y eliminar publicaciones

En la misma pestaña **Novedades**, cada publicación de la lista
"Publicaciones existentes" tiene sus propios botones **"Editar"** y
**"Eliminar"**. Editar reutiliza el mismo formulario (categoría, título,
contenido) precargado con los datos actuales; la fecha original de
publicación no cambia. Eliminar pide confirmación explícita antes de
borrar. Ambos cambios se reflejan de inmediato en el feed de novedades del
paciente.

### Gestionar el catálogo de premios

Pestaña **Premios** (panel admin): permite crear, editar y eliminar los
premios canjeables, hoy sin necesidad de tocar código.

- **Crear un premio:** elige una categoría (Evaluación, Equipamiento,
  Terapia manual, Recuperación, Prevención), escribe nombre, puntos
  requeridos y descripción, y pulsa **"Agregar al catálogo"**.
- **Editar o eliminar:** cada premio de la lista tiene sus propios botones
  **"Editar"** (mismo formulario, precargado) y **"Eliminar"** (con
  confirmación explícita).

Los cambios se reflejan de inmediato tanto en el catálogo que ve el
paciente como en el selector de **"Registrar canje de premio"** del panel
admin. Si el premio seleccionado en ese selector se edita o elimina
mientras la ficha de un paciente sigue abierta, la selección cae de vuelta
al primer premio disponible (o muestra un aviso si el catálogo queda
vacío).

### Exportar actividad

Pestaña **Actividad**: lista completa de acreditaciones y canjes, con
filtros rápidos. El botón **"Exportar CSV"** descarga un archivo con las
columnas `fecha, paciente, accion, puntos` (respeta el filtro activo).

## 4. Cerrar sesión

- **Paciente:** botón "Cerrar sesión" en la cabecera de su vista (vuelve a
  la pantalla de ingreso/registro).
- **Administración:** botón "Salir" en la cabecera del panel (vuelve a la
  pantalla de acceso admin).
