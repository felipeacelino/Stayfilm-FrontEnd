var getPageName = function getPageName() {
  var url = document.location.href;
  url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
  url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
  url = url.substring(url.lastIndexOf("/") + 1, url.length);

  return url;
}

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

var snackMessage = function snackMessage(obj, mensagem, tempo) {
  // Configurações
  var snackSettings = {
    message: mensagem,  // Mensagem
    timeout: tempo      // Tempo de exibição
  };

  var snackbarContainer = document.querySelector(obj);
  snackbarContainer.MaterialSnackbar.showSnackbar(snackSettings);
}

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
