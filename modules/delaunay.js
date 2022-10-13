var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

function mainDelaunay(){
    pts = createPoints(100);
    ctx.font = "12px Roboto";
    for(let i = 0;i<pts.length;i++){
        ctx.fillText(i,pts[i][0],pts[i][1]);
    }
    mergeDelauney(pts);
}

function mergeDelauney(pts){
    if(pts.length == 2){
        let a = pts[0];
        let b = pts[1];
        ctx.beginPath();
        ctx.moveTo(a[0],a[1]);
        ctx.lineTo(b[0],b[1]);
        ctx.stroke();
    }else if(pts.length == 3){
        drawTriangle(pts[0],pts[1],pts[2]);
    }else{
        let mid = Math.ceil(pts.length/2)
        let left =  pts.slice(0,mid);
        let right = pts.slice(mid,pts.length);
        mergeDelauney(left);
        mergeDelauney(right);
    }
    

}
function createPoints(nbPoints){
    /* Create a list of points placed randomly inside the canvas space*/
    let res = [];
    for (let i = 0;i<nbPoints;i++){
        x = Math.random()*canvas.width;
        y = Math.random()*canvas.height;
        arrSize = res.push([x,y]);
        console.log(x,y);
        dot(x,y);
    
    }
    res.sort(function(a,b){if(a[0] === b[0])return a[1]-b[1];
                            return a[0]-b[0]});
    return res;
}

