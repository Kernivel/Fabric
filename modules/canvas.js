var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
ctx.font = "50px Roboto";
ctx.strokeText("Select a mode",canvas.width/2-50,canvas.height/2-50);

function dot(x,y){
    ctx.fillStyle = "#000000"
    ctx.fillRect(x,y,2,2);
}