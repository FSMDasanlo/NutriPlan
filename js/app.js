import { db, isCloud } from "./db.js";
import { buildPlan, toKey, fromKey, RACE_DATE, PLAN_START, GUIDE } from "./plan-data.js";

const $ = (id) => document.getElementById(id);
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const TYPES = {
  fuerza: { icon: "🏋️", label: "Fuerza" },
  carrera: { icon: "🏃‍♀️", label: "Carrera" },
  montana: { icon: "⛰️", label: "Montaña" },
  descanso: { icon: "🌿", label: "Descanso" },
  "carrera-spartan": { icon: "🔥", label: "Spartan Beast" },
  otro: { icon: "✨", label: "Otro" },
};
const MEAL_SLOTS = [
  ["breakfast", "☕", "Desayuno"],
  ["lunch", "🍲", "Comida"],
  ["snack", "🍌", "Merienda / durante"],
  ["dinner", "🌙", "Cena"],
];

const state = { days: {}, current: toKey(new Date()), editing: false };

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove("show"), 2600);
}

function blankDay(key) {
  const d = fromKey(key);
  const names = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return {
    date: key, dayName: names[d.getDay()], weekIndex: 0, weekTitle: "", weekGoal: "",
    training: { type: "descanso", title: "", details: "" },
    meals: { breakfast: "", lunch: "", snack: "", dinner: "" },
    notes: "", log: { done: false, effort: "", legs: "", energy: "", comments: "" },
    blank: true,
  };
}

const getDay = (key) => state.days[key] || blankDay(key);

function go(key) {
  state.current = key;
  state.editing = false;
  render();
}

function shift(n) {
  const d = fromKey(state.current);
  d.setDate(d.getDate() + n);
  go(toKey(d));
}

function renderCountdown() {
  const days = Math.ceil((fromKey(RACE_DATE) - fromKey(toKey(new Date()))) / 864e5);
  $("countdown").innerHTML = days > 0
    ? `<strong>${days}</strong> días para la Beast · 28 nov`
    : days === 0 ? "🔥 ¡HOY ES EL DÍA! 🔥" : "🏅 ¡Beast conquistada!";
}

function renderStrip() {
  const cur = fromKey(state.current);
  const monday = new Date(cur);
  monday.setDate(cur.getDate() - ((cur.getDay() + 6) % 7));
  let html = "";
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const key = toKey(d);
    const day = state.days[key];
    const type = day ? day.training.type : "otro";
    html += `<button type="button" class="wd ${key === state.current ? "active" : ""} ${day && day.log.done ? "done" : ""}" data-key="${key}">
      <small>${["L", "M", "X", "J", "V", "S", "D"][i]}</small><b>${d.getDate()}</b><span>${day ? TYPES[type]?.icon || "" : "·"}</span></button>`;
  }
  $("week-strip").innerHTML = html;
}

function viewDay(day) {
  const t = TYPES[day.training.type] || TYPES.otro;
  const meals = MEAL_SLOTS.map(([k, icon, label]) => `
    <div class="meal"><div class="meal-h">${icon} ${label}</div><p>${esc(day.meals[k]) || "<em>—</em>"}</p></div>`).join("");
  const l = day.log;
  return `
    <div class="card train t-${day.training.type}">
      <div class="card-h"><span class="badge">${t.icon} ${t.label}</span>
        <label class="check"><input type="checkbox" id="done" ${l.done ? "checked" : ""}> Hecho</label></div>
      <h3>${esc(day.training.title) || t.label}</h3>
      <p>${esc(day.training.details) || "<em>Sin detalles</em>"}</p>
    </div>
    <h4 class="sec">Comidas</h4>
    <div class="meals">${meals}</div>
    ${day.notes ? `<div class="card note">💡 ${esc(day.notes)}</div>` : ""}
    <h4 class="sec">Mi registro</h4>
    <div class="card log">
      <div class="log-grid">
        <div><small>Esfuerzo (1–10)</small><b>${esc(l.effort) || "—"}</b></div>
        <div><small>Piernas / molestias</small><b>${esc(l.legs) || "—"}</b></div>
        <div><small>Energía / hambre / sueño</small><b>${esc(l.energy) || "—"}</b></div>
      </div>
      ${l.comments ? `<p class="comments">${esc(l.comments)}</p>` : ""}
    </div>
    <button id="edit" class="btn primary block" type="button">✏️ Editar este día</button>`;
}

function editDay(day) {
  const typeOpts = Object.entries(TYPES).map(([k, v]) =>
    `<option value="${k}" ${k === day.training.type ? "selected" : ""}>${v.icon} ${v.label}</option>`).join("");
  const meals = MEAL_SLOTS.map(([k, icon, label]) => `
    <label class="field">${icon} ${label}<textarea name="m_${k}" rows="2">${esc(day.meals[k])}</textarea></label>`).join("");
  const l = day.log;
  return `
    <form id="form" class="card form">
      <h4>Entrenamiento</h4>
      <label class="field">Tipo<select name="type">${typeOpts}</select></label>
      <label class="field">Título<input name="title" value="${esc(day.training.title)}"></label>
      <label class="field">Detalles<textarea name="details" rows="5">${esc(day.training.details)}</textarea></label>
      <h4>Comidas</h4>${meals}
      <label class="field">Notas<textarea name="notes" rows="2">${esc(day.notes)}</textarea></label>
      <h4>Mi registro</h4>
      <label class="field">Esfuerzo (1–10)<input name="effort" inputmode="numeric" value="${esc(l.effort)}"></label>
      <label class="field">Piernas / molestias<input name="legs" value="${esc(l.legs)}"></label>
      <label class="field">Energía / hambre / sueño<input name="energy" value="${esc(l.energy)}"></label>
      <label class="field">Comentarios<textarea name="comments" rows="3">${esc(l.comments)}</textarea></label>
      <label class="check"><input type="checkbox" name="done" ${l.done ? "checked" : ""}> Entrenamiento hecho</label>
      <div class="row">
        <button type="button" id="cancel" class="btn ghost">Cancelar</button>
        <button type="submit" class="btn primary">💾 Guardar</button>
      </div>
    </form>`;
}

function render() {
  const key = state.current;
  const d = fromKey(key);
  const day = getDay(key);
  $("date-label").textContent = `${day.dayName} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  $("date-input").value = key;
  renderStrip();

  const head = day.weekIndex
    ? `<div class="weekhead"><span>${esc(day.weekTitle)}</span><p>${esc(day.weekGoal)}</p></div>` : "";
  $("day").innerHTML = head + (state.editing ? editDay(day) : viewDay(day));
  $("seed-banner").hidden = Object.keys(state.days).length > 0;

  if (state.editing) {
    $("form").addEventListener("submit", onSave);
    $("cancel").addEventListener("click", () => { state.editing = false; render(); });
  } else {
    $("edit").addEventListener("click", () => { state.editing = true; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    $("done").addEventListener("change", async (e) => {
      const upd = structuredClone(day);
      delete upd.blank;
      upd.log.done = e.target.checked;
      await persist(upd);
    });
  }
}

async function persist(day) {
  try {
    await db.save(day);
    state.days[day.date] = day;
    toast("Guardado ✔");
    render();
  } catch (err) {
    console.error(err);
    toast("Error al guardar: " + (err.code || err.message));
  }
}

async function onSave(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const day = structuredClone(getDay(state.current));
  delete day.blank;
  day.training = { type: f.get("type"), title: f.get("title").trim(), details: f.get("details").trim() };
  day.meals = Object.fromEntries(MEAL_SLOTS.map(([k]) => [k, f.get(`m_${k}`).trim()]));
  day.notes = f.get("notes").trim();
  day.log = {
    done: f.get("done") === "on",
    effort: f.get("effort").trim(), legs: f.get("legs").trim(),
    energy: f.get("energy").trim(), comments: f.get("comments").trim(),
  };
  state.editing = false;
  await persist(day);
}

async function seed(force) {
  if (force && !confirm("Esto sobrescribe los 42 días con el plan original del PDF (pierdes tus ediciones y registro). ¿Continuar?")) return;
  try {
    await db.seed(buildPlan());
    state.days = await db.getAll();
    toast("Plan cargado ✔");
    render();
  } catch (err) {
    console.error(err);
    toast("Error al cargar: " + (err.code || err.message));
  }
}

async function loadAll() {
  state.days = await db.getAll();
  const start = PLAN_START, end = "2026-11-29";
  const today = toKey(new Date());
  state.current = today >= start && today <= end ? today : start;
  $("login").hidden = true;
  $("planner").hidden = false;
  render();
}

async function boot() {
  $("guide").innerHTML = GUIDE.map(([t, p]) => `<p><b>${t}.</b> ${p}</p>`).join("");
  renderCountdown();

  $("prev").onclick = () => shift(-1);
  $("next").onclick = () => shift(1);
  $("today").onclick = () => go(toKey(new Date()));
  $("race").onclick = () => go(RACE_DATE);
  $("date-input").onchange = (e) => e.target.value && go(e.target.value);
  $("week-strip").onclick = (e) => {
    const b = e.target.closest("[data-key]");
    if (b) go(b.dataset.key);
  };
  $("btn-seed").onclick = () => seed(false);
  $("btn-reseed").onclick = () => seed(true);
  $("btn-login").onclick = () => db.signIn().catch((e) => toast(e.message));
  $("btn-user").onclick = () => db.signOut();

  // Swipe horizontal para cambiar de día
  let x0 = null;
  const area = $("day");
  area.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  area.addEventListener("touchend", (e) => {
    if (x0 === null || state.editing) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 80) shift(dx < 0 ? 1 : -1);
  });

  await db.init(async (user) => {
    const btn = $("btn-user");
    if (!user) {
      $("planner").hidden = true;
      $("login").hidden = false;
      btn.hidden = true;
      return;
    }
    btn.hidden = !isCloud;
    btn.textContent = "Salir";
    try { await loadAll(); } catch (err) { console.error(err); toast("Error leyendo datos: " + (err.code || err.message)); }
  });

  if (!isCloud) toast("Modo local: configura js/firebase-config.js para usar Firestore");
}

boot();
