jQuery(function($) {

  // PAGINAÇÃO
  function paginationInit(){

    // Intens que serão paginados
    var pageParts = $(".paginate");

    // Total de itens
    var numPages = pageParts.length;

    // Total de itens por página
    var perPage = parseInt($('#qtde_pagina').val());

    var start = 0;
    var end = perPage;

    pageParts.hide().slice(start, end).show();

    $('#start').html(start+1);
    end_lbl = end <= numPages ? end : numPages;
    $('#end').html(end_lbl);
    $('#total').html(numPages);

    $("#page-nav").pagination({
      items: numPages,
      itemsOnPage: perPage,
      cssStyle: "material-pagination",
      displayedPages: 0,
      edges: 0,
      ellipsePageSet: false,
      prevText: '<i class="material-icons">chevron_left</i>',
      nextText: '<i class="material-icons">chevron_right</i>',
      onPageClick: function(pageNum) {
        var start = perPage * (pageNum - 1);
        var end = start + perPage;
        pageParts.hide().slice(start, end).show();
        $('#start').html(start+1);
        end_lbl = end <= numPages ? end : numPages;
        $('#end').html(end_lbl);
      }
    });
  }

  paginationInit();

  $('#qtde_pagina').change(function(){
    paginationInit();
  });
    
  });
