/* ==========================================================================
   IGNIS SAFE · Contenido de la guía
   Todo el texto educativo vive aquí para que sea fácil de editar.
   ========================================================================== */
window.IGNIS_DATA = (function () {
  'use strict';

  /* Clases de fuego (clasificación A–F del prototipo) */
  const FIRE_CLASSES = {
    A: {
      key: 'A',
      title: 'Sólidos',
      examples: 'Madera, papel, tela y plásticos.',
      noteLabel: 'Mecanismo',
      note: 'Se busca enfriar el material o sofocar la llama para evitar la reignición de las brasas.',
      detected: 'Sólidos combustibles',
      best: 'agua',
      ok: ['espuma', 'pqs'],
      why: 'El agua enfría el material que arde y evita que las brasas vuelvan a encenderse. La espuma y el PQS también funcionan en este tipo de fuego.',
      warning: null
    },
    B: {
      key: 'B',
      title: 'Líquidos',
      examples: 'Gasolina, pinturas, aceites y disolventes.',
      noteLabel: 'Mecanismo',
      note: 'El objetivo principal es romper la reacción en cadena y sofocar el fuego impidiendo que el oxígeno llegue al vapor del combustible.',
      detected: 'Líquidos inflamables',
      best: 'espuma',
      ok: ['co2', 'pqs'],
      why: 'La espuma forma una capa sobre el líquido inflamable, corta el aporte de oxígeno y ayuda a evitar la reignición sin dispersar el líquido.',
      warning: 'El agua puede esparcir el líquido ardiendo y propagar el fuego.'
    },
    C: {
      key: 'C',
      title: 'Gases',
      examples: 'Propano, butano, acetileno, metano y gas natural.',
      noteLabel: 'Advertencia',
      note: 'En un incendio de gas, lo prioritario suele ser cortar el suministro antes de intentar extinguir la llama, para evitar acumulaciones explosivas.',
      detected: 'Gases inflamables',
      best: 'pqs',
      ok: [],
      why: 'El polvo químico seco interrumpe la reacción en cadena de la llama. Aun así, lo primero es cortar el suministro de gas: apagar la llama sin cortar la fuga puede provocar una acumulación explosiva.',
      warning: 'Apagar la llama sin cortar la fuga puede crear una mezcla explosiva.'
    },
    D: {
      key: 'D',
      title: 'Metales especiales',
      examples: 'Magnesio, sodio, potasio, titanio y aluminio.',
      noteLabel: 'Importancia',
      note: '¡Jamás uses agua aquí! El agua en contacto con un fuego de magnesio, por ejemplo, provoca una reacción explosiva violenta.',
      detected: 'Metales combustibles',
      best: 'polvoD',
      ok: [],
      why: 'Los polvos especiales se funden sobre el metal caliente y forman una costra que lo aísla del oxígeno. El agua reaccionaría violentamente con el metal.',
      warning: 'El agua provoca una reacción violenta con el metal incandescente.'
    },
    F: {
      key: 'F',
      title: 'Aceites y grasas de cocina',
      examples: 'Aceites y grasas vegetales o animales utilizados en aparatos de cocina.',
      noteLabel: 'Dónde ocurre',
      note: 'Esencial en hostelería y cocinas domésticas. Si es seguro hacerlo, tapa el recipiente y corta la fuente de calor.',
      detected: 'Aceites y grasas de cocina',
      best: 'acetato',
      ok: [],
      why: 'El acetato de potasio produce una capa jabonosa que sella la superficie y enfría el aceite hirviendo, evitando que se reavive.',
      warning: 'El agua sobre aceite hirviendo provoca salpicaduras y llamaradas violentas.'
    }
  };

  /* Extintores */
  const EXTINGUISHERS = [
    {
      id: 'agua', name: 'Hídrico (agua)', short: 'Hídrico', icon: 'droplet',
      detail: 'Enfría el material combustible. Excelente para fuegos de Clase A; algunos modelos de agua pulverizada con aditivos sirven para Clase F.',
      classes: ['A'], tags: ['A'],
      caution: 'No usar en líquidos inflamables, metales ni equipos eléctricos energizados.'
    },
    {
      id: 'espuma', name: 'Espuma', short: 'Espuma', icon: 'beaker',
      detail: 'Forma una capa que sofoca el fuego y evita la reignición.',
      classes: ['A', 'B'], tags: ['A', 'B'],
      caution: 'No es adecuada para equipos eléctricos energizados.'
    },
    {
      id: 'co2', name: 'CO₂', short: 'CO₂', icon: 'wind',
      detail: 'No deja residuos y desplaza el oxígeno. Ideal para líquidos inflamables y equipos eléctricos.',
      classes: ['B'], tags: ['B', 'Eléctrico'],
      caution: 'Alcance corto y poco efecto sobre brasas profundas.'
    },
    {
      id: 'pqs', name: 'Polvo químico seco (ABC)', short: 'PQS (ABC)', icon: 'sparkles',
      detail: 'Multipropósito: sirve para fuegos de Clase A, B y C.',
      classes: ['A', 'B', 'C'], tags: ['A', 'B', 'C'],
      caution: 'Desventaja: el polvo ensucia, es corrosivo y reduce la visibilidad al dispararse. Puede adherirse a componentes electrónicos.'
    },
    {
      id: 'polvoD', name: 'Polvo especial (Clase D)', short: 'Polvo especial', icon: 'flask',
      detail: 'Contiene polvos específicos que se funden sobre el metal caliente y crean una costra que lo aísla del oxígeno.',
      classes: ['D'], tags: ['D'],
      caution: 'Solo para metales combustibles; no sirve para otras clases.'
    },
    {
      id: 'acetato', name: 'Acetato de potasio', short: 'Acetato de potasio', icon: 'pan',
      detail: 'Extintor de Clase F. Al contacto con aceite hirviendo produce una capa jabonosa que sella la superficie y enfría el aceite.',
      classes: ['F'], tags: ['F'],
      caution: 'Diseñado para cocinas; no es multipropósito.'
    }
  ];

  /* Método PASS (Pull · Aim · Squeeze · Sweep) */
  const PASS_STEPS = [
    { id: 'retirar',   label: 'Retirar el pasador',                      short: 'Retirar pasador',   letter: 'P', english: 'Pull',    icon: 'pin',    desc: 'Rompe el sello y libera el mecanismo.' },
    { id: 'dirigir',   label: 'Dirigir la boquilla a la base del fuego', short: 'Apuntar a la base', letter: 'A', english: 'Aim',     icon: 'nozzle', desc: 'Mantén distancia y apunta al origen.' },
    { id: 'presionar', label: 'Presionar la manija',                     short: 'Presionar manija',  letter: 'S', english: 'Squeeze', icon: 'press',  desc: 'Aprieta para liberar el agente extintor.' },
    { id: 'barrido',   label: 'Hacer un barrido lateral',                short: 'Barrido lateral',   letter: 'S', english: 'Sweep',   icon: 'sweep',  desc: 'Cubre el área de lado a lado.' }
  ];
  const CORRECT_PASS = ['retirar', 'dirigir', 'presionar', 'barrido'];
  /* Orden en que se muestran mezclados en la práctica */
  const PASS_SHUFFLED = ['dirigir', 'retirar', 'barrido', 'presionar'];

  /* Qué hacer ante un incendio */
  const ACTION_PLAN = [
    { icon: 'bell',  title: 'Da la alarma', text: 'Activa la alarma o avisa en voz alta a quienes estén cerca. Cuanto antes se sepa, más tiempo hay para evacuar.' },
    { icon: 'exit',  title: 'Evacúa', text: 'Sal por la ruta más cercana y cierra las puertas al salir para frenar el humo. No uses ascensores y no regreses por tus pertenencias.' },
    { icon: 'phone', title: 'Llama a emergencias', text: 'Desde un lugar seguro, llama al número de emergencias de tu país (en Colombia, 123) e indica la dirección y qué está ardiendo.' },
    { icon: 'extinguisher', title: 'Decide si combatirlo', text: 'Solo si el fuego es pequeño, tienes una salida a tu espalda y sabes usar el extintor adecuado. Ante la duda, sal.' }
  ];

  const DO_NOT_FIGHT = [
    'El fuego ya se extendió más allá de su origen o crece rápido.',
    'Hay humo denso que reduce la visibilidad o dificulta respirar.',
    'No sabes qué material está ardiendo o no tienes el extintor adecuado.',
    'Tu única salida queda del otro lado del fuego.',
    'Se trata de una fuga de gas que no puedes cortar con seguridad.'
  ];

  const SMOKE_TIPS = [
    'Agáchate: el aire más limpio está cerca del suelo.',
    'Cubre nariz y boca con un paño, de ser posible húmedo.',
    'Antes de abrir una puerta, tócala con el dorso de la mano: si está caliente, no la abras.'
  ];

  /* Lista de prevención */
  const PREVENTION = [
    { title: 'Revisa conexiones', text: 'Evita sobrecargar enchufes y sustituye cables deteriorados.' },
    { title: 'Despeja las salidas', text: 'Mantén libres las rutas de evacuación y señalízalas.' },
    { title: 'Ubica el extintor', text: 'Comprueba su vigencia y asegúrate de que sea accesible.' },
    { title: 'Vigila la cocina', text: 'No dejes sartenes ni hornillas encendidas sin supervisión.' },
    { title: 'Guarda con cuidado', text: 'Almacena líquidos inflamables en recipientes cerrados, ventilados y lejos de fuentes de calor.' },
    { title: 'Detectores de humo', text: 'Instálalos y pruébalos con regularidad.' },
    { title: 'Define un punto de encuentro', text: 'Acuerda con tu familia o equipo dónde reunirse tras evacuar.' }
  ];

  /* Tutorial de uso, en el orden recomendado */
  const TUTORIAL_STEPS = [
    {
      n: '01', title: 'Conoce la guía', where: 'Guía de seguridad',
      what: 'Reúne los tipos de fuego, los extintores, el método PASS y el plan de acción ante un incendio.',
      how: 'Recórrela de arriba abajo. Toca una clase de fuego (A, B, C, D o F) para ver qué extintores sirven y cuáles no.',
      cta: 'Abrir la guía', href: '#/guia'
    },
    {
      n: '02', title: 'Sube una imagen', where: 'Inicio · Paso 1 de 3',
      what: 'Es el punto de partida del modo análisis: la imagen de una situación para practicar la decisión.',
      how: 'Arrastra un archivo JPG, PNG o WEBP (máx. 10 MB) a la zona punteada o pulsa «Seleccionar imagen».',
      cta: 'Ir a subir imagen', href: '#/analisis'
    },
    {
      n: '03', title: 'Espera el análisis', where: 'Pantalla de análisis',
      what: 'La herramienta revisa si hay fuego en la imagen y de qué clase es.',
      how: 'No tienes que hacer nada. Si no hay fuego verás consejos de prevención; si lo hay, pasas a la práctica.',
      cta: null
    },
    {
      n: '04', title: 'Elige el extintor', where: 'Práctica · Paso 2 de 3',
      what: 'Decide qué extintor usarías para la clase de fuego detectada.',
      how: 'Pulsa una de las opciones; puedes cambiar tu elección las veces que quieras antes de continuar.',
      cta: null
    },
    {
      n: '05', title: 'Ordena el método PASS', where: 'Práctica · Paso 3 de 3',
      what: 'Practica la secuencia correcta para operar un extintor.',
      how: 'Pulsa las acciones en el orden en que las harías. «Reiniciar» borra la secuencia y «Comprobar orden» la valida.',
      cta: null
    },
    {
      n: '06', title: 'Revisa tus resultados', where: 'Resultados',
      what: 'Compara tu respuesta con lo recomendado y lee el porqué.',
      how: 'Pulsa «Ver resultado de la práctica» cuando hayas completado los dos pasos. Desde allí puedes analizar otra imagen o volver al inicio.',
      cta: null
    }
  ];

  const IMAGE_TIPS = [
    'Usa una imagen nítida, con buena luz y donde el fuego (o la zona) se vea completo.',
    'Evita capturas con mucho zoom, filtros o texto encima.',
    'Formatos permitidos: JPG, PNG o WEBP, de hasta 10 MB.',
    'Nunca te acerques a un fuego real para tomar una foto: usa imágenes de ejemplo o archivo.'
  ];

  const FAQ = [
    { q: '¿Se guarda mi imagen?', a: 'Según el diseño del proyecto, tu imagen se utiliza únicamente durante la práctica y no se almacena ni se comparte.' },
    { q: '¿Qué pasa si mi imagen no tiene fuego?', a: 'Verás un resultado de «No se detectó fuego» con tres consejos de prevención y un botón para volver al inicio. También puedes ver ese ejemplo desde el inicio sin subir nada.' },
    { q: '¿Puedo repetir la práctica?', a: 'Sí. Desde la pantalla de resultados pulsa «Analizar otra imagen» y vuelves al paso 1.' },
    { q: '¿Puedo cambiar mi respuesta?', a: 'Antes de ver el resultado sí: puedes cambiar el extintor y reiniciar la secuencia PASS cuantas veces quieras.' },
    { q: '¿Esto reemplaza una capacitación oficial?', a: 'No. Es una herramienta educativa; en tu lugar de trabajo o estudio consulta la capacitación y los protocolos oficiales.' }
  ];

  return {
    FIRE_CLASSES, EXTINGUISHERS, PASS_STEPS, CORRECT_PASS, PASS_SHUFFLED,
    ACTION_PLAN, DO_NOT_FIGHT, SMOKE_TIPS, PREVENTION,
    TUTORIAL_STEPS, IMAGE_TIPS, FAQ
  };
})();
