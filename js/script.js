/*===================================================
            VALIDAÇÃO DO FORMULÁRIO
===================================================*/

var validaFormulario =  function validaFormulario() {

  var cout_campos_invalidos = 0;

  $(".required").each(function() { 

    if(!this.value){
      $(this).parent().addClass('is-invalid');
      cout_campos_invalidos++;      
    }else{      
      $(this).parent().removeClass('is-invalid');
    }

  });

  return cout_campos_invalidos === 0 ? true : false;

}

/*===================================================
            OBTÉM O NOME DA PÁGINA NA URL
===================================================*/

var getPageName = function getPageName() {
  var url = document.location.href;
  url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
  url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
  url = url.substring(url.lastIndexOf("/") + 1, url.length);

  return url;
}

/*===================================================
            OBTÉM UM PARÂMETRO NA URL
===================================================*/

var getParam = function getParam(param) {
  var vars = {};
  window.location.href.replace( location.hash, '' ).replace( 
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function( m, key, value ) { // callback
      vars[key] = value !== undefined ? value : '';
    }
  );

  if ( param ) {
    return vars[param] ? vars[param] : null;  
  }
  return vars;
}

/*===================================================
                      SNACKBAR
===================================================*/

var snackMessage = function snackMessage(obj, mensagem, tempo) {
  // Configurações
  var snackSettings = {
    message: mensagem,  // Mensagem
    timeout: tempo      // Tempo de exibição
  };

  var snackbarContainer = document.querySelector(obj);
  snackbarContainer.MaterialSnackbar.showSnackbar(snackSettings);
}

/*===================================================
                   LOADING ICON
===================================================*/

var LoadingProgress = {
  container: document.querySelector('#icon-loading'),
  show: function Show() {    
    this.container.style.display = 'block';
  },
  hide: function Hide() {
    this.container.style.display = 'none';
  }
}

/*===================================================
            ATIVA / DESATIVA UM BOTÃO
===================================================*/

var ativaBotao = function ativaBotao(botao) {
  document.querySelector(botao).disabled = false;
}

var desativaBotao = function desativaBotao(botao) {
  document.querySelector(botao).disabled = true;
}

/*===================================================
                      TOKEN
===================================================*/

// Salva o TOKEN
var setToken = function setToken(token) {
  clearToken();
  window.localStorage.setItem('token', token);
  // Seta as informações do usuário
  setInfosUser();
}

// Retorna o TOKEN
var getToken = function getToken() {
  var token = window.localStorage.getItem('token');
  return token;
}

// Valida o TOKEN
var validaToken = function validaToken(token) {
  // Verifica se é do tipo string
  if (typeof token === 'string') {
    var tokenLocal = getToken();
    return tokenLocal === token ? true : false;
  }
  return false;
}

// Decodifica o TOKEN
var decodeToken = function decodeToken() {
  var tokenLocal = getToken(); 
  var tokenDecoded = jwt_decode(tokenLocal);
  return tokenDecoded;
}

// Limpar o TOKEN
var clearToken = function clearToken() {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('userId');
  window.localStorage.removeItem('userNome');
  window.localStorage.removeItem('userEmail');
  window.localStorage.removeItem('userTipo');
  window.localStorage.clear();
}

/*===================================================
       PERMISSÕES E INFOS DO USUÁRIO LOGADO
===================================================*/

var setInfosUser = function setInfosUser() {

  // Objeto com as infos do usuário logado
  var objUserInfos = decodeToken();

  // ID do usuário
  window.localStorage.setItem('userId', objUserInfos.id_colaborador);
  // Nome do usuário
  window.localStorage.setItem('userNome', objUserInfos.nome);
  // E-mail do usuário
  window.localStorage.setItem('userEmail', objUserInfos.email);
  // Tipo do usuário (Permissão)
  window.localStorage.setItem('userTipo', objUserInfos.permissao);

}

// Retorna o ID do usuário
var getUserId = function getUserId() {
  return window.localStorage.getItem('userId');
}

// Retorna o nome do usuário
var getUserNome = function getUserNome() {
  return window.localStorage.getItem('userNome');
}

// Retorna o e-mail do usuário
var getUserEmail = function getUserEmail() {
  return window.localStorage.getItem('userEmail');
}

// Retorna o tipo do usuário
var getUserTipo = function getUserTipo() {
  return window.localStorage.getItem('userTipo');
}

var loadPermissoes = function loadPermissoes() {
  
  // Nome do usuário da barra de navegação lateral
  $('#user-name-sidebar').text(getUserNome());
  // ATENÇÃO: Por enquanto exibindo o e-mail enquanto a API não retorna o nome...

  // Oculta os itens da barra de navegação lateral se o usuário não for ADMINISTRADOR
  if (getUserTipo() !== 'ADMINISTRADOR') {
    //$('.restrito-admin').attr('style','display: none !important');
    $('.restrito-admin').remove();
  } 

}

// Verifica se o usuário tem permissão para uma determinada página
var permissaoPage = function permissaoPage(pagina) {

  // Permissão da página
  var permissaoPage = false;

  // Páginas que os usuários ADMIN tem acesso
  var pags_admin = [
  'index.html',
  'respostas.html',
  'cadastrar_resposta.html',
  'editar_resposta.html',
  'colaboradores.html',
  'cadastrar_colaborador.html',
  'editar_colaborador.html',
  'atividades.html',
  'cadastrar_atividade.html',
  'editar_atividade.html',
  'editar_endereco.html',
  'curadoria.html',
  'curadoria_revisao.html',
  'curadoria_reprovacao.html',
  'filme_curadoria.html',
  'monitoria.html',
  'filme_monitoria.html',
  'monitoria_revisao.html',
  'monitoria_reprovacao.html',
  'minha_escala.html'
  ];

  // Páginas que os usuários COMUNS tem acesso
  var pags_user = [
  'curadoria.html',
  'curadoria_revisao.html',
  'curadoria_reprovacao.html',
  'filme_curadoria.html',
  'monitoria.html',
  'filme_monitoria.html',
  'monitoria_revisao.html',
  'monitoria_reprovacao.html',
  'minha_escala.html'
  ];

  // Obtém o tipo do usuário
  var tipoUser = getUserTipo();

  // Verifica o tipo para que seja feita a busca no array para cada tipo de usuário
  if (tipoUser === 'ADMINISTRADOR') {

    // Percorre o array de páginas e retorna TRUE caso seja encontrada a página especificada
    permissaoPage = pags_admin.some(function(pag) {
      return pag === pagina;
    });

  } else {

    // Percorre o array de páginas e retorna TRUE caso seja encontrada a página especificada
    permissaoPage = pags_user.some(function(pag) {
      return pag === pagina;
    });

  }

  // Se não tiver permissão, redireciona para a página de erro 403
  if (!permissaoPage) {
    window.location.href = 'error_403.html';
  }
  
}

/*===================================================
              MENSAGENS SNACK DE RETORNO
===================================================*/

// Grava a mensagem de retorno
var setMessageRetorno = function setMessageRetorno(msg) {
  if (msg) {
    window.localStorage.setItem('msg', msg);
  }
}

// Exibe a mensagem de retorno
var showMessageRetorno = function showMessageRetorno() {
  //snackMessage('#snackbar', 'teste', 3000);
  if (window.localStorage.getItem('msg')) {
    snackMessage('#snackbar', window.localStorage.getItem('msg'), 3000);
    window.localStorage.removeItem('msg');
  }
}

$(document).ready(function () {

  // Timeout de 0.1s
  setTimeout(function() {
    
    // Exibe a mensagem de retorno 
    showMessageRetorno();
    
  }, 100);

});

/*===================================================
                    VERIFICA LOGIN
===================================================*/

// Verifica se já está logado
var verificaLogin = function verificaLogin() {

  //console.log(getToken());

  // Se estiver DESLOGADO (Não existe um TOKEN)
  if (!getToken()) {

    // Se a página atual não for a index (login), redireciona para o login... 
    if (getPageName() !== 'index.html') {
      window.location.href = 'index.html';
    }

  } 

  // Se estiver LOGADO (Existe um TOKEN)
  else {

    // Se a página atual for a index (login), redireciona para a principal (curadoria)... 
    if (getPageName() === 'index.html') {
      window.location.href = 'curadoria.html';
    }

    // Carrega as infos e permissões do usuário
    loadPermissoes();

    // Verifica permissão para acessar a página
    permissaoPage(getPageName());

  }
  
}

// Verifica o login ao carregar a página
$(document).ready(function () {  
  verificaLogin();
});

/*===================================================
                    LOGOUT
===================================================*/

var efetuarLogout = function efetuarLogout() {

  //Limpa o token
  clearToken();

  // Redireciona
  window.location.href = 'index.html';

}

// Botão de logout
var btnLogout = $('#btn-logout');

// Evento de click do botão de logout
btnLogout.on('click', function() {
  // Efetua logout
  efetuarLogout();
});

/*===================================================
                      LOGIN
===================================================*/

// Função de login
var efetuarLogin = function efetuarLogin(email, senha) {

  // Adiciona os dados de login em um objeto
  var dados_login = {
    email: email,
    senha: senha
  }  
  
  $.ajax({

    url: 'http://localhost/Prj_StayFilm/login',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados_login) 

  }).done(function(response) {    
    
    // Armazena o token
    setToken(response.token);        
    // Ativa o botão de submit
    ativaBotao('#btn-entrar');
    // Oculta o ícone de loading
    LoadingProgress.hide();
    // Verifica o login
    verificaLogin();

  }).fail(function(response) {    

    // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
    if (response.readyState == 4) {      
      if (response.status == 401) {

        // Mensagem snackbar   
        snackMessage('#snackbar', 'Dados de acesso inválidos!', 3000);
        // Ativa o botão de submit
        ativaBotao('#btn-entrar');
        // Oculta o ícone de loading       
        LoadingProgress.hide();
        // Limpa e foca no campo de senha
        $('#senha').val('');
        $('#senha').focus();

      }     
    }
    // Network error (i.e. connection refused, access denied due to CORS, etc.)   
    else if (response.readyState == 0) {      

      // Mensagem snackbar   
      snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
      // Ativa o botão de submit
      ativaBotao('#btn-entrar');
      // Oculta o ícone de loading
      LoadingProgress.hide();
      // Limpa e foca no campo de senha
      $('#senha').val('');
      $('#senha').focus();
      
    }
    else {
      // something weird is happening
      console.log('erro other...');
    }
  });

}

$("#form-login").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Desativa o botão de submit
  desativaBotao('#btn-entrar');
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo
    var email = $('#email').val();
    var senha = $('#senha').val();

    // Executa a função de login
    efetuarLogin(email, senha);    

  } else {

    // Ativa o botão de submit
    ativaBotao('#btn-entrar');
    // Oculta o ícone de loading
    LoadingProgress.hide();

  }

});

/*=================================================
                     RESPOSTAS
===================================================*/

