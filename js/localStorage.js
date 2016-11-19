(function(){

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

}());