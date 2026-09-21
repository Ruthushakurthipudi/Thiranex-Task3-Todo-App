%%writefile /content/Thiranex-Task3/script.js

// ===============================
// DOM ELEMENTS
// ===============================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

// ===============================
// APPLICATION STATE
// ===============================

let tasks = JSON.parse(
    localStorage.getItem("thiranexTasks") || "[]"
);

let currentFilter = "all";

// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "thiranexTasks",
        JSON.stringify(tasks)
    );

}

// ===============================
// CREATE TASK
// ===============================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    const newTask = {

        id: Date.now().toString(),

        text: text,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

});

// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "complete-checkbox";

        checkbox.checked = task.completed;

        const textSpan = document.createElement("span");

        textSpan.className = "task-text";

        textSpan.textContent = task.text;

        const actions = document.createElement("div");

        actions.className = "task-actions";

        const editButton = document.createElement("button");

        editButton.className = "edit-btn";

        editButton.textContent = "Edit";

        editButton.type = "button";

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.type = "button";

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);

        li.appendChild(checkbox);

        li.appendChild(textSpan);

        li.appendChild(actions);

        taskList.appendChild(li);

    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateStats();

}

// ===============================
// UPDATE STATISTICS
// ===============================

function updateStats() {

    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    const activeCount = tasks.length - completedCount;

    totalTasks.textContent = tasks.length;

    activeTasks.textContent = activeCount;

    completedTasks.textContent = completedCount;

}

// ===============================
// EVENT DELEGATION
// ===============================

taskList.addEventListener("click", function(event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = taskItem.dataset.id;

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return;
    }

    // DELETE TASK

    if (event.target.closest(".delete-btn")) {

        tasks = tasks.filter(
            task => task.id !== taskId
        );

        saveTasks();

        renderTasks();

        return;

    }

    // EDIT TASK

    if (event.target.closest(".edit-btn")) {

        const updatedText = prompt(
            "Edit your task:",
            task.text
        );

        if (
            updatedText !== null &&
            updatedText.trim() !== ""
        ) {

            task.text = updatedText.trim();

            saveTasks();

            renderTasks();

        }

    }

});

// ===============================
// COMPLETE TASK
// ===============================

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("complete-checkbox")) {
        return;
    }

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = taskItem.dataset.id;

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return;
    }

    task.completed = event.target.checked;

    saveTasks();

    renderTasks();

});

// ===============================
// FILTER TASKS
// ===============================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        renderTasks();

    });

});

// ===============================
// INITIAL RENDER
// ===============================

renderTasks();
