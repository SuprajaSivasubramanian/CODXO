document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('taskInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    tasks.forEach(task => renderTask(task));
    completedTasks.forEach(task => renderTask(task, true));
}

function saveTasks() {
    const tasks = [];
    const completedTasks = [];
    document.querySelectorAll('#taskList li').forEach(li => tasks.push(extractTaskFromListItem(li)));
    document.querySelectorAll('#completedTaskList li').forEach(li => completedTasks.push(extractTaskFromListItem(li)));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function extractTaskFromListItem(li) {
    return {
        text: li.querySelector('.task-text').innerText,
        dueDate: li.querySelector('.task-due-date').innerText
    };
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === '') return;

    const task = { text: taskText, dueDate };
    renderTask(task);
    taskInput.value = '';
    dueDateInput.value = '';
    saveTasks();
}

function renderTask(task, completed = false) {
    const taskList = completed ? document.getElementById('completedTaskList') : document.getElementById('taskList');

    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span class="task-due-date">${task.dueDate}</span>
        ${!completed ? `
            <button class="complete" onclick="completeTask(this)">Complete</button>
            <button class="edit" onclick="editTask(this)">Edit</button>
            <button class="delete" onclick="deleteTask(this)">Delete</button>
        ` : `
            <button class="remove" onclick="removeCompletedTask(this)">Remove</button>
        `}
    `;
    taskList.appendChild(li);
}

function completeTask(button) {
    const li = button.parentElement;
    const task = extractTaskFromListItem(li);
    li.remove();
    renderTask(task, true);
    saveTasks();
}

function editTask(button) {
    const li = button.parentElement;
    const taskText = li.querySelector('.task-text').innerText;
    const newTaskText = prompt('Edit task:', taskText);
    if (newTaskText !== null && newTaskText.trim() !== '') {
        li.querySelector('.task-text').innerText = newTaskText;
        saveTasks();
    }
}

function deleteTask(button) {
    button.parentElement.remove();
    saveTasks();
}

function removeCompletedTask(button) {
    button.parentElement.remove();
    saveTasks();
}