// Lista as respostas
var listarRespostas = function listarRespostas() {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/respostas',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(itens) {   

    if (itens.length > 0) {

      // TBODY Container
      var tbodyDOM = document.querySelector('#carrega-lista');

      // Limpa o conteúdo
      tbodyDOM.innerHTML = '';

      // Popula a tabela com os dados
      itens.forEach(function(item) {      
       
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

        // Botão de opção (Arrow)
        var btnOptDOM = document.createElement('button');
        btnOptDOM.setAttribute('class', 'btn-menu mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon');
        btnOptDOM.setAttribute('id', 'item_' + item.idResposta);

        // Ícone do botão de ação
        var iconBtnOptDOM = document.createElement('i');
        iconBtnOptDOM.setAttribute('class', 'material-icons');
        iconBtnOptDOM.setAttribute('role', 'presentation');
        iconBtnOptDOM.innerHTML = 'keyboard_arrow_down';       
        btnOptDOM.appendChild(iconBtnOptDOM);
        
        td4DOM.appendChild(btnOptDOM);

        // Opções do botão de ação (UL)
        var ulOptsDOM = document.createElement('ul');
        ulOptsDOM.setAttribute('class', 'mdl-menu-item mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right');
        ulOptsDOM.setAttribute('for', 'item_' + item.idResposta);

        // Item da opção (Edit)
        var aOptEditDOM = document.createElement('a');
        aOptEditDOM.setAttribute('class', 'link_item');
        aOptEditDOM.setAttribute('href', 'editar_resposta.html?id=' + item.idResposta); 

        var liOptEditDOM = document.createElement('li');
        liOptEditDOM.setAttribute('class', 'mdl-menu__item'); 

        var iconOptEditDOM = document.createElement('i');
        iconOptEditDOM.setAttribute('class', 'material-icons');
        iconOptEditDOM.setAttribute('role', 'presentation');
        iconOptEditDOM.innerHTML = 'edit';

        var txtIconOptEditDOM = document.createElement('span');
        txtIconOptEditDOM.innerHTML = 'Editar';         
        liOptEditDOM.appendChild(iconOptEditDOM);    
        liOptEditDOM.appendChild(txtIconOptEditDOM);     
        aOptEditDOM.appendChild(liOptEditDOM);      
        ulOptsDOM.appendChild(aOptEditDOM);

        // Item da opção (Remove)
        var aOptDelDOM = document.createElement('a');
        aOptDelDOM.setAttribute('class', 'link_item remove-item');
        // Evento click (Remover)
        aOptDelDOM.addEventListener('click', function() {
          // Passa o ID do item para o campo oculto do modal de exclusão
          $('#id-item-remove').val(item.idResposta);
          // Abre o modal de exclusão
          $.featherlight('#lightbox_remover');
        });

        var liOptDelDOM = document.createElement('li');
        liOptDelDOM.setAttribute('class', 'mdl-menu__item');

        var iconOptDelDOM = document.createElement('i');
        iconOptDelDOM.setAttribute('class', 'material-icons');
        iconOptDelDOM.setAttribute('role', 'presentation');
        iconOptDelDOM.innerHTML = 'delete';

        var txtIconOptDelDOM = document.createElement('span');
        txtIconOptDelDOM.innerHTML = 'Remover';     
        liOptDelDOM.appendChild(iconOptDelDOM);    
        liOptDelDOM.appendChild(txtIconOptDelDOM);     
        aOptDelDOM.appendChild(liOptDelDOM);      
        ulOptsDOM.appendChild(aOptDelDOM);

        td4DOM.appendChild(ulOptsDOM);    
        trDOM.appendChild(td4DOM);      
        tbodyDOM.appendChild(trDOM);

        // Atualiza os componentes do MDL
        componentHandler.upgradeDom();

      });
      
    } 
    // Se não houver registros
    else {
      // Oculta a tabela
      $('#table').hide();
      // Exibe a mensagem 'Sem registros'
      $('.sem-registros').show();
    }
    
  }).fail(function(response) {   

    // Exibe os detalhes no console
    console.log(response);

    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
        
  });

}

// Chama a funcção de listagem se a página for a correta (Respostas)
$(document).ready(function () {
  if (getPageName() === 'respostas.html') {
    listarRespostas();
  }
});

// Insere uma resposta
var insereResposta = function insereResposta(titulo, respostaBRA, respostaUSA, respostaESP) {

  // Adiciona os dados em um objeto
  var dados = {
    tituloResposta: titulo,
    respostaBRA: respostaBRA,
    respostaUSA: respostaUSA,
    respostaESP: respostaESP
  }  

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/private/resposta',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    // Armazena a mensagem de retorno
    setMessageRetorno('Cadastrado com sucesso');    
    
    // Redireciona para a tela de listagem
    window.location.href = 'respostas.html';

  }).fail(function(response) {    

    // Exibe os detalhes no console
    console.log(response);
    
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();

  });

}

// Remove uma resposta
var removeResposta = function removeResposta(idResposta) {
  
  $.ajax({

    url: 'http://localhost/Prj_StayFilm/private/resposta/remove/' + idResposta,
    type: 'DELETE',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(response) { 

    // Mensagem snackbar   
    snackMessage('#snackbar', 'Removido com sucesso', 3000);
    // Lista os itens
    listarRespostas();

  }).fail(function(response) {    
    
    // Exibe os detalhes no console
    console.log(response);
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    
  });

}

// Evento do click na caixa de remoção
$(document).ready(function() {
  $('#btn-modal-remover-resposta').on('click', function(del) {
    removeResposta($('#id-item-remove').val());
  });
});

// Altera uma resposta
var updateResposta = function updateResposta(idResposta, tituloResposta, respostaBRA, respostaUSA, respostaESP) {

  // Adiciona os dados em um objeto
  var dados = {
    idResposta: idResposta,
    tituloResposta: tituloResposta,
    respostaBRA: respostaBRA,
    respostaUSA: respostaUSA,
    respostaESP: respostaESP
  }  

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/private/resposta/editar/' + idResposta,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    // Armazena a mensagem de retorno
    setMessageRetorno('Alterado com sucesso');    
    
    // Redireciona para a tela de listagem
    window.location.href = 'respostas.html';

  }).fail(function(response) {    
    
    // Exibe os detalhes no console
    console.log(response);
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();

  });

}

// Retorna uma resposta
var getResposta = function getResposta(id) {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/resposta/' + id,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(response) {

    // Passa os valores para os campos
    $('#id_edit').val(response.idResposta).parent().addClass('is-dirty');
    $('#tituloResposta').val(response.tituloResposta).parent().addClass('is-dirty');
    $('#respostaBRA').val(response.respostaBRA).parent().addClass('is-dirty');
    $('#respostaUSA').val(response.respostaUSA).parent().addClass('is-dirty');
    $('#respostaESP').val(response.respostaESP).parent().addClass('is-dirty');
    
  }).fail(function(response) {    
    
    // Exibe os detalhes no console
    console.log(response);
      
    // Armazena a mensagem de retorno
    setMessageRetorno('Não foi possível realizar essa operação');

    // Redireciona para a tela de listagem
    window.location.href = 'respostas.html';

  });

}

// Carrega a resposta a ser editada
$(document).ready(function () {
  if (getPageName() === 'editar_resposta.html') {
    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {
      // Carrega a resposta
      getResposta(id);
    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'respostas.html';
    }    
  } 
});

// Envia o formulário
$("#form-cad-resposta").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Oculta o botão de submit
  $('#btn-submit').hide();
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo
    var titulo = $('#tituloResposta').val();
    var respostaBRA = $('#respostaBRA').val();
    var respostaUSA = $('#respostaUSA').val();
    var respostaESP = $('#respostaESP').val();
   
    // Executa a função de insert
    insereResposta(titulo, respostaBRA, respostaUSA, respostaESP);    

  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});

// Envia o formulário
$("#form-edit-resposta").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Oculta o botão de submit
  $('#btn-submit').hide();
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo
    var idResposta = $('#id_edit').val();
    var tituloResposta = $('#tituloResposta').val();
    var respostaBRA = $('#respostaBRA').val();
    var respostaUSA = $('#respostaUSA').val();
    var respostaESP = $('#respostaESP').val();
   
    // Executa a função de update
    updateResposta(idResposta, tituloResposta, respostaBRA, respostaUSA, respostaESP);    

  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});

/*=================================================
                  FORMATA DATAS
===================================================*/

// Formata data no formata SQL
var formatDataSQL = function formatDataSQL(data) {

  var dataSplit = data.split('/');
  return dataSplit[2] + '-' + dataSplit[1] + '-' + dataSplit[0];

}

// Formata data no formata BR
var formatDataBR = function formatDataBR(data) {

  var dataSplit = data.split('-');
  return dataSplit[2] + '/' + dataSplit[1] + '/' + dataSplit[0];

}

/*=================================================
                  COLABORADORES
===================================================*/

// Lista os colaboradores
var listarColaboradores = function listarColaboradores() {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/listarColaboradores',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(itens) {   

    if (itens.length > 0) {

      // TBODY Container
      var tbodyDOM = document.querySelector('#carrega-lista');

      // Limpa o conteúdo
      tbodyDOM.innerHTML = '';

      // Popula a tabela com os dados
      itens.forEach(function(item) {      
       
        // Linha (TR)
        var trDOM = document.createElement('tr');
        
        // Status
        var td1DOM = document.createElement('td'); 
        var spanStatus = document.createElement('span');

        // Verifica o status do colaborador
        if (item.status === true) {
          spanStatus.setAttribute('class', 'span_status aprovado');
          spanStatus.innerHTML = 'Ativo';
        } else {
          spanStatus.setAttribute('class', 'span_status reprovado');
          spanStatus.innerHTML = 'Inativo';
        }
        td1DOM.appendChild(spanStatus);
        trDOM.appendChild(td1DOM);

        // Nome
        var td2DOM = document.createElement('td');
        td2DOM.innerHTML = item.nome;       
        trDOM.appendChild(td2DOM);

        // E-mail
        var td3DOM = document.createElement('td');
        td3DOM.innerHTML = item.email;        
        trDOM.appendChild(td3DOM);

        // Telefone
        var td4DOM = document.createElement('td');
        td4DOM.innerHTML = item.telefoneResidencial;        
        trDOM.appendChild(td4DOM);

        // Opções
        var td5DOM = document.createElement('td');

        // Botão de opção (Arrow)
        var btnOptDOM = document.createElement('button');
        btnOptDOM.setAttribute('class', 'btn-menu mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon');
        btnOptDOM.setAttribute('id', 'item_' + item.idColaborador);

        // Ícone do botão de ação
        var iconBtnOptDOM = document.createElement('i');
        iconBtnOptDOM.setAttribute('class', 'material-icons');
        iconBtnOptDOM.setAttribute('role', 'presentation');
        iconBtnOptDOM.innerHTML = 'keyboard_arrow_down';       
        btnOptDOM.appendChild(iconBtnOptDOM);
        
        td5DOM.appendChild(btnOptDOM);

        // Opções do botão de ação (UL)
        var ulOptsDOM = document.createElement('ul');
        ulOptsDOM.setAttribute('class', 'mdl-menu-item mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right');
        ulOptsDOM.setAttribute('for', 'item_' + item.idColaborador);

        // Item da opção (Edit)
        var aOptEditDOM = document.createElement('a');
        aOptEditDOM.setAttribute('class', 'link_item');
        aOptEditDOM.setAttribute('href', 'editar_colaborador.html?id=' + item.idColaborador); 

        var liOptEditDOM = document.createElement('li');
        liOptEditDOM.setAttribute('class', 'mdl-menu__item'); 

        var iconOptEditDOM = document.createElement('i');
        iconOptEditDOM.setAttribute('class', 'material-icons');
        iconOptEditDOM.setAttribute('role', 'presentation');
        iconOptEditDOM.innerHTML = 'edit';

        var txtIconOptEditDOM = document.createElement('span');
        txtIconOptEditDOM.innerHTML = 'Editar';         
        liOptEditDOM.appendChild(iconOptEditDOM);    
        liOptEditDOM.appendChild(txtIconOptEditDOM);     
        aOptEditDOM.appendChild(liOptEditDOM);      
        ulOptsDOM.appendChild(aOptEditDOM);

        // Item da opção (Atividades)
        var aOptAtivDOM = document.createElement('a');
        aOptAtivDOM.setAttribute('class', 'link_item');
        aOptAtivDOM.setAttribute('href', 'atividades.html?id=' + item.idColaborador); 

        var liOptAtivDOM = document.createElement('li');
        liOptAtivDOM.setAttribute('class', 'mdl-menu__item'); 

        var iconOptAtivDOM = document.createElement('i');
        iconOptAtivDOM.setAttribute('class', 'material-icons');
        iconOptAtivDOM.setAttribute('role', 'presentation');
        iconOptAtivDOM.innerHTML = 'school';

        var txtIconOptAtivDOM = document.createElement('span');
        txtIconOptAtivDOM.innerHTML = 'Atividades';         
        liOptAtivDOM.appendChild(iconOptAtivDOM);    
        liOptAtivDOM.appendChild(txtIconOptAtivDOM);     
        aOptAtivDOM.appendChild(liOptAtivDOM);      
        ulOptsDOM.appendChild(aOptAtivDOM);

        // Item da opção (Endereço)
        var aOptEndDOM = document.createElement('a');
        aOptEndDOM.setAttribute('class', 'link_item');
        aOptEndDOM.setAttribute('href', 'editar_endereco.html?id=' + item.idColaborador); 

        var liOptEndDOM = document.createElement('li');
        liOptEndDOM.setAttribute('class', 'mdl-menu__item'); 

        var iconOptEndDOM = document.createElement('i');
        iconOptEndDOM.setAttribute('class', 'material-icons');
        iconOptEndDOM.setAttribute('role', 'presentation');
        iconOptEndDOM.innerHTML = 'location_on';

        var txtIconOptEndDOM = document.createElement('span');
        txtIconOptEndDOM.innerHTML = 'Endereço';         
        liOptEndDOM.appendChild(iconOptEndDOM);    
        liOptEndDOM.appendChild(txtIconOptEndDOM);     
        aOptEndDOM.appendChild(liOptEndDOM);      
        ulOptsDOM.appendChild(aOptEndDOM);

        td5DOM.appendChild(ulOptsDOM);    
        trDOM.appendChild(td5DOM);      
        tbodyDOM.appendChild(trDOM);

        // Atualiza os componentes do MDL
        componentHandler.upgradeDom();

      });
      
    } 
    // Se não houver registros
    else {
      // Oculta a tabela
      $('#table').hide();
      // Exibe a mensagem 'Sem registros'
      $('.sem-registros').show();
    }
    
  }).fail(function(response) {   

    // Exibe os detalhes no console
    console.log(response);

    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
        
  });

}

