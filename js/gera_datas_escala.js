(function(){

	// Nomes dias semana
	var diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

	// Obtem os dias do mês
	function getDaysInMonth(month, year) {	    
	     var date = new Date(year, month, 1);
	     var days = [];
	     while (date.getMonth() === month) {
	        days.push(new Date(date));
	        date.setDate(date.getDate() + 1);
	     }
	     return days;
    }

    // Data atual
	var dataAtual = new Date();
	var mesAtual = dataAtual.getMonth(); 
	var anoAtual = dataAtual.getFullYear(); 

	// Dias do mês atual
    var days = getDaysInMonth(mesAtual, anoAtual);

    // Objeto lista
    var listDays = document.querySelector('.days');

	// Popula a lista   
    days.forEach(function(i){

    	// Formata a data DD/MM/AAAAA
    	var data = i.getDate() + '/' + i.getMonth() + '/' + i.getFullYear();
    	// Obtém o dia da semana
    	var nomeSemana = diasSemana[i.getDay()];

    	// Item (dia) da lista
    	var liDay = document.createElement('li');
    	liDay.setAttribute('class','day');

    	// Label da data
    	var lblDate = document.createElement('label');
        // Atribui formatação diferente caso seja Sábado ou Domingo
    	i.getDay() === 0 || i.getDay() === 6 ? lblDate.setAttribute('class','date fds') : lblDate.setAttribute('class','date');
    	lblDate.innerHTML = data;

    	// Label do dia da semana
    	var lblNomeSemana = document.createElement('label');
    	lblNomeSemana.setAttribute('class','desc-date');
    	lblNomeSemana.innerHTML = nomeSemana;

    	// Campo checkbox
    	var lblInput = document.createElement('label');
    	lblInput.setAttribute('class','mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect'); 
    	lblInput.setAttribute('for', data);
    	var input = document.createElement('input');
    	input.setAttribute('type','checkbox');
    	input.setAttribute('id', data);
    	input.setAttribute('class','mdl-icon-toggle__input'); 
    	var iconInput = document.createElement('i');
    	iconInput.setAttribute('class','mdl-icon-toggle__label material-icons');
    	iconInput.innerHTML = 'done';  	

    	// Adicina os itens na página
    	liDay.appendChild(lblDate);
    	liDay.appendChild(lblNomeSemana);
    	lblInput.appendChild(input);
    	lblInput.appendChild(iconInput);	
    	liDay.appendChild(lblInput);
    	listDays.appendChild(liDay);

    });

}());