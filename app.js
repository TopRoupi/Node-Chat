const express = require('express');
var app = express();
const path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Iniciar servidor web
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index');
});

http.listen(3000, function(){
  console.log('listening on :3000');
});

var users = [];

//Codigo CHAT
io.on('connection', function(socket){

  //Enviar alert no chat quando alguém entra e sai
  io.emit('chat message', 'usuário entrou na sala');
  socket.on('disconnect', function(){
    io.emit('chat message', 'usuário saiu da sala');
  });

  //Evento ao receber mensagem
  socket.on('chat message', function(msg){
    //Enviar mensagem
    io.emit('chat message', msg);
  });

  //Evento ao um usuário entrar
  socket.on('new user', function(user){
    users.push(user);
    userlist = users.join('<br>');
    io.emit('room users', userlist);
  });

  //Atualizar lista de usuários
  socket.on('room users', function(userlist){
    io.emit('room users', userlist);
  });
});
