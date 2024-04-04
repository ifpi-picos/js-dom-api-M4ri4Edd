//ad088184ba4a37454c7fbdc87fdbe43d0c09da02

// Carrega as tarefas salvas ao carregar a página
carregarTarefas();

// Função para carregar as tarefas salvas no localStorage
function carregarTarefas() {
    var tarefas = JSON.parse(localStorage.getItem('tarefas'));
    if (tarefas) {
        tarefas.forEach(function(tarefa) {
            adicionarTarefaNaLista(tarefa);
        });
    }
}

// Função para salvar as tarefas no localStorage
function salvarTarefas(tarefas) {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Função para adicionar uma tarefa na lista
function adicionarTarefaNaLista(tarefa) {
    var listItem = document.createElement("li");
    listItem.textContent = tarefa.nome + " - " + tarefa.descricao + " - " + tarefa.data;

    // Cria botões para marcar como concluída e excluir a tarefa
    var concluidaBtn = document.createElement("button");
    concluidaBtn.textContent = "Concluída";
    concluidaBtn.className = "concluir-btn";
    concluidaBtn.addEventListener("click", marcarConcluida);

    var excluirBtn = document.createElement("button");
    excluirBtn.textContent = "Excluir";
    excluirBtn.className = "excluir-btn";
    excluirBtn.addEventListener("click", excluirTarefa);

    // Adiciona os botões ao item de lista
    listItem.appendChild(concluidaBtn);
    listItem.appendChild(excluirBtn);

    // Adiciona o novo item à lista
    document.getElementById("lista").appendChild(listItem);
}

// Função para adicionar uma nova tarefa
function adicionarTarefa(event) {
    event.preventDefault(); // Evita o envio do formulário

    // Obtém os valores dos campos do formulário
    var nome = document.getElementById("nomeTarefa").value;
    var descricao = document.getElementById("descricao").value;
    var data = document.getElementById("datetime").value;

    // Cria um objeto representando a tarefa
    var tarefa = {
        nome: nome,
        descricao: descricao,
        data: data
    };

    // Adiciona a tarefa à lista e salva no localStorage
    adicionarTarefaNaLista(tarefa);
    var tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push(tarefa);
    salvarTarefas(tarefas);

    // Limpa os campos do formulário
    document.getElementById("nomeTarefa").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("datetime").value = "";
}

// Função para marcar a tarefa como concluída
function marcarConcluida(event) {
    var listItem = event.target.parentNode;
    listItem.classList.add("concluida");
}

// Função para excluir a tarefa
function excluirTarefa(event) {
    var listItem = event.target.parentNode;
    listItem.remove();

    // Remove a tarefa do localStorage
    var tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    var index = Array.from(listItem.parentNode.children).indexOf(listItem);
    tarefas.splice(index, 1);
    salvarTarefas(tarefas);
}

// Adiciona um listener para o evento de envio do formulário
document.getElementById("input-form").addEventListener("submit", adicionarTarefa);

