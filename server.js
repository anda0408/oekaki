const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const users = {};
var no=0;
var color;
var widt;
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Run when client connects
io.on('connection', socket => {
   console.log('connected');
   socket.on('send-stroke',({x1,y1,x2,y2})=>{
      socket.broadcast.emit('stroke',{x1,y1,x2,y2,widt,color});
   })
   socket.on('message',function(msg){
      io.emit('message', msg);
  });
   socket.on('send-width',wid=>{
      widt=wid;
   })
   socket.on('send-color',col=>{
      color=col;
   })
   socket.on('send-eraser',({x1,y1,x2,y2,num})=>{
      socket.broadcast.emit('eraser',{x1,y1,x2,y2,num});
     })
   socket.on('clear-click',(data)=>{
      socket.broadcast.emit('clear-pls',data);
   })
})
const PORT = process.env.PORT || 7000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));