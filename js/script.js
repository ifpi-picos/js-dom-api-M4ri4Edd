const tarefaForm = document.getElementById('input-form');
const nomeTarefaInput = document.getElementById('nomeTarefa');
const descricaoInput = document.getElementById('descricao');
const dataInput = document.getElementById('datetime');
const listaUl = document.getElementById('lista');

let listaTarefas = [];

let accessToken = null;
let isAuthenticated = false;

// Função para solicitar autorização OAuth
function solicitarAutorizacaoOAuth() {
    const clientID = '2740ffea288245b0adedbbf8f52bf503';
    const scope1 = 'task:add';
    const scope2 = 'data:delete';
    const scope3 = 'data:read';
    const scope4 = 'data:read_write';
    const scope = `${scope1},${scope2},${scope3},${scope4}`;
    const state = '78678868685856';

    const urlAutorizacao = `https://todoist.com/oauth/authorize?client_id=${clientID}&scope=${scope}&state=${state}`;

    // Redirecionar o usuário para a URL de autorização
    window.location.href = urlAutorizacao;
}

// Função para trocar o código de autorização por um token de acesso
async function trocarCodigoPorAccessToken(codigo) {
    const clientID = '2740ffea288245b0adedbbf8f52bf503';
    const clientSecret = 'b798552ae7dc463098cd31f923368499';
    const redirectURI = 'https://ifpi-picos.github.io/js-dom-api-M4ri4Edd/';

    const urlTrocaToken = 'https://todoist.com/oauth/access_token';

    const parametros = {
        client_id: clientID,
        client_secret: clientSecret,
        code: codigo,
        redirect_uri: redirectURI
    };

    try {
        const resposta = await fetch(urlTrocaToken, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parametros)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao trocar código por token de acesso');
        }

        const dados = await resposta.json();
        accessToken = dados.access_token;
        isAuthenticated = true;

        localStorage.setItem('accessToken', accessToken);

        console.log('Token de acesso obtido:', accessToken);
    } catch (erro) {
        console.error('Ocorreu um erro ao trocar código por token de acesso:', erro);
    }
}

// Função para fazer chamadas à API do Todoist
async function fazerChamadaAPI(url, options) {
    if (!isAuthenticated) {
        console.error('Usuário não autenticado');
        return;
    }

    options.headers.Authorization = `Bearer ${accessToken}`;

    try {
        const resposta = await fetch(url, options);
        return resposta.json();
    } catch (erro) {
        console.error('Ocorreu um erro ao fazer chamada à API:', erro);
    }
}

// Função para cadastrar uma tarefa
function cadastrarTarefa(event) {
    event.preventDefault();

    const nomeTarefa = nomeTarefaInput.value;
    const descricao = descricaoInput.value;
    const data = dataInput.value;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: nomeTarefa,
            description: descricao,
            due_date: data,
            priority: 1
        })
    };

    fazerChamadaAPI('https://api.todoist.com/rest/v1/tasks', options)
        .then(data => {
            console.log('Tarefa cadastrada:', data);
            listaTarefas.push({ nomeTarefa, descricao, data, status: 'pendente', id: data.id });
            atualizarListaTarefas();
            saveLocalStorage();
        })
        .catch(error => {
            console.error('Ocorreu um erro ao cadastrar tarefa:', error);
        });

    // Limpar os campos de entrada
    nomeTarefaInput.value = '';
    descricaoInput.value = '';
    dataInput.value = '';
}

// Função para atualizar a lista de tarefas na página
function atualizarListaTarefas() {
    listaUl.innerHTML = '';

    listaTarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.textContent = `${tarefa.nomeTarefa} - ${tarefa.descricao} - ${tarefa.data} - ${tarefa.status}`;

        const concluirButton = document.createElement('button');
        concluirButton.textContent = 'Concluir';
        concluirButton.classList.add('btn');
        concluirButton.addEventListener('click', () => concluirTarefa(tarefa.id));

        const excluirButton = document.createElement('button');
        excluirButton.textContent = 'Excluir';
        excluirButton.classList.add('btn');
        excluirButton.addEventListener('click', () => excluirTarefa(tarefa.id));

        li.appendChild(concluirButton);
        li.appendChild(excluirButton);

        listaUl.appendChild(li);
    });
}

// Função para concluir uma tarefa
function concluirTarefa(tarefaId) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: tarefaId
        })
    };

    fazerChamadaAPI(`https://api.todoist.com/rest/v1/tasks/${tarefaId}/close`, options)
        .then(() => {
            console.log('Tarefa concluída com sucesso no Todoist.');
            listaTarefas = listaTarefas.filter(tarefa => tarefa.id !== tarefaId);
            atualizarListaTarefas();
            saveLocalStorage();
        })
        .catch(error => {
            console.error('Ocorreu um erro ao concluir tarefa:', error);
        });
}

// Função para excluir uma tarefa
function excluirTarefa(tarefaId) {
    const options = {
        method: 'DELETE'
    };

    fazerChamadaAPI(`https://api.todoist.com/rest/v1/tasks/${tarefaId}`, options)
        .then(() => {
            console.log('Tarefa excluída com sucesso do Todoist.');
            listaTarefas = listaTarefas.filter(tarefa => tarefa.id !== tarefaId);
            atualizarListaTarefas();
            saveLocalStorage();
        })
        .catch(error => {
            console.error('Ocorreu um erro ao excluir tarefa:', error);
        });
}

// Função para salvar a lista de tarefas no armazenamento local
function saveLocalStorage() {
    localStorage.setItem('listaTarefas', JSON.stringify(listaTarefas));
}

// Função para carregar a lista de tarefas do armazenamento local
function loadLocalStorage() {
    const savedListaTarefas = localStorage.getItem('listaTarefas');
    if (savedListaTarefas) {
        listaTarefas = JSON.parse(savedListaTarefas);
        atualizarListaTarefas();
    }
}

// Verificar a autenticação ao carregar a página
function verificarAutenticacao() {
    const urlAtual = new URL(window.location.href);
    const codigo = urlAtual.searchParams.get('code');

    if (codigo) {
        trocarCodigoPorAccessToken(codigo);
    } else {
        alert('Usuário não autenticado. Redirecionando para a página de autenticação para logar no Todoist.');
        solicitarAutorizacaoOAuth();
    }
}

// Evento de submit ao formulário
tarefaForm.addEventListener('submit', cadastrarTarefa);

// Carregar as tarefas do Local Storage ao carregar a página
loadLocalStorage();

// Verificar autenticação ao carregar a página
verificarAutenticacao();
