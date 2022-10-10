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
        console.log(x,y);
        dot(x,y);
        if(insideTriangle(a,b,c,[x,y])){
            dotColor(x,y,"#00FF00");
        }else{
            dotColor(x,y,"#FF0000");
        }
    }
}



function drawTriangle(a,b,c){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    ctx.lineTo(b[0],b[1]);
    ctx.lineTo(c[0],c[1]);
    ctx.lineTo(a[0],a[1]);
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