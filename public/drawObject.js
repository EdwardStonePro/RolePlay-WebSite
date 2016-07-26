/**
 * Created by Edward on 18/07/2016.
 */
function DrawObject(coordinatesX,coordinatesY,DrawingStyle,typeOfDrawing,
                    rectangleHeight, rectangleWidth, radiusCircle){
    this.coordinatesX = coordinatesX;
    this.coordinatesY = coordinatesY;
    this.DrawingStyle = DrawingStyle;
    this.typeOfDrawing = typeOfDrawing || 'unknown';
    this.rectangleHeight = rectangleHeight || null;
    this.rectangleWidth = rectangleWidth || null;
    this.radiusCircle = radiusCircle || null;
}

DrawObject.prototype.getAllInfo = function(){
    console.log(this.coordinatesX+this.coordinatesY+this.DrawingStyle)
};

function DrawingStyle(lineWidth,lineColor){
    this.lineWidth = lineWidth;
    this.lineColor = lineColor || 'black';
}