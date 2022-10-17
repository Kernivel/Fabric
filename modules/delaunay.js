var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var adjencyList = {};
/*Each connexion is saved as a link between two points
    cf if a is connected to b then  {
                                        adj[a] => [b]
                                        adj[b] => [a]
                                    }
    if we then add a third point c that we connect to b we get
                                    {
                                        adj[a] => [b]
                                        adj[b] => [a,c]
                                        adj[c] => [b]
                                    }
  */

function mainDelaunay(){
    pts = createPoints(50);
    ctx.font = "12px Roboto";
    for(let i = 0;i<pts.length;i++){
        ctx.fillText(i,pts[i][0],pts[i][1]);
    }
    mergeDelauney(pts);
}

function mergeDelauney(pts){
    let hullLeft = null;
    let hullRight = null;
    let hull = null;
    if(pts.length == 2){
        let a = pts[0];
        let b = pts[1];
        ctx.beginPath();
        ctx.moveTo(a[0],a[1]);
        ctx.lineTo(b[0],b[1]);
        ctx.stroke();
        adjencyList[pts[0]] = [];
        adjencyList[pts[1]] = [];
        adjencyList[pts[0]].push(pts[1]);
        adjencyList[pts[1]].push(pts[0]);
        hull = initHull(pts);
        console.log("New 2 hull : ",hull);
        return hull;
    }else if(pts.length == 3){
        drawTriangle(pts[0],pts[1],pts[2]);
        adjencyList[pts[0]] = [];
        adjencyList[pts[1]] = [];
        adjencyList[pts[2]] = [];
        adjencyList[pts[0]].push(pts[1],pts[2]);
        adjencyList[pts[1]].push(pts[0],pts[2]);
        adjencyList[pts[2]].push(pts[0],pts[1]);
        hull = initHull(pts);
        console.log("New 3 hull : ",hull);
        return hull;
    }else{
        let mid = Math.ceil(pts.length/2)
        let left =  pts.slice(0,mid);
        let right = pts.slice(mid,pts.length);
        hullLeft = mergeDelauney(left);
        hullRight = mergeDelauney(right);
        return hull;
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

function initHull(pts){
    let hull = new DoubleCyclingLinkedList();
    console.log(pts);
    for(let i = 0;i<pts.length;i++){
        //console.log("pt:",pts[i]);
        hull.insert(pts[i]);
    }
    return hull;
}
