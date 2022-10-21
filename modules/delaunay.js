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
    pts = createPoints(20);
    ctx.font = "30px Roboto";
    for(let i = 0;i<pts.length;i++){
        ctx.fillText(pts[i].index,pts[i].x,pts[i].y);
    }
    mergeDelauney(0,pts.length);
}

function createPoints(nbPoints){
    /* Create a list of points placed randomly inside the canvas space*/
    let res = [];
    let arrSize = 0;
    for (let i = 0;i<nbPoints;i++){
        x = Math.random()*canvas.width;
        y = Math.random()*canvas.height;
        let newPoint = new Point(x,y);
        arrSize = res.push(newPoint);
        dot(x,y);
    }
    res.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
                            return a.x-b.x});
    for(let i = 0;i<res.length;i++){
        res[i].index = i;
    }
    return res;
}

function mergeDelauney(start,end){
    let hullLeft = null;
    let hullRight = null;
    let hull = null;
    dist = end-start;
    if(dist == 2){
        let a = pts[start];
        let b = pts[start+1];
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
        adjencyList[pts[0]] = [];
        adjencyList[pts[1]] = [];
        adjencyList[pts[0]].push(pts[1]);
        adjencyList[pts[1]].push(pts[0]);
        hull = initHull(start,end);
        console.log("New 2 hull : ",hull);
        return hull;
    }else if(dist == 3){
        drawTriangle(pts[start],pts[start+1],pts[start+2]);
        adjencyList[pts[0]] = [];
        adjencyList[pts[1]] = [];
        adjencyList[pts[2]] = [];
        adjencyList[pts[0]].push(pts[1],pts[2]);
        adjencyList[pts[1]].push(pts[0],pts[2]);
        adjencyList[pts[2]].push(pts[0],pts[1]);
        
        hull = initHull(start,end);
        //console.log("Triangle ",JSON.stringify(pts[start]));
        //console.log("Triangle ",JSON.stringify(pts[start+1]));
        //console.log("Triangle ",JSON.stringify(pts[start+2]));
        //console.log("New 3 hull : ",hull);
        return hull;
    }else{
        let mid = Math.ceil((start+end)/2);
        //console.log("left : ",start,mid);
        //console.log("right : ",mid,end);
        hullLeft = mergeDelauney(start,mid);
        hullRight = mergeDelauney(mid,end);
        
        console.log("Merging left,right",hullLeft,hullRight);
        hull = mergeHulls(hullLeft,hullRight);
        console.log("New merged hull",hull);
        return hull;
    }
    

}


function initHull(start,end){
    let hull =[];
    let dist =  end-start;
    for(let i = start;i<end;i++){
        hull.push(i);
    }
    if(dist == 2){
        console.log("Linking from",start,end)
        pts[start].cwnext = start+1;
        pts[start].ccwnext = start+1;
        
        pts[start+1].cwnext = start;
        pts[start+1].ccwnext = start;
    }else if(dist  == 3){
        console.log("Linking from",start,end);
        console.log("Dir",direction(pts[start],pts[start+1],pts[start+2]))
        
        if (direction(pts[start],pts[start+1],pts[start+2])<0){
            console.log("1 is First");
            pts[start].cwnext = start+1;
            pts[start].ccwnext = start+2;
            pts[start+1].cwnext = start+2;
            pts[start+1].ccwnext = start;
            pts[start+2].ccwnext = start+1;
            pts[start+2].cwnext = start;
        }else{
            console.log("2 is First");
            pts[start].cwnext = start+2;
            pts[start].ccwnext = start+1;
            pts[start+2].cwnext = start+1;
            pts[start+2].ccwnext = start;
            pts[start+1].cwnext = start;
            pts[start+1].ccwnext = start+2;
        }

        
        //console.log("At init 3 ",pts[start]);
        //console.log("At init 3 ",pts[start+1]);
        //console.log("At init 3 ",pts[start+2]);
    }else{
        console.log("Errorr : No init hull for dist: ",dist);
    }
    
    return hull;
}

function crossProduct(p1,p2){
    // if p1*p2>0 then p1 is clockwise to p2 else anticlockwise
    return p1.x*p2.y - p2.x*p1.y;
}

function direction(p1,p2,p3){
    return crossProduct(p3.substract(p1),p2.substract(p1));
}

function mergeHulls(leftHull,rightHull){

    console.log(rightHull);
    let q = pts[Math.min.apply(null,rightHull)];
    let p = pts[Math.max.apply(null,leftHull)];
    let cpP = p;
    let cpQ = q;

    //p is point on leftHull, q is point on the right
    console.log("Init p ",JSON.stringify(p));
    console.log("Init q ",JSON.stringify(q));
    let prevP = null;
    let prevQ = null;

    //lower the bridge pq 
    while (true){
        prevP = p;
        prevQ = q;     
        while (direction(p, q, pts[q.ccwnext]) < 0){
            q = pts[q.ccwnext];
        }
        while (direction(q, p, pts[p.cwnext]) > 0){
            p = pts[p.cwnext];
        }

        if(p == prevP && q == prevQ){
            break;
        }
    }

    //up the bridge cpP cpQ 
    while (true){
        prevP = cpP;
        prevQ = cpQ;

        while (direction(cpP, cpQ, pts[cpQ.cwnext]) > 0){
            cpQ = pts[cpQ.cwnext];
        }
        while (direction(cpQ, cpP, pts[cpP.ccwnext]) < 0){
            cpP = pts[cpP.ccwnext];
        }
        if (cpP == prevP && cpQ == prevQ){
            break;
        }
    }

    console.log("Final lower p ",JSON.stringify(p));
    console.log("Final lower q ",JSON.stringify(q));
    console.log("Final upper cpP ",JSON.stringify(cpP));
    console.log("Final upper cpQ ",JSON.stringify(cpQ));
    
    p.ccwnext = q.index;
    q.cwnext = p.index;
    cpP.cwnext = cpQ.index;
    cpQ.ccwnext = cpP.index;
    
    let start = p;
    let hull = [];
    ctx.beginPath();
    ctx.moveTo(p.x,p.y);
    
    ctx.stroke();
    do{
        hull.push(p.index);
        console.log("Walking",JSON.stringify(p));
        p = pts[p.cwnext];
        ctx.lineTo(p.x,p.y);
    }while(p != start);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    return hull;
}