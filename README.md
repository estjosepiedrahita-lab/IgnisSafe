# IGNIS SAFE · Asistente de Prevención de Incendios

Página web estática (HTML + CSS + JavaScript, sin dependencias ni instalación).
Basada en el prototipo de Figma «prueba».

## Cómo abrirla
Abre `index.html` en el navegador (o con la extensión Live Server de VS Code).
Las tipografías se cargan desde Google Fonts (requiere internet).

## Estructura
```
index.html              Estructura base, pie de página y botón de ayuda
css/styles.css          Estilos (colores y medidas del prototipo)
js/data.js              Contenido educativo (fuegos, extintores, PASS, tutorial, preguntas frecuentes)
js/escenarios.js        BANCO DE IMÁGENES de la práctica (aquí agregas tus imágenes)
js/app.js               Pantallas, navegación, práctica y recorrido guiado
img/escenarios/         Carpeta donde van las imágenes
```

## Pantallas y navegación (rutas con #)
| Ruta | Pantalla |
|---|---|
| `#/` | Inicio |
| `#/cargando` | Pantalla de carga (el sistema prepara una imagen al azar) |
| `#/practica` | Imagen a la izquierda, tres preguntas a la derecha, «Confirmar respuestas» |
| `#/guia` | Guía de seguridad (`#/guia/metodo-pass`, `#/guia/plan-de-accion`, …) |
| `#/como-usar` | Tutorial de uso, recorrido guiado y preguntas frecuentes |

El botón «?» (esquina inferior derecha) está en todas las pantallas y lleva a cada sección.

## Cómo funciona la práctica
1. El usuario pulsa «Comenzar práctica»; el sistema elige una imagen al azar (sin repetir la misma dos veces seguidas).
2. Responde: tipo de fuego, extintor y orden del método PASS.
3. Al pulsar «Confirmar respuestas» (se activa cuando las tres están respondidas), las respuestas se bloquean y debajo de la imagen aparecen las respuestas correctas, la comparación, el puntaje y la explicación.

## Agregar tus imágenes
1. Copia las imágenes en `img/escenarios/`.
2. En `js/escenarios.js` agrega una línea por imagen:
   ```js
   { src: 'img/escenarios/cocina-1.jpg', fireClass: 'F', alt: 'Aceite ardiendo en una sartén' },
   ```
   `fireClass` es la clase correcta: `A` sólidos · `B` líquidos · `C` gases · `D` metales · `F` aceites de cocina.

Mientras la lista esté vacía, la práctica usa 5 ilustraciones de ejemplo (una por clase), marcadas como «imagen de ejemplo».

## Extintores válidos
Qué extintores se aceptan como correctos se calcula a partir de las clases de cada extintor en `js/data.js`
(`EXTINGUISHERS[...].classes`), y el recomendado de cada clase es `FIRE_CLASSES[...].best`.
