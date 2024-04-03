const tarefaForm = document.getElementById('input-form');
const nome = document.getElementById('nomeTarefa');
const local = document.getElementById('local');
const descricao = document.getElementById('descricao');
const data = document.getElementById('datetime');
const listaTarefas = document.getElementById('Lista');
// Array para armazenar as tarefas
let listaDeTarefas = [];

function adicionarTarefa(){
    if (nome.value === '' || local.value === '' || data.value === ''){
        alert('Preencha os campos obrigatórios.');
    } else {
        let itemLista = document.createElement('li')
        itemLista.innerHTML = nome.value + local.value + data.value;
        listaTarefas.appendChild(itemLista);

        alert('Tarefa cadastrada com sucesso')
    }
}
