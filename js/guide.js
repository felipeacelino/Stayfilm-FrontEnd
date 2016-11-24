

URI

http://localhost/Prj_StayFilm/colaborador  --POST

USA TOKEN(SIM /NAO): SIM.

BODY

{
	"nome": "stayfilm",
	"dataNasc":"2016-10-11",
	"status":true,
	"telefoneResidencial":"2000-2222",
	"telefoneCelular":"98888-9999",
	"email":"teste@teste.com",
	"senha":"123456",
	"permissao":1
}

RESPOSTA do POST

{
  "nome": "stayfilm",
  "dataNasc": "2016-10-11",
  "status": true,
  "telefoneResidencial": "2000-2222",
  "telefoneCelular": "98888-9999",
  "email": "teste@teste.com",
  "senha": "e10adc3949ba59abbe56e057f20f883e",
  "permissao": "ADMINISTRADOR"
}



 URI

http://localhost/Prj_StayFilm/private/colaborador/busca/1  --GET 

USA TOKEN(SIM /NAO): SIM. ( Authorization = logar para pegar o token )

RESPOTA DO GET 

{
  "idColaborador": 1,
  "nome": "stayfilm",
  "dataNasc": "11-10-2016",
  "status": true,
  "telefoneResidencial": "2000-2222",
  "telefoneCelular": "98888-9999",
  "email": "teste@teste.com",
  "senha": "e10adc3949ba59abbe56e057f20f883e",
  "permissao": "ADMINISTRADOR"
}



URI

http://localhost/Prj_StayFilm/login    --POST

BODY
{
	"email":"teste@teste.com",
	"senha":"123456"
}

RESPOTA DO POST

{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vd3d3LnNwLnNlbmFpLmJyIiwiaWRfY29sYWJvcmFkb3IiOjEsImV4cCI6MTQ3OTk4ODUzMywicGVybWlzc2FvIjoiQURNSU5JU1RSQURPUiIsImlhdCI6MTQ3OTk1MjEzMywiZW1haWwiOiJ0ZXN0ZUB0ZXN0ZS5jb20ifQ.Yz7Sv2Tsnam7LVUxKLIoRDArS-CWJxZFs6_YJTHX4no"
}


URI 

http://localhost/Prj_StayFilm/escalabloqueiofixo -- POST


BODY
{
	"horaInicio":18,
	"horaFim":21,
	"diaSemana":"DOMINGO"
}

RESPOTA DO POST

{
  "dia": "Domingo",
  "horario": "18 - 21h"
}