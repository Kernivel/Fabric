var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

function dot(x,y){
    ctx.fillStyle = "#000000"
    ctx.fillRect(x,y,2,2);
}
let pts = [];

for (let i = 0;i<100;i++){
    x = Math.random()*canvas.width;
    y = Math.random()*canvas.height;
    arrSize = pts.push([x,y]);
    console.log(x,y);
    dot(x,y);
}
window.requestAnimationFrame(animate);

function animate(){
    let cnx = [];
    for(let i = 0;i<pts.length;i++){
        cnx[i] = find3Mins(i);
        
    }
    for(let i = 0;i<50;i++){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        movePoints(cnx);
    }
    window.requestAnimationFrame(animate);
}

function movePoints(cnx){
    
    for(let i = 0;i<pts.length;i++){
        newX = (Math.random()-0.5)*5+pts[i][0];
        newY = (Math.random()-0.5)*5+pts[i][1];
        pts[i][0]= newX;
        pts[i][1]= newY;
        dot(newX,newY);
        connectDot3Dots(pts[i],cnx[i]);
    }
}

function connectCloseDots(treshold){
    for(let i = 0;i<pts.length;i++){
        for(let j = 0;j<pts.length;j++){
            if(i == j){
                continue;
            }
            let dist = Math.abs(pts[i][0]-pts[j][0])+Math.abs(pts[i][1]-pts[j][1]);
            if (dist<treshold){
                ctx.beginPath();
                ctx.moveTo(pts[i][0],pts[i][1]);
                ctx.lineTo(pts[j][0],pts[j][1]);
                ctx.stroke();
            }
        }
    } 
}

function find3Mins(pt){
    let connexions = [];
    max = Number.MAX_SAFE_INTEGER;
    minDist = [max,max,max];
    connexions = [0,0,0];
        for(let i = 0;i<pts.length;i++){
            if (i == pt){
                continue;
            }
            dist = getDist(pts[pt],pts[i]);
            if (dist<minDist[0]){
                minDist[0] = dist;
                connexions[0] = i;
            }else if(minDist[0]<dist && dist<minDist[1]){
                minDist[1] = dist;
                connexions[1] = i;
            }else if(dist<minDist[2]){
                minDist[2] = dist;
                connexions[2] = i;
            }
        }
    return connexions;
}

function connectDot3Dots(pt,connexions){
    /*console.log(pt,"hey",connexions);*/
    for(let i = 0;i<connexions.length;i++){
        ctx.beginPath();
        ctx.moveTo(pt[0],pt[1]);
        ctx.lineTo(pts[connexions[i]][0],pts[connexions[i]][1]);
        ctx.stroke();
        console.log(pt,connexions[i]);
    }
}

function getDist(pt1,pt2){
    return Math.abs(pt1[0]-pt2[0])+Math.abs(pt1[1]-pt2[1]);
}