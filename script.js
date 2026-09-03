// ========================================
// CONTROLE FINANCEIRO
// ========================================

// Carrega as movimentações salvas no navegador
let movimentacoes =
  JSON.parse(localStorage.getItem("movimentacoes")) || [];


// ========================================
// FORMATAR VALOR
// ========================================

function formatarMoeda(valor) {

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor);

}


// ========================================
// FORMATAR DATA
// ========================================

function formatarData(data) {

  if (!data) {
    return "";
  }

  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ========================================
// ADICIONAR MOVIMENTAÇÃO
// ========================================

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


  // Verifica se os campos obrigatórios foram preenchidos

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


  // Cria uma nova movimentação

  const movimentacao = {

    id: Date.now(),

    descricao: descricao,

    valor: valor,

    data: data,

    categoria: categoria,

    tipo: tipo

  };


  // Adiciona a movimentação

  movimentacoes.push(movimentacao);


  // Salva os dados

  salvarDados();


  // Limpa os campos

  document.getElementById("descricao").value = "";

  document.getElementById("valor").value = "";

  document.getElementById("data").value = "";

  document.getElementById("categoria").value = "";


  // Atualiza a tela

  atualizarTela();

}


// ========================================
// SALVAR DADOS
// ========================================

function salvarDados() {

  localStorage.setItem(
    "movimentacoes",
    JSON.stringify(movimentacoes)
  );

}


// ========================================
// ATUALIZAR TELA
// ========================================

function atualizarTela() {

  const lista =
    document.getElementById("lista");

  const pesquisa =
    document.getElementById("pesquisa").value
      .toLowerCase()
      .trim();

  const filtroTipo =
    document.getElementById("filtroTipo").value;

  const filtroCategoria =
    document.getElementById("filtroCategoria").value;


  lista.innerHTML = "";


  let totalReceitas = 0;

  let totalDespesas = 0;


  // Calcula os valores gerais

  movimentacoes.forEach(function(movimentacao) {

    if (movimentacao.tipo === "receita") {

      totalReceitas += Number(movimentacao.valor);

    } else {

      totalDespesas += Number(movimentacao.valor);

    }

  });


  // Filtra as movimentações

  const movimentacoesFiltradas =
    movimentacoes.filter(function(movimentacao) {

      const descricao =
        movimentacao.descricao.toLowerCase();

      const categoria =
        movimentacao.categoria || "Outros";


      const correspondePesquisa =
        descricao.includes(pesquisa);


      const correspondeTipo =
        filtroTipo === "todos" ||
        movimentacao.tipo === filtroTipo;


      const correspondeCategoria =
        filtroCategoria === "todas" ||
        categoria === filtroCategoria;


      return (
        correspondePesquisa &&
        correspondeTipo &&
        correspondeCategoria
      );

    });


  // Organiza da data mais recente para a mais antiga

  movimentacoesFiltradas.sort(function(a, b) {

    return new Date(b.data) - new Date(a.data);

  });


  // Mostra as movimentações

  movimentacoesFiltradas.forEach(
    function(movimentacao) {

      const item =
        document.createElement("li");


      const informacoes =
        document.createElement("div");


      informacoes.className =
        "movimentacao-info";


      const descricao =
        document.createElement("span");


      descricao.className =
        "movimentacao-descricao";


      descricao.textContent =
        movimentacao.descricao;


      const detalhes =
        document.createElement("span");


      detalhes.className =
        "movimentacao-detalhes";


      const categoria =
        movimentacao.categoria || "Outros";


      const data =
        movimentacao.data
          ? formatarData(movimentacao.data)
          : "Sem data";


      const nomeTipo =
        movimentacao.tipo === "receita"
          ? "Receita"
          : "Despesa";


      detalhes.textContent =
        `${categoria} • ${data} • ${nomeTipo}`;


      const valor =
        document.createElement("strong");


      valor.className =
        "movimentacao-valor";


      valor.classList.add(
        movimentacao.tipo
      );


      const sinal =
        movimentacao.tipo === "receita"
          ? "+ "
          : "- ";


      valor.textContent =
        sinal + formatarMoeda(
          Number(movimentacao.valor)
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


      informacoes.appendChild(descricao);

      informacoes.appendChild(detalhes);

      item.appendChild(informacoes);

      item.appendChild(valor);

      item.appendChild(botao);

      lista.appendChild(item);

    }
  );


  // Atualiza os cards

  const saldo =
    totalReceitas - totalDespesas;


  document.getElementById("saldo").textContent =
    formatarMoeda(saldo);


  document.getElementById("receitas").textContent =
    formatarMoeda(totalReceitas);


  document.getElementById("despesas").textContent =
    formatarMoeda(totalDespesas);


  document.getElementById("contador").textContent =
    movimentacoes.length;


  // Atualiza mensagem quando não houver resultados

  const mensagemVazia =
    document.getElementById("mensagemVazia");


  if (movimentacoesFiltradas.length === 0) {

    mensagemVazia.style.display = "block";

  } else {

    mensagemVazia.style.display = "none";

  }


  // Atualiza informação dos filtros

  const contadorFiltro =
    document.getElementById("contadorFiltro");


  if (
    pesquisa !== "" ||
    filtroTipo !== "todos" ||
    filtroCategoria !== "todas"
  ) {

    contadorFiltro.textContent =
      `${movimentacoesFiltradas.length} resultado(s) encontrado(s)`;

  } else {

    contadorFiltro.textContent =
      "Exibindo todas as movimentações";

  }


  // Atualiza o gráfico

  atualizarGrafico(
    totalReceitas,
    totalDespesas
  );

}


// ========================================
// GRÁFICO
// ========================================

function atualizarGrafico(
  totalReceitas,
  totalDespesas
) {

  const total =
    totalReceitas + totalDespesas;


  let percentualReceitas = 0;

  let percentualDespesas = 0;


  if (total > 0) {

    percentualReceitas =
      (totalReceitas / total) * 100;


    percentualDespesas =
      (totalDespesas / total) * 100;

  }


  document.getElementById(
    "barraReceitas"
  ).style.width =
    `${percentualReceitas}%`;


  document.getElementById(
    "barraDespesas"
  ).style.width =
    `${percentualDespesas}%`;


  document.getElementById(
    "percentualReceitas"
  ).textContent =
    `${percentualReceitas.toFixed(1)}%`;


  document.getElementById(
    "percentualDespesas"
  ).textContent =
    `${percentualDespesas.toFixed(1)}%`;

}


// ========================================
// EXCLUIR MOVIMENTAÇÃO
// ========================================

function excluirMovimentacao(id) {

  const confirmar =
    confirm(
      "Deseja realmente excluir esta movimentação?"
    );


  if (!confirmar) {
    return;
  }


  movimentacoes =
    movimentacoes.filter(
      function(movimentacao) {

        return movimentacao.id !== id;

      }
    );


  salvarDados();

  atualizarTela();

}


// ========================================
// LIMPAR TODAS AS MOVIMENTAÇÕES
// ========================================

function limparTudo() {

  if (movimentacoes.length === 0) {

    alert(
      "Não existem movimentações para excluir."
    );

    return;
  }


  const confirmar =
    confirm(
      "Tem certeza que deseja apagar TODAS as movimentações?"
    );


  if (!confirmar) {
    return;
  }


  movimentacoes = [];


  salvarDados();

  atualizarTela();

}


// ========================================
// INICIAR SISTEMA
// ========================================

atualizarTela();
