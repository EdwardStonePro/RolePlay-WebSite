function changeImageSize(imgWidth,imgHeight){
   console.log(imgWidth,imgHeight);
   var factorRatio;
   if(imgWidth > 800){
       factorRatio = 800 / imgWidth;
   }else{
       factorRatio = imgWidth / 800;
   }
   imgWidth = imgWidth * factorRatio;
   imgHeight = imgHeight * factorRatio;
   return [imgWidth,imgHeight];
}
