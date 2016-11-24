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
  $('#user-name-sidebar').text(getUserEmail());
  // ATENÇÃO: Por enquanto exibindo o e-mail enquanto a API não retorna o nome...

  // Oculta os itens da barra de navegação lateral se o usuário não for ADMINISTRADOR
  if (getUserTipo() !== 'ADMINISTRADOR') {
    //$('.restrito-admin').attr('style','display: none !important');
    $('.restrito-admin').remove();
  } 

}

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

  }
  
}

// Executa ao carregar a página
verificaLogin();

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

  }).fail(function(reponse) {    

    // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
    if (reponse.readyState == 4) {      
      if (reponse.status == 401) {

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
    else if (reponse.readyState == 0) {      

      // Mensagem snackbar   
      snackMessage('#snackbar', 'Problema na comunicação com o servidor', 3000);
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

// Variável para impedir que uma requisição seja realizada ao mesmo tempo
var processando = false;

$("#form").on('submit', function(e){

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


