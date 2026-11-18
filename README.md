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
js/app.js               Pantallas, navegación, práctica, modelo y recorrido guiado
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
| `#/guia` | Guía de seguridad (`#/guia/metodo-pass`, `#/guia/plan-de-accion`, …) |
| `#/como-usar` | Tutorial de uso, recorrido guiado y preguntas frecuentes |

El botón «?» (esquina inferior derecha) está en todas las pantallas y lleva a cada sección.

## Cómo funciona la práctica
1. El usuario pulsa «Comenzar práctica»; el sistema elige una imagen al azar. Las respuestas correctas del caso (clase de fuego, extintor, método PASS) quedan guardadas pero **no se muestran**.
2. Mientras el usuario observa la imagen, el modelo de IA la analiza en segundo plano (tampoco muestra nada todavía).
3. El usuario responde: tipo de fuego, extintor y orden del método PASS.
4. Al pulsar «Confirmar respuestas» las respuestas se bloquean y debajo de la imagen aparecen las correctas, la comparación con las del usuario, el puntaje, la explicación y la **detección del modelo** (zona de fuego sobre la foto y porcentaje de área).
5. «Practicar con otra imagen» trae otra distinta: **no se repite ninguna hasta haber visto todo el banco** (también al recargar la página; se guarda en el navegador). Al terminar la ronda empieza otra y la página lo avisa; la primera de la ronda nueva nunca es la última vista.

## Banco de imágenes
El banco tiene 12 imágenes en `img/escenarios/`, registradas en `js/escenarios.js`:

| Respuesta | Imágenes |
|---|---|
| A · sólidos | `a-incendio-forestal.jpg`, `a-tronco-ardiendo.jpg` |
| B · líquidos | `b-liquido-recipiente.jpg`, `b-tanques-combustible.jpg` |
| C · gases y eléctricos | `c-tomacorriente.jpg`, `c-caja-electrica.jpg` (extintor recomendado: CO₂) |
| D · metales | `d-vehiculo-metal.jpg`, `d-bateria-vehiculo.jpg` |
| F · aceites de cocina | `f-sarten-estufa.jpg`, `f-cocina-industrial.jpg` |
| Sin fuego | `sin-fuego-humo-extinguido.jpg`, `sin-fuego-humo-bosque.jpg` |

Para agregar otra, cópiala en `img/escenarios/` y añade una línea en `js/escenarios.js`:
```js
{ src: 'img/escenarios/cocina-3.jpg', fireClass: 'F', alt: 'Aceite ardiendo en una sartén' },
```
- `fireClass`: `A`, `B`, `C`, `D`, `F` o `none` (sin fuego).
- `best` (opcional): extintor recomendado para ese caso si es distinto del de la clase (`agua`, `espuma`, `co2`, `pqs`, `polvoD`, `acetato`).
- `nota` (opcional): explicación extra que aparece al confirmar.

### Casos «Sin fuego»
La primera pregunta incluye la opción **Sin fuego**. Si el usuario la elige, las preguntas del extintor y del PASS quedan bloqueadas («No aplica») y puede confirmar directamente.
- Caso sin fuego: se califica solo el tipo de fuego (puntaje sobre 1).
- Caso con fuego en el que el usuario respondió «Sin fuego»: puntaje 0/3 y se muestran las tres respuestas correctas.

Si la lista quedara vacía, la práctica usaría 5 ilustraciones de ejemplo (una por clase).

## Extintores válidos
Qué extintores se aceptan como correctos se calcula a partir de las clases de cada extintor en `js/data.js`
(`EXTINGUISHERS[...].classes`), y el recomendado de cada clase es `FIRE_CLASSES[...].best` (o el `best` del caso en `js/escenarios.js`).

## Modelo de detección de fuego (U-Net)
Integra `unet_fuego.pt`: una U-Net de segmentación (entrada RGB 256×256, salida de 1 canal, umbral 0,5, ~2 M de parámetros).
- **Qué hace:** marca los píxeles que considera fuego y calcula qué porcentaje de la imagen ocupan. Si es menos del 0,5 % dice que no detectó fuego (`IgnisUNet.MIN_FRACTION`).
- **Qué no hace:** no clasifica A/B/C/D/F (solo segmenta). La clase correcta de cada imagen sale de `js/escenarios.js` (`fireClass`).
- **Dónde corre:** en el navegador del usuario (JavaScript puro, ~7–10 s por imagen, sin bloquear la página). La imagen no se envía a ningún servidor.
- **Carga diferida:** `js/unet.js` y `model/unet_fuego.js` (~10 MB) se descargan al empezar una práctica con imágenes reales.
- **Importante:** para leer los píxeles de las imágenes del banco el navegador exige abrir la página por **http** (extensión Live Server de VS Code, o GitHub Pages). Abierta como archivo (`file://`) la práctica funciona igual, pero el recuadro de detección avisa de que el navegador lo bloquea.

### Supuestos del preprocesamiento (ajustables en `js/unet.js` → `CONFIG`)
El `.pt` solo trae los pesos, no el código de entrenamiento, así que dos detalles se dedujeron:
- **Normalización de entrada:** píxeles 0–1 (`mean [0,0,0]`, `std [1,1,1]`). Si entrenaste con ImageNet, cambia `mean`/`std` en `CONFIG`.
- **Orden de concatenación del decodificador:** `up-first` = `torch.cat([sube, codificador])`. Con una llama sintética el otro orden no detecta nada; este sí.
Verificación: la salida en JavaScript coincide con una implementación de referencia en NumPy (diferencia máxima 8e-7). Prueba la precisión real con tus imágenes de fuego.

### Regenerar los pesos
Si reentrenas el modelo, vuelve a exportar `model/unet_fuego.js` con las mismas capas (`e1..e4`, `cuello`, `u4..u1`, `d4..d1`, `out`).
