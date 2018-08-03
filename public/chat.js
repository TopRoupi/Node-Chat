myuser = '';
var socket = io();

//Ao entrar na sala
socket.on('connect', function () {
  var name = prompt('Insira seu um nome', 'User');
  if (name != null && name != "") {
    socket.emit('new user', name);
  } else {
    socket.emit('new user', 'User');
  }
  myuser = name;
});

$(function () {
  //Enviar mensagem
  $('form').submit(function(){
    //Checar se o campo está vazio
    if ( $("input:first").val() != ""){
      socket.emit('chat message', myuser + ': ' + $('#m').val());
      $('#m').val('');
    }
    return false;
  });
});

//Receber mensagem
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
  //Mover "view" para a nova mensagem
  var objDiv = document.getElementById("chat");
  objDiv.scrollTop = objDiv.scrollHeight;
});

//Atualizar lista de usuarios
socket.on('room users', function(userlist){
  document.getElementById("sala").innerHTML = userlist;
});
