/* ==========================================================================
   IGNIS SAFE · Banco de imágenes de la práctica
   --------------------------------------------------------------------------
   Aquí agregas las imágenes que el sistema muestra al azar.

   1) Copia las imágenes en la carpeta  img/escenarios/
   2) Agrega una línea por imagen dentro de la lista:

      { src: 'img/escenarios/cocina-1.jpg', fireClass: 'F', alt: 'Aceite ardiendo en una sartén' },

   - src        Ruta de la imagen (JPG, PNG o WEBP).
   - fireClass  Clase de fuego correcta: 'A', 'B', 'C', 'D' o 'F'.
                A sólidos · B líquidos · C gases · D metales · F aceites de cocina
   - alt        Descripción corta de la imagen (para lectores de pantalla).
   - id         (Opcional) Un nombre único. Si no lo pones, se genera solo.

   La práctica elige una imagen al azar y evita repetir la misma dos veces
   seguidas. Mientras la lista esté vacía, se usan 5 ilustraciones de ejemplo
   (una por clase) marcadas como «imagen de ejemplo».
   ========================================================================== */
window.IGNIS_SCENARIOS = [
  // { src: 'img/escenarios/ejemplo-1.jpg', fireClass: 'B', alt: 'Descripción de la imagen' },
];
