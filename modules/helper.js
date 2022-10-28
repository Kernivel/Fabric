var elt = document.querySelector('select');
var scriptName = "";
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
        case 'triangleP':
            //mainTriangle(500);
            let triangle = new Triangle(canvas);
            triangle.mainTriangle();
            break;
        case 'delaunay':
            let delaun = new Delaunay(canvas);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            delaun.createPoints(50);
            delaun.delaunization(0,50);
            console.log("Done delaun");
            delaun.drawAdjency();
            delete delaun;
            break;
        default:
            ctx.strokeText("Select a mode",canvas.width/2-50,canvas.height/2-50);
            break;
    }
}