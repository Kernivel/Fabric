var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
createPoints(100);


function createPoints(nbPoints){
    /* Create a list of points placed randomly inside the canvas space*/
    pts = [];
    for (let i = 0;i<nbPoints;i++){
        x = Math.random()*canvas.width;
        y = Math.random()*canvas.height;
        arrSize = pts.push([x,y]);
        console.log(x,y);
        dot(x,y);
    }
    return pts;
}
