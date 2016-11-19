/*===================================================
            VALIDAÇÃO DO FORMULÁRIO
===================================================*/

var validaFormulario =  function validaFormulario(callbackForm) {

  var cout_campos_invalidos = 0;

  /*$(".required").blur(function(){

    if(!this.value){
      $(this).parent().addClass('is-invalid');
    }

  });*/

  $(".required").each(function() { 

    if(this.value){
      $(this).parent().removeClass('is-invalid');
    }else{      
      $(this).parent().addClass('is-invalid');
      cout_campos_invalidos++;
    }

  });

  if (cout_campos_invalidos === 0) {   
    callbackForm();
  }

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

var login = function login(usuario, senha) {

  var dados_login = {
    login: $('#login').val(),
    senha: $('#senha').val()
  }

  var data = {
    message: 'Usuário ou senha incorretos'
  };

  var snackbarContainer = document.querySelector('#demo-toast-example');
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
.

  /*$.ajax({

    url: 'http://localhost/Prj_StayFilm/login',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    async: true,    
    data: JSON.stringify(dados_login)
      
  }).done(function(response) {    
      console.log(response);
  }).fail(function(response) {
      console.log(response);
  });*/

}

$("#form").on('submit', function(e){

  e.preventDefault();
  validaFormulario(login);  

});


