/* ==========================================================================
   IGNIS SAFE · Punto de conexión del analizador de fuego
   --------------------------------------------------------------------------
   Aquí es donde se conecta el modelo que identifica el tipo de fuego.
   La página YA tiene todo el flujo armado (subida, pantalla de análisis,
   práctica, resultados). Solo falta reemplazar el cuerpo de `analyze`.

   CONTRATO
   --------
   FireAnalyzer.analyze(file: File) -> Promise<{
     fire:       boolean,                      // ¿se detectó fuego?
     fireClass:  'A' | 'B' | 'C' | 'D' | 'F' | null,   // null si fire = false
     confidence: number                        // entre 0 y 1 (ej. 0.94)
   }>

   - Si ocurre un error, lanza una excepción (throw): la página mostrará un
     mensaje con la opción de reintentar.
   - Si el resultado trae `demo: true`, la página muestra la etiqueta
     «Resultado de demostración». Quítala al conectar el modelo real.

   Ejemplos de conexión:
     // 1) API propia
     const body = new FormData(); body.append('image', file);
     const r = await fetch('/api/analizar', { method: 'POST', body });
     if (!r.ok) throw new Error('El servicio no respondió');
     return await r.json();

     // 2) Modelo en el navegador (TensorFlow.js, ONNX Runtime Web, etc.)
     //    cargar el modelo una vez y ejecutarlo sobre la imagen.
   ========================================================================== */
window.FireAnalyzer = (function () {
  'use strict';

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* MODO DEMOSTRACIÓN (temporal) ------------------------------------------
     Devuelve un resultado simulado para poder recorrer toda la página.
     Para probar cada clase sin modelo, abre la página con ?demo=A|B|C|D|F
     (o ?demo=none para simular «sin fuego»). */
  async function analyze(file) {
    await wait(400);
    const param = (new URLSearchParams(window.location.search).get('demo') || 'B').toUpperCase();
    if (param === 'NONE') {
      return { fire: false, fireClass: null, confidence: 0.97, demo: true };
    }
    const fireClass = ['A', 'B', 'C', 'D', 'F'].includes(param) ? param : 'B';
    return { fire: true, fireClass: fireClass, confidence: 0.94, demo: true };
  }

  return { analyze: analyze };
})();
