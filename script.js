// ========================================================
// FINANZY
// CONTROLE FINANCEIRO
// ========================================================


// ========================================================
// CARREGAR DADOS
// ========================================================

let movimentacoes =
  JSON.parse(
    localStorage.getItem("movimentacoes")
  ) || [];


// ========================================================
// FORMATAR MOEDA
// ========================================================

function formatarMoeda(valor) {

  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  ).format(valor);

}


// ========================================================
// FORMATAR DATA
// ========================================================

function formatarData(data) {

  if (!data) {
    return "";
  }

  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ========================================================
// ADICIONAR MOVIMENTAÇÃO
// ========================================================

function adicionarMovimentacao() {

  const descricao =
    document
      .getElementById("descricao")
      .value
      .trim();

  const valor =
    Number(
      document
        .getElementById("valor")
        .value
    );

  const data =
    document
      .getElementById("data")
      .value;

  const categoria =
    document
      .getElementById("categoria")
      .value;

  const tipo =
    document
      .getElementById("tipo")
      .value;


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


  // Criar movimentação

  const movimentacao = {

    id: Date.now(),

    descricao: descricao,

    valor: valor,

    data: data,

    categoria: categoria,

    tipo: tipo

  };


  // Adicionar à lista

  movimentacoes.push(
    movimentacao
  );


  // Salvar

  salvarDados();


  // Limpar formulário

  document
    .getElementById("descricao")
    .value = "";

  document
    .getElementById("valor")
    .value = "";

  document
    .getElementById("data")
    .value = "";

  document
    .getElementById("categoria")
    .value = "";


  // Atualizar tela

  atualizarTela();

}


// ========================================================
// SALVAR DADOS
// ========================================================

function salvarDados() {

  localStorage.setItem(
    "movimentacoes",
    JSON.stringify(
      movimentacoes
    )
  );

}


// ========================================================
// ATUALIZAR TELA
// ========================================================

function atualizarTela() {

  const lista =
    document.getElementById("lista");


  const pesquisa =
    document
      .getElementById("pesquisa")
      .value
      .toLowerCase()
      .trim();


  const filtroTipo =
    document
      .getElementById("filtroTipo")
      .value;


  const filtroCategoria =
    document
      .getElementById("filtroCategoria")
      .value;


  lista.innerHTML = "";


  let totalReceitas = 0;

  let totalDespesas = 0;


  // ======================================================
  // CALCULAR TOTAIS
  // ======================================================

  movimentacoes.forEach(
    function(movimentacao) {

      if (
        movimentacao.tipo === "receita"
      ) {

        totalReceitas +=
          Number(
            movimentacao.valor
          );

      } else {

        totalDespesas +=
          Number(
            movimentacao.valor
          );

      }

    }
  );


  // ======================================================
  // FILTRAR
  // ======================================================

  const movimentacoesFiltradas =
    movimentacoes.filter(
      function(movimentacao) {

        const descricao =
          movimentacao.descricao
            .toLowerCase();


        const categoria =
          movimentacao.categoria ||
          "Outros";


        const correspondePesquisa =
          descricao.includes(
            pesquisa
          );


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

      }
    );


  // ======================================================
  // ORDENAR POR DATA
  // ======================================================

  movimentacoesFiltradas.sort(
    function(a, b) {

      return (
        new Date(b.data) -
        new Date(a.data)
      );

    }
  );


  // ======================================================
  // MOSTRAR MOVIMENTAÇÕES
  // ======================================================

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
        movimentacao.categoria ||
        "Outros";


      const data =
        movimentacao.data
          ? formatarData(
              movimentacao.data
            )
          : "Sem data";


      const nomeTipo =
        movimentacao.tipo === "receita"
          ? "Receita"
          : "Despesa";


      // ==================================================
      // ÍCONE DA CATEGORIA
      // ==================================================

      const iconesCategoria = {

        "Alimentação": "🍔",

        "Transporte": "🚗",

        "Moradia": "🏠",

        "Salário": "💰",

        "Compras": "🛒",

        "Educação": "📚",

        "Contas": "💡",

        "Outros": "📦"

      };


      const icone =
        iconesCategoria[categoria] ||
        "📦";


      detalhes.textContent =
        `${icone} ${categoria}  •  📅 ${data}  •  ${nomeTipo}`;


      // ==================================================
      // VALOR
      // ==================================================

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
        sinal +
        formatarMoeda(
          Number(
            movimentacao.valor
          )
        );


      // ==================================================
      // BOTÃO EXCLUIR
      // ==================================================

      const botao =
        document.createElement("button");


      botao.textContent =
        "Excluir";


      botao.type =
        "button";


      botao.onclick =
        function() {

          excluirMovimentacao(
            movimentacao.id
          );

        };


      // ==================================================
      // MONTAR ITEM
      // ==================================================

      informacoes.appendChild(
        descricao
      );

      informacoes.appendChild(
        detalhes
      );

      item.appendChild(
        informacoes
      );

      item.appendChild(
        valor
      );

      item.appendChild(
        botao
      );

      lista.appendChild(
        item
      );

    }
  );


  // ======================================================
  // SALDO
  // ======================================================

  const saldo =
    totalReceitas -
    totalDespesas;


  document
    .getElementById("saldo")
    .textContent =
      formatarMoeda(
        saldo
      );


  document
    .getElementById("receitas")
    .textContent =
      formatarMoeda(
        totalReceitas
      );


  document
    .getElementById("despesas")
    .textContent =
      formatarMoeda(
        totalDespesas
      );


  document
    .getElementById("contador")
    .textContent =
      movimentacoes.length;


  // ======================================================
  // MENSAGEM VAZIA
  // ======================================================

  const mensagemVazia =
    document.getElementById(
      "mensagemVazia"
    );


  if (
    movimentacoesFiltradas.length === 0
  ) {

    mensagemVazia.style.display =
      "flex";

  } else {

    mensagemVazia.style.display =
      "none";

  }


  // ======================================================
  // CONTADOR DOS FILTROS
  // ======================================================

  const contadorFiltro =
    document.getElementById(
      "contadorFiltro"
    );


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


  // ======================================================
  // GRÁFICO
  // ======================================================

  atualizarGrafico(
    totalReceitas,
    totalDespesas
  );

}


// ========================================================
// GRÁFICO
// ========================================================

function atualizarGrafico(
  totalReceitas,
  totalDespesas
) {

  const total =
    totalReceitas +
    totalDespesas;


  let percentualReceitas = 0;

  let percentualDespesas = 0;


  if (total > 0) {

    percentualReceitas =
      (
        totalReceitas /
        total
      ) * 100;


    percentualDespesas =
      (
        totalDespesas /
        total
      ) * 100;

  }


  document
    .getElementById(
      "barraReceitas"
    )
    .style.width =
      `${percentualReceitas}%`;


  document
    .getElementById(
      "barraDespesas"
    )
    .style.width =
      `${percentualDespesas}%`;


  document
    .getElementById(
      "percentualReceitas"
    )
    .textContent =
      `${percentualReceitas.toFixed(1)}%`;


  document
    .getElementById(
      "percentualDespesas"
    )
    .textContent =
      `${percentualDespesas.toFixed(1)}%`;

}


// ========================================================
// EXCLUIR MOVIMENTAÇÃO
// ========================================================

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

        return (
          movimentacao.id !== id
        );

      }
    );


  salvarDados();

  atualizarTela();

}


// ========================================================
// LIMPAR TUDO
// ========================================================

function limparTudo() {

  if (
    movimentacoes.length === 0
  ) {

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


// ========================================================
// MODO ESCURO
// ========================================================

function alternarTema() {

  document.body.classList.toggle(
    "dark-mode"
  );


  const modoEscuro =
    document.body.classList.contains(
      "dark-mode"
    );


  localStorage.setItem(
    "temaFinanzy",
    modoEscuro
      ? "escuro"
      : "claro"
  );


  atualizarBotaoTema();

}


// ========================================================
// ATUALIZAR BOTÃO DO TEMA
// ========================================================

function atualizarBotaoTema() {

  const botao =
    document.getElementById(
      "botaoTema"
    );


  if (!botao) {
    return;
  }


  const modoEscuro =
    document.body.classList.contains(
      "dark-mode"
    );


  if (modoEscuro) {

    botao.innerHTML =
      "☀️ <span>Modo claro</span>";

  } else {

    botao.innerHTML =
      "🌙 <span>Modo escuro</span>";

  }

}


// ========================================================
// CARREGAR TEMA SALVO
// ========================================================

function carregarTema() {

  const tema =
    localStorage.getItem(
      "temaFinanzy"
    );


  if (tema === "escuro") {

    document.body.classList.add(
      "dark-mode"
    );

  }


  atualizarBotaoTema();

}


// ========================================================
// INICIALIZAR SISTEMA
// ========================================================

carregarTema();

atualizarTela();
