class Triangle{
    a = [Math.random()*canvas.width,Math.random()*canvas.height];
    b = [Math.random()*canvas.width,Math.random()*canvas.height];
    c = [Math.random()*canvas.width,Math.random()*canvas.height];
    pts = [];
    ctx = null;
    canvas = null;
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    mainTriangle(nbPoints){
        this.ctx.clearRect(0,0,canvas.width,canvas.height);
        
        this.drawTriangle(this.a,this.b,this.c);
        for (let i = 0;i<nbPoints;i++){
            let x = Math.random()*canvas.width;
            let y = Math.random()*canvas.height;
            this.pts.push([x,y]);
        }
        this.animateTriangle();
    };

    movePoints(){
        for(let i = 0;i<this.pts.length;i++){
            let newX = (Math.random()-0.5)*5+this.pts[i][0];
            let newY = (Math.random()-0.5)*5+this.pts[i][1];
            this.pts[i].x= newX;
            this.pts[i].y = newY;    
        }
    }

    animateTriangle(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.movePoints();
        this.drawTriangle(this.a,this.b,this.c);
        for (let i = 0;i<this.pts.length;i++){
            let x = pts[i][0];
            let y = pts[i][1];
            if(insideTriangle(this.a,this.b,this.c,this.pts[i])){
                this.ctx.fillStyle = "#0000FF";
                dotColor(x,y,"#0000FF");
            }else{
                let nextColor = getColorDistTriangle(this.a,this.b,this.c,this.pts[i]);
                ctx.fillStyle = nextColor.toString();
                //console.log(nextColor);
                dotColor(x,y,nextColor);
            }
        }
    
        if(scriptName == "triangleP"){
            //window.requestAnimationFrame();
            //window.requestAnimationFrame(this.animateTriangle.bind(this))

        }else{
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        }
    }

    drawTriangle(a,b,c){
        console.log("Drawing tri");
        this.ctx.strokeStyle = "blue";
        //ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x,a.y);
        this.ctx.lineTo(b.x,b.y);
        this.ctx.lineTo(c.x,c.y);
        this.ctx.lineTo(a.x,a.y);
        this.ctx.stroke();
        this.ctx.strokeStyle = "black";
    }

    drawLine2Points(a,b){
        this.ctx.strokeStyle = "blue";
        this.ctx.beginPath();
        this.ctx.moveTo(a.x,a.y);
        this.ctx.lineTo(b.x,b.y);
        this.ctx.stroke();
        this.ctx.strokeStyle = "black";
    }

    getSidePlane(a,b,p){
        //return on which side the point p is sitting based on the x,y plane
        return ((p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0]));
    }
    
    insideTriangle(a,b,c,p){
        return Math.sign(getSidePlane(a,b,c)) == Math.sign(getSidePlane(a,b,p))
        && Math.sign(getSidePlane(b,c,a)) == Math.sign(getSidePlane(b,c,p))
        && Math.sign(getSidePlane(a,c,b)) == Math.sign(getSidePlane(a,c,p))
    }
    
    getColorDistTriangle(a,b,c,p){
        let dist1 = Math.abs(getSidePlane(a,b,p))/1000;
        let dist2 = Math.abs(getSidePlane(a,c,p))/1000;
        let dist3 = Math.abs(getSidePlane(b,c,p))/1000;
        
        let minDist = Math.min(Math.round(dist1),Math.round(dist2),Math.round(dist3),255);
        //let color = minDist.toString(16);
        res = `rgb(${255-Math.floor(minDist)},0,0)`;
        return res;
    }
    
}









