
var ctx = canvas.getContext("2d");
var adjencyList = {};

class Delaunay{
    pts = null;
    adjencyList = {};
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    createPoints(nbPoints){
        this.pts = [];
        for (let i = 0;i<nbPoints;i++){
            let x = Math.random()*canvas.width;
            let y = Math.random()*canvas.height;
            this.pts.push(new Point(x,y));
            //dot(x,y);
        }
        this.pts.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
                                return a.x-b.x});
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].index = i;
        }
        console.log("Created and ordered new set of points",this.pts);
        //return this.pts;
    };

    delaunization(start,end){
        if(this.pts == null){
            console.log("No points have been created before, use this.createPoints(nbPoints), before calling this function");
            return null;
        }
        let hullLeft = null;
        let hullRight = null;
        let hull = null;
        let dist = end-start;
        if(dist == 2){
            let a = this.pts[start];
            let b = this.pts[start+1];
            this.ctx.beginPath();
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 3;
            this.ctx.moveTo(a.x,a.y);
            this.ctx.lineTo(b.x,b.y);
            this.ctx.stroke();
            this.adjencyList[start] = [];
            this.adjencyList[start+1] = [];
            this.adjencyList[start].push(start+1);
            this.adjencyList[start+1].push(start);
            hull = this.initHull(start,end);
            return hull;
        }else if(dist == 3){
            drawTriangle(this.pts[start],this.pts[start+1],this.pts[start+2]);
            this.adjencyList[start] = [];
            this.adjencyList[start+1] = [];
            this.adjencyList[start+2] = [];
            this.adjencyList[start].push(start,start+2);
            this.adjencyList[start+1].push(start,pts[start+2]);
            this.adjencyList[start+2].push(start,start+1);
            hull = this.initHull(start,end);
            return hull;
        }else{
            let mid = Math.ceil((start+end)/2);
            hullLeft = this.delaunization(start,mid);
            hullRight = this.delaunization(mid,end);
            
            console.log("Merging left,right",hullLeft,hullRight);
            hull = this.mergeHulls(hullLeft,hullRight);
            console.log("New merged hull",hull);
            return hull;
        }
    };


    mergeHulls(leftHull,rightHull){
        console.log(rightHull);
        let q = this.pts[Math.min.apply(null,rightHull)];
        let p = this.pts[Math.max.apply(null,leftHull)];
        let cpP = p;
        let cpQ = q;
    
        let prevP = null;
        let prevQ = null;
    
        //lower the bridge pq 
        while (true){
            prevP = p;
            prevQ = q;     
            while (this.direction(p, q, this.pts[q.ccwnext]) < 0){
                q = this.pts[q.ccwnext];
            }
            while (this.direction(q, p, this.pts[p.cwnext]) > 0){
                p = this.pts[p.cwnext];
            }
    
            if(p == prevP && q == prevQ){
                break;
            }
        }
    
        //up the bridge cpP cpQ 
        while (true){
            prevP = cpP;
            prevQ = cpQ;
    
            while (this.direction(cpP, cpQ, this.pts[cpQ.cwnext]) > 0){
                cpQ = this.pts[cpQ.cwnext];
            }
            while (this.direction(cpQ, cpP, this.pts[cpP.ccwnext]) < 0){
                cpP = this.pts[cpP.ccwnext];
            }
            if (cpP == prevP && cpQ == prevQ){
                break;
            }
        }
    
        p.ccwnext = q.index;
        q.cwnext = p.index;
        cpP.cwnext = cpQ.index;
        cpQ.ccwnext = cpP.index;
        let start = p;
        let hull = [];
        do{
            hull.push(p.index);
            p = this.pts[p.cwnext];
        }while(p != start);
    
        return hull;
    }

    crossProduct(p1,p2){
        // if p1*p2>0 then p1 is clockwise to p2 else anticlockwise
        return p1.x*p2.y - p2.x*p1.y;
    }
    
    computeClockwiseAngle(p1,p2,p3){
        let result = Math.atan2(p3.substract(p1).y,p3.substract(p1).x)-Math.atan2(p2.substract(p1).y,p2.substract(p1).x);
        return result;
    }
    
    direction(p1,p2,p3){
        return this.crossProduct(p3.substract(p1),p2.substract(p1));
    }
    
    initHull(start,end){
        let hull =[];
        let dist =  end-start;
        for(let i = start;i<end;i++){
            hull.push(i);
        }
        if(dist == 2){
            this.pts[start].cwnext = start+1;
            this.pts[start].ccwnext = start+1;
            
            this.pts[start+1].cwnext = start;
            this.pts[start+1].ccwnext = start;
        }else if(dist  == 3){
    
            if (this.direction(this.pts[start],this.pts[start+1],this.pts[start+2])<0){
                this.pts[start].cwnext = start+1;
                this.pts[start].ccwnext = start+2;
                this.pts[start+1].cwnext = start+2;
                this.pts[start+1].ccwnext = start;
                this.pts[start+2].ccwnext = start+1;
                this.pts[start+2].cwnext = start;
            }else{
                this.pts[start].cwnext = start+2;
                this.pts[start].ccwnext = start+1;
                this.pts[start+2].cwnext = start+1;
                this.pts[start+2].ccwnext = start;
                this.pts[start+1].cwnext = start;
                this.pts[start+1].ccwnext = start+2;
            }
        }else{
            console.log("Errorr : No init hull for dist: ",dist);
        }
        
        return hull;
    }

};


function findNextCandidate(side,p,q){
    if(side == "left"){

    }else if(side == "right"){

    }else{
        console.log("Wrong format for side");
        return null;
    }
}
