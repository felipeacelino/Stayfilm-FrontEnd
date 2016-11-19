(function() {

	
	/*$.ajax({

		type: 'GET',
		url: 'https://jsonplaceholder.typicode.com/comments',
		async: false,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(data)
		{
			//$('#jsonp-results').html(JSON.stringify(data));
			console.log(data);
		},
		error: function(e)
		{
		   alert(e.message);
		}
	});	*/

	var login =  function login() {

		$.ajax({
			url: 'http://localhost/Prj_StayFilm/login',
			type: 'POST',
			async: true,
			crossDomain: true,

		  	data: {
		  		usuario: 'usuario',
		  		senha: '123456'
		  	}

		  	headers: {
		  		'content-type': 'application/json;charset=utf-8',
		  		'cache-control': 'no-cache'
		  	}
			
		}).then(function(data) {
		  console.log(data);
		});

	}

}());
