let movimentacoes =
  JSON.parse(localStorage.getItem("movimentacoes")) || [];


function adicionarMovimentacao() {

  const descricao =
    document.getElementById("descricao").value;

  const valor =
    Number(document.getElementById("valor").value);

  const tipo =
    document.getElementById("tipo").value;


  if (descricao === "" || valor <= 0) {

    alert("Preencha a descrição e um valor válido.");

    return;
  }


  const movimentacao = {

    id: Date.now(),

    descricao: descricao,

    valor: valor,

    tipo: tipo

  };


  movimentacoes.push(movimentacao);

  salvarDados();


  document.getElementById("descricao").value = "";

  document.getElementById("valor").value = "";


  atualizarTela();
}


function salvarDados() {

  localStorage.setItem(
    "movimentacoes",
    JSON.stringify(movimentacoes)
  );

}


function atualizarTela() {

  const lista =
    document.getElementById("lista");

  lista.innerHTML = "";


  let totalReceitas = 0;

  let totalDespesas = 0;


  movimentacoes.forEach(function(movimentacao) {

    const item =
      document.createElement("li");


    const informacoes =
      document.createElement("span");

    informacoes.textContent =
      `${movimentacao.descricao} - R$ ${movimentacao.valor.toFixed(2)}`;


    informacoes.classList.add(
      movimentacao.tipo
    );


    const botao =
      document.createElement("button");

    botao.textContent = "Excluir";


    botao.onclick = function() {

      excluirMovimentacao(movimentacao.id);

    };


    item.appendChild(informacoes);

    item.appendChild(botao);

    lista.appendChild(item);


    if (movimentacao.tipo === "receita") {

      totalReceitas += movimentacao.valor;

    } else {

      totalDespesas += movimentacao.valor;

    }

  });


  const saldo =
    totalReceitas - totalDespesas;


  document.getElementById("saldo").textContent =
    `R$ ${saldo.toFixed(2)}`;


  document.getElementById("receitas").textContent =
    `R$ ${totalReceitas.toFixed(2)}`;


  document.getElementById("despesas").textContent =
    `R$ ${totalDespesas.toFixed(2)}`;

}


function excluirMovimentacao(id) {

  movimentacoes =
    movimentacoes.filter(function(movimentacao) {

      return movimentacao.id !== id;

    });


  salvarDados();

  atualizarTela();

}


atualizarTela();
