var elt = document.querySelector('select');
elt.addEventListener('change',fetchMatchingScript,elt.value);
//elt.addEventListener('change',function(){console.log(this.value)});


function fetchMatchingScript(scriptName){
    console.log("script is : " + scriptName);
    var script = document.querySelector('script[src = "modules/fabric.js]"');
    console.log("hh"+script);
}