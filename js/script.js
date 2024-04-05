// Initialize the Google Tasks API client
const CLIENT_ID = 'AIzaSyDdRJRT4yEw-ZropcgO1obK6Qm3o_ay_KE';
const API_KEY = '793446928976-avgeohaghkicra242kq4vtqe12ka43rh.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
const SCOPES = 'https://www.googleapis.com/auth/tasks';

// Function to handle loading of Google Tasks API client
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Function to initialize Google Tasks API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        listTasks(); 
    }, function(error) {
        console.error('Error initializing Google API client: ', error);
    });
}


function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        carregarTarefas(); 
    } else {
    }
}

// Function to list tasks
function listTasks() {
    gapi.client.tasks.tasks.list({
        'tasklist': 'primary' // Change tasklist ID as needed
    }).then(function(response) {
        var tasks = response.result.items;
        if (tasks && tasks.length > 0) {
            tasks.forEach(function(task) {
                adicionarTarefaAoDOM(task);
            });
        } else {
        }
    });
}

// Function to create a task
function createTask(task) {
    gapi.client.tasks.tasks.insert({
        'tasklist': 'primary', 
        'resource': task
    }).then(function(response) {
        var createdTask = response.result;
        adicionarTarefaAoDOM(createdTask); 
    });
}

// Function to delete a task
function deleteTask(taskId) {
    gapi.client.tasks.tasks.delete({
        'tasklist': 'primary', 
        'task': taskId
    }).then(function(response) {
    });
}

// Function to load tasks from Google Tasks API
function carregarTarefas() {
    listTasks();
}

// Function to save a task to Google Tasks API
function salvarTarefaNoAPI(tarefa) {
    createTask({
        'title': tarefa.titulo,
        'notes': tarefa.descricao,
        'due': tarefa.datetime
    });
}

// Function to remove a task from Google Tasks API
function removerTarefaDoAPI(taskId) {
    deleteTask(taskId);
}
document.addEventListener('DOMContentLoaded', function () {
    // Selecionando elementos do DOM
    const form = document.getElementById('input-form');
    const listaTarefas = document.getElementById('lista');

    // Função para adicionar tarefa ao DOM
    function adicionarTarefaAoDOM(tarefa) {
        const li = document.createElement('li');
        li.innerHTML = `
        <div class="text">
            <strong>${tarefa.title}</strong><br> 
            <span>${tarefa.due}</span>
            <span>${tarefa.notes}</span>
        </div>
        <div class="button-container">
            <button class="remove-btn">Remover</button>
        </div>
        `;

        listaTarefas.appendChild(li);

        // Adicionando evento de remoção da tarefa
        const removeBtn = li.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            li.remove();
            removerTarefaDoAPI(tarefa.id); 
        });
    }

    // Evento de submissão do formulário
    form.addEventListener('submit', e => {
        e.preventDefault();
        const titulo = document.getElementById('nomeTarefa').value;
        const descricao = document.getElementById('descricao').value;
        const datetime = document.getElementById('datetime').value;

        const tarefa = {
            titulo,
            descricao,
            datetime
        };

        adicionarTarefaAoDOM(tarefa);
        salvarTarefaNoAPI(tarefa);

        // Limpar campos do formulário
        form.reset();
    });
});
