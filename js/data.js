/* ==========================================================================
   IGNIS SAFE · Contenido de la guía
   Todo el texto educativo vive aquí para que sea fácil de editar.
   ========================================================================== */
window.IGNIS_DATA = (function () {
  'use strict';

  /* Clases de fuego (clasificación A–F del prototipo).
     `best` es el extintor más adecuado. Los demás extintores válidos se
     calculan solos a partir de las clases de cada extintor (ver más abajo). */
  const FIRE_CLASSES = {
    A: {
      key: 'A',
      title: 'Sólidos',
      examples: 'Madera, papel, tela y plásticos.',
      noteLabel: 'Mecanismo',
      note: 'Se busca enfriar el material o sofocar la llama para evitar la reignición de las brasas.',
      detected: 'Sólidos combustibles',
      best: 'agua',
      why: 'El agua enfría el material que arde y evita que las brasas vuelvan a encenderse.',
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
      why: 'El acetato de potasio produce una capa jabonosa que sella la superficie y enfría el aceite hirviendo, evitando que se reavive.',
      warning: 'El agua sobre aceite hirviendo provoca salpicaduras y llamaradas violentas.'
    }
  };

  /* Extintores. `classes` = clases de fuego en las que sirve (se usa en la guía
     y para decidir qué respuestas son válidas en la práctica). */
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
      classes: ['A', 'B', 'C'], tags: ['A', 'B', 'C', 'Eléctrico'],
      caution: 'Alcance corto y poco efecto sobre brasas profundas, por eso en Clase A su efecto es limitado.'
    },
    {
      id: 'pqs', name: 'Polvo químico seco', short: 'PQS', icon: 'sparkles',
      detail: 'Multipropósito: sirve para fuegos de Clase A, B y C.',
      classes: ['A', 'B', 'C'], tags: ['A', 'B', 'C'],
      caution: 'Desventaja: el polvo ensucia, es corrosivo y reduce la visibilidad al dispararse. Puede adherirse a componentes electrónicos.'
    },
    {
      id: 'polvoD', name: 'Polvo especial', short: 'Polvo especial', icon: 'flask',
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

  /* Otros extintores válidos para cada clase (además del recomendado) */
  Object.keys(FIRE_CLASSES).forEach(function (k) {
    const c = FIRE_CLASSES[k];
    c.ok = EXTINGUISHERS
      .filter(function (e) { return e.classes.indexOf(k) !== -1 && e.id !== c.best; })
      .map(function (e) { return e.id; });
  });

  /* Método PASS (Pull · Aim · Squeeze · Sweep) */
  const PASS_STEPS = [
    { id: 'retirar',   label: 'Retirar el pasador',                      short: 'Retirar pasador',   letter: 'P', english: 'Pull',    icon: 'pin',    desc: 'Rompe el sello y libera el mecanismo.' },
    { id: 'dirigir',   label: 'Dirigir la boquilla a la base del fuego', short: 'Apuntar a la base', letter: 'A', english: 'Aim',     icon: 'nozzle', desc: 'Mantén distancia y apunta al origen.' },
    { id: 'presionar', label: 'Presionar la manija',                     short: 'Presionar manija',  letter: 'S', english: 'Squeeze', icon: 'press',  desc: 'Aprieta para liberar el agente extintor.' },
    { id: 'barrido',   label: 'Hacer un barrido lateral',                short: 'Barrido lateral',   letter: 'S', english: 'Sweep',   icon: 'sweep',  desc: 'Cubre el área de lado a lado.' }
  ];
  const CORRECT_PASS = ['retirar', 'dirigir', 'presionar', 'barrido'];

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

  /* Tutorial de uso, en el orden recomendado */
  const TUTORIAL_STEPS = [
    {
      n: '01', title: 'Conoce la guía', where: 'Guía de seguridad',
      what: 'Reúne los tipos de fuego, los extintores, el método PASS y el plan de acción ante un incendio.',
      how: 'Recórrela de arriba abajo. Toca una clase de fuego (A, B, C, D o F) para ver qué extintores sirven y cuáles no.',
      cta: 'Abrir la guía', href: '#/guia'
    },
    {
      n: '02', title: 'Comienza la práctica', where: 'Inicio',
      what: 'Es el punto de partida del modo práctica: el sistema te mostrará la imagen de un incendio al azar.',
      how: 'Pulsa «Comenzar práctica». No tienes que subir nada: la imagen la elige el sistema.',
      cta: 'Comenzar práctica', href: '#/practica'
    },
    {
      n: '03', title: 'Espera la carga', where: 'Pantalla de carga',
      what: 'El sistema prepara el caso y las preguntas.',
      how: 'No tienes que hacer nada: en unos segundos aparece la imagen.',
      cta: null
    },
    {
      n: '04', title: 'Observa la imagen y responde', where: 'Práctica · imagen a la izquierda, preguntas a la derecha',
      what: 'Decides cómo enfrentarías ese incendio, antes de ver las respuestas correctas.',
      how: 'Responde tres preguntas: qué tipo de fuego es, qué extintor elegirías y en qué orden aplicas el método PASS. Puedes cambiar cualquier respuesta cuantas veces quieras.',
      cta: null
    },
    {
      n: '05', title: 'Confirma tus respuestas', where: 'Práctica · parte final',
      what: 'Te muestra las respuestas correctas para que las compares con las tuyas.',
      how: 'Cuando hayas respondido las tres preguntas, pulsa «Confirmar respuestas». Debajo de la imagen aparecen el tipo de fuego, el extintor recomendado, el orden correcto del método PASS y una explicación.',
      cta: null
    },
    {
      n: '06', title: 'Repite o repasa', where: 'Práctica · después de confirmar',
      what: 'Practica con otro caso o refuerza lo que fallaste.',
      how: 'Pulsa «Practicar con otra imagen» para un nuevo caso, o «Repasar la guía» para volver a leer.',
      cta: null
    }
  ];

  const FAQ = [
    { q: '¿De dónde salen las imágenes?', a: 'El sistema elige al azar una imagen de su banco de casos. Cada vez que practicas puede aparecer una distinta.' },
    { q: '¿Se guardan mis respuestas?', a: 'No. Las respuestas solo se usan durante la práctica y no se almacenan ni se comparten.' },
    { q: '¿Puedo repetir la práctica?', a: 'Sí. Al terminar pulsa «Practicar con otra imagen» y te muestra un caso nuevo.' },
    { q: '¿Puedo cambiar mi respuesta?', a: 'Sí, hasta que pulses «Confirmar respuestas». Después se bloquean para que puedas compararlas con las correctas.' },
    { q: '¿Esto reemplaza una capacitación oficial?', a: 'No. Es una herramienta educativa; en tu lugar de trabajo o estudio consulta la capacitación y los protocolos oficiales.' }
  ];

  return {
    FIRE_CLASSES, EXTINGUISHERS, PASS_STEPS, CORRECT_PASS,
    ACTION_PLAN, DO_NOT_FIGHT, SMOKE_TIPS,
    TUTORIAL_STEPS, FAQ
  };
})();
