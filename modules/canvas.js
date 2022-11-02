var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
//canvas.width  = 500;
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width ='100%';
canvas.style.height='100%';
var ctx = canvas.getContext("2d");
ctx.font = "50px Roboto";
ctx.strokeText("Select a mode",canvas.width/2-50,canvas.height/2-50);

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
    pts.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
                            return a.x-b.x});
    for(let i = 0;i<pts.length;i++){
        pts[i].index = i;
    }
    return pts;
};

function drawTriangle(a,b,c){
    console.log("Drawing tri");
    ctx.strokeStyle = "blue";
    //ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.lineTo(c.x,c.y);
    ctx.lineTo(a.x,a.y);
    ctx.stroke();
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

function delaunayAnimation(delaunObj){
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas
    ctx.save();
    delaunObj.delaunization(0,delaunObj.pts.length);
    drawAdjency(delaunObj);
    delaunObj.updateThrustPts();
    delaunObj.movePointsThrustBounce();
    if(btn.value == "Stop"){
        window.requestAnimationFrame(function(){delaunayAnimation(delaunObj)});
    }
}

function clampValue(val,min,max){
    val = Math.min(Math.max(min,val),max);
    return val;
}