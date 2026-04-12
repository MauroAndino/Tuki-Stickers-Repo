# TUKI! STICKERS MVP

MVP local para probar el flujo base de:

- catalogo de stickers
- carga de imagen por modelo
- filtros por stock, fecha, tematica, vinilo y unidades
- registro de ventas
- modo rapido de feria
- registro de ingresos
- control de stock
- metricas, graficos y reporte asistido

## Como usarlo en compu

1. Abre `index.html` en tu navegador.
2. Si quieres ver un ejemplo rapido, usa el boton `Cargar demo`.
3. Carga tus propios modelos desde `Catalogo`.
4. Registra ventas desde `Ventas`, usando el modo rapido o la carga manual.
5. Registra reposiciones desde `Ingresos`.
6. Revisa el resumen y el panel `Asistente`.

## Como usarlo en el celular

1. En tu compu, abre PowerShell dentro de esta carpeta.
2. Ejecuta:

```powershell
.\start-local.ps1
```

3. El script te va a mostrar una o varias direcciones tipo `http://192.168.1.39:8000`.
4. Conecta el celular al mismo Wi-Fi que la compu.
5. Abre esa direccion en Chrome desde el celular.
6. Si quieres, usa `Agregar a pantalla de inicio` para tenerlo como app web.

## Notas importantes para esta etapa

- esta version sigue guardando datos en el navegador del dispositivo
- eso significa que compu y celular todavia no sincronizan solos
- el modo movil ya queda mucho mejor para probar interfaz, camara y flujo real
- el siguiente paso sera agregar backend y base de datos para sincronizacion real

## Version sincronizada entre celu y compu

Esta carpeta ya quedo preparada para una sincronizacion simple usando Supabase.

### 1. Crear la base remota

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor.
3. Ejecuta el contenido de [supabase-schema.sql](C:\Users\IPEEM\Documents\New project\supabase-schema.sql).

### 2. Configurar la app

1. Abre [config.js](C:\Users\IPEEM\Documents\New project\config.js).
2. Completa:

```js
window.TUKI_REMOTE_CONFIG = {
  enabled: true,
  supabaseUrl: "https://TU-PROYECTO.supabase.co",
  supabaseAnonKey: "TU-ANON-KEY",
  stateRowId: "main",
};
```

### 3. Publicar la app con HTTPS

Como esta app es estatica, puedes subir esta misma carpeta a un hosting estatico con HTTPS.

Opciones practicas:
- Vercel
- Netlify
- Cloudflare Pages

### 4. Resultado esperado

- abres la misma URL en compu y celular
- ambos leen el mismo estado remoto
- la camara del celular funciona porque la app corre en HTTPS
- las ventas, ingresos y catalogo quedan compartidos

## Que guarda este MVP

Los datos se guardan en el navegador usando `localStorage`.

Eso significa:

- funciona sin servidor
- los datos quedan en ese navegador
- si borras los datos del navegador o cambias de dispositivo, no se sincronizan

## Objetivo de esta version

Validar contigo:

- que el flujo operativo sirva
- que las metricas sean utiles
- que el reporte se acerque a las decisiones que tomas

## Siguiente evolucion posible

- importacion y exportacion de datos
- carga por imagen con IA para clasificar stickers
- filtros por fechas y canal
- graficos mas avanzados
- backend y base de datos reales
- tienda online conectada al stock
