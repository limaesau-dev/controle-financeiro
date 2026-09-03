let movimentacoes =
  JSON.parse(localStorage.getItem("movimentacoes")) || [];


function adicionarMovimentacao() {

  const descricao =
    document.getElementById("descricao").value;

  const valor =
    Number(document.getElementById("valor").value);

  const data =
    document.getElementById("data").value;

  const tipo =
    document.getElementById("tipo").value;


  if (descricao === "" || valor <= 0 || data === "") {

    alert("Preencha a descrição, o valor e a data.");

    return;
  }


  const movimentacao = {

    id: Date.now(),

    descricao: descricao,

    valor: valor,

    data: data,

    tipo: tipo

  };


  movimentacoes.push(movimentacao);

  salvarDados();


  document.getElementById("descricao").value = "";

  document.getElementById("valor").value = "";

  document.getElementById("data").value = "";


  atualizarTela();
}


function salvarDados() {

  localStorage.setItem(
    "movimentacoes",
    JSON.stringify(movimentacoes)
  );

}


function formatarData(data) {

  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;

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


    let textoData = "";

    if (movimentacao.data) {

      textoData =
        ` - ${formatarData(movimentacao.data)}`;

    }


    informacoes.textContent =
      `${movimentacao.descricao} - R$ ${movimentacao.valor.toFixed(2)}${textoData}`;


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
