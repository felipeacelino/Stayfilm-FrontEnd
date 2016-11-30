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
  'curadoria.html',
  'monitoria.html'
  ];

  // Páginas que os usuários COMUNS tem acesso
  var pags_user = [
  'curadoria.html',
  'monitoria.html'
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

    url: 'http://localhost/Prj_StayFilm/resposta',
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

    url: 'http://localhost/Prj_StayFilm/resposta/' + idResposta,
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

    url: 'http://localhost/Prj_StayFilm/resposta/editar/' + idResposta,
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
        
        // TD vazio
        var td1DOM = document.createElement('td');         
        trDOM.appendChild(td1DOM);

        // Nome
        var td2DOM = document.createElement('td');
        td2DOM.innerHTML = item[1];       
        trDOM.appendChild(td2DOM);

        // E-mail
        var td3DOM = document.createElement('td');
        td3DOM.innerHTML = item[2];        
        trDOM.appendChild(td3DOM);

        // E-mail
        var td4DOM = document.createElement('td');
        td4DOM.innerHTML = item[3];        
        trDOM.appendChild(td4DOM);

        // Opções
        var td5DOM = document.createElement('td');

        // Botão de opção (Arrow)
        var btnOptDOM = document.createElement('button');
        btnOptDOM.setAttribute('class', 'btn-menu mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon');
        btnOptDOM.setAttribute('id', 'item_' + item[0]);

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
        ulOptsDOM.setAttribute('for', 'item_' + item[0]);

        // Item da opção (Edit)
        var aOptEditDOM = document.createElement('a');
        aOptEditDOM.setAttribute('class', 'link_item');
        aOptEditDOM.setAttribute('href', 'editar_colaborador.html?id=' + item[0]); 

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
        aOptAtivDOM.setAttribute('href', 'atividades.html?id=' + item[0]); 

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
        aOptEndDOM.setAttribute('href', 'endereco_colaborador.html?id=' + item[0]); 

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
var updateColaborador = function updateColaborador(idColaborador, nome, nascimento, telefone, celular, email, permissao, status) {

  // Adiciona os dados em um objeto
  var dados = {
    idColaborador: idColaborador,
    nome: nome,
    dataNasc: nascimento,
    status: status,
    telefoneResidencial: telefone,
    telefoneCelular: celular,
    email: email,
    senha: '123',
    permissao: permissao
  }  

  $.ajax({

    url: 'http://localhost/Prj_StayFilm/colaborador/editar/' + idColaborador,
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

    // Passa os valores para os campos
    $('#id_edit').val(response.idColaborador);
    $('#nome').val(response.nome).parent().addClass('is-dirty');
    $('#nascimento').val(response.dataNasc.replace(/-/g, '/')).parent().addClass('is-dirty');
    $('#telefone').val(response.telefoneResidencial).parent().addClass('is-dirty');
    $('#celular').val(response.telefoneCelular).parent().addClass('is-dirty');
    $('#email').val(response.email).parent().addClass('is-dirty');    
    response.permissao === 'ADMINISTRADOR' ? $('#permissao').val('Administrador').parent().addClass('is-dirty') : $('#permissao').val('Usuário Comum').parent().addClass('is-dirty');
    !!response.status ? $('#status').val('Ativo').parent().addClass('is-dirty') : $('#status').val('Inativo').parent().addClass('is-dirty');
    
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
    var permissao = $('#permissao').val() === 'Administrador' ? 1 : 0;
    var status = $('#status').val() === 'Ativo' ? true : false;
  
    // Executa a função de update
    updateColaborador(idColaborador, nome, nascimento, telefone, celular, email, permissao, status);  

  } else {

    // Exibe o botão de submit
    $('#btn-submit').show();
    /// Oculta o ícone de loading
    LoadingProgress.hide();
    
  }

});