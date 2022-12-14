var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
//canvas.width  = 500;
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight*0.9;
canvas.style.width ='100%';
canvas.style.height='90%';
var ctx = canvas.getContext("2d");
ctx.font = "50px Roboto";
ctx.fillText("Select a mode",canvas.width/2-canvas.width/15,canvas.height/2-canvas.height/15);

function dot(x,y){
    ctx.fillStyle = "#000000"
    ctx.fillRect(x,y,5,5);
}

function dotColor(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,5,5);
}

function createPoints(nbPoints){
    let pts = [];

    for (let i = 0;i<nbPoints;i++){
        
        let x = Math.random()*canvas.width;
        let y = Math.random()*canvas.height;
        pts.push(new Point(x,y));
    }
    pts.sort(function(a,b){if(a.x === b.x)return b.y-a.y;
                            return a.x-b.x});
    for(let i = 0;i<pts.length;i++){
        pts[i].index = i;
        ctx.strokeText(i,pts[i].x,pts[i].y);
    }
    return pts;
};

function createPointsWithBorder(nbPoints){
    let pts = [];
    /*pts.push(new Point(0,0));
    pts.push(new Point(0,canvas.height));
    pts.push(new Point(canvas.width,0));
    pts.push(new Point(canvas.width,canvas.height));

    pts.push(new Point(0,canvas.height/2));
    pts.push(new Point(canvas.width/2,0));
    pts.push(new Point(canvas.width,canvas.height/2));
    pts.push(new Point(canvas.width/2,canvas.height));
    */
    for (let i = 0;i<nbPoints-8;i++){
        
        let x = Math.random()*canvas.width;
        let y = Math.random()*canvas.height;
        pts.push(new Point(x,y));
    }
    pts.sort(function(a,b){if(a.x === b.x)return b.y-a.y;
                            return a.x-b.x});
    for(let i = 0;i<pts.length;i++){
        pts[i].index = i;
        ctx.fillText(i,pts[i].x,pts[i].y);
    }
    return pts;
};

function drawTriangle(a,b,c){
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.lineTo(c.x,c.y);
    ctx.lineTo(a.x,a.y);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
}

function fillTrianglePos(a,b,c,pos){
    //console.log("filling tri");
    pos = pos.split(",");
    let posX = (pos[0]*255)/canvas.width;
    let posY = (pos[1]*255)/canvas.height;
    let color = rgb(posX,posY,126)
    ctx.fillStyle = color;
    //ctx.fillStyle = random_rgba();
    //ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.lineTo(c.x,c.y);
    ctx.lineTo(a.x,a.y);
    ctx.fill();
    //ctx.strokeStyle = "black";
}

function drawLine2Points(a,b){
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
}

function drawLine2Points(a,b){
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
        ctx.strokeStyle = "black";
}

function drawAdjency(delaunObj){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;    
    let adjencyList = delaunObj.adjencyList;
    let pts = delaunObj.pts;
    //console.log("In draw",adjencyList);
    for(let el in adjencyList){
        for(let line of adjencyList[el].values()){
            
            ctx.beginPath();
            //console.log("Start",pts[el].index);
            //console.log("End",pts[line].index);
            ctx.moveTo(pts[el].x,pts[el].y);
            ctx.lineTo(pts[line].x,pts[line].y);
            //ctx.lineTo(pts[el].x,pts[el].y);
            ctx.stroke();
        }
    }
}

function findTriangles(delaunObj){
    let triangleMap = {};
    //Triangle is defined by its center point and idx of its 3 corners : [[c.x,c.y],idx1,idx2,idx3]
    for(let i = 0;i<Object.keys(delaunObj.adjencyList).length;i++){
        
        for(const b of delaunObj.adjencyList[i]){
            //let b = delaunObj.adjencyList[i][j];
            for(const c of delaunObj.adjencyList[i]){
                if(b==c){continue;}
                //let c = delaunObj.adjencyList[i][k];
                if(delaunObj.adjencyList[b].has(c) && delaunObj.adjencyList[i].has(c)){
                    let centroid;
                    let x = (delaunObj.pts[i].x+delaunObj.pts[b].x+delaunObj.pts[c].x)/3;  
                    let y = (delaunObj.pts[i].y+delaunObj.pts[b].y+delaunObj.pts[c].y)/3;
                    triangleMap[[x,y]] = [i,b,c];
                }
            }
        }
    }
    return triangleMap;
}

function drawHull(delaun,hull){
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    let x = delaun.pts[hull[0]].x;
    let y = delaun.pts[hull[0]].y;
    ctx.moveTo(x,y);
    for(let i = 0;i<hull.length;i++){
        x = delaun.pts[hull[i]].x;
        y = delaun.pts[hull[i]].y;
        ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    
}

function delaunayAnimation(delaunObj){
    
    console.log("----NEW DELAUNAY TRIANGULATION ------");
    delaunObj.delaunization(0,delaunObj.pts.length);
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas
    //drawAdjency(delaunObj);
    let triangles = findTriangles(delaunObj);
    for(const [key,value] of Object.entries(triangles))
    {
        let a = value[0];
        let b = value[1];
        let c = value[2];
        fillTrianglePos(delaunObj.pts[a],delaunObj.pts[b],delaunObj.pts[c],key);
    }
    delaunObj.updateThrustPts();
    delaunObj.movePointsThrustOffset();
    if(btn.value == "Stop"){
        window.requestAnimationFrame(function(){delaunayAnimation(delaunObj)});
    }
}

function clampValue(val,min,max){
    val = Math.min(Math.max(min,val),max);
    return val;
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
  }