var elt = document.querySelector('select');
var scriptName = "";
elt.addEventListener('change',function(){scriptName = elt.value;fetchMatchingScript()});


function fetchMatchingScript(){
    console.log("script is : " + scriptName);
    
    switch(scriptName){
        case 'fabric':
            mainFabric(100);
            break;
        case 'delaunay':
            console.log("Not yet implemented");
            break;
        case 'triangleP':
            mainTriangle(500);
            break;
        default:
            ctx.strokeText("Select a mode",canvas.width/2-50,canvas.height/2-50);
            break;
    }
}