//Task Class - represents a task
class Task{
    constructor(name, priority, dueDate){
        this.name = name;
        this.priority = priority;
        this.dueDate = dueDate;
    }
}

//UI Class - handle UI tasks
class UI{
    static displayTasks(){
        const tasks = Store.getTasks();

        tasks.forEach((task) => UI.addTaskToList(task));
    }

    static addTaskToList(task){
        const list = document.querySelector('#task-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.priority}</td>
            <td>${task.dueDate}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteTask(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container'); //parent
        const form = document.querySelector('#task-form'); //before this insert div
        container.insertBefore(div, form);

        //vanish in 3 secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#task').value = '';
        document.querySelector('#priority').value = '';
        document.querySelector('#due-date').value = '';
    }
}

//Store Class - handle (local) storage
class Store{
    static getTasks(){
        let tasks;
        if(localStorage.getItem('tasks') == null){
            tasks = [];
        }
        else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
    }

    static addTask(task){
        const tasks = Store.getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeTask(name){
        const tasks = Store.getTasks();
        tasks.forEach((task, index) => {
            if(task.name === name){
                tasks.splice(index, 1);
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

//Event - display tasks
document.addEventListener('DOMContentLoaded', UI.displayTasks);

//Event - add task
document.querySelector('#task-form').addEventListener('submit', (e) => {
    //prevent actual submit
    e.preventDefault();

    //get from values
    const name = document.querySelector('#task').value;
    const priority = document.querySelector('#priority').value;
    const dueDate = document.querySelector('#due-date').value;

    //validate
    if(name === '' || priority === '' || dueDate === ''){
        UI.showAlert('Please fill in all fields!', 'danger');
    }
    else{
        //inst. task
        const task = new Task(name, priority, dueDate);
        console.log(task); 

        //Add Task to UI
        UI.addTaskToList(task);

        //Add Task to LS
        Store.addTask(task);

        //clear fields
        UI.clearFields();
        UI.showAlert('Task Inserted!', 'success');
    }
});

//Event - remove task
document.querySelector('#task-list').addEventListener('click', (e) => {
    UI.deleteTask(e.target);

    //console.log(e.target.parentElement.parentElement.firstElementChild);
    Store.removeTask(e.target.parentElement.parentElement.firstElementChild.textContent);

    UI.showAlert('Task Removed', 'warning');
});