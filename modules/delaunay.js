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
        arrSize = res.push(new Point(x,y));
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
        adjencyList[start] = [];
        adjencyList[start+1] = [];
        adjencyList[start].push(start+1);
        adjencyList[start+1].push(start);
        hull = initHull(start,end);
        return hull;
    }else if(dist == 3){
        drawTriangle(pts[start],pts[start+1],pts[start+2]);
        adjencyList[start] = [];
        adjencyList[start+1] = [];
        adjencyList[start+2] = [];
        adjencyList[start].push(start,start+2);
        adjencyList[start+1].push(start,pts[start+2]);
        adjencyList[start+2].push(start,start+1);
        hull = initHull(start,end);
        return hull;
    }else{
        let mid = Math.ceil((start+end)/2);
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
        pts[start].cwnext = start+1;
        pts[start].ccwnext = start+1;
        
        pts[start+1].cwnext = start;
        pts[start+1].ccwnext = start;
    }else if(dist  == 3){

        if (direction(pts[start],pts[start+1],pts[start+2])<0){
            pts[start].cwnext = start+1;
            pts[start].ccwnext = start+2;
            pts[start+1].cwnext = start+2;
            pts[start+1].ccwnext = start;
            pts[start+2].ccwnext = start+1;
            pts[start+2].cwnext = start;
        }else{
            pts[start].cwnext = start+2;
            pts[start].ccwnext = start+1;
            pts[start+2].cwnext = start+1;
            pts[start+2].ccwnext = start;
            pts[start+1].cwnext = start;
            pts[start+1].ccwnext = start+2;
        }
    }else{
        console.log("Errorr : No init hull for dist: ",dist);
    }
    
    return hull;
}

function crossProduct(p1,p2){
    // if p1*p2>0 then p1 is clockwise to p2 else anticlockwise
    return p1.x*p2.y - p2.x*p1.y;
}

function computeClockwiseAngle(p1,p2,p3){
    console.log
    let result = Math.atan2(p3.substract(p1).y,p3.substract(p1).x)-Math.atan2(p2.substract(p1).y,p2.substract(p1).x);
    return result;
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

    p.ccwnext = q.index;
    q.cwnext = p.index;
    cpP.cwnext = cpQ.index;
    cpQ.ccwnext = cpP.index;

    //Compute edges for candidates
    while(true){
        // at p,q
        let orderedAdj = [];
        console.log("test",JSON.stringify(q.index),JSON.stringify(adjencyList[q.index]));
        for(let i = 0;i<adjencyList[q.index].length;i++){
            console.log("t",adjencyList[q.index][i]);
            orderedAdj.push([adjencyList[q.index][i],computeClockwiseAngle(p,q,pts[adjencyList[q.index][i]])]);
        }
        console.log("Ordered adj list from",JSON.stringify(p),"to",JSON.stringify(q));
        console.log("Is ",JSON.stringify(orderedAdj));
        break;

        
        if(candP == cpP && candQ == cpQ){
            break;
        }
    }




    let start = p;
    let hull = [];
    ctx.beginPath();
    ctx.moveTo(p.x,p.y);
    
    ctx.stroke();
    do{
        hull.push(p.index);
        //console.log("Walking",JSON.stringify(p));
        p = pts[p.cwnext];
        ctx.lineTo(p.x,p.y);
    }while(p != start);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    return hull;
}