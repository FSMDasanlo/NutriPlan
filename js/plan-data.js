// Plan Spartan Beast Tenerife (19 oct – 29 nov 2026), extraído del PDF.
export const RACE_DATE = "2026-11-28";
export const PLAN_START = "2026-10-19";

const WEEKS = [
  {
    title: "Semana 1 · 19–25 octubre",
    goal: "Seguir la planificación del entrenador. No añadir volumen extra. Tras la carrera de calidad y la ruta larga previas, vigila la recuperación.",
    run: "Entrenamiento que indique el entrenador. Registra series, ritmos, FC y esfuerzo (1–10).",
    mountain: "Montaña según entrenador; elige una duración que puedas completar sin acabar exhausta. Lleva agua y algo de carbohidrato si se alarga.",
    reminder: "Al terminar cada sesión: anota energía, hambre, sueño, molestias y cómo están las piernas al día siguiente.",
    strength: "Fuerza según el plan de tu entrenador.",
  },
  {
    title: "Semana 2 · 26 octubre–1 noviembre",
    goal: "Última semana de octubre con el entrenador. Prioriza cumplir el plan real y revisar si el cansancio se acumula.",
    run: "Sesión del entrenador; no persigas el ritmo si las pulsaciones o las sensaciones son desproporcionadas.",
    mountain: "Salida de montaña indicada por el entrenador. Practica desayuno, hidratación y un alimento durante la ruta si dura >75–90 min.",
    reminder: "Antes de empezar noviembre, revisar el registro completo: carga semanal, molestias, recuperación y tiempo que puedes dedicar.",
    strength: "Fuerza según el plan de tu entrenador.",
  },
  {
    title: "Semana 3 · 2–8 noviembre",
    goal: "Inicio de la planificación conjunta: consolidar, no probar límites. Si la semana anterior fue dura, reduce volumen.",
    run: "Carrera controlada: 10 min suave + 4 × 4 min a esfuerzo vivo pero controlado (RPE 6–7/10), 2 min andando/trote muy suave entre series + 10 min suave. Si sigues fatigada, 35–45 min fácil en su lugar.",
    mountain: "Montaña 90–120 min a esfuerzo conversacional; caminar subidas empinadas. No es obligatorio aumentar distancia respecto a lo que toleras.",
    reminder: "Fuerza lunes/jueves: mantener cargas conocidas, sin llegar al fallo; jueves puede incluir 10–15 min de agarre/técnica ligera si tienes acceso seguro.",
    strength: "Fuerza: mantén cargas conocidas, sin llegar al fallo.",
  },
  {
    title: "Semana 4 · 9–15 noviembre",
    goal: "Semana específica, solo si recuperas bien. No hacer dos días duros seguidos.",
    run: "45–55 min totales: 10 min suave + 3 × 6 min a esfuerzo controlado (RPE 6–7/10), 3 min suave entre bloques + enfriamiento. No usar un ritmo objetivo fijo.",
    mountain: "Montaña 1 h 45 min–2 h 15 min como máximo orientativo, a ritmo de conversación, con alimentación practicada. Si hay fatiga o molestias, acorta.",
    reminder: "Fuerza: conservar la técnica y el agarre, pero reducir accesorios si interfieren con la carrera larga. No estrenar ejercicios ni material.",
    strength: "Fuerza: conserva técnica y agarre; reduce accesorios si interfieren con la carrera.",
  },
  {
    title: "Semana 5 · 16–22 noviembre",
    goal: "Comienza la reducción de carga. Queremos llegar con piernas frescas, no ganar forma a última hora.",
    run: "35–45 min suaves, con 4–5 aceleraciones cómodas de 20–30 s si estás recuperada; recuperación completa andando/trotando.",
    mountain: "Última salida de montaña moderada: 75–100 min, sin buscar récord de distancia ni desnivel. Practica la estrategia de comida e hidratación que usarás en carrera.",
    reminder: "Fuerza lunes/jueves: reduce volumen aproximadamente un 30–40%; nada de agujetas fuertes, series al fallo ni sesión dura de piernas.",
    strength: "Fuerza: reduce volumen un 30–40%. Sin fallo, sin agujetas fuertes, sin sesión dura de piernas.",
  },
  {
    title: "Semana 6 · 23–29 noviembre · carrera",
    goal: "Taper y carrera el sábado 28. Mantén rutina, duerme y evita experimentos.",
    run: "20–30 min muy suaves; opcional 3 aceleraciones breves si las piernas están bien. Si estás cansada, descanso.",
    mountain: "Descanso y recuperación después de la carrera; paseo suave solo si te sienta bien.",
    reminder: "Lunes: activación ligera. Martes: descanso/movilidad. Jueves: 15–20 min muy suaves o descanso. Viernes: descanso, preparar material y comidas. Sábado: BEAST.",
    strength: "Activación ligera, sin agujetas.",
  },
];

