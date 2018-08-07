const express = require('express');
var app = express();
const path = require('path');
var http = require('http').Server(app);
const PORT = process.env.PORT || 3000;
var io = require('socket.io')(http);

//Iniciar servidor web
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index');
});

http.listen(PORT, () => console.log(`Listening on ${ PORT }`));

var userlist = [];

//Codigo CHAT
io.on('connection', function(socket){
  //Evento ao um usuário entrar
  socket.on('new user', function(user){
    io.emit('chat message', user + ' entrou na sala');
    socket.username = user;
    userlist.push(user);
    io.emit('room users', userlist);
  });

  //Atualizar lista de usuários
  socket.on('room users', function(userlist){
    io.emit('room users', userlist);
  });

  //Evento ao receber mensagem
  socket.on('chat message', function(user, msg){
    //Checa se a mensagem está vazia
    if (msg.trim() != ""){
      msg = msg.slice(0, 254)
      if(user != ""){
        io.emit('chat message', [user, ":" , msg].join(' '));
      } else {
        io.emit('chat message', msg);
      }
    }
  });

  //Evento ao desconectar da sala
  socket.on('disconnect', function(){
    io.emit('chat message', socket.username + ' saiu da sala');
    var pos = userlist.indexOf(socket.username);
    userlist.splice(pos, 1);
    usrlist = userlist.join('<br>')
    io.emit('room users', usrlist);
  });
});
