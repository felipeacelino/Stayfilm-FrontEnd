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
  localStorage.setItem('token', token);

}

// Retorna o TOKEN
var getToken = function getToken() {

  return localStorage.getItem('token');

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

// Limpar o TOKEN
var clearToken = function clearToken() {

  localStorage.removeItem('token');
  localStorage.clear();

}

/*===================================================
                      LOGIN
===================================================*/

var efetuarLogin = function efetuarLogin(login, senha) {

  // Adiciona os dados de login em um objeto
  var dados_login = {
    login: login,
    senha: senha
  }  
  
  $.ajax({

    url: 'http://localhost/Prj_StayFilm/login',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify(dados_login) 

  }).done(function(response) {    
    
    setToken(response.token);
    location.href = 'curadoria.html';

  }).fail(function(reponse) {    
    if (reponse.readyState == 4) {
      // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
    }
    else if (reponse.readyState == 0) {
      // Network error (i.e. connection refused, access denied due to CORS, etc.)   

      // Mensagem snackbar   
      snackMessage('#snackbar', 'Problema na comunicação com o servidor', 3000);
      // Ativa o botão de submit
      ativaBotao('#btn-entrar');
      // Oculta o ícone de loading
      LoadingProgress.hide();
    }
    else {
      // something weird is happening
    }
  });

}

$("#form").on('submit', function(e){

  // Cancela o envio do formulário
  e.preventDefault();
  // Desativa o botão de submit
  desativaBotao('#btn-entrar');
  // Exibe o ícone de loading
  LoadingProgress.show();
  
  if (validaFormulario()) {
    
    //Pega os valores do campo
    var login = $('#login').val();
    var senha = $('#senha').val();

    // Executa a função de login
    efetuarLogin(login, senha);    

  } else {

    // Ativa o botão de submit
    ativaBotao('#btn-entrar');
    // Oculta o ícone de loading
    LoadingProgress.hide();

  }

});