// Chama a funcção de listagem se a página for a correta (Respostas)
$(document).ready(function () {
  if (getPageName() === 'colaboradores.html') {
    listarColaboradores();
  }
});

// Insere um colaborador
var insereColaborador = function insereColaborador(nome, nascimento, telefone, celular, email, senha, permissao, status) {

  // Adiciona os dados em um objeto
  var dados = {
    nome: nome,
    dataNasc: nascimento,
    status: status,
    telefoneResidencial: telefone,
    telefoneCelular: celular,
    email: email,
    senha: senha,
    permissao: permissao
  }  

  console.log(dados);
 
  $.ajax({

    url: 'http://localhost/Prj_StayFilm/private/colaborador',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    // Armazena a mensagem de retorno
    setMessageRetorno('Cadastrado com sucesso');    
    
    // Redireciona para a tela de listagem
    window.location.href = 'colaboradores.html';

  }).fail(function(response) {    

    // Exibe os detalhes no console
    console.log(response);
    
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();

  });

}

// Altera uma resposta
var updateColaborador = function updateColaborador(idColaborador, nome, nascimento, telefone, celular, email, permissao, status, senha) {

  // Adiciona os dados em um objeto
  var dados = {
    idColaborador: idColaborador,
    nome: nome,
    dataNasc: nascimento,
    status: status,
    telefoneResidencial: telefone,
    telefoneCelular: celular,
    email: email,
    senha: senha,
    permissao: permissao
  }  

  console.log(dados);

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/colaborador/editar/' + idColaborador,
    type: 'PATCH',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    // Armazena a mensagem de retorno
    setMessageRetorno('Alterado com sucesso');    
    
    // Redireciona para a tela de listagem
    window.location.href = 'colaboradores.html';

  }).fail(function(response) {    
    
    if (response.status == 200) {

      // Armazena a mensagem de retorno
      setMessageRetorno('Alterado com sucesso');    
    
      // Redireciona para a tela de listagem
      window.location.href = 'colaboradores.html';

    } else {

      // Exibe os detalhes no console
      console.log(response.status);
      // Mensagem snackbar   
      snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
      // Exibe o botão de submit
      $('#btn-submit').show();
      // Oculta o ícone de loading
      LoadingProgress.hide();

    }
    

  });

}

// Retorna um colaborador
var getColaborador = function getColaborador(id) {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/private/colaborador/busca/' + id,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(response) {

    // Executa determinada ação dependendo da página
    switch (getPageName()) {

      case 'editar_colaborador.html':

        // Passa os valores para os campos
        $('#id_edit').val(response.idColaborador);
        $('#nome').val(response.nome).parent().addClass('is-dirty');
        $('#nascimento').val(response.dataNasc.replace(/-/g, '/')).parent().addClass('is-dirty');
        $('#telefone').val(response.telefoneResidencial).parent().addClass('is-dirty');
        $('#celular').val(response.telefoneCelular).parent().addClass('is-dirty');
        $('#email').val(response.email).parent().addClass('is-dirty');    
        response.permissao === 'ADMINISTRADOR' ? $('#permissao').val('Administrador').parent().addClass('is-dirty') : $('#permissao').val('Usuário Comum').parent().addClass('is-dirty');
        !!response.status ? $('#status').val('Ativo').parent().addClass('is-dirty') : $('#status').val('Inativo').parent().addClass('is-dirty');
        break;

      case 'atividades.html':
        
        // Exibe o nome do colaborador no título da tela de atividades
        $('#titulo-nome-colaborador').text(response.nome);

        // Personaliza o link para cadastrar uma atividade com o ID do colaborador
        $('#btn-cad-atividade').attr('href', 'cadastrar_atividade.html?id=' + response.idColaborador);
        
        // Lista as atividades do colaborador
        listarAtividades(response.idColaborador);
        break; 

      case 'cadastrar_atividade.html':
      case 'editar_atividade.html':

        // Exibe o nome do colaborador no título da tela de atividades
        $('#titulo-nome-colaborador').text(response.nome);

        // Passa o id do colaborador para um campo oculto do formulário
        $('#id_colaborador').val(response.idColaborador);

        // Personaliza o link de cancalar no formulário de cadastro da atividade com o ID do colaborador
        $('#btn-cancelar-form-atividades').attr('href', 'atividades.html?id=' + response.idColaborador);

        break;   

      case 'editar_endereco.html':

        // Exibe o nome do colaborador no título da tela de atividades
        $('#titulo-nome-colaborador').text(response.nome);

        // Passa o id do colaborador para um campo oculto do formulário
        $('#id_colaborador').val(response.idColaborador);

        // Personaliza o link de cancalar no formulário de cadastro da atividade com o ID do colaborador
        $('#btn-cancelar-form-atividades').attr('href', 'colaboradores.html');

        break;   

    }
    
  }).fail(function(response) {    
    
    // Exibe os detalhes no console
    console.log(response);
      
    // Armazena a mensagem de retorno
    setMessageRetorno('Não foi possível realizar essa operação');

    // Redireciona para a tela de listagem
    window.location.href = 'colaboradores.html';

  });

}

// Carrega o colaborador a ser editado
$(document).ready(function () {
  if (getPageName() === 'editar_colaborador.html') {
    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {
      // Carrega o colaborador
      getColaborador(id);
    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'colaboradores.html';
    }    
  } 
});

// Validações e configurações do formulário
$(document).ready(function() {
  // Verifica se a página é a de cadastrar colaborador
  if (getPageName() === 'cadastrar_colaborador.html' || getPageName() === 'editar_colaborador.html') {

    // Máscaras de campo
    $("#nascimento").mask("99/99/9999",{placeholder:"dd/mm/yyyy"});
    $("#telefone").mask("(99) 9999-9999");
    $("#celular").mask("(99) 99999-9999");

    // Ajusta na classe MDL
    $("#nascimento, #telefone, #celular").on('change', function() {
      if ($(this).val()) {
        $(this).parent().addClass('is-dirty');
      } else {
        $(this).parent().removeClass('is-dirty'); 
      }          
    });

    // Verifica se o e-mail já está cadastrado
    $("#email").on('change', function() {
      console.log('verificar email');    
    });

    // Verifica se a senha e a confirmação são iguais
    $("#senha2").on('change', function() {       
      if ($(this).val() != $('#senha').val()) {
        $(this).parent().addClass('is-invalid');
        $(this).val('');          
      } else {
        $(this).parent().removeClass('is-invalid');          
      }        
    });

  }
  
});

$("#form-cad-colaborador").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Oculta o botão de submit
  $('#btn-submit').hide();
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo e formata os necessários
    var nome = $('#nome').val();
    var nascimento = formatDataSQL($('#nascimento').val());
    var telefone = $('#telefone').val();
    var celular = $('#celular').val();
    var email = $('#email').val();
    var senha = $('#senha').val();
    var permissao = $('#permissao').val() === 'Administrador' ? 1 : 0;
    var status = $('#status').val() === 'Ativo' ? true : false;
  
    // Executa a função de insert
    insereColaborador(nome, nascimento, telefone, celular, email, senha, permissao, status);  

  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    /// Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});

$("#form-edit-colaborador").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Oculta o botão de submit
  $('#btn-submit').hide();
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo e formata os necessários
    var idColaborador = $('#id_edit').val();
    var nome = $('#nome').val();
    var nascimento = formatDataSQL($('#nascimento').val());
    var telefone = $('#telefone').val();
    var celular = $('#celular').val();
    var email = $('#email').val();    
    var senha = $('#senha').val();
    var permissao = $('#permissao').val() === 'Administrador' ? 1 : 0;
    var status = $('#status').val() === 'Ativo' ? true : false;
  
    // Executa a função de update
    updateColaborador(idColaborador, nome, nascimento, telefone, celular, email, permissao, status, senha);  

  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    /// Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});

/*=================================================
                   ATIVIDADES
===================================================*/

// Lista as atividades
var listarAtividades = function listarAtividades(idColaborador) {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/lista/' + idColaborador,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(itens) {   
    
    if (itens.length > 0) {

      // TBODY Container
      var tbodyDOM = document.querySelector('#carrega-lista');

      // Limpa o conteúdo
      tbodyDOM.innerHTML = '';

      // Popula a tabela com os dados
      itens.forEach(function(item) {      
       
        // Linha (TR)
        var trDOM = document.createElement('tr');
        
        // TD vazio
        var td1DOM = document.createElement('td');         
        trDOM.appendChild(td1DOM);

        // Título 
        var td2DOM = document.createElement('td');
        td2DOM.innerHTML = item.atividade;       
        trDOM.appendChild(td2DOM);

        // Instituição
        var td3DOM = document.createElement('td');
        td3DOM.innerHTML = item.instituicao;        
        trDOM.appendChild(td3DOM);

        // Período
        var td4DOM = document.createElement('td');
        td4DOM.innerHTML = item.periodo;        
        trDOM.appendChild(td4DOM);

        // Opções
        var td5DOM = document.createElement('td');

        // Botão de opção (Arrow)
        var btnOptDOM = document.createElement('button');
        btnOptDOM.setAttribute('class', 'btn-menu mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon');
        btnOptDOM.setAttribute('id', 'item_' + item.idAtividade);

        // Ícone do botão de ação
        var iconBtnOptDOM = document.createElement('i');
        iconBtnOptDOM.setAttribute('class', 'material-icons');
        iconBtnOptDOM.setAttribute('role', 'presentation');
        iconBtnOptDOM.innerHTML = 'keyboard_arrow_down';       
        btnOptDOM.appendChild(iconBtnOptDOM);
        
        td5DOM.appendChild(btnOptDOM);

        // Opções do botão de ação (UL)
        var ulOptsDOM = document.createElement('ul');
        ulOptsDOM.setAttribute('class', 'mdl-menu-item mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right');
        ulOptsDOM.setAttribute('for', 'item_' + item.idAtividade);

        // Item da opção (Edit)
        /*var aOptEditDOM = document.createElement('a');
        aOptEditDOM.setAttribute('class', 'link_item');
        aOptEditDOM.setAttribute('href', 'editar_atividade.html?id=' + idColaborador + '&id_atividade=' + item.idAtividade); 

        var liOptEditDOM = document.createElement('li');
        liOptEditDOM.setAttribute('class', 'mdl-menu__item'); 

        var iconOptEditDOM = document.createElement('i');
        iconOptEditDOM.setAttribute('class', 'material-icons');
        iconOptEditDOM.setAttribute('role', 'presentation');
        iconOptEditDOM.innerHTML = 'edit';

        var txtIconOptEditDOM = document.createElement('span');
        txtIconOptEditDOM.innerHTML = 'Editar';         
        liOptEditDOM.appendChild(iconOptEditDOM);    
        liOptEditDOM.appendChild(txtIconOptEditDOM);     
        aOptEditDOM.appendChild(liOptEditDOM);      
        ulOptsDOM.appendChild(aOptEditDOM);*/

        // Item da opção (Remove)
        var aOptDelDOM = document.createElement('a');
        aOptDelDOM.setAttribute('class', 'link_item remove-item');
        // Evento click (Remover)
        aOptDelDOM.addEventListener('click', function() {
          // Passa o ID do item para o campo oculto do modal de exclusão
          $('#id-item-remove').val(item.idAtividade);
          // Passa o ID do colaborador para o campo oculto do modal de exclusão
          $('#id-item-colaborador').val(idColaborador);
          // Abre o modal de exclusão
          $.featherlight('#lightbox_remover');
        });

        var liOptDelDOM = document.createElement('li');
        liOptDelDOM.setAttribute('class', 'mdl-menu__item');

        var iconOptDelDOM = document.createElement('i');
        iconOptDelDOM.setAttribute('class', 'material-icons');
        iconOptDelDOM.setAttribute('role', 'presentation');
        iconOptDelDOM.innerHTML = 'delete';

        var txtIconOptDelDOM = document.createElement('span');
        txtIconOptDelDOM.innerHTML = 'Remover';     
        liOptDelDOM.appendChild(iconOptDelDOM);    
        liOptDelDOM.appendChild(txtIconOptDelDOM);     
        aOptDelDOM.appendChild(liOptDelDOM);      
        ulOptsDOM.appendChild(aOptDelDOM);

        td5DOM.appendChild(ulOptsDOM);    
        trDOM.appendChild(td5DOM);      
        tbodyDOM.appendChild(trDOM);

        // Atualiza os componentes do MDL
        componentHandler.upgradeDom();

      });
      
    } 
    // Se não houver registros
    else {
      // Oculta a tabela
      $('#table').hide();
      // Exibe a mensagem 'Sem registros'
      $('.sem-registros').show();
    }
    
  }).fail(function(response) {   

    // Exibe os detalhes no console
    console.log(response);

    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
        
  });

}

// Insere uma atividade
var insereAtividade = function insereAtividade(idColaborador, instituicao, atividade, periodo, escalasFixas) {

  // Adiciona os dados em um objeto
  var dados = {
    instituicao: instituicao,
    atividade: atividade,
    periodo: periodo
  }  

  var insereEscalaFixa = function insereEscalaFixa(idColaborador, escala) {

    $.ajax({

      url: 'http://localhost/Prj_StayFilm/escalabloqueiofixo/' + idColaborador,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify(escala),
      headers: {'Authorization': getToken()} 

    }).done(function(response) {      

      console.log('escala inserida com sucesso');

    }).fail(function(response) {    

      console.log('erro ao inserir escala');

    });

  }

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/atividade/' + idColaborador,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    escalasFixas.forEach(function(escala) {
      insereEscalaFixa(idColaborador, escala);
    });

    // Armazena a mensagem de retorno
    setMessageRetorno('Cadastrado com sucesso');    
    
    // Redireciona para a tela de listagem
    window.location.href = 'atividades.html?id=' + idColaborador;

  }).fail(function(response) {    

    // Exibe os detalhes no console
    console.log(response);
    
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();

  });

}

// Altera uma atividade
var updateAtividade = function updateAtividade(idColaborador, idAtividade, instituicao, atividade, periodo) {

  // Adiciona os dados em um objeto
  var dados = {
    idAtividade: idAtividade,
    instituicao: instituicao,
    atividade: atividade,
    periodo: periodo
  }  

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/atividade/editar/' + idAtividade + '/' + idColaborador,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    // Armazena a mensagem de retorno
    setMessageRetorno('Alterado com sucesso');    
    
    // Redireciona para a tela de listagem
    window.location.href = 'atividades.html?id=' + idColaborador;

  }).fail(function(response) {    
    
    // Exibe os detalhes no console
    console.log(response);
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();

  });

}

// Remove uma atividade
var removeAtividade = function removeAtividade(idColaborador, idAtividade) {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/atividade/' + idAtividade,
    type: 'DELETE',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(response) { 

    // Mensagem snackbar   
    snackMessage('#snackbar', 'Removido com sucesso', 3000);
    // Lista os itens
    listarAtividades(idColaborador);

  }).fail(function(response) {    
    
    // Exibe os detalhes no console
    console.log(response);
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    
  });

}

// Retorna uma atividade
var getAtividade = function getAtividade(id) {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/atividade/busca/' + id,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(response) {

    // Passa os valores para os campos
    $('#id_edit').val(response.idAtividade).parent().addClass('is-dirty');
    $('#instituicao').val(response.instituicao).parent().addClass('is-dirty');
    $('#atividade').val(response.atividade).parent().addClass('is-dirty');
    switch (response.periodo) {
      case 'MANHA':
        $('#periodo').val('Manhã').parent().addClass('is-dirty');
        break;
      case 'TARDE':
        $('#periodo').val('Tarde').parent().addClass('is-dirty');
        break;
      case 'NOITE':
        $('#periodo').val('Noite').parent().addClass('is-dirty');
        break;   
    }
    
  }).fail(function(response) {    
    
    // Exibe os detalhes no console
    console.log(response);
      
    // Armazena a mensagem de retorno
    setMessageRetorno('Não foi possível realizar essa operação');

  });

}

// Envia o formulário de cadastro
$("#form-cad-atividade").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Oculta o botão de submit
  $('#btn-submit').hide();
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo e formata os necessários
    var idColaborador = $('#id_colaborador').val();
    var instituicao = $('#instituicao').val();
    var atividade = $('#atividade').val();
    var periodo;
    switch ($('#periodo').val()) {
      case 'Manhã':
        periodo = 'MANHA';
        break;
      case 'Tarde':
        periodo = 'TARDE';
        break;
      case 'Noite':
        periodo = 'NOITE';
        break;   
    }

    var escalasFixas = [];
    $('input[name="dias_semana"]:checked').each(function() {

      horarios = $('#horario_' + this.value).val().replace(/h|\s*/ig,'').split('às');

      escalasFixas.push({
        "diaSemana": this.value.toUpperCase(),
        "horaInicio": horarios[0].replace(/^0+/,''),
        "horaFim": horarios[1].replace(/^0+/,''),
        "colaboradorId": idColaborador
      });
    });

    // Executa a função de insert
    insereAtividade(idColaborador, instituicao, atividade, periodo, escalasFixas);  

  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    /// Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});

// Envia o formulário de editar
$("#form-edit-atividade").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Oculta o botão de submit
  $('#btn-submit').hide();
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo e formata os necessários
    var idAtividade = $('#id_edit').val();
    var idColaborador = $('#id_colaborador').val();
    var instituicao = $('#instituicao').val();
    var atividade = $('#atividade').val();
    var periodo;
    switch ($('#periodo').val()) {
      case 'Manhã':
        periodo = 'MANHA';
        break;
      case 'Tarde':
        periodo = 'TARDE';
        break;
      case 'Noite':
        periodo = 'NOITE';
        break;   
    }
  
    // Executa a função de update
    updateAtividade(idColaborador, idAtividade, instituicao, atividade, periodo);  

  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    /// Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});

// Evento do click na caixa de remoção
$(document).ready(function() {
  $('#btn-modal-remover-atividade').on('click', function(del) {
    removeAtividade($('#id-item-colaborador').val(), $('#id-item-remove').val());
  });
});

// Carrega os dados do colaborador
$(document).ready(function () {

  if (getPageName() === 'atividades.html' || 
      getPageName() === 'cadastrar_atividade.html' ||
      getPageName() === 'editar_atividade.html' ||
      getPageName() === 'editar_endereco.html') {

    if (getPageName() === 'cadastrar_atividade.html') {
      $(".horario_semana").mask("99h às 99h");
      $('.mdl-textfield__input').on('change', function() {
        if ($(this).val()) {
          $(this).parent().addClass('is-dirty');
        }
      });
    }

    // Verifica se tem o ID na URL 
    var id = getParam('id');

    if (id) {
      // Carrega o colaborador
      getColaborador(id);
    } 

    // Redireciona para a tela de listagem
    else {
      window.location.href = 'colaboradores.html';
    }   

  } 
});

// Carrega a atividade a ser editada
$(document).ready(function () {
  if (getPageName() === 'editar_atividade.html') {
    // Verifica se vieram parâmetros na url
    var id = getParam('id');
    var id_atividade = getParam('id_atividade');
    if (id && id_atividade) {
      // Carrega a atividade
      getAtividade(id);
    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'atividades.html?id=' + id;
    }    
  } 
});

/*=================================================
                   ENDEREÇO
===================================================*/

// Array de estados
var estados_nomes = [];
estados_nomes['AC'] = 'Acre';
estados_nomes['AL'] = 'Alagoas';
estados_nomes['AP'] = 'Amapá';
estados_nomes['AM'] = 'Amazonas';
estados_nomes['BA'] = 'Bahia';
estados_nomes['CE'] = 'Ceará';
estados_nomes['DF'] = 'Distrito Federal';
estados_nomes['ES'] = 'Espírito Santo';
estados_nomes['GO'] = 'Goiás';
estados_nomes['MA'] = 'Maranhão';
estados_nomes['MT'] = 'Mato Grosso';
estados_nomes['MS'] = 'Mato Grosso do Sul';
estados_nomes['MG'] = 'Minas Gerais';
estados_nomes['PA'] = 'Pará';
estados_nomes['PB'] = 'Paraíba';
estados_nomes['PR'] = 'Paraná';
estados_nomes['PE'] = 'Pernambuco';
estados_nomes['PI'] = 'Piauí';
estados_nomes['RJ'] = 'Rio de Janeiro';
estados_nomes['RN'] = 'Rio Grande do Norte';
estados_nomes['RS'] = 'Rio Grande do Sul';
estados_nomes['RO'] = 'Rondônia';
estados_nomes['RR'] = 'Roraima';
estados_nomes['SC'] = 'Santa Catarina';
estados_nomes['SP'] = 'São Paulo';
estados_nomes['SE'] = 'Sergipe';
estados_nomes['TO'] = 'Tocantins';

var estados_siglas = [];
estados_siglas['Acre'] = 'AC';
estados_siglas['Alagoas'] = 'AL';
estados_siglas['Amapá'] = 'AP';
estados_siglas['Amazonas'] = 'AM'; 
estados_siglas['Bahia'] = 'BA';
estados_siglas['Ceará'] = 'CE';
estados_siglas['Distrito Federal'] = 'DF';
estados_siglas['Espírito Santo'] = 'ES';
estados_siglas['Goiás'] = 'GO';
estados_siglas['Maranhão'] = 'MA';
estados_siglas['Mato Grosso'] = 'MT';
estados_siglas['Mato Grosso do Sul'] = 'MS';
estados_siglas['Minas Gerais'] = 'MG';
estados_siglas['Pará'] = 'PA';
estados_siglas['Paraíba'] = 'PB';
estados_siglas['Paraná'] = 'PR';
estados_siglas['Pernambuco'] = 'PE';
estados_siglas['Piauí'] = 'PI';
estados_siglas['Rio de Janeiro'] = 'RJ';
estados_siglas['Rio Grande do Norte'] = 'RN';
estados_siglas['Rio Grande do Sul'] = 'RS';
estados_siglas['Rondônia'] = 'RO';
estados_siglas['Roraima'] = 'RR';
estados_siglas['Santa Catarina'] = 'SC';
estados_siglas['São Paulo'] = 'SP';
estados_siglas['Sergipe'] = 'SE';
estados_siglas['Tocantins'] = 'TO';

// Insere um endereço
var insereEndereco = function insereEndereco(idColaborador, endereco, complemento, bairro, cidade, estado, cep) {

  // Adiciona os dados em um objeto
  var dados = {
    endereco: endereco,
    complemento: complemento,
    bairro: bairro,
    cidade: cidade,
    estado: estado,
    cep: cep
  }  

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/endereco/' + idColaborador,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    // Armazena a mensagem de retorno
    setMessageRetorno('Cadastrado com sucesso'); 

    window.location;href = 'colaboradores.html';
    
  }).fail(function(response) {    

    // Exibe os detalhes no console
    console.log(response);
    
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();

  });

}

// Atualiza um endereço
var updateEndereco = function  updateEndereco(idEndereco, idColaborador, endereco, complemento, bairro, cidade, estado, cep) {

  // Adiciona os dados em um objeto
  var dados = {
    idEndereco: idEndereco,
    endereco: endereco,
    complemento: complemento,
    bairro: bairro,
    cidade: cidade,
    estado: estado,
    cep: cep
  }  

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/endereco/editar/' + idEndereco + '/' + idColaborador,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    // Armazena a mensagem de retorno
    setMessageRetorno('Alterado com sucesso');    
    
    // Redireciona para a tela de listagem
    window.location.href = 'colaboradores.html'; 

  }).fail(function(response) {    

    // Exibe os detalhes no console
    console.log(response);
    
    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
    // Exibe o botão de submit
    $('#btn-submit').show();
    // Oculta o ícone de loading
    LoadingProgress.hide();

  });

}

// Retorna um endereço
var getEndereco = function getEndereco(idColaborador) {

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/buscarEndereco/' + idColaborador,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(response) {

    // Caso não seja retornado nenhum endereco, atribui ao form a ação de inserir
    $('#acao').val('update');
    $('#btn-submit').val('Atualizar');

    // Passa os valores para os campos
    $('#id_edit').val(response.idEndereco).parent().addClass('is-dirty');
    $('#id_colaborador').val(response.idColaborador.idColaborador).parent().addClass('is-dirty');
    $('#bairro').val(response.bairro).parent().addClass('is-dirty');
    $('#cep').val(response.cep).parent().addClass('is-dirty');
    $('#cidade').val(response.cidade).parent().addClass('is-dirty');
    $('#complemento').val(response.complemento).parent().addClass('is-dirty');
    $('#endereco').val(response.endereco).parent().addClass('is-dirty');
    $('#estado').val(estados_nomes[response.estado]).parent().addClass('is-dirty');
    
  }).fail(function(response) { 

    // Caso não seja retornado nenhum endereco, atribui ao form a ação de inserir
    $('#acao').val('insert');
    $('#btn-submit').val('Cadastrar');
    
    // Exibe os detalhes no console
    console.log(response);
      
    // Armazena a mensagem de retorno
    //setMessageRetorno('Não foi possível realizar essa operação');

  });

}

// Envia o formulário de cadastro
$("#form-endereco").on('submit', function(e){
  
  // Cancela o envio do formulário
  e.preventDefault();
  // Oculta o botão de submit
  $('#btn-submit').hide();
  // Exibe o ícone de loading
  LoadingProgress.show();

  if (validaFormulario()) {
    
    //Pega os valores do campo e formata os necessários
    var idEndereco = $('#id_edit').val();
    var idColaborador = $('#id_colaborador').val();
    var cep = $('#cep').val();
    var endereco = $('#endereco').val();
    var complemento = $('#complemento').val();
    var bairro = $('#bairro').val();
    var cidade = $('#cidade').val();       
    var estado = estados_siglas[$('#estado').val()];

    if ($('#acao').val() == 'insert') {

      // Executa a função de insert
      insereEndereco(idColaborador, endereco, complemento, bairro, cidade, estado, cep);

    } else {

      // Executa a função de update
      updateEndereco(idEndereco, idColaborador, endereco, complemento, bairro, cidade, estado, cep);

    }
     
  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    /// Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});

// Carrega o endereço a ser editado
$(document).ready(function () {
  if (getPageName() === 'editar_endereco.html') {

    // Verifica se vieram parâmetros na url
    var idColaborador = getParam('id');
    if (idColaborador && idColaborador) {

      // Máscaras de campo
      $("#cep").mask("99999-999");
      // Carrega o endereço
      getEndereco(idColaborador);

    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'colaboradores.html';
    }    
  } 
});


// PENDENTE

/*=================================================
                CURADORIA
===================================================*/

// Clientes que vão pra Curadoria
var clientesCuradoria = ['Disney', 'Rádio Disney'];
// Clientes que vão pra Monitoria
var clientesMonitoria = ['Chelsea', 'Marvel'];

// Armazena uma lista de filmes
var saveFilmes = function saveFilmes(filmes) {
  delFilmes();
  window.localStorage.setItem('filmes', JSON.stringify(filmes));
}

// Retorna a lista de filmes
var getFilmes = function getFilmes() {
  return JSON.parse(window.localStorage.getItem('filmes'));
}

// Remove a lista de filmes
var delFilmes = function delFilmes() {
  localStorage.removeItem('filmes');
}

// Gera uma lista de filmes aleatórios
var gerarListaFilmes = function gerarListaFilmes(quantidade) {

  // Delete os Filmes
  delFilmes();

  // INFORMAÇÕES ALEATÓRIAS PARA CRIAÇÃO DE FILMES
  var nomes_aleatorios = ['Felipe Silva', 'Gustavo Henrique', 'Gabriela', 'José Controle', 'Luís Alberto', 'Luís Fernando', 'Maria Oliveira', 'Jeferson Teixeira', 'Alberto Lussano', 'Beatriz Costa', 'Camila Morais', 'Welligton Feitosa', 'Paulo Ribeiro', 'Leandro Freitas', 'Elizabete Furtado', 'Jennifer Dantas'];
  var titulos_aleatorios = ['Feliz Aniversário Ka!', 'Amor pra vida toda', 'Viagem para Madri 2016', 'Show do Paralamas', 'Minha princesa', 'Minha festa de 20', '2 anos de namoro', 'Carnaval Brazil', 'Família na Disney', 'Os 3 mosqueteiros', 'Chá de cozinha Marcela', 'Passeio no parque', 'Melhores momentos 2015', 'Retrospectiva 2016 Paula', '10 anos de casados', 'Niver Mauro'];
  var temas_aleatorios = ['Disney', 'Rádio Disney', 'Chelsea', 'Marvel'];
  var idiomas_aleatorios = ['en', 'pt', 'es'];
  var status_aleatorios = ['Aprovado', 'Pendente', 'Reprovado', 'Revisao', 'Favorito'];

  var FilmesList = [];

  for (var i=1; i<=quantidade; i++) {

    var ano = 2016;
    var mes = 12;
    var dia = Math.floor(Math.random() * 31 + 1);
    var horaAleatoria = Math.floor(Math.random() * 24 + 0);
    horaAleatoria = horaAleatoria < 10 ? '0'+horaAleatoria : horaAleatoria;
    var minAleatorios = Math.floor(Math.random() * 59 + 0);
    minAleatorios = minAleatorios < 10 ? '0'+minAleatorios : minAleatorios;
    var segAleatorios = Math.floor(Math.random() * 59 + 0);
    segAleatorios = segAleatorios < 10 ? '0'+segAleatorios : segAleatorios;
    var data = new Date(ano, Number(mes-1), dia, horaAleatoria, minAleatorios, segAleatorios);
    dia = dia < 10 ? '0'+dia : dia;

    FilmesList.push({
      idFilme: i,
      dataCriacao: dia+'/'+mes+'/'+ano+' '+horaAleatoria+':'+minAleatorios+':'+segAleatorios,
      data: data,
      descricaoFilme: titulos_aleatorios[Math.floor(Math.random() * (titulos_aleatorios.length) + 0)],
      statusFilme: status_aleatorios[Math.floor(Math.random() * (status_aleatorios.length) + 0)],
      temaFilme: temas_aleatorios[Math.floor(Math.random() * (temas_aleatorios.length) + 0)],
      usuarioFilme: nomes_aleatorios[Math.floor(Math.random() * (nomes_aleatorios.length) + 0)],
      usuarioIdioma: idiomas_aleatorios[Math.floor(Math.random() * (idiomas_aleatorios.length) + 0)],
      comentarios: []
    });

  }

  // Salva os filmes
  saveFilmes(FilmesList);

}

// Retorna um filme pelo ID
var getFilme = function getFilme(id) {

  var filmeObj = {};

  getFilmes().forEach(function(filme, index) {
    if (filme.idFilme == id) {
      filmeObj = filme;
    }
  });

  return filmeObj;

}

// Filtra os filmes por status
var filterStatus = function filterStatus(status) {

  return getFilmes().filter(function(filme) {
    return filme.statusFilme == status;
  });

}

// Filtra os filmes por cliente
var filterCliente = function filterCliente(cliente) {

  return getFilmes().filter(function(filme) {
    return filme.temaFilme == cliente;
  });

}

// Retorna a quantidade de filmes pendentes (Curadoria)
var getNumPendentesCuradoria = function getNumPendentesCuradoria() {

  var qtdePendentes = 0;

  getFilmes().forEach(function(filme, index) {

    // Filtra pelos clientes (Curadoria)  
    if (!clientesMonitoria.some(function(cliente) {
      return filme.temaFilme == cliente;
    })) {

      if (filme.statusFilme == 'Pendente') {
        qtdePendentes++;
      }
    }
      
  });

  return qtdePendentes;

}

// Retorna a quantidade de filmes pendentes (Monitoria)
var getNumPendentesMonitoria = function getNumPendentesMonitoria() {

  var qtdePendentes = 0;

  getFilmes().forEach(function(filme, index) {

    // Filtra pelos clientes (Curadoria)  
    if (!clientesCuradoria.some(function(cliente) {
      return filme.temaFilme == cliente;
    })) {

      if (filme.statusFilme == 'Pendente') {
        qtdePendentes++;
      }
    }
      
  });

  return qtdePendentes;

}

// Obtém o índice do filme no array de filmes
var getIndexFilme = function getIndexFilme(id) {
  var indexNum = null;
  getFilmes().forEach(function(filme, index) {
    if (filme.idFilme == id) {
      indexNum = index;
    }
  });
  return indexNum;
}

/*// Remove um filme do array pelo ID
var removeFilme = function removeFilme(id) {
  var index = getIndexFilme(id);
  if (index) {
    var Filmes = getFilmes();
    var removed = Filmes.splice(index, 1);
    saveFilmes(Filmes);
  }
}

// Adiciona um filme do array
var addFilme = function addFilme(filme) {
  var Filmes = getFilmes();
  Filmes.push(filme);
  saveFilmes(Filmes);
}*/

// Atualiza o status de um filme
var updateStatusFilme = function updateStatusFilme(id, status) {
  var filmes = getFilmes();
  filmes.forEach(function(filme, index) {
    if (filme.idFilme == id) {
      filme.statusFilme = status;
    }
  });
  saveFilmes(filmes);
}

// Adiciona um comentário a um filme
var addComentFilme = function addComentFilme(idFilme, comentario, colaborador) {
  var filmes = getFilmes();
  var data = new Date();
  var dia = data.getDate() < 10 ? '0'+data.getDate() : data.getDate();
  var mes = data.getMonth() < 10 ? '0'+data.getMonth() : data.getMonth();
  var ano = data.getFullYear();
  data = dia + '/' + Number(mes+1) + '/' + ano;
  filmes.forEach(function(filme, index) {
    if (filme.idFilme == idFilme) {
      filme.comentarios.push({
        'comentario': comentario,
        'colaborador': colaborador,
        'data': data
      });
    }
  });
  saveFilmes(filmes);
}

// Clientes que vão pra Curadoria
var clientesCuradoria = ['Disney', 'Rádio Disney'];
// Clientes que vão pra Monitoria
var clientesMonitoria = ['Chelsea', 'Marvel'];

// Listar os filmes da curadoria
var listarFilmesCuradoria = function listarFilmesCuradoria(filtroStatus, filtroCliente) {
  
  // Exibe a tabela
  $('#table').show();
  // Oculta a mensagem 'Sem registros'
  $('.sem-registros').hide();

  var filmes = [];

  if (filtroStatus !== '') {
    var filmes = filterStatus(filtroStatus);
  }

  if (filtroCliente !== '') {
    var filmes = filterCliente(filtroCliente);
  }

  if (filtroStatus === '' && filtroCliente === '') {
    var filmes = getFilmes();
  }

  if (filmes.length > 0) {

    // TBODY Container
    var tbodyDOM = document.querySelector('#carrega-lista');

    // Limpa o conteúdo
    tbodyDOM.innerHTML = '';

    // Ordena por data decrescente  
    filmes.sort(function(a, b) {

      a = new Date(a.data);
      b = new Date(b.data);
      return a > b ? -1 : a < b ? 1 : 0;

    // Popula a tabela com os dados
    }).forEach(function(filme) { 

      // Filtra pelos clientes (Curadoria)  
      if (!clientesMonitoria.some(function(cliente) {
        return filme.temaFilme == cliente;
      })) {
        
        // Linha (TR)
        var trDOM = document.createElement('tr');
        //Torna a linha da dabela clicável
        trDOM.addEventListener('click', function() {
          window.location.href = 'filme_curadoria.html?id=' + filme.idFilme;
        });

        // Status
        var td1DOM = document.createElement('td'); 
        var spanStatus = document.createElement('span');

        // Verifica o status do filme
        switch (filme.statusFilme) {
          // Pendente
          case 'Pendente':
            spanStatus.setAttribute('class', 'span_status pendente');
            spanStatus.innerHTML = 'Pendente';
            break;
          // Revisão
          case 'Revisao':
            spanStatus.setAttribute('class', 'span_status revisao');
            spanStatus.innerHTML = 'Revisão';
            break;
          // Aprovado
          case 'Aprovado':
            spanStatus.setAttribute('class', 'span_status aprovado');
            spanStatus.innerHTML = 'Aprovado';
            break;
          // Reprovado
          case 'Reprovado':
            spanStatus.setAttribute('class', 'span_status reprovado');
            spanStatus.innerHTML = 'Reprovado';
            break;
          // Favorito
          case 'Favorito':
            spanStatus.setAttribute('class', 'span_status favorito');
            spanStatus.innerHTML = 'Favorito';
            break;
        }  
        td1DOM.appendChild(spanStatus);
        trDOM.appendChild(td1DOM);

        // Título 
        var td2DOM = document.createElement('td');
        td2DOM.innerHTML = filme.descricaoFilme;       
        trDOM.appendChild(td2DOM);

        // Usuário
        var td3DOM = document.createElement('td');
        td3DOM.innerHTML = filme.usuarioFilme;        
        trDOM.appendChild(td3DOM);

        // Tema
        var td4DOM = document.createElement('td');
        td4DOM.setAttribute('class', 'visible_desktop');
        td4DOM.innerHTML = filme.temaFilme;        
        trDOM.appendChild(td4DOM);

        // Data
        var td5DOM = document.createElement('td');
        td5DOM.setAttribute('class', 'visible_desktop');
        td5DOM.innerHTML = filme.dataCriacao;        
        trDOM.appendChild(td5DOM);

        tbodyDOM.appendChild(trDOM);

        // Atualiza os componentes do MDL
        //componentHandler.upgradeDom();

      }   
    
    });
    
  } 
  // Se não houver registros
  else {
    // Oculta a tabela
    $('#table').hide();
    // Exibe a mensagem 'Sem registros'
    $('.sem-registros').show();
  }

}

// Listar os filmes da monitoria
var listarFilmesMonitoria = function listarFilmesMonitoria(filtroStatus, filtroCliente) {
  
  // Exibe a tabela
  $('#table').show();
  // Oculta a mensagem 'Sem registros'
  $('.sem-registros').hide();

  var filmes = [];

  if (filtroStatus !== '') {
    var filmes = filterStatus(filtroStatus);
  }

  if (filtroCliente !== '') {
    var filmes = filterCliente(filtroCliente);
  }

  if (filtroStatus === '' && filtroCliente === '') {
    var filmes = getFilmes();
  }

  if (filmes.length > 0) {

    // TBODY Container
    var tbodyDOM = document.querySelector('#carrega-lista');

    // Limpa o conteúdo
    tbodyDOM.innerHTML = '';

    // Ordena por data decrescente  
    filmes.sort(function(a, b) {

      a = new Date(a.data);
      b = new Date(b.data);
      return a > b ? -1 : a < b ? 1 : 0;

    // Popula a tabela com os dados
    }).forEach(function(filme) { 

      // Filtra pelos clientes (Monitoria)  
      if (!clientesCuradoria.some(function(cliente) {
        return filme.temaFilme == cliente;
      })) {
        
        // Linha (TR)
        var trDOM = document.createElement('tr');
        //Torna a linha da dabela clicável
        trDOM.addEventListener('click', function() {
          window.location.href = 'filme_monitoria.html?id=' + filme.idFilme;
        });

        // Status
        var td1DOM = document.createElement('td'); 
        var spanStatus = document.createElement('span');

        // Verifica o status do filme
        switch (filme.statusFilme) {
          // Pendente
          case 'Pendente':
            spanStatus.setAttribute('class', 'span_status pendente');
            spanStatus.innerHTML = 'Pendente';
            break;
          // Revisão
          case 'Revisao':
            spanStatus.setAttribute('class', 'span_status revisao');
            spanStatus.innerHTML = 'Revisão';
            break;
          // Aprovado
          case 'Aprovado':
            spanStatus.setAttribute('class', 'span_status aprovado');
            spanStatus.innerHTML = 'Aprovado';
            break;
          // Reprovado
          case 'Reprovado':
            spanStatus.setAttribute('class', 'span_status reprovado');
            spanStatus.innerHTML = 'Reprovado';
            break;
          // Favorito
          case 'Favorito':
            spanStatus.setAttribute('class', 'span_status favorito');
            spanStatus.innerHTML = 'Favorito';
            break;
        }  
        td1DOM.appendChild(spanStatus);
        trDOM.appendChild(td1DOM);

        // Título 
        var td2DOM = document.createElement('td');
        td2DOM.innerHTML = filme.descricaoFilme;       
        trDOM.appendChild(td2DOM);

        // Usuário
        var td3DOM = document.createElement('td');
        td3DOM.innerHTML = filme.usuarioFilme;        
        trDOM.appendChild(td3DOM);

        // Tema
        var td4DOM = document.createElement('td');
        td4DOM.setAttribute('class', 'visible_desktop');
        td4DOM.innerHTML = filme.temaFilme;        
        trDOM.appendChild(td4DOM);

        // Data
        var td5DOM = document.createElement('td');
        td5DOM.setAttribute('class', 'visible_desktop');
        td5DOM.innerHTML = filme.dataCriacao;        
        trDOM.appendChild(td5DOM);

        tbodyDOM.appendChild(trDOM);

        // Atualiza os componentes do MDL
        //componentHandler.upgradeDom();

      }   
    
    });
    
  } 
  // Se não houver registros
  else {
    // Oculta a tabela
    $('#table').hide();
    // Exibe a mensagem 'Sem registros'
    $('.sem-registros').show();
  }

}

// TELA DE LISTAGEM DA CURADORIA
$(document).ready(function () {

  // Atualiza as labels de filmes pendêntes
  if (getNumPendentesCuradoria() > 0) {
    $('#count-pendentes-curadoria-lt').text(getNumPendentesCuradoria());
  }
  if (getNumPendentesMonitoria() > 0) {
    $('#count-pendentes-monitoria-lt').text(getNumPendentesMonitoria());
  }

  if (getPageName() === 'curadoria.html') {

    // Gera os filmes
    if (!getFilmes()) {
      gerarListaFilmes(10);
    }
    
    // Lista os Filmes da Curadoria
    listarFilmesCuradoria('', '');

    // Atualiza as labels de filmes pendêntes da curadoria
    if (getNumPendentesCuradoria() > 0) {
      $('#count-pendentes-hd').text(getNumPendentesCuradoria());
    }
    
    // Filtrar Status 'Pendente'
    $('#btn-filtro-status-pendentes').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesCuradoria('Pendente', '');
    });
    // Filtrar Status 'Revisao'
    $('#btn-filtro-status-revisao').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesCuradoria('Revisao', '');
    });
    // Filtrar Status 'Aprovado'
    $('#btn-filtro-status-aprovados').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesCuradoria('Aprovado', '');
    });
    // Filtrar Status 'Reprovado'
    $('#btn-filtro-status-reprovados').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesCuradoria('Reprovado', '');
    });
    // Filtrar Status 'Favorito'
    $('#btn-filtro-status-favoritos').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesCuradoria('Favorito', '');
    });

    // Filtrar Cliente 'Disney'
    $('#btn-filtro-cliente-disney').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesCuradoria('', 'Disney');
    });
    // Filtrar Cliente 'Rádio Disney'
    $('#btn-filtro-cliente-radio-disney').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesCuradoria('', 'Rádio Disney');
    });
    
  } 
});

// TELA DO FILME DA CURADORIA
$(document).ready(function () {
  if (getPageName() === 'filme_curadoria.html') {

    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {

      // Carrega o filme
      var filmeCuradoria = getFilme(id);

      // ID do Filme
      $('#id_filme').val(filmeCuradoria.idFilme);
      // Título do Filme
      $('#titulo-filme').text(filmeCuradoria.descricaoFilme);
      // Usuário do Filme
      $('#nome-user').text(filmeCuradoria.usuarioFilme);
      // Tema do Filme
      $('#tema-filme').text(filmeCuradoria.temaFilme);
      // Data do Filme
      $('#data-filme').text(filmeCuradoria.dataCriacao);

      // Carrega comentários
      if (filmeCuradoria.statusFilme == 'Revisao' && filmeCuradoria.comentarios.length > 0) {

        // Load comentários
        var containerComents = document.querySelector('#load_comentarios');

        // Section
        var sectionComents = document.createElement('section');
        sectionComents.setAttribute('class', 'detalhes-revisao');

        // H2 (Título)
        var tituloComents = document.createElement('h2');
        tituloComents.innerHTML = 'Comentários';
        sectionComents.appendChild(tituloComents);

        // Comentários
        filmeCuradoria.comentarios.forEach(function(coment) {

          // Comentário
          var divComent = document.createElement('div');
          divComent.setAttribute('class', 'detalhe');

          // Mensagem
          var msgComent = document.createElement('p');
          msgComent.innerHTML = coment.comentario;
          divComent.appendChild(msgComent);

          // Colaborador e Data
          var nomeDataComent = document.createElement('span');
          nomeDataComent.innerHTML = coment.colaborador + ' em ' + coment.data;
          divComent.appendChild(nomeDataComent);

          sectionComents.appendChild(divComent);

        });

        containerComents.appendChild(sectionComents);
      }

      // Aprova Filme
      $('#btn-aprovar-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Atualiza o status do filme
        updateStatusFilme(idFilmeEdit, 'Aprovado');

        setMessageRetorno('Filme aprovado com sucesso');

        // Redireciona para a tela de listagem
        window.location.href = 'curadoria.html';
        
      });
      // Favoritar Filme
      $('#btn-favoritar-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Atualiza o status do filme
        updateStatusFilme(idFilmeEdit, 'Favorito');

        setMessageRetorno('Filme aprovado com sucesso');

        // Redireciona para a tela de listagem
        window.location.href = 'curadoria.html';
        
      });
      // Revisão
      $('#btn-revisao-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Redireciona para a tela de revisão
        window.location.href = 'curadoria_revisao.html?id=' + idFilmeEdit;
        
      });
      // Reprovação
      $('#btn-reprovar-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Redireciona para a tela de reprovação
        window.location.href = 'curadoria_reprovacao.html?id=' + idFilmeEdit;
        
      });

    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'curadoria.html';
    }    
  } 
});

// TELA DE REVISÃO DO FILME DA CURADORIA
$(document).ready(function () {
  if (getPageName() === 'curadoria_revisao.html') {

    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {

      // Carrega o filme
      var filmeRevisao = getFilme(id);

      // ID do Filme
      $('#id_filme').val(filmeRevisao.idFilme);
      // Título do Filme
      $('#titulo-filme').text(filmeRevisao.descricaoFilme);

      // Botão de cancelar
      $('#btn-back').attr('href', 'filme_curadoria.html?id=' + filmeRevisao.idFilme);
      
      // Marcar para revisão
      $("#form-revisao-curadoria").on('submit', function(e){

        // Cancela o envio do formulário
        e.preventDefault();
        // Oculta o botão de submit
        $('#btn-submit').hide();
                
        if (validaFormulario()) {
          
          var comentario = $('#comentario').val();
          addComentFilme(filmeRevisao.idFilme, comentario, 'Fulano'); // PENDENTE (NOME DO USER)
          updateStatusFilme(filmeRevisao.idFilme, 'Revisao');

          setMessageRetorno('Filme marcado para revisão');

          // Redireciona para a tela de listagem
          window.location.href = 'curadoria.html'; 

        } else {

          // Exibe o botão de submit
          $('#btn-submit').show();         
          
        }

      });

    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'curadoria.html';
    }    
  } 
});

// TELA DE REPROVAÇÃO DO FILME DA CURADORIA
$(document).ready(function () {
  if (getPageName() === 'curadoria_reprovacao.html') {

    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {

      //Carregar as respostas()

      // Carrega o filme
      var filmeRevisao = getFilme(id);

      // ID do Filme
      $('#id_filme').val(filmeRevisao.idFilme);
      // Título do Filme
      $('#titulo-filme').text(filmeRevisao.descricaoFilme);

      // Botão de cancelar
      $('#btn-back').attr('href', 'filme_curadoria.html?id=' + filmeRevisao.idFilme);
      
      // Reprovar
      $("#form-reprovacao-curadoria").on('submit', function(e){

        // Cancela o envio do formulário
        e.preventDefault();
        // Oculta o botão de submit
        $('#btn-submit').hide();
                
        if (validaFormulario()) {
          
          var motivo = $('#motivo').val();
          var resposta = $('#resposta').val();

          // EnviarEmail();
          
          updateStatusFilme(filmeRevisao.idFilme, 'Reprovado');

          setMessageRetorno('Filme reprovado com sucesso');

          // Redireciona para a tela de listagem
          window.location.href = 'curadoria.html'; 

        } else {

          // Exibe o botão de submit
          $('#btn-submit').show();         
          
        }

      });

    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'curadoria.html';
    }    
  } 
});


// TELA DE LISTAGEM DA MONITORIA
$(document).ready(function () {
  if (getPageName() === 'monitoria.html') {

    // Gera os filmes
    if (!getFilmes()) {
      gerarListaFilmes(10);
    }
    
    // Lista os Filmes da Monitoria
    listarFilmesMonitoria('', '');

    // Atualiza as labels de filmes pendêntes da monitoria
    if (getNumPendentesMonitoria() > 0) {
      $('#count-pendentes-hd').text(getNumPendentesMonitoria());
    }
    
    // Filtrar Status 'Pendente'
    $('#btn-filtro-status-pendentes').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesMonitoria('Pendente', '');
    });
    // Filtrar Status 'Revisao'
    $('#btn-filtro-status-revisao').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesMonitoria('Revisao', '');
    });
    // Filtrar Status 'Aprovado'
    $('#btn-filtro-status-aprovados').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesMonitoria('Aprovado', '');
    });
    // Filtrar Status 'Reprovado'
    $('#btn-filtro-status-reprovados').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesMonitoria('Reprovado', '');
    });
    // Filtrar Status 'Favorito'
    $('#btn-filtro-status-favoritos').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesMonitoria('Favorito', '');
    });

    // Filtrar Cliente 'Chelsea'
    $('#btn-filtro-cliente-chelsea').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesMonitoria('', 'Chelsea');
    });
    // Filtrar Cliente 'Marvel'
    $('#btn-filtro-cliente-marvel').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      listarFilmesMonitoria('', 'Marvel');
    });
    
  } 
});

// TELA DO FILME DA MONITORIA
$(document).ready(function () {
  if (getPageName() === 'filme_monitoria.html') {

    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {

      // Carrega o filme
      var filmeMonitoria = getFilme(id);

      // ID do Filme
      $('#id_filme').val(filmeMonitoria.idFilme);
      // Título do Filme
      $('#titulo-filme').text(filmeMonitoria.descricaoFilme);
      // Usuário do Filme
      $('#nome-user').text(filmeMonitoria.usuarioFilme);
      // Tema do Filme
      $('#tema-filme').text(filmeMonitoria.temaFilme);
      // Data do Filme
      $('#data-filme').text(filmeMonitoria.dataCriacao);

      // Carrega comentários
      if (filmeMonitoria.statusFilme == 'Revisao' && filmeMonitoria.comentarios.length > 0) {

        // Load comentários
        var containerComents = document.querySelector('#load_comentarios');

        // Section
        var sectionComents = document.createElement('section');
        sectionComents.setAttribute('class', 'detalhes-revisao');

        // H2 (Título)
        var tituloComents = document.createElement('h2');
        tituloComents.innerHTML = 'Comentários';
        sectionComents.appendChild(tituloComents);

        // Comentários
        filmeMonitoria.comentarios.forEach(function(coment) {

          // Comentário
          var divComent = document.createElement('div');
          divComent.setAttribute('class', 'detalhe');

          // Mensagem
          var msgComent = document.createElement('p');
          msgComent.innerHTML = coment.comentario;
          divComent.appendChild(msgComent);

          // Colaborador e Data
          var nomeDataComent = document.createElement('span');
          nomeDataComent.innerHTML = coment.colaborador + ' em ' + coment.data;
          divComent.appendChild(nomeDataComent);

          sectionComents.appendChild(divComent);

        });

        containerComents.appendChild(sectionComents);
      }

      // Aprova Filme
      $('#btn-aprovar-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Atualiza o status do filme
        updateStatusFilme(idFilmeEdit, 'Aprovado');

        setMessageRetorno('Filme aprovado com sucesso');

        // Redireciona para a tela de listagem
        window.location.href = 'monitoria.html';
        
      });
      // Favoritar Filme
      $('#btn-favoritar-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Atualiza o status do filme
        updateStatusFilme(idFilmeEdit, 'Favorito');

        setMessageRetorno('Filme aprovado com sucesso');

        // Redireciona para a tela de listagem
        window.location.href = 'monitoria.html';
        
      });
      // Revisão
      $('#btn-revisao-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Redireciona para a tela de revisão
        window.location.href = 'monitoria_revisao.html?id=' + idFilmeEdit;
        
      });
      // Reprovação
      $('#btn-reprovar-filme').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var idFilmeEdit = $('#id_filme').val();

        // Redireciona para a tela de reprovação
        window.location.href = 'monitoria_reprovacao.html?id=' + idFilmeEdit;
        
      });

    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'monitoria.html';
    }    
  } 
});

// TELA DE REVISÃO DO FILME DA CURADORIA
$(document).ready(function () {
  if (getPageName() === 'monitoria_revisao.html') {

    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {

      // Carrega o filme
      var filmeRevisao = getFilme(id);

      // ID do Filme
      $('#id_filme').val(filmeRevisao.idFilme);
      // Título do Filme
      $('#titulo-filme').text(filmeRevisao.descricaoFilme);

      // Botão de cancelar
      $('#btn-back').attr('href', 'filme_monitoria.html?id=' + filmeRevisao.idFilme);
      
      // Marcar para revisão
      $("#form-revisao-monitoria").on('submit', function(e){

        // Cancela o envio do formulário
        e.preventDefault();
        // Oculta o botão de submit
        $('#btn-submit').hide();
                
        if (validaFormulario()) {
          
          var comentario = $('#comentario').val();
          addComentFilme(filmeRevisao.idFilme, comentario, 'Fulano'); // PENDENTE (NOME DO USER)
          updateStatusFilme(filmeRevisao.idFilme, 'Revisao');

          setMessageRetorno('Filme marcado para revisão');

          // Redireciona para a tela de listagem
          window.location.href = 'monitoria.html'; 

        } else {

          // Exibe o botão de submit
          $('#btn-submit').show();         
          
        }

      });

    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'monitoria.html';
    }    
  } 
});

// TELA DE REPROVAÇÃO DO FILME DA CURADORIA
$(document).ready(function () {
  if (getPageName() === 'monitoria_reprovacao.html') {

    // Verifica se tem o ID na URL 
    var id = getParam('id');
    if (id) {

      //Carregar as respostas()

      // Carrega o filme
      var filmeRevisao = getFilme(id);

      // ID do Filme
      $('#id_filme').val(filmeRevisao.idFilme);
      // Título do Filme
      $('#titulo-filme').text(filmeRevisao.descricaoFilme);

      // Botão de cancelar
      $('#btn-back').attr('href', 'filme_monitoria.html?id=' + filmeRevisao.idFilme);
      
      // Reprovar
      $("#form-reprovacao-monitoria").on('submit', function(e){

        // Cancela o envio do formulário
        e.preventDefault();
        // Oculta o botão de submit
        $('#btn-submit').hide();
                
        if (validaFormulario()) {
          
          var motivo = $('#motivo').val();
          var resposta = $('#resposta').val();

          // EnviarEmail();
          
          updateStatusFilme(filmeRevisao.idFilme, 'Reprovado');

          setMessageRetorno('Filme reprovado com sucesso');

          // Redireciona para a tela de listagem
          window.location.href = 'monitoria.html'; 

        } else {

          // Exibe o botão de submit
          $('#btn-submit').show();         
          
        }

      });

    } 
    // Redireciona para a tela de listagem
    else {
      window.location.href = 'monitoria.html';
    }    
  } 
});

/*=================================================
                  MINHA ESCALA
===================================================*/

// Nomes dos meses
var nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Nomes dos dias da semana
var nomeDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Salva o mês corrente
var setMes = function setMes(mes) {

  if (mes > 11) {
    window.localStorage.setItem('mes', 0);
    setAno(getAno() + 1);
  } else if (mes < 0) {
    window.localStorage.setItem('mes', 11);
    setAno(getAno() - 1);
  } else {
    window.localStorage.setItem('mes', mes);     
  } 

}

// Retorna o mês corrente
var getMes = function getMes() {
  var mes = window.localStorage.getItem('mes');
  return Number(mes);
}

// Altera o ano corrente
var setAno = function setAno (ano) {
  window.localStorage.setItem('ano', ano);
}

// Retorna o ano corrente
var getAno = function getAno() {
  var ano = window.localStorage.getItem('ano');
  return Number(ano);
}

// Ontem os dias do mês
var obterDiasDoMes = function obterDiasDoMes(mes, ano) {
  var data = new Date(ano, mes, 1);
  var dias = [];
  while (data.getMonth() === mes) {
    dias.push(new Date(data));
    data.setDate(data.getDate() + 1);
  }
  return dias;
}

// Preenche a primeira e a última semana do mês com os dias do mês anterior e posterior
var preecheSemanas = function preecheSemanas(dias) {

  // Array de dias
  var dias = dias;

  // Primeiro dia da semana
  var primeiroDia = dias[0];
  // Segundo dia da semana
  var ultimoDia = dias[dias.length-1];

  /** Número do dia da semana do primeiro e último dia
  Domingo: 0,
  Segunda: 1,
  Terça:   2,
  Quarta:  3,
  Quinta:  4,
  Sexta:   5,
  Sábado:  6 **/
  var primeiroDiaNumSemana = primeiroDia.getDay();
  var ultimoDiaNumSemana = ultimoDia.getDay();
  
  // Quantidade de dias do mês anterior a serem preenchidos na primeira semana
  var qtdeDiasMesAnterior = primeiroDiaNumSemana;

  // Dias mês anterior
  if (primeiroDia.getMonth() == 0) {
    var diasMesAnterior = obterDiasDoMes(11, (primeiroDia.getFullYear() - 1));
  } else {
    var diasMesAnterior = obterDiasDoMes((primeiroDia.getMonth() - 1), primeiroDia.getFullYear());
  }

  // Último dia do mês anterior
  var ultimoDiaMesAnterior = diasMesAnterior[diasMesAnterior.length-1];

  // Preeche a primeira semana
  if (primeiroDiaNumSemana != 0) {
    for(var i=0; i<qtdeDiasMesAnterior; i++) {
      var data_anterior = diasMesAnterior[diasMesAnterior.length - (i + 1)];
      dias.unshift(data_anterior);
    }
  }
  
  // Quantidade de dias do mês posterior a serem preenchidos na última semana
  var qtdeDiasMesPosterior = 7 - (ultimoDiaNumSemana + 1) ;

  // Dias mês postetior
  if (ultimoDia.getMonth() == 11) {
    var diasMesPostetior = obterDiasDoMes(0, (primeiroDia.getFullYear() + 1));
  } else {
    var diasMesPostetior = obterDiasDoMes((primeiroDia.getMonth() + 1), primeiroDia.getFullYear());
  }
  
  // Preeche a última semana
  if (ultimoDiaNumSemana != 6) {
    for(var i=0; i<qtdeDiasMesPosterior; i++) {
      var data_posterior = diasMesPostetior[i];
      dias.push(data_posterior);
    }
  }
  return dias;
}

// Divide o array de dias em partes (semanas)
var quebraArray = function quebraArray(array, numPartes) {

  // Matriz das partes do array
  var matriz = [];

  // Quantidade de arrays
  var qtdeArrays = array.length / numPartes;

  // Quantidade de itens já transferidos 
  var itensTransferidos = 0;

  // Partes já transferidas
  var partesTransferidas = numPartes;
 
  for(var i=0; i<qtdeArrays; i++) {

    // Parte do array
    var array_parte = [];

    // Adiciona os itens em cada parte do array
    for(var x=itensTransferidos; x<partesTransferidas; x++) {
      if(!array[x]){
        continue;
      }
      array_parte.push(array[x]);
    }

    // Atualiza a quantidade de itens já transferidos
    itensTransferidos += numPartes;
    // Atualiza a quantidade de partes já transferidos
    partesTransferidas += numPartes;

    // Adiciona a parte do array na matriz
    matriz.push(array_parte);

  }

  return matriz;
}

// Popula o calendário
var populaCalendario = function populaCalendario(mes, ano) {
  
  $.ajax({

    url: 'http://localhost/Prj_StayFilm/listarEscalaMontada/'+getUserId()+'?mes='+(mes+1)+'&ano='+ano,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',

    headers: {'Authorization': getToken()} 

  }).done(function(escalas) {   
    
    // Limpa o calendário
    limparCalendario();

    // Mês completo
    var mesCompleto = quebraArray(preecheSemanas(obterDiasDoMes(mes,ano)),7);

    // Título do Calendário
    var calendarioTitulo = document.querySelector('#calendar-title');
    calendarioTitulo.innerHTML = nomeMeses[mes] + ' ' + ano;

    // Caléndario
    var calendarioDOM = document.querySelector('#calendar-load');

    // Percorre o array populando as semanas e dias
    mesCompleto.forEach(function(semana){

      // Semana
      var semanaDOM =  document.createElement('ul');
      semanaDOM.setAttribute('class','days');

      semana.forEach(function(dia){

        // Dia
        var diaDOM =  document.createElement('li');
        
        // Data
        var dataDOM =  document.createElement('div');
        dataDOM.setAttribute('class','date');
        dataDOM.innerHTML = dia.getDate();

        // Adiciona a data no dia
        diaDOM.appendChild(dataDOM);

        // Nome do dia da semana
        var dataDescDOM = document.createElement('label');
        dataDescDOM.setAttribute('class','desc-day');
        dataDescDOM.innerHTML = nomeDias[dia.getDay()];       
        diaDOM.appendChild(dataDescDOM);
        
        // Verifica se o dia é do mês atual
        if (dia.getMonth() === mes) {
        
          // Percorre a escala
          escalas.forEach(function(escala, index) {
            // Verifica se o dia atual é igual oo dia do calendário
            if (escala.dia == dia.getDate()) {
              // Verifica se há horários indisponíveis
              if (escala.bloqueado.length > 0) {

                escala.bloqueado.forEach(function(horario) {
                  var horarioDOM = document.createElement('div');
                  horarioDOM.setAttribute('class','horario-block');           
                  horarioDOM.innerHTML = horario;
                  diaDOM.appendChild(horarioDOM);
                });

              }
              // Verifica se há horários indisponíveis
              if (escala.escalados.length > 0) {

                escala.bloqueado.forEach(function(horario) {
                  var horarioDOM = document.createElement('div');
                  horarioDOM.setAttribute('class','horario-escal');           
                  horarioDOM.innerHTML = horario;
                  diaDOM.appendChild(horarioDOM);
                });
                
              }
            }
          });

          diaDOM.setAttribute('class','day');
          var dataAttr = dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getDate();
          diaDOM.setAttribute('data-data', dataAttr);

        } else {
          diaDOM.setAttribute('class','day other-month');
        }       

        // Adiciona o dia na semana   
        semanaDOM.appendChild(diaDOM);      

      });

      // Adiciona a semana no calendario
      calendarioDOM.appendChild(semanaDOM);

    });
    
  }).fail(function(response) {   

    // Exibe os detalhes no console
    console.log(response);

    // Mensagem snackbar   
    snackMessage('#snackbar', 'Não foi possível realizar essa operação', 3000);
        
  });

}

// Limpa o calendário
var limparCalendario = function limparCalendario() {

  // Caléndario
  var calendarioDOM = document.querySelector('#calendar-load');

  // Limpa o calendário
  calendarioDOM.innerHTML = '';

}

// Soma +1 ao dia da data
var soma1Data = function soma1Data(data) {
  var dataSplit = data.split('-');
  return dataSplit[0] + '-' + dataSplit[1] + '-' + (Number(dataSplit[2])+1);
}

// Adiciona um evento
var AddHorario = function AddHorario(data, horaInicio, horaFim) {

  // Adiciona os dados em um objeto
  var dados = {
    data: soma1Data(data),
    horaInicio: horaInicio,
    horaFim: horaFim
  }

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/escalabloqueioEspecifico/' + getUserId(),
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados),
    headers: {'Authorization': getToken()} 

  }).done(function(response) {      

    console.log('escala inserida com sucesso');

  }).fail(function(response) {    

    console.log('erro ao inserir escala');

  });

  window.location.reload();
  
}

//Retorna o objeto Date
var strToDate = function strToDate(string) {

  var dataSplit = string.split('/');

  var diaSplit = dataSplit[0];
  var mesSplit = dataSplit[1];  
  mesSplit--;
  var anoSplit = dataSplit[2];

  var dataObj = new Date(anoSplit, mesSplit, diaSplit);

  return dataObj;
}

// Retorna a data por extenso
var dataExtenso = function dataExtenso(data) {
  var dataObj = strToDate(data);
  return nomeDias[dataObj.getDay()] + ', ' + dataObj.getDate() + ' de ' + nomeMeses[dataObj.getMonth()] + ' de ' + dataObj.getFullYear();
}

// Carrega os dados da minha escala
$(document).ready(function () {
  
  if (getPageName() === 'minha_escala.html') {

    // Data atual
    var dataAtual = new Date();
    setMes(dataAtual.getMonth());
    setAno(dataAtual.getFullYear());
     
    // Popula o calendário
    populaCalendario(getMes(), getAno());

    // Botão (Mês anterior)
    var btnAnt = document.querySelector('#btn-ant');
    // Evento click (Mês anterior)
    btnAnt.addEventListener('click', function(){    
      setMes(getMes()-1);
      populaCalendario(getMes(), getAno());
    });
    // Botão (Mês posterior)
    var btnProx = document.querySelector('#btn-prox');
    // Evento click (Mês posterior)
    btnProx.addEventListener('click', function(){
      setMes(getMes()+1);
      populaCalendario(getMes(), getAno());
    });

    // Caléndario
    var calendarioDOM = document.querySelector('#calendar-load');

    // Foca no Caléndario
    var calendarioFocus = function calendarioFocus() {
      calendarioDOM.scrollIntoView();
    }

    calendarioDOM.addEventListener('click', function(clickDay){

      // Alvo do click
      var alvoClick = clickDay.target;

      // Verifica se foi clicado na 'LI'
      if (alvoClick.nodeName === 'LI' || alvoClick.nodeName === 'DIV') {

        var dataClicadaDOM;

        if (alvoClick.nodeName === 'LI') {
          //dataClicadaDOM = clickDay.target.dataset.data;
          dataClicadaDOM = clickDay.target;
        } else if (alvoClick.nodeName === 'DIV') {
          //dataClicadaDOM = clickDay.target.parentElement.dataset.data;
          dataClicadaDOM = clickDay.target.parentElement;
        }
        
        if (dataClicadaDOM.className === 'day') {

          var dataClicada = dataClicadaDOM.dataset.data;

          fechaCaixa();

          horarioDescDOM.innerHTML = dataExtenso(formatDataBR(dataClicada));
          InputHorarioData.value = dataClicada;
          abreCaixa();

        }   
      
      } else {
        clickDay.stopPropagation();
        clickDay.preventDefault();
      }

    });

    // Caixa para adicionar um novo horário
    var caixaDOM = document.querySelector('.card-horario');
    // Fechar caixa
    var fechaCaixa = function fechaCaixa() {
      caixaDOM.style.display = 'none';
      calendarioFocus();
    }
    // Abre caixa
    var abreCaixa = function abreCaixa() {
      caixaDOM.style.display = '-webkit-flex';  
      caixaDOM.style.display = '-ms-flexbox';
      caixaDOM.style.display = 'flex';
      caixaFocus();
    }
    // Foca na caixa
    var caixaFocus = function caixaFocus() {
      caixaDOM.scrollIntoView();
    }
    // Botão para fechar caixa
    var btnClose = document.querySelector('#box-close');
    btnClose.addEventListener('click', function(){
      fechaCaixa();
    });

    $("#horario").mask("99h às 99h");
    $('.mdl-textfield__input').on('change', function() {
      if ($(this).val()) {
        $(this).parent().addClass('is-dirty');
      }
    });

    // Data label
    var horarioDescDOM = document.querySelector('#horario-desc');
    // Campo Data
    var InputHorarioData = document.querySelector('#horario-data');
    // Campo Horário
    var InputHorario = document.querySelector('#horario');  
  
    // Botão adicionar horário
    var btnAdd = document.querySelector('#btn-add');

    // Evento adiciona um horário
    btnAdd.addEventListener('click', function(){

      horarios = InputHorario.value.replace(/h|\s*/ig,'').split('às');
       
      var hData = InputHorarioData.value;
      var hInicio = horarios[0].replace(/^0+/,'');
      var hFinal = horarios[1].replace(/^0+/,'');

      AddHorario(hData, hInicio, hFinal);
      fechaCaixa();
    });

  } 
});

  