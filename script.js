const campoTarefa = document.getElementById("campo-tarefa");
const campoData = document.getElementById("campo-data");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");

const CHAVE_STORAGE = "tarefas";
const CHAVE_TEMA = "tema";

let tarefas = [];
let filtroAtual = "todas";

function carregarTarefas() {

    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos) {
        tarefas = JSON.parse(dadosSalvos);
    }
}

function salvarTarefas() {

    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(tarefas)
    );
}

function adicionarTarefa() {

    let texto = campoTarefa.value;
    let data = campoData.value;

    if (texto == "") {
        alert("Digite uma tarefa!");
        return;
    }

    if (data == "") {
        alert("Escolha uma data!");
        return;
    }

    tarefas.push({
        texto: texto,
        data: data,
        concluida: false
    });

    campoTarefa.value = "";
    campoData.value = "";

    salvarTarefas();
    mostrarTarefas();
}

function mostrarTarefas() {

    listaTarefas.innerHTML = "";

    for (let i = 0; i < tarefas.length; i++) {

        if (filtroAtual == "pendentes" && tarefas[i].concluida) {
            continue;
        }

        if (filtroAtual == "concluidas" && !tarefas[i].concluida) {
            continue;
        }

        let item = document.createElement("li");

        item.classList.add("item-tarefa");

        if (tarefas[i].concluida) {
            item.classList.add("concluido");
        }

        let dataAtual = new Date();

        dataAtual.setHours(0, 0, 0, 0);

        let dataPrazo = new Date(
            tarefas[i].data + "T00:00:00"
        );

        let classePrazo = "";

        if (!tarefas[i].concluida) {

            if (dataPrazo < dataAtual) {

                classePrazo = "prazo-vencido";

            } else if (dataPrazo.getTime() == dataAtual.getTime()) {

                classePrazo = "prazo-hoje";
            }
        }

        item.innerHTML = `
            <div>
                <span>${tarefas[i].texto}</span>

                <small class="${classePrazo}">
                    ${formatarData(tarefas[i].data)}
                </small>
            </div>

            <div class="acoes-tarefa">

                <button 
                    class="botao-acao" 
                    onclick="concluirTarefa(${i})">
                    ✓
                </button>

                <button 
                    class="botao-acao excluir" 
                    onclick="excluirTarefa(${i})">
                    🗑
                </button>

            </div>
        `;

        listaTarefas.appendChild(item);
    }

    atualizarContador();
}

function formatarData(data) {

    let partes = data.split("-");

    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function concluirTarefa(indice) {

    tarefas[indice].concluida =
        !tarefas[indice].concluida;

    salvarTarefas();
    mostrarTarefas();
}

function excluirTarefa(indice) {

    tarefas.splice(indice, 1);

    salvarTarefas();
    mostrarTarefas();
}

function filtrarTarefas(filtro) {

    filtroAtual = filtro;

    mostrarTarefas();
}

function atualizarContador() {

    let total = tarefas.length;
    let concluidas = 0;

    for (let i = 0; i < tarefas.length; i++) {

        if (tarefas[i].concluida) {
            concluidas++;
        }
    }

    contadorTarefas.textContent =
        total + " tarefas | " +
        concluidas + " concluídas";
}

function mudarTema() {

    document.body.classList.toggle("modo-escuro");

    if (document.body.classList.contains("modo-escuro")) {

        localStorage.setItem(CHAVE_TEMA, "escuro");

    } else {

        localStorage.setItem(CHAVE_TEMA, "claro");
    }
}

function carregarTema() {

    let temaSalvo = localStorage.getItem(CHAVE_TEMA);

    if (temaSalvo == "escuro") {

        document.body.classList.add("modo-escuro");
    }
}

carregarTarefas();

carregarTema();

mostrarTarefas();
