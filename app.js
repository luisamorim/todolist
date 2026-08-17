document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const taskCount = document.getElementById('task-count');
    const clearCompleted = document.getElementById('clear-completed');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function updateCount() {
        const pending = todos.filter(t => !t.completed).length;
        const total = todos.length;
        taskCount.textContent = `${pending} pendente${pending !== 1 ? 's' : ''} de ${total}`;
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            if (todo.completed) {
                li.classList.add('completed');
            }

            const checkbox = document.createElement('div');
            checkbox.classList.add('checkbox');
            checkbox.setAttribute('role', 'checkbox');
            checkbox.setAttribute('aria-checked', todo.completed);
            checkbox.setAttribute('tabindex', '0');
            checkbox.addEventListener('click', () => toggleTodo(index));
            checkbox.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTodo(index);
                }
            });

            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            taskText.textContent = todo.text;
            taskText.addEventListener('click', () => toggleTodo(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '✕';
            deleteBtn.setAttribute('aria-label', `Excluir tarefa: ${todo.text}`);
            deleteBtn.addEventListener('click', () => deleteTodo(index));

            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
        updateCount();
    }

    function addTodo() {
        const text = input.value.trim();
        if (!text) return;

        todos.push({ text, completed: false });
        input.value = '';
        saveTodos();
        renderTodos();
        input.focus();
    }

    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }

    function clearCompletedTodos() {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
    }

    addBtn.addEventListener('click', addTodo);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    clearCompleted.addEventListener('click', clearCompletedTodos);

    renderTodos();
});
