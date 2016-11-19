(function(){

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
					
					var dataAttr = dia.getDate() + '/' + (dia.getMonth() + 1) + '/' + dia.getFullYear();
					/*var horariosData = filtraHorarios(dataAttr);

					horariosData.forEach(function(item) {

						var horarioDOM = document.createElement('div');
						horarioDOM.setAttribute('class','horario');						
						horarioDOM.innerHTML = item.horaInicio  + ' - ' + item.horaFim;
						diaDOM.appendChild(horarioDOM);

					});*/

					diaDOM.setAttribute('class','day');
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

	}

	// Limpa o calendário
	var limparCalendario = function limparCalendario() {

		// Caléndario
		var calendarioDOM = document.querySelector('#calendar-load');

		// Limpa o calendário
		calendarioDOM.innerHTML = '';

	}
	 
	// Altera o mês atual
	var setMes = function setMes (mes) {
		if (mes > 11) {
			mesAtual = 0;
			anoAtual = anoAtual + 1;
		} else if (mes < 0) {
			mesAtual = 11;
			anoAtual = anoAtual - 1;
		} else {
			mesAtual = mes;			
		}		
	}

	// Data atual
	var dataAtual = new Date();
	var mesAtual = dataAtual.getMonth();
	var anoAtual = dataAtual.getFullYear();

	// Nomes dos meses
	var nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

	// Nomes dos dias da semana
	var nomeDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

	// Popula o calendário
	populaCalendario(mesAtual, anoAtual);

	// Botão (Mês anterior)
	var btnAnt = document.querySelector('#btn-ant');
	// Evento click (Mês anterior)
	btnAnt.addEventListener('click', function(){		
		setMes(mesAtual-1);
		populaCalendario(mesAtual, anoAtual);
	});

	// Botão (Mês posterior)
	var btnProx = document.querySelector('#btn-prox');
	// Evento click (Mês posterior)
	btnProx.addEventListener('click', function(){
		setMes(mesAtual+1);
		populaCalendario(mesAtual, anoAtual);
	});
	
}());


