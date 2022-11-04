var elt = document.querySelector('select');
var scriptName = "";
var btn = document.querySelector('input');
var speedSlider = document.getElementById('topSpeed');
var accSlider = document.getElementById('acceleration');

var maxSpeed = 2;
var acceleration = 0.5;
let delaun = null;
btn.addEventListener('click',updateBtn);
elt.addEventListener('change',function(){scriptName = elt.value;fetchMatchingScript()});


function fetchMatchingScript(){
    console.log("script is : " + scriptName);
    let canvas = document.getElementById("myCanvas");
    switch(scriptName){
        case 'fabric':
            //mainFabric(100);
            break;
        case 'debug':
            //mainDebug(30);
            break;
        case 'delaunay':
            delaun = new Delaunay(20);
            //delaun.delaunization(0,50);
            //delaunayAnimation(delaun);
            window.requestAnimationFrame(function(){delaunayAnimation(delaun)});
            //console.log("Done delaun");
            //drawAdjency(delaun.adjencyList);
            drawAdjency(delaun);
            break;
        default:
            ctx.strokeText("Select a mode",canvas.width/2-50,canvas.height/2-50);
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
    maxSpeed = speedSlider.value/10;
    document.getElementById('outputSpeed').innerHTML ="speed " + maxSpeed; 
}

function updateMaxAccel() {
    acceleration = accSlider.value/10;
    document.getElementById('outputAccel').innerHTML ="accel " + acceleration; 
}