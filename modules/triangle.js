let a = [Math.random()*canvas.width,Math.random()*canvas.height];
let b = [Math.random()*canvas.width,Math.random()*canvas.height];
let c = [Math.random()*canvas.width,Math.random()*canvas.height];

function mainTriangle(nbPoints){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts = [];
    drawTriangle(a,b,c);
    for (let i = 0;i<nbPoints;i++){
        x = Math.random()*canvas.width;
        y = Math.random()*canvas.height;
        arrSize = pts.push([x,y]);
    }
    animateTriangle();
}

function animateTriangle(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    movePoints();
    drawTriangle(a,b,c);
    for (let i = 0;i<pts.length;i++){
        let x = pts[i][0];
        let y = pts[i][1];
        if(insideTriangle(a,b,c,pts[i])){
            ctx.fillStyle = "#0000FF";
            dotColor(x,y,"#0000FF");
        }else{
            let nextColor = getColorDistTriangle(a,b,c,pts[i]);
            ctx.fillStyle = nextColor.toString();
            //console.log(nextColor);
            dotColor(x,y,nextColor);
        }
    }

    if(scriptName == "triangleP"){
        window.requestAnimationFrame(animateTriangle);
    }else{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
}


function drawTriangle(a,b,c){
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.lineTo(c.x,c.y);
    ctx.lineTo(a.x,a.y);
    ctx.stroke();
}

function getSidePlane(a,b,p){
    //return on which side the point p is sitting based on the x,y plane
    return ((p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0]));
}

function insideTriangle(a,b,c,p){
    return Math.sign(getSidePlane(a,b,c)) == Math.sign(getSidePlane(a,b,p))
    && Math.sign(getSidePlane(b,c,a)) == Math.sign(getSidePlane(b,c,p))
    && Math.sign(getSidePlane(a,c,b)) == Math.sign(getSidePlane(a,c,p))
}

function getColorDistTriangle(a,b,c,p){
    let dist1 = Math.abs(getSidePlane(a,b,p))/1000;
    let dist2 = Math.abs(getSidePlane(a,c,p))/1000;
    let dist3 = Math.abs(getSidePlane(b,c,p))/1000;
    
    let minDist = Math.min(Math.round(dist1),Math.round(dist2),Math.round(dist3),255);
    //let color = minDist.toString(16);
    res = `rgb(${255-Math.floor(minDist)},0,0)`;
    return res;
}

