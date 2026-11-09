// Lista de tareas: agregar, completar, editar, eliminar y filtrar.
// Las tareas se guardan en el navegador (localStorage), así que no se pierden al recargar.

const STORAGE_KEY = 'tareas';

const form = document.getElementById('newTask');
const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');
const template = document.getElementById('taskTemplate');
const counter = document.getElementById('counter');
const empty = document.getElementById('empty');
const clearDone = document.getElementById('clearDone');
const filterButtons = document.querySelectorAll('.filter');

let tasks = loadTasks();
let filter = 'all';

// ---------- Datos ----------

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Sin almacenamiento (modo privado, por ejemplo): la lista sigue funcionando sin guardarse.
  }
}

function newId() {
  return window.crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
}

function addTask(text) {
  tasks.unshift({ id: newId(), text, done: false });
  update();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  update();
}

function renameTask(id, text) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.text = text;
  update();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  update();
}

// ---------- Vista ----------

function visibleTasks() {
  if (filter === 'pending') return tasks.filter((t) => !t.done);
  if (filter === 'done') return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  list.replaceChildren(...visibleTasks().map(renderTask));

  const pending = tasks.filter((t) => !t.done).length;
  const done = tasks.length - pending;
  counter.textContent =
    tasks.length === 0 ? 'Sin tareas' : `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
  clearDone.disabled = done === 0;

  const messages = {
    all: 'No hay tareas. Escribe una arriba para empezar.',
    pending: '¡Todo listo! No tienes tareas pendientes.',
    done: 'Aún no has completado ninguna tarea.',
  };
  empty.textContent = messages[filter];
  empty.hidden = list.children.length > 0;
}

function renderTask(task) {
  const item = template.content.firstElementChild.cloneNode(true);
  const check = item.querySelector('.task-check');
  const text = item.querySelector('.task-text');

  item.dataset.id = task.id;
  item.classList.toggle('done', task.done);
  check.checked = task.done;
  check.setAttribute('aria-label', `Marcar "${task.text}" como ${task.done ? 'pendiente' : 'completada'}`);
  text.textContent = task.text;
  item.querySelector('.edit').setAttribute('aria-label', `Editar "${task.text}"`);
  item.querySelector('.delete').setAttribute('aria-label', `Eliminar "${task.text}"`);
  return item;
}

function update() {
  saveTasks();
  render();
}

// Cambia el texto de la tarea por una caja editable. Enter o salir de la caja guarda, Esc cancela.
function startEditing(item) {
  const text = item.querySelector('.task-text');
  const field = document.createElement('input');
  field.type = 'text';
  field.className = 'task-edit';
  field.value = text.textContent;
  field.maxLength = 200;
  field.setAttribute('aria-label', 'Editar tarea');
  text.replaceWith(field);
  field.focus();
  field.select();

  let finished = false;
  const finish = (save) => {
    if (finished) return;
    finished = true;
    const value = field.value.trim();
    if (save && value) renameTask(item.dataset.id, value);
    else render();
  };

  field.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') finish(true);
    if (event.key === 'Escape') finish(false);
  });
  field.addEventListener('blur', () => finish(true));
}

// ---------- Eventos ----------

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  form.reset();
  input.focus();
});

list.addEventListener('change', (event) => {
  if (event.target.matches('.task-check')) toggleTask(event.target.closest('.task').dataset.id);
});

list.addEventListener('click', (event) => {
  const item = event.target.closest('.task');
  if (!item) return;
  if (event.target.closest('.delete')) deleteTask(item.dataset.id);
  if (event.target.closest('.edit')) startEditing(item);
});

list.addEventListener('dblclick', (event) => {
  if (event.target.matches('.task-text')) startEditing(event.target.closest('.task'));
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    render();
  });
});

clearDone.addEventListener('click', () => {
  tasks = tasks.filter((t) => !t.done);
  update();
});

document.getElementById('today').textContent = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date());

render();
