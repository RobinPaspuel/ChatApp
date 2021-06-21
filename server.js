const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);



//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const BotName = 'Chat App Bot';

//Run on connection
io.on('connection', socket =>{
    //temp -> connection established
    //console.log('New WS Connection...');

    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //welcome current user
        socket.emit('message', formatMessage(BotName,`Welcome to Chat App ${user.username}!`));

        //BroadCast When a user connections
        socket.broadcast.to(user.room).emit('message', formatMessage(BotName,`${user.username} has joined the chat`));

        //Users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //listen for chat messages
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when user diisconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        if (user){
            io.to(user.room).emit('message', formatMessage(BotName,`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`));