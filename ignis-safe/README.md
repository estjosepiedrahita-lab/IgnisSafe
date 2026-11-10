# IGNIS SAFE · Asistente de Prevención de Incendios

Página web estática (HTML + CSS + JavaScript, sin dependencias ni instalación).
Basada en el prototipo de Figma «prueba».

## Cómo abrirla
Abre `index.html` en el navegador. Las tipografías se cargan desde Google Fonts (requiere internet).

## Estructura
```
index.html          Estructura base, encabezado, pie y ayuda flotante
css/styles.css      Estilos (colores y medidas del prototipo)
js/data.js          Todo el contenido educativo (fuegos, extintores, PASS, tutorial, FAQ)
js/analyzer.js      PUNTO DE CONEXIÓN del modelo que identifica el tipo de fuego
js/app.js           Pantallas, navegación, práctica, resultados y recorrido guiado
```

## Pantallas y navegación (rutas con #)
| Ruta | Pantalla |
|---|---|
| `#/` | Inicio y subida de imagen (Paso 1 de 3) |
| `#/analizando` | Progreso del análisis |
| `#/practica` | Elegir extintor (Paso 2) y ordenar PASS (Paso 3) |
| `#/resultados` | Comparación y explicación |
| `#/prevencion` | Resultado cuando no se detecta fuego |
| `#/guia` | Guía de seguridad (`#/guia/metodo-pass`, `#/guia/prevencion`, …) |
| `#/como-usar` | Tutorial de uso, recorrido guiado y preguntas frecuentes |

## Conectar el analizador
Edita `js/analyzer.js`: reemplaza el cuerpo de `analyze(file)`.
Debe devolver `{ fire: boolean, fireClass: 'A'|'B'|'C'|'D'|'F'|null, confidence: 0..1 }`.
Mientras no esté conectado, devuelve un resultado simulado marcado como «demostración»
(quita `demo: true` al conectar el modelo real para ocultar esa etiqueta).

Para probar cada clase sin modelo: abre `index.html?demo=A` (o B, C, D, F) y `?demo=none` para «sin fuego».
