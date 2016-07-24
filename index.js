var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var ChatPerson = require('./chatClasses');
var checkFunctions = require('./checkFunctions');
var associative_array_chatPerson = {};
var logChat = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected and his id is ' + socket.id);

    //io.emit('chat message', "Please write your name first")

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('name chat', function (name) {

        console.log("Worked man! " + name);
        console.log("ID is " + socket.id);
        associative_array_chatPerson[socket.id] = new ChatPerson(socket.id, name, socket);
        console.log(associative_array_chatPerson[socket.id].getAllInfo());
        console.log(logChat);
        io.to(socket.id).emit("chat retrieval", logChat);
    });

    socket.on('chat message', function (msg) {
        /*if(name === false){
         name = msg
         }else{*/
        var socketPerson = associative_array_chatPerson[socket.id];
        var id_name;
        if (msg[0] == "/") {
            socketPerson.pushLastCommands(msg);
            socket.emit("last commands", socketPerson.lastCommands);
            msg = msg.split("/")[1];
            if (msg[0] == "t" && msg[1] == "o") {
                var new_message = "";
                for (var i = 2; i < msg.length; i++) {
                    new_message += msg[i];
                }
                msg = new_message;
                console.log(msg);
                var splitString = /(\w+)\s(\w+)\s(\w+)/;
                var resultSplitString = msg.match(splitString);
                if (resultSplitString) {
                    id_name = resultSplitString[1];
                    msg = resultSplitString[2] + " " + resultSplitString[3];
                    msg = checkFunctions.rollThemAll(msg);
                } else {
                    msg = checkFunctions.wrongCommand(msg);
                }

            } else {
                msg = checkFunctions.rollThemAll(msg);
            }
        }
        checkFunctions.sendMessage(msg, associative_array_chatPerson[socket.id], id_name, io,
            associative_array_chatPerson, logChat);
        //}
    });

    socket.on('chat image', function (imageMessage) {
        console.log('Entered server-side function chat image from socket on; ie received imageMessage from client');
        console.log(imageMessage);
        io.emit('chat image', {image: true, buffer: imageMessage.toString('base64')});
    });

    socket.on('send drawing', function(drawObject){
        console.log('sending info new drawing');
        socket.broadcast.emit('receive drawing', drawObject);
    });

});

server.listen(28015, function () {
    console.log('listening on *:80');
});
