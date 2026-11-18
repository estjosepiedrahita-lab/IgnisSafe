/* ==========================================================================
   IGNIS SAFE · Banco de imágenes de la práctica
   --------------------------------------------------------------------------
   Aquí están las imágenes que el sistema muestra al azar.

   Para agregar otra:
   1) Copia la imagen en la carpeta  img/escenarios/
   2) Agrega una línea dentro de la lista:

      { src: 'img/escenarios/cocina-3.jpg', fireClass: 'F', alt: 'Aceite ardiendo en una sartén' },

   - src        Ruta de la imagen (JPG, PNG o WEBP).
   - fireClass  Respuesta correcta: 'A', 'B', 'C', 'D', 'F' o 'none' (sin fuego).
                A sólidos · B líquidos · C gases y equipos eléctricos · D metales
                F aceites de cocina · none no hay llamas en la imagen
   - alt        Descripción corta de la imagen (para lectores de pantalla).
   - best       (Opcional) Extintor recomendado para ESTE caso, si es distinto del
                recomendado para la clase. Valores: 'agua', 'espuma', 'co2', 'pqs',
                'polvoD', 'acetato'.
   - nota       (Opcional) Explicación extra que aparece al confirmar las respuestas.
   - id         (Opcional) Un nombre único. Si no lo pones, se usa el nombre del archivo.

   Las respuestas correctas quedan guardadas aquí y solo se muestran después de
   que el usuario pulsa «Confirmar respuestas». Ninguna imagen se repite hasta
   que se hayan visto todas.
   ========================================================================== */
window.IGNIS_SCENARIOS = [
  // ---- Clase A · sólidos ----
  { src: 'img/escenarios/a-incendio-forestal.jpg', fireClass: 'A',
    alt: 'Incendio de vegetación en una ladera con un avión lanzando retardante',
    nota: 'A esta escala no se combate con un extintor portátil: aléjate y llama a emergencias (en Colombia, 123). El extintor solo sirve para un conato pequeño.' },
  { src: 'img/escenarios/a-tronco-ardiendo.jpg', fireClass: 'A',
    alt: 'Tronco de árbol con llamas en un bosque quemado' },

  // ---- Clase B · líquidos inflamables ----
  { src: 'img/escenarios/b-liquido-recipiente.jpg', fireClass: 'B',
    alt: 'Recipiente pequeño con líquido inflamable ardiendo junto a una botella de aditivo para combustible' },
  { src: 'img/escenarios/b-tanques-combustible.jpg', fireClass: 'B',
    alt: 'Tanques de almacenamiento de combustible en llamas con humo negro',
    nota: 'Un incendio de tanques industriales lo atienden los bomberos con espuma en grandes cantidades. Lo correcto para una persona es evacuar y dar aviso.' },

  // ---- Clase C · equipos eléctricos ----
  { src: 'img/escenarios/c-tomacorriente.jpg', fireClass: 'C', best: 'co2',
    alt: 'Tomacorriente de pared con dos clavijas conectadas y llamas saliendo de él',
    nota: 'Es un fuego eléctrico. Si puedes hacerlo con seguridad, corta la energía en el tablero. Usa CO₂ (no deja residuos) o polvo químico seco; nunca agua ni espuma.' },
  { src: 'img/escenarios/c-caja-electrica.jpg', fireClass: 'C', best: 'co2',
    alt: 'Caja de conexiones eléctricas con cables derretidos y llamas',
    nota: 'Es un fuego eléctrico. Corta la energía si puedes hacerlo con seguridad. Usa CO₂ o polvo químico seco; nunca agua ni espuma, porque conducen la electricidad.' },

  // ---- Clase D · metales ----
  { src: 'img/escenarios/d-vehiculo-metal.jpg', fireClass: 'D',
    alt: 'Automóvil en llamas en un campo de pruebas, con fuego intenso en la parte trasera',
    nota: 'Algunas piezas de vehículos contienen metales combustibles como magnesio o aluminio. El agua sobre esos metales provoca reacciones violentas.' },
  { src: 'img/escenarios/d-bateria-vehiculo.jpg', fireClass: 'D',
    alt: 'Batería de vehículo eléctrico ardiendo sobre el pavimento',
    nota: 'Las baterías de litio son un caso especial: pueden reavivarse durante horas. Aléjate, no respires el humo y llama a los bomberos.' },

  // ---- Clase F · aceites de cocina ----
  { src: 'img/escenarios/f-sarten-estufa.jpg', fireClass: 'F',
    alt: 'Sartén con aceite en llamas sobre una estufa eléctrica' },
  { src: 'img/escenarios/f-cocina-industrial.jpg', fireClass: 'F',
    alt: 'Llamarada sobre los fogones de una cocina industrial con un cocinero cerca' },

  // ---- Sin fuego ----
  { src: 'img/escenarios/sin-fuego-humo-extinguido.jpg', fireClass: 'none',
    alt: 'Personas con chalecos reflectivos observando humo blanco que sale de un recipiente metálico',
    nota: 'Solo queda humo blanco: el fuego ya fue extinguido. No hace falta usar el extintor, pero mantén la distancia porque el material puede seguir caliente.' },
  { src: 'img/escenarios/sin-fuego-humo-bosque.jpg', fireClass: 'none',
    alt: 'Humo blanco entre árboles de un bosque, sin llamas visibles',
    nota: 'Hay humo pero no se ven llamas. Que no haya fuego visible no significa que el riesgo terminó: puede haber brasas. Avisa y mantente atento.' }
];
