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
        ctx.fillText(i,pts[i].x,pts[i].y);
    }
    mergeDelauney(0,50);
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
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
        //adjencyList[pts[0]] = [];
        //adjencyList[pts[1]] = [];
        //adjencyList[pts[0]].push(pts[1]);
        //adjencyList[pts[1]].push(pts[0]);
        hull = initHull(start,end);
        console.log("New 2 hull : ",hull);
        return hull;
    }else if(dist == 3){
        drawTriangle(pts[0],pts[1],pts[2]);
        //adjencyList[pts[0]] = [];
        //adjencyList[pts[1]] = [];
        //adjencyList[pts[2]] = [];
        //adjencyList[pts[0]].push(pts[1],pts[2]);
        //adjencyList[pts[1]].push(pts[0],pts[2]);
        //adjencyList[pts[2]].push(pts[0],pts[1]);
        hull = initHull(start,end);
        console.log("New 3 hull : ",hull);
        return hull;
    }else{
        let mid = Math.ceil((start+end)/2);
        console.log("left : ",start,mid);
        console.log("right : ",mid,end);
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
        pts[start].cwnext = pts[end-1];
        pts[start].ccwnext = pts[end-1];
        pts[end-1].cwnext = pts[start];
        pts[end-1].ccwnext = pts[start];
    }else if(dist  == 3){
        pts[start].cwnext = pts[start+1];
        pts[start].ccwnext = pts[end-1];
        pts[start+1].cwnext = pts[start+2];
        pts[start+1].ccwnext = pts[start];
        pts[start+2].cwnext = pts[start];
        pts[start+2].ccwnext = pts[start+1];
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
    return crossProduct(p3.substract(p3,p1),p2.substract(p2,p1));
}

function mergeHulls(leftHull,rightHull){
    console.log(leftHull)
    let q = pts[rightHull[0]];
    let p = pts[leftHull[0]];

    for(let elt in leftHull){
        if (pts[elt] < q.x){
            q = pts[elt];
        }
    }

    for(let elt in leftHull){
        if (pts[elt] > p.x){
            p = pts[elt];
        }
    }
    
    console.log("left q ",q);
    console.log("right p ",p);
    let cpP = p;
    let cpQ = q;
    let prevP = null;
    let prevQ = null;

    //Raising pq to upper tangeant
    if(true){
        prevP = p;
        prevQ = q;
        if(q.cwnext){
            while(direction(p,q,q.cwnext)<0){
                q = q.cwnext;
                console.log("q = q.cwnext;");
            }
        }
        if(p.ccwnext){
            while(direction(q,p,p.ccwnext)>0){
                p = p.ccwnext;
                console.log("p = p.ccwnext;");
            }
        }
        if(p == prevP && q == prevQ){
            //break;
        }
    }
    console.log("Raised upper");
    prevP = null;
    prevQ = null;
    //lower  cpp cpq to lower tangeant
    if(true){
        prevP = cpP;
        prevQ = cpQ;
        if(cpQ.cwnext){
            while(direction(cpP,cpQ,cpQ.ccwnext)<0){
                cpQ = cpQ.ccwnext;
                console.log("q = q.cwnext;");
            }
        }
        if(p.ccwnext){
            while(direction(cpQ,cpP,cpP.cwnext)>0){
                cpP = cpP.cwnext;
            }
        }
        if(cpP == prevP && cpQ == prevQ){
            //break;
        }
    }
    console.log("out of while true");
    
    //remove all other points
    p.cwnext = q;
    q.ccwnext = p;

    cpP.ccwnext = cpQ;
    cpQ.cwnext = cpP;
    
    let hull = [];
    start = p;
    console.log("aa",p);
    let cnt = 0;
    do{
        hull.push(p.index);
        p = p.cwnext;
        cnt+=1;
    }while(p.index != start.index || cnt<10);
    
    console.log("Resulting hull",hull);
    return hull;
}