const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Run on connection
io.on('connection', socket =>{
    console.log('New WS Connection...');
    socket.emit('message', 'Welcome!');

    //BroadCast When a user connections
    socket.broadcast.emit('message', 'A user has joined the chat');

    //Runs when user diisconnects
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat');
    });

    //listen for chat messages
    socket.on('chatMessage', msg =>{
        io.emit('message', msg);
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`));