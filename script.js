// Array para almacenar las tareas
var tasks = [];

// Función para agregar una nueva tarea
function addTask() {
  var taskInput = document.getElementById("taskInput");
  var taskList = document.getElementById("taskList");

  if (taskInput.value.trim() !== "") {
    // Crear un nuevo elemento de lista
    var newTask = document.createElement("li");

    // Añadir la tarea al array
    tasks.push(taskInput.value);

    // Actualizar la lista de tareas
    updateTaskList(taskList);

    // Limpiar el campo de entrada
    taskInput.value = "";
  }
}

// Función para actualizar la lista de tareas
function updateTaskList(taskList) {
  // Limpiar la lista
  taskList.innerHTML = "";

  // Recorrer el array de tareas y agregar cada tarea a la lista
  tasks.forEach(function (task, index) {
    var listItem = document.createElement("li");
    listItem.textContent = task;

    // Agregar botón para marcar como completada
    var completeButton = document.createElement("button");
    completeButton.textContent = "Completada";
    completeButton.onclick = function () {
      toggleTaskStatus(index);
    };

    // Agregar botón para eliminar
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.onclick = function () {
      deleteTask(index);
    };

    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);
  });
}

// Función para marcar/desmarcar una tarea como completada
function toggleTaskStatus(index) {
  if (index >= 0 && index < tasks.length) {
    tasks[index] = tasks[index].startsWith("✓ ") ? tasks[index].substring(2) : "✓ " + tasks[index];
    var taskList = document.getElementById("taskList");
    updateTaskList(taskList);
  }
}

// Función para eliminar una tarea
function deleteTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    var taskList = document.getElementById("taskList");
    updateTaskList(taskList);
  }
}
