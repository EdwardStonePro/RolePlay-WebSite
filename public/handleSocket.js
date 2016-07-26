/**
 * Created by Edward on 18/07/2016.
 */
var socket = io();
var lastCommandsHTML = [];
socket.on('chat message', function (msg) {
    $('#messages').prepend($('<li class="list-group-item">').text(msg));
    var elem = document.getElementById('messagewindow');
    elem.scrollTop = elem.scrollHeight;
});

socket.on('chat image', function (imageMessageFromSocket) {
    console.log(imageMessageFromSocket);
    var img = new Image();
    img.src = 'data:image/jpeg;base64,' + imageMessageFromSocket.buffer;
    $(img).load(function () {
        console.log("natural width and height: " + img.naturalWidth + " " + img.naturalHeight);
        console.log("img width and height: " + img.width + " " + img.height);
        var newImageSize = changeImageSize(img.width, img.height);
        img.width = newImageSize[0];
        img.height = newImageSize[1];
        console.log(img);
        console.log('Receiving data from server, ie receiving image from the other client (client->server->client)');
        $('#messages').prepend($('<li class="list-group-item"><img src="' + img.src + '" width="' + img.width + '" ' +
            'height="' + img.height + '" >'));
    });
});

socket.on('chat retrieval', function (logChat) {
    console.log(logChat);
    for (var i = 0, len = logChat.length; i < len; i++) {
        console.log(logChat[i]);
        $('#messages').prepend($('<li class="list-group-item">').text(logChat[i]));
    }
});

socket.on('last commands', function (lastCommands) {
    lastCommandsHTML = lastCommands;
    console.log(lastCommandsHTML);
});

socket.on('receive drawing', function(drawObject){
    if(drawObject.typeOfDrawing == 'point'){
        CANVAS.context.moveTo(drawObject.coordinatesX[0], drawObject.coordinatesY[0]);
        CANVAS.context.beginPath();
        for(var i =1;i<drawObject.coordinatesX.length;i++){
            CANVAS.context.lineTo(drawObject.coordinatesX[i], drawObject.coordinatesY[i]);
            CANVAS.context.stroke();
        }
    }else if(drawObject.typeOfDrawing == 'rectangle'){
        CANVAS.context.moveTo(drawObject.coordinatesX,drawObject.coordinatesY);
        CANVAS.context.beginPath();
        CANVAS.context.rect(drawObject.coordinatesX,drawObject.coordinatesY,
            drawObject.rectangleWidth,drawObject.rectangleHeight);
        CANVAS.context.stroke();
    }
});

socket.on('reset canvas', function(){
    CANVAS.context.clearRect(0,0,CANVAS.canvas.width,CANVAS.canvas.height);
});
