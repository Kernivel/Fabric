var elt = document.querySelector('select');
var scriptName = "";
elt.addEventListener('change',function(){scriptName = elt.value;fetchMatchingScript()});


function fetchMatchingScript(){
    console.log("script is : " + scriptName);
    
    switch(scriptName){
        case 'fabric':
            mainFabric(100);
            break;
        case 'debug':
            mainDebug(30);
            break;
        case 'triangleP':
            mainTriangle(500);
            break;
        case 'delaunay':
            let delaun = new Delaunay(canvas);
            delaun.createPoints(20);
            delaun.delaunization(0,20);
            console.log("Done delaun");
            delaun.drawAdjency();
            break;
        default:
            ctx.strokeText("Select a mode",canvas.width/2-50,canvas.height/2-50);
            break;
    }
}