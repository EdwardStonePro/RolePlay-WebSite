/**
 * Created by Edward on 02/07/2016.
 */
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
        } else if (result[1] == "roll2f60") {
            for (var rolls = 0; rolls < (+numberOfRolls); rolls++) {
                msg += ", " + (Math.floor(Math.random() * (60 - 1 + 1)) + 1);
            }
            msg += " (" + result[4] + ")";
        } else if (result[1] == "roll2f15") {
            for (var rolls = 0; rolls < (+numberOfRolls); rolls++) {
                msg += ", " + (Math.floor(Math.random() * (15 - 1 + 1)) + 1);
            }
            msg += " (" + result[4] + ")";
        } else {
            msg = wrongCommand(msg);
        }
        console.log(msg);
    } else if (msg == "roll opedward") {
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

function sendMessage(msg, chatPersonObject, id_name, io, associative_array_chatPerson, logChat) {
    msg = chatPersonObject.getUsername() + ": " + msg;
    if (id_name) {
        var keyPerson = findUser(id_name, associative_array_chatPerson);
        if (associative_array_chatPerson[keyPerson]) {
            console.log("Sending private message");
            msg += " PRIVATE";
            io.to(keyPerson).emit('chat message', msg);
            chatPersonObject.getSocket().emit("chat message", msg);
        } else {
            chatPersonObject.getSocket().emit("chat message", "You entered a wrong name");
        }
    } else {
        io.emit('chat message', msg);
        logChat.push(msg);
        console.log(logChat);
    }
    console.log(msg);
}

function findUser(id_name, associative_array_chatPerson) {
    for (var key in associative_array_chatPerson) {
        if (associative_array_chatPerson.hasOwnProperty(key)) {
            console.log(key + associative_array_chatPerson[key].getUsername());
            if (associative_array_chatPerson[key].getUsername() == id_name) {
                console.log("Found user");
                console.log("key is " + key);
                return key;
            }
        }
    }
}

module.exports.rollThemAll = rollThemAll;
module.exports.wrongCommand = wrongCommand;
module.exports.sendMessage = sendMessage;
module.exports.findUser = findUser;