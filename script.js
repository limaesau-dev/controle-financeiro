// ================================
// DADOS DO SISTEMA
// ================================

let movimentacoes =
  JSON.parse(localStorage.getItem("movimentacoes")) || [];


// ================================
// FORMATAR VALOR EM REAL
// ================================

function formatarMoeda(valor) {

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor);

}


// ================================
// FORMATAR DATA
// ================================

function formatarData(data) {

  if (!data) {
    return "";
  }

  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ================================
// ADICIONAR MOVIMENTAÇÃO
// ================================

function adicionarMovimentacao() {

  const descricao =
    document.getElementById("descricao").value.trim();

  const valor =
    Number(document.getElementById("valor").value);

  const data =
    document.getElementById("data").value;

  const categoria =
    document.getElementById("categoria").value;

  const tipo =
    document.getElementById("tipo").value;


  // Verificação dos campos

  if (
    descricao === "" ||
    valor <= 0 ||
    data === "" ||
    categoria === ""
  ) {

    alert(
      "Preencha a descrição, o valor, a data e a categoria."
    );

    return;
  }


  // Criando a movimentação

  const movimentacao = {

    id: Date.now(),

    descricao: descricao,

    valor: valor,

    data: data,

    categoria: categoria,

    tipo: tipo

  };


  // Adiciona na lista

  movimentacoes.push(movimentacao);


  // Salva no navegador

  salvarDados();


  // Limpa os campos

  document.getElementById("descricao").value = "";

  document.getElementById("valor").value = "";

  document.getElementById("data").value = "";

  document.getElementById("categoria").value = "";


  // Atualiza a tela

  atualizarTela();

}


// ================================
// SALVAR DADOS
// ================================

function salvarDados() {

  localStorage.setItem(
    "movimentacoes",
    JSON.stringify(movimentacoes)
  );

}


// ================================
// ATUALIZAR TELA
// ================================

function atualizarTela() {

  const lista =
    document.getElementById("lista");


  lista.innerHTML = "";


  let totalReceitas = 0;

  let totalDespesas = 0;


  // Ordena as movimentações mais recentes primeiro

  const movimentacoesOrdenadas =
    [...movimentacoes].sort(function(a, b) {

      return new Date(b.data) - new Date(a.data);

    });


  // Verifica cada movimentação

  movimentacoesOrdenadas.forEach(
    function(movimentacao) {


      const item =
        document.createElement("li");


      const informacoes =
        document.createElement("span");


      // Categoria antiga pode não existir

      const categoria =
        movimentacao.categoria || "Outros";


      // Data pode não existir

      const data =
        movimentacao.data
          ? formatarData(movimentacao.data)
          : "";


      // Texto que aparece na lista

      informacoes.textContent =
        `${movimentacao.descricao} | ${categoria} | ${data} | ${formatarMoeda(movimentacao.valor)}`;


      // Classe receita ou despesa

      informacoes.classList.add(
        movimentacao.tipo
      );


      // Botão excluir

      const botao =
        document.createElement("button");


      botao.textContent =
        "Excluir";


      botao.onclick =
        function() {

          excluirMovimentacao(
            movimentacao.id
          );

        };


      // Coloca os elementos na tela

      item.appendChild(informacoes);

      item.appendChild(botao);

      lista.appendChild(item);


      // Calcula os totais

      if (
        movimentacao.tipo === "receita"
      ) {

        totalReceitas +=
          Number(movimentacao.valor);

      } else {

        totalDespesas +=
          Number(movimentacao.valor);

      }

    }
  );


  // Calcula o saldo

  const saldo =
    totalReceitas - totalDespesas;


  // Atualiza os cards

  document.getElementById("saldo").textContent =
    formatarMoeda(saldo);


  document.getElementById("receitas").textContent =
    formatarMoeda(totalReceitas);


  document.getElementById("despesas").textContent =
    formatarMoeda(totalDespesas);


  // Atualiza o contador

  const contador =
    document.getElementById("contador");


  const quantidade =
    movimentacoes.length;


  if (quantidade === 1) {

    contador.textContent =
      "1 movimentação";

  } else {

    contador.textContent =
      `${quantidade} movimentações`;

  }

}


// ================================
// EXCLUIR MOVIMENTAÇÃO
// ================================

function excluirMovimentacao(id) {

  movimentacoes =
    movimentacoes.filter(
      function(movimentacao) {

        return movimentacao.id !== id;

      }
    );


  salvarDados();

  atualizarTela();

}


// ================================
// INICIAR SISTEMA
// ================================

atualizarTela();
