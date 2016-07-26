/**
 * Created by Edward on 18/07/2016.
 */
var toolSelected = $('#pen');
var CANVAS = function(){
    var my ={};
    my.mouseX = 0;
    my.mouseY = 0;
    my.canvas = document.getElementById('myCanvas');
    my.context = my.canvas.getContext('2d');
    my.context.lineWidth = 2;
    my.offsetLeftCache = null;
    my.offsetTopCache = null;
    my.coordinatesX =[];
    my.coordinatesY =[];
    my.paint = false;
    my.canvasID = $("#myCanvas");
    my.drawingStyle = new DrawingStyle(my.context.lineWidth);
    my.timer = null;
    my.enableHandler = false;
    return my;
}();
$(document).ready(function(){
    
    $('#resetCanvas').click(function(){
        CANVAS.context.clearRect(0,0,CANVAS.canvas.width,CANVAS.canvas.height);
        socket.emit('reset canvas');
    }) ;

    toolSelected.addClass('isSelected');
    toolSelected.removeClass('disabledbutton');
    $('#toolbar').click(function(e){
        console.log('clicked');
        toolSelected.addClass('disabledbutton');
        toolSelected.removeClass('isSelected');
        if($(e.target).is('img')){
            toolSelected = $(e.target).parent();
            console.log(toolSelected.attr('id'));
        }else if($(e.target).has('li')){
            toolSelected = $(e.target);
            console.log(toolSelected.attr('id'));
        }
        toolSelected.addClass('isSelected');
        toolSelected.removeClass('disabledbutton');
        console.log(toolSelected.attr('id'));
    });
});


function enableTimer(){
    CANVAS.timer = window.setInterval(function(){
        CANVAS.enableHandler = true;
    }, 1000/80);
}

CANVAS.canvasID.mousedown(function (e) {
    console.log(toolSelected.attr('id'));
    CANVAS.offsetLeftCache = this.offsetLeft;
    CANVAS.offsetTopCache = this.offsetTop;
    CANVAS.mouseX = e.pageX - CANVAS.offsetLeftCache;
    CANVAS.mouseY =e.pageY - CANVAS.offsetTopCache;
    if(toolSelected.attr('id') == 'pen'){
        enableTimer();
        var coordinates = getAndPushCoordinates(CANVAS.coordinatesX,
            CANVAS.coordinatesY,CANVAS.mouseX,CANVAS.mouseY);
        CANVAS.coordinatesX = coordinates[0];
        CANVAS.coordinatesY = coordinates[1];
        CANVAS.context.moveTo(CANVAS.mouseX,CANVAS.mouseY);
        CANVAS.context.beginPath();
        CANVAS.paint = true;
    }else if (toolSelected.attr('id') == 'rectangle'){
        CANVAS.context.moveTo(CANVAS.mouseX,CANVAS.mouseY);
        CANVAS.context.beginPath();
    }else if(toolSelected.attr('id') == 'circle'){
        
    }
});


CANVAS.canvasID.mousemove(function (e) {
   if(CANVAS.enableHandler){
        if(toolSelected.attr('id') == 'pen'){
            if (CANVAS.paint) {
                CANVAS.mouseX = e.pageX - CANVAS.offsetLeftCache;
                CANVAS.mouseY =e.pageY - CANVAS.offsetTopCache;
                var coordinates = getAndPushCoordinates(CANVAS.coordinatesX,
                    CANVAS.coordinatesY,CANVAS.mouseX,CANVAS.mouseY);
                CANVAS.coordinatesX = coordinates[0];
                CANVAS.coordinatesY = coordinates[1];
                CANVAS.context.lineTo(CANVAS.mouseX, CANVAS.mouseY);
                CANVAS.context.stroke();
            }
        }
    }
    CANVAS.enableHandler = false;
});

CANVAS.canvasID.mouseup(function (e) {
    if(toolSelected.attr('id') == 'pen'){
        CANVAS.mouseX = e.pageX - CANVAS.offsetLeftCache;
        CANVAS.mouseY =e.pageY - CANVAS.offsetTopCache;
        var coordinates = getAndPushCoordinates(CANVAS.coordinatesX,
            CANVAS.coordinatesY,CANVAS.mouseX,CANVAS.mouseY);
        CANVAS.coordinatesX = coordinates[0];
        CANVAS.coordinatesY = coordinates[1];
        CANVAS.context.lineTo(CANVAS.mouseX, CANVAS.mouseY);
        CANVAS.context.stroke();

        var drawObjectToSend = new DrawObject(CANVAS.coordinatesX,CANVAS.coordinatesY,
            CANVAS.drawingStyle, 'point');
        socket.emit('send drawing', drawObjectToSend);
        CANVAS.coordinatesX =[];
        CANVAS.coordinatesY=[];

        CANVAS.paint = false;
        CANVAS.timer = null;
    }else if (toolSelected.attr('id') == 'rectangle'){
        var rectangleWidth = 0;
        if(CANVAS.mouseX < (e.pageX - CANVAS.offsetLeftCache)){
            rectangleWidth = (e.pageX - CANVAS.offsetLeftCache) - CANVAS.mouseX;
        }else{
            rectangleWidth = CANVAS.mouseX - (e.pageX - CANVAS.offsetLeftCache);
        }

        var rectangleHeight = 0;
        if(CANVAS.mouseY < (e.pageY - CANVAS.offsetTopCache)){
            rectangleHeight = (e.pageY - CANVAS.offsetTopCache) - CANVAS.mouseY;
        }else{
            rectangleHeight = CANVAS.mouseY - (e.pageY - CANVAS.offsetTopCache);
        }
        var drawObjectToSend = new DrawObject(CANVAS.mouseX,CANVAS.mouseY,
            CANVAS.drawingStyle,'rectangle',rectangleHeight,rectangleWidth);
        socket.emit('send drawing', drawObjectToSend);
        console.log('width is '+rectangleWidth+' and height is '+rectangleHeight);
        CANVAS.context.rect(CANVAS.mouseX,CANVAS.mouseY,rectangleWidth,rectangleHeight);
        CANVAS.context.stroke();
    }
});

function getAndPushCoordinates(cX,cY,X,Y){
    cX.push(X);
    cY.push(Y);
    return [cX,cY];
}


