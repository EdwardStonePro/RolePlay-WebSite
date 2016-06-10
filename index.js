var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var associativearray_ID_Name = {};


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    var ioname = "";
    console.log('a user connected and his id is ' + socket.id);

    //io.emit('chat message', "Please write your name first")

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('name chat', function (name) {
        console.log("Worked man! " + name);
        associativearray_ID_Name[name] = socket.id;
        console.log(associativearray_ID_Name);
        ioname = name;
    });
    socket.on('chat message', function (msg) {
        /*if(name === false){
         name = msg
         }else{*/
        var idname;
        if (msg[0] == "/") {
            msg = msg.split("/")[1];
            console.log(msg);
            if (msg[0] == "t" && msg[1] == "o") {
                console.log("detected to");
                var newmessage = "";
                for (var i = 2; i < msg.length; i++) {
                    newmessage += msg[i];
                    console.log(newmessage);
                }
                msg = newmessage;
                console.log(msg);
                var splitString = /(\w+)\s(\w+)\s(\w+)/;
                var resultSplitString = msg.match(splitString);
                console.log(resultSplitString);
                idname = resultSplitString[1];
                msg = resultSplitString[2] + " " + resultSplitString[3];
                console.log(idname + "+" + msg);
                msg = rollThemAll(msg);

            } else {
                msg = rollThemAll(msg);
            }
        }
        sendMessage(msg, ioname, idname, io, socket);
        //}
    });


});

http.listen(28015, function () {
    console.log('listening on *:28015');
});

function rollThemAll(msg) {
    console.log(msg);
    var testString = /(\w+)\s(\d+)(d)(\d+)/;
    var result = msg.match(testString);

    if (result) {
        var numberOfRolls;
        var rollNumber;
        numberOfRolls = result[2];
        rollNumber = result[4];
        msg = "You rolled";
        console.log(result[0]);

        if (result[3] == "d" && result[1] == "roll") {
            for (var rolls = 0; rolls < (+numberOfRolls); rolls++) {
                msg += ", " + (Math.floor(Math.random() * (rollNumber - 1 + 1)) + 1);
            }
            msg += " (" + result[4] + ")";
        } else if (result[1] == "roll2p60") {
            for (var rolls = 0; rolls < (+numberOfRolls); rolls++) {
                msg += ", " + (Math.floor(Math.random() * (60 - 1 + 1)) + 1);
            }
            msg += " (" + result[4] + ")";
        } else if (result[1] == "roll2p15") {
            for (var rolls = 0; rolls < (+numberOfRolls); rolls++) {
                msg += ", " + (Math.floor(Math.random() * (15 - 1 + 1)) + 1);
            }
            msg += " (" + result[4] + ")";
        } else {
            msg = wrongCommand(msg);
        }
        console.log(msg);
    } else if (msg == "roll opfabed") {
        msg = "You rolled, 1 (100)";
    }
    else {
        console.log("Didn't find roll");
        msg = "What the fuck happened?";
    }
    return msg;
}

function wrongCommand(msg) {
    return msg = "You entered a wrong command :(";
}

function sendMessage(msg, ioname, idname, mySocket, personalSocket) {
    msg = ioname + ": " + msg;
    if (idname) {
        if (associativearray_ID_Name[idname]) {
            console.log("sending private message");
            msg += " PRIVATE";
            mySocket.to(associativearray_ID_Name[idname]).emit('chat message', msg);
            personalSocket.emit("chat message", msg);
        } else {
            personalSocket.emit("chat message", "You entered a wrong name");
        }
    } else {
        mySocket.emit('chat message', msg);
    }
    console.log(msg);
}
