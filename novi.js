
const form = document.getElementById("form");
const resposta = document.getElementById("ul");

// Mensagem dinâmica
function showMessage(msg, tipo = "erro") {
  let msgDiv = document.getElementById("msg");
  if (!msgDiv) {
    msgDiv = document.createElement("div");
    msgDiv.id = "msg";
    msgDiv.style.margin = "10px 0";
    msgDiv.style.fontWeight = "bold";
    form.parentNode.insertBefore(msgDiv, form.nextSibling);
  }
  msgDiv.style.color = tipo === "erro" ? "red" : "green";
  msgDiv.innerText = msg;
  setTimeout(() => { msgDiv.innerText = ""; }, 3000);
}

// Exibe/oculta campo de detalhe de alergia
document.getElementById("alergiaSim").addEventListener("change", function () {
  document.getElementById("alergiaDetalhe").style.display = "block";
});
document.getElementById("alergiaNao").addEventListener("change", function () {
  document.getElementById("alergiaDetalhe").style.display = "none";
});
document.getElementById("alergiaNaoSei").addEventListener("change", function () {
  document.getElementById("alergiaDetalhe").style.display = "none";
});

// Exibe/oculta campo de detalhe de neuroatipicidade
document.getElementById("neuroatipico").addEventListener("change", function () {
  document.getElementById("neuroatipicoDetalhe").style.display = "block";
});
document.querySelectorAll('input[name="prioridade"]').forEach(function (radio) {
  if (radio.id !== "neuroatipico") {
    radio.addEventListener("change", function () {
      document.getElementById("neuroatipicoDetalhe").style.display = "none";
    });
  }
});

// Seleciona automaticamente "60 anos ou +" ao preencher data de nascimento
document.addEventListener('DOMContentLoaded', function() {
  const dataNascimento = document.getElementById('dataDeNascimento');
  const radio60mais = document.getElementById('60mais');
  if (!dataNascimento || !radio60mais) return;

  dataNascimento.addEventListener('change', function() {
    if (!this.value) return;
    const hoje = new Date();
    const nascimento = new Date(this.value);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    radio60mais.checked = idade >= 60;
  });
});

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Captura valores dos campos de texto
  const nome = document.getElementById("nome")?.value.trim() || "";
  const sobrenome = document.getElementById("sobrenome")?.value.trim() || "";
  const dataDeNascimento = document.getElementById("dataDeNascimento")?.value.trim() || "";
  const responsavel = document.getElementById("responsavel")?.value.trim() || "";
  const mae = document.getElementById("nomeMae")?.value.trim() || "";
  const procedimento = document.getElementById("procedimento")?.value.trim() || "";
  const CPF = document.getElementById("CPF")?.value.trim() || "";
  const medicacao = document.getElementById("medicacao")?.value.trim() || "";
  const endereco = document.getElementById("endereco")?.value.trim() || "";
  const telefone = document.getElementById("telefone")?.value.trim() || "";
  const doenca = document.getElementById("doencas")?.value.trim() || "";

  // Captura opções selecionadas de radio buttons
  let genero = document.querySelector('input[name="genero"]:checked');
  let prioridade = document.querySelector('input[name="prioridade"]:checked');
  let especificacao = document.querySelector('input[name="especificacao"]:checked');
  let alergia = document.querySelector('input[name="alergia"]:checked');
  let neuroatipicidade = document.querySelector('input[name="prioridade"]:checked');

  // Captura campos de detalhes
  const alergiaDetalhe = document.getElementById("alergiaDetalhe")?.value.trim() || "";
  const neuroatipicoDetalhe = document.getElementById("neuroatipicoDetalhe")?.value.trim() || "";

  // Validação dos campos obrigatórios
  if (
    !nome ||
    !sobrenome ||
    !CPF ||
    !dataDeNascimento ||
    !responsavel ||
    !procedimento ||
    !doenca ||
    !mae ||
    !medicacao ||
    !endereco ||
    !telefone ||
    !genero ||
    !(prioridade || (especificacao && especificacao.value === "60mais")) ||
    !alergia ||
    (alergia.value === "sim" && !alergiaDetalhe) ||
    (neuroatipicidade && neuroatipicidade.value === "neuroatipico" && !neuroatipicoDetalhe)
  ) {
    showMessage("Por favor, preencha todos os campos obrigatórios.", "erro");
    return;
  }

  // Monta texto de alergia
  let alergiaTexto = "";
  if (alergia.value === "sim") {
    alergiaTexto = `Sim${alergiaDetalhe ? " (" + alergiaDetalhe + ")" : ""}`;
  } else if (alergia.value === "nao") {
    alergiaTexto = "Não";
  } else {
    alergiaTexto = "Não sei";
  }

  // Monta texto de especificação/prioridade
  let especificacaoTexto = "";
  if (prioridade && prioridade.value === "neuroatipico") {
    especificacaoTexto = `Neuroatípico${neuroatipicoDetalhe ? " (" + neuroatipicoDetalhe + ")" : ""}`;
  } else if (especificacao && especificacao.value === "60mais") {
    especificacaoTexto = "60 anos ou +";
  } else if (prioridade && prioridade.value === "gestante") {
    especificacaoTexto = "Gestante";
  } else {
    especificacaoTexto = "Nenhuma";
  }

  // Cria o elemento de lista para exibir o cadastro na tela
  let li = document.createElement("li");
  li.innerHTML = `
    <span>Nome: ${nome}</span> <br> 
    <span>Sobrenome: ${sobrenome}</span> <br>
    <span>Data de Nascimento: ${dataDeNascimento}</span> <br>
    <span>Responsável: ${responsavel}</span> <br>
    <span>Procedimento: ${procedimento}</span> <br>
    <span>CPF: ${CPF}</span> <br>
    <span>Mãe: ${mae}</span> <br>
    <span>Medicação: ${medicacao}</span> <br>
    <span>Endereço: ${endereco}</span> <br>
    <span>Telefone: ${telefone}</span> <br>
    <span>Doença: ${doenca}</span> <br>
    <span>Gênero: ${genero.value}</span> <br>
    <span>Alergias: ${alergiaTexto}</span> <br>
    <span>Especificações: ${especificacaoTexto}</span> <br>
    <hr>
  `;
  resposta.appendChild(li);

  showMessage("Concluído!", "sucesso");
  form.reset();
  document.getElementById("alergiaDetalhe").style.display = "none";
  document.getElementById("neuroatipicoDetalhe").style.display = "none";
});