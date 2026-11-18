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
js/app.js               Pantallas, navegación, práctica, analizador y recorrido guiado
js/unet.js              Motor de la U-Net: ejecuta el modelo en el navegador (sin librerías)
model/unet_fuego.js     Pesos del modelo unet_fuego.pt (BatchNorm ya fusionada)
img/escenarios/         Carpeta donde van las imágenes
```

## Pantallas y navegación (rutas con #)
| Ruta | Pantalla |
|---|---|
| `#/` | Inicio |
| `#/cargando` | Pantalla de carga (el sistema prepara una imagen al azar) |
| `#/practica` | Imagen a la izquierda, tres preguntas a la derecha, «Confirmar respuestas» |
| `#/analizador` | Analizador de fuego: subes una imagen y el modelo marca las llamas |
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

## Analizador de fuego (modelo U-Net)
Integra `unet_fuego.pt`: una U-Net de segmentación (entrada RGB 256×256, salida de 1 canal, umbral 0,5, ~2 M de parámetros).
- **Qué hace:** marca los píxeles que considera fuego y calcula qué porcentaje de la imagen ocupan. Si es menos del 0,5 % dice «No se detectó fuego» (`IgnisUNet.MIN_FRACTION`).
- **Qué no hace:** no clasifica A/B/C/D/F (el modelo solo segmenta). Tras la detección, el usuario elige la clase y la página muestra el extintor correspondiente (datos de `js/data.js`).
- **Dónde corre:** en el navegador del usuario (JavaScript puro, ~7–10 s por imagen); la imagen no se sube a ningún servidor. Funciona abriendo `index.html` directamente.
- **Carga diferida:** `js/unet.js` y `model/unet_fuego.js` (~10 MB) solo se descargan al entrar al analizador.

### Supuestos del preprocesamiento (ajustables en `js/unet.js` → `CONFIG`)
El `.pt` solo trae los pesos, no el código de entrenamiento, así que dos detalles se dedujeron:
- **Normalización de entrada:** píxeles 0–1 (`mean [0,0,0]`, `std [1,1,1]`). Si entrenaste con ImageNet, cambia `mean`/`std` en `CONFIG`.
- **Orden de concatenación del decodificador:** `up-first` = `torch.cat([sube, codificador])`. Con una llama sintética el otro orden no detecta nada; este sí.
Verificación: la salida en JavaScript coincide con una implementación de referencia en NumPy (diferencia máxima 8e-7). Prueba la precisión real con tus imágenes de fuego.

### Regenerar los pesos
Si reentrenas el modelo, vuelve a exportar `model/unet_fuego.js` con las mismas capas (`e1..e4`, `cuello`, `u4..u1`, `d4..d1`, `out`).