// Índice 0 = domingo (Date.getDay)
const MEALS = {
  1: ["Avena con leche/yogur y fruta", "Pollo/tofu + arroz + verduras", "Yogur griego y plátano", "Tortilla + patata + ensalada y pan"],
  2: ["Tostadas + huevos + fruta", "Lentejas con verduras y huevo", "Fruta + queso fresco o yogur", "Salmón/legumbres + patata + verduras"],
  3: ["Tostadas con mermelada + yogur + fruta", "Pasta/arroz + pollo/atún/tofu + verduras", "Antes si hace falta: plátano o tostada", "Arroz o patata + huevos/pescado + verduras"],
  4: ["Yogur + avena + fruta", "Cuscús/arroz + garbanzos + verduras + queso", "Bocadillo pequeño de pavo/queso o hummus", "Merluza/tofu + boniato/patata + verduras"],
  5: ["Tostadas + queso fresco + fruta", "Arroz + pollo/tempeh + verduras", "Yogur + frutos secos + fruta", "Fajitas de ternera/pollo/legumbres con verduras"],
  6: ["Tostadas + plátano + yogur", "Pasta/arroz + proteína + verduras", "Fruta y yogur o bocadillo pequeño", "Arroz/patata + pescado/huevos + verduras cocinadas"],
  0: ["2–3 tostadas con mermelada + plátano + yogur/leche", "Después: arroz/pasta/patata + proteína + verduras", "Durante: 30–60 g carbohidratos/h si >1 h; agua según sed", "Tortilla/pescado/legumbres + pan/patata + verduras"],
};

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const WEEK6_OVERRIDES = {
  1: { type: "fuerza", title: "Fuerza · activación ligera", details: "Activación ligera, sin agujetas." },
  2: { type: "descanso", title: "Descanso", details: "Descanso o movilidad suave." },
  4: { type: "carrera", title: "Rodaje muy suave", details: "15–20 min muy suaves o descanso." },
  5: { type: "descanso", title: "Descanso y preparación", details: "Descanso. Prepara material y comidas de mañana." },
};

const RACE_DAY = {
  training: {
    type: "carrera-spartan",
    title: "🔥 SPARTAN BEAST · 21K · 30 obstáculos",
    details: "Puerto de la Cruz. Mantén rutina, nada de experimentos. Come desde la primera hora y de forma regular (30–60 g de carbohidratos/h, ajustado a tolerancia y avituallamientos). Lleva una reserva. Bebe según sed, calor y sudor; considera electrolitos sin forzar grandes volúmenes.",
  },
  meals: {
    breakfast: "2–3 h antes: desayuno ya probado: tostadas/pan blanco con mermelada o miel + plátano; yogur/leche si lo toleras. No pruebes alimentos nuevos.",
    lunch: "Después: agua y comida con carbohidratos + proteína cuando te resulte posible.",
    snack: "Durante: carbohidratos desde la primera hora (30–60 g/h) + reserva.",
    dinner: "Prioriza recuperación y descanso.",
  },
  notes: "Evento oficial: Spartan Tenerife Weekend, 28–29 nov 2026.",
};

const pad = (n) => String(n).padStart(2, "0");
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

function trainingFor(week, dow) {
  switch (dow) {
    case 1:
    case 4:
      return { type: "fuerza", title: "Fuerza", details: week.strength + (dow === 4 ? " Jueves: fuerza moderada / OCR técnica si procede." : "") };
    case 3:
      return { type: "carrera", title: "Carrera", details: week.run };
    case 0:
      return { type: "montana", title: "Montaña / tirada larga", details: week.mountain + " Practica combustible si >75–90 min." };
    case 2:
      return { type: "descanso", title: "Descanso", details: "Descanso o paseo suave; movilidad opcional." };
    case 5:
      return { type: "descanso", title: "Descanso", details: "Descanso o recuperación suave." };
    default:
      return { type: "descanso", title: "Descanso", details: "Descanso; prepara agua y comida para montaña." };
  }
}

export function buildPlan() {
  const days = [];
  const start = fromKey(PLAN_START);
  for (let i = 0; i < 42; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const key = toKey(date);
    const weekIdx = Math.floor(i / 7);
    const week = WEEKS[weekIdx];
    const dow = date.getDay();
    let training = trainingFor(week, dow);
    if (weekIdx === 5 && WEEK6_OVERRIDES[dow]) training = { ...WEEK6_OVERRIDES[dow] };
    const [breakfast, lunch, snack, dinner] = MEALS[dow];
    let meals = { breakfast, lunch, snack, dinner };
    let notes = i % 7 === 6 || dow === 0 ? week.reminder : "";
    if (key === RACE_DAY_KEY) {
      training = { ...RACE_DAY.training };
      meals = { ...RACE_DAY.meals };
      notes = RACE_DAY.notes;
    }
    days.push({
      date: key,
      dayName: DAY_NAMES[dow],
      weekIndex: weekIdx + 1,
      weekTitle: week.title,
      weekGoal: week.goal,
      training,
      meals,
      notes,
      log: { done: false, effort: "", legs: "", energy: "", comments: "" },
    });
  }
  return days;
}

const RACE_DAY_KEY = RACE_DATE;

export const GUIDE = [
  ["Proteína", "Incluye una fuente en cada comida: huevos, yogur/leche, pollo, pescado, tofu, legumbres o queso fresco. Orientación: ~80–100 g al día."],
  ["Carbohidratos", "Avena, pan, arroz, pasta, patata, fruta y legumbres. Aumenta raciones antes/después de carrera y montaña; no los recortes."],
  ["Hidratación", "Bebe según sed, calor y sudor. En salidas largas prueba electrolitos; evita beber en exceso."],
  ["Durante largas", "En sesiones >1 h, practica 30–60 g de carbohidratos/hora, subiendo progresivamente con alimentos que toleres."],
  ["Importante", "Plan orientativo: ajústalo a fatiga y sensaciones. No añadas sesiones duras para compensar ni hagas dieta agresiva. Si hay dolor persistente, mareos o fatiga inusual, para y consulta a un profesional."],
];
