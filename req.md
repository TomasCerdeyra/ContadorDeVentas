# Documento de Requerimientos: Fast-Sales Counter App

## 1. Contexto del Proyecto
El objetivo es desarrollar una aplicación web de alta velocidad para el conteo de ventas en barras de eventos o boliches. La aplicación está diseñada para ser utilizada en **tablets** (modo horizontal) con una interfaz de "fricción cero", donde un solo toque registra una venta.

## 2. Stack Tecnológico
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion (para feedback visual)
- **Estado/Persistencia:** LocalStorage (persistente ante recargas)
- **Librerías Extra:** `xlsx` para la exportación de datos.

## 3. Arquitectura de Datos
La aplicación debe consumir los productos de un archivo estático para facilitar cambios rápidos:
- `src/data/products.json`: Array de 8 objetos con `id`, `name`, y `color` (hex).

## 4. Especificaciones de Pantalla

### Home (Index `/`)
- **Layout:** Grid de **4 columnas x 2 filas** que cubra el `100vw` y `100vh`. No debe existir scroll.
- **Botones de Producto:** - Ocupan todo el espacio disponible en la celda.
  - El fondo es el color definido en el JSON.
  - Texto grande, en negrita y centrado (ej: "VODKA + SPEED").
- **Experiencia de Usuario (UX):**
  - Al tocar, se suma **+1** automáticamente.
  - **Animación de Feedback:** Al hacer tap, debe emerger un texto flotante (`+1` o `¡ANOTADO!`) desde la posición del botón que suba y desaparezca con opacidad (estilo partícula).
  - Efecto de escala (`scale-95`) al presionar para simular un botón físico.

### Administración (`/ventas`)
- **Reporte:** Tabla minimalista con los nombres de productos y sus totales.
- **Acciones:**
  - **Botón Exportar:** Descargar un archivo `.xlsx` con el nombre `ventas_dd_mm_aaaa.xlsx`.
  - **Botón Resetear:** Botón rojo para limpiar el LocalStorage y volver todos los contadores a cero.

## 5. Instrucciones de Generación para la IA
> "Genera el código completo siguiendo esta estructura. Prioriza el rendimiento táctil y asegúrate de que el archivo `useSales.ts` (hook) maneje correctamente la sincronización con LocalStorage para evitar pérdida de datos si se cierra el navegador."