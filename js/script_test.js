/*===================================================
                  RESPOSTAS
===================================================*/
// Lista as respostas
var listarRespostas = function listarRespostas() {
  
  var itens = [
    {
      idResposta: 01,
      tituloResposta: 'teste 001',
      respostaBRA: 'aaaaaaa'
    },
    {
      idResposta: 02,
      tituloResposta: 'teste 002',
      respostaBRA: 'bbbbbbb'
    },
    {
      idResposta: 03,
      tituloResposta: 'teste 003',
      respostaBRA: 'ccccccccc'
    },
    {
      idResposta: 04,
      tituloResposta: 'teste 004',
      respostaBRA: 'dddddddd'
    },
    {
      idResposta: 05,
      tituloResposta: 'teste 005',
      respostaBRA: 'eeeeeee'
    }
  ];

  // Popula a tabela com os dados
  itens.forEach(function(item) {

    // TBODY Container
    var tdobyDOM = document.querySelector('#carrega-lista');

    // Linha (TR)
    var trDOM = document.createElement('tr');

    // TD vazio
    var td1DOM = document.createElement('td');  
    trDOM.appendChild(td1DOM);

    // Título (Motivo da resposta)
    var td2DOM = document.createElement('td');
    td2DOM.innerHTML = item.tituloResposta;
    trDOM.appendChild(td2DOM);

    // Detalhe da resposta
    var td3DOM = document.createElement('td');
    td3DOM.setAttribute('class', 'visible_desktop');
    td3DOM.innerHTML = item.respostaBRA;
    trDOM.appendChild(td3DOM);

    // Opções
    var td4DOM = document.createElement('td');

    // Editar
    //Botão
    btnEditDOM = document.createElement('button');
    btnEditDOM.setAttribute('class', 'btn-options-table btn-options-table-edit mdl-button mdl-js-button mdl-button--icon');
    btnEditDOM.setAttribute('id', 'edit_' + item.idResposta);
    // Ícone do botão
    iconBtnEditDOM = document.createElement('i');
    iconBtnEditDOM.setAttribute('class', 'material-icons');
    iconBtnEditDOM.setAttribute('role', 'presentation');
    iconBtnEditDOM.innerHTML = 'edit';
    btnEditDOM.appendChild(iconBtnEditDOM);
    td4DOM.appendChild(btnEditDOM);
    // Tooltip
    tooltipEditDOM =  document.createElement('div');
    tooltipEditDOM.setAttribute('class', 'mdl-tooltip');
    tooltipEditDOM.setAttribute('data-mdl-for', 'edit_' + item.idResposta);
    tooltipEditDOM.innerHTML = 'Editar';
    td4DOM.appendChild(tooltipEditDOM);

    // Deletar
    //Botão
    btnDelDOM = document.createElement('button');
    btnDelDOM.setAttribute('class', 'btn-options-table btn-options-table-del mdl-button mdl-js-button mdl-button--icon');
    btnDelDOM.setAttribute('id', 'del_' + item.idResposta);
    btnDelDOM.setAttribute('data-featherlight', '#lightbox_remover');
    // Ícone do botão
    iconBtnDelDOM = document.createElement('i');
    iconBtnDelDOM.setAttribute('class', 'material-icons');
    iconBtnDelDOM.setAttribute('role', 'presentation');
    iconBtnDelDOM.innerHTML = 'delete';
    btnDelDOM.appendChild(iconBtnDelDOM);
    td4DOM.appendChild(btnDelDOM);
    // Tooltip
    tooltipDelDOM =  document.createElement('div');
    tooltipDelDOM.setAttribute('class', 'mdl-tooltip');
    tooltipDelDOM.setAttribute('data-mdl-for', 'del_' + item.idResposta);
    tooltipDelDOM.innerHTML = 'Remover';
    td4DOM.appendChild(tooltipDelDOM);

    trDOM.appendChild(td4DOM);

    tdobyDOM.appendChild(trDOM);

  });
    
}

listarRespostas();

