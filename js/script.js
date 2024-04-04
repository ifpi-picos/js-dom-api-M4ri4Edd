document.addEventListener('DOMContentLoaded', function () {
    // Selecionando elementos do DOM
    const form = document.getElementById('input-form');
    const listaTarefas = document.getElementById('lista');

    // Função para carregar tarefas do localStorage
    function carregarTarefas() {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.forEach(tarefa => {
            adicionarTarefaAoDOM(tarefa);
        });
    }

    // Função para salvar tarefas no localStorage
    function salvarTarefaNoLocalStorage(tarefa) {
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.push(tarefa);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // Função para remover tarefa do localStorage
    function removerTarefaDoLocalStorage(tituloTarefaParaRemover) {
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas = tarefas.filter(tarefa => tarefa.titulo !== tituloTarefaParaRemover);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // Função para adicionar tarefa ao DOM
    function adicionarTarefaAoDOM(tarefa) {
        const li = document.createElement('li');
        li.innerHTML = `
        <div class="text">
            <strong>${tarefa.titulo}</strong><br> 
            <span>${tarefa.datetime}</span>
            <span>${tarefa.descricao}</span>
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
            removerTarefaDoLocalStorage(tarefa.titulo); // Passando o título da tarefa para remover do localStorage
        });
    }

    // Carregando tarefas ao carregar a página
    carregarTarefas();

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
        salvarTarefaNoLocalStorage(tarefa);

        // Limpar campos do formulário
        form.reset();
    });
});
