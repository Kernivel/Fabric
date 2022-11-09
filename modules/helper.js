var elt = document.querySelector('select');
var scriptName = "";
var btn = document.querySelector('input');
var speedSlider = document.getElementById('topSpeed');
var accSlider = document.getElementById('acceleration');

var maxSpeed = 2;
var acceleration = 1;
let delaun = null;
btn.addEventListener('click',updateBtn);
elt.addEventListener('change',function(){scriptName = elt.value;fetchMatchingScript()});


function fetchMatchingScript(){
    console.log("script is : " + scriptName);
    let canvas = document.getElementById("myCanvas");
    switch(scriptName){
        case 'fabric':
            break;
        case 'delaunay':
            delaun = new Delaunay(25);
            window.requestAnimationFrame(function(){delaunayAnimation(delaun)});
            drawAdjency(delaun);
            break;
        default:
            ctx.fillText("Select a mode",canvas.width/2-canvas.width/15,canvas.height/2-canvas.height/15);
            break;
    }
}

function updateBtn(){
    if (btn.value == "Start"){
        btn.value = "Stop";
        if(scriptName == "delaunay"){
            window.requestAnimationFrame(function(){delaunayAnimation(delaun)});
        }else{
            fetchMatchingScript();
        }
        
    }else{
        btn.value = "Start";
    }
}

function updateMaxSpeed(){
    maxSpeed = parseInt(speedSlider.value);
    document.getElementById('outputSpeed').innerHTML = "Speed : " + maxSpeed; 
}

function updateMaxAccel() {
    acceleration = parseInt(accSlider.value);
    document.getElementById('outputAccel').innerHTML = "Accel : " + acceleration; 
}