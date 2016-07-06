/**
 * Created by Edward on 01/07/2016.
 */
function ChatPerson(id,username,socket){
    this.id = id;
    this.username = username;
    this.socket = socket;
    this.lastCommands = []
};

ChatPerson.prototype.getAllInfo = function(){
    console.log("The user id is "+this.id+" and its username is "+this.username);
};

ChatPerson.prototype.getUsername = function(){
    return this.username;
};

ChatPerson.prototype.getID = function(){
    return this.id;
};

ChatPerson.prototype.getSocket = function(){
    return this.socket;
};

ChatPerson.prototype.pushLastCommands = function(command){
    if(this.lastCommands.length >= 3) {
        this.lastCommands.shift();
        this.lastCommands.push(command);
    }else{
        this.lastCommands.push(command);
    }
};

module.exports = ChatPerson;