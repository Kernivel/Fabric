class Delaunay{
    pts = null;
    adjencyList = {};

    constructor(nbPoints){
        this.pts = createPointsWithBorder(nbPoints);
    }

    

    movePointsRandom(){
        for(let i = 0;i<this.pts.length;i++){
            let newX = (Math.random()-0.5)*2+this.pts[i].x;
            let newY = (Math.random()-0.5)*2+this.pts[i].y;
            this.pts[i].x= newX;
            this.pts[i].y = newY;
        }
        console.log(this.pts);
        this.pts.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
            return a.x-b.x});
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].index = i;
        }
    }

    updateThrustPts(){
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].updateThrustPoint();
        }
    }
    movePointsThrust(){
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].x += this.pts[i].thrustX;
            this.pts[i].x = clampValue(this.pts[i].x,0,canvas.width);
            
            this.pts[i].y += this.pts[i].thrustY;
            this.pts[i].y = clampValue(this.pts[i].y,0,canvas.height);  
        }
        //console.log(this.pts);
        this.pts.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
            return a.x-b.x});
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].index = i;
            //ctx.strokeText(i,this.pts[i].x,this.pts[i].y);
        }
    }

    movePointsThrustBounce(){
        for(let i = 0;i<this.pts.length;i++){
            if(this.pts[i].x<0){
                this.pts[i].thrustX = 2;
            }else if(this.pts[i].x>canvas.width){
                this.pts[i].thrustX = -2;
            }
            if(this.pts[i].y<0){
                this.pts[i].thrustY = 2;
            }else if(this.pts[i].y>canvas.height){
                this.pts[i].thrustY = -2;
            }
            this.pts[i].x += this.pts[i].thrustX;
            
            this.pts[i].y += this.pts[i].thrustY;
        }
        //console.log(this.pts);
        this.pts.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
            return a.x-b.x});
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].index = i;
            //ctx.strokeText(i,this.pts[i].x,this.pts[i].y);
        }
    }

    movePointsThrustOffset(){
        for(let i = 0;i<this.pts.length;i++){
            if(this.pts[i].x<4){
                this.pts[i].thrustX = 2;
            }else if(this.pts[i].x>canvas.width-4){
                this.pts[i].thrustX = -2;
            }
            if(this.pts[i].y<4){
                this.pts[i].thrustY = 2;
            }else if(this.pts[i].y>canvas.height-4){
                this.pts[i].thrustY = -2;
            }

            if(this.pts[i].x == 0 || this.pts[i].x == canvas.width || this.pts[i].y == 0 || this.pts[i].y == canvas.height){
                this.pts[i].thrustX = 0;
                this.pts[i].thrustY = 0;
            }

            this.pts[i].x += this.pts[i].thrustX;
            
            this.pts[i].y += this.pts[i].thrustY;
        }
        //console.log(this.pts);
        this.pts.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
            return a.x-b.x});
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].index = i;
            ctx.strokeText(i,this.pts[i].x,this.pts[i].y);
        }
    }

    delaunization(start,end){
        if(this.pts == null){
            //console.log("No points have been created before, use this.createPoints(nbPoints), before calling this function");
            return null;
        }
        let hullLeft = null;
        let hullRight = null;
        let hull = null;
        let dist = end-start;
        if(dist == 2){
            let a = this.pts[start];
            let b = this.pts[start+1];
            hull = this.initHull(start,end);
            return hull;
        }else if(dist == 3){
            //drawTriangle(this.pts[start],this.pts[start+1],this.pts[start+2]);
            hull = this.initHull(start,end);
            return hull;
        }else{
            let mid = Math.ceil((start+end)/2);
            hullLeft = this.delaunization(start,mid);
            hullRight = this.delaunization(mid,end);
            
            //console.log("Merging left,right",hullLeft,hullRight);
            hull = this.mergeHulls(hullLeft,hullRight);
            //console.log("New merged hull",hull);
            return hull;
        }
    };


    mergeHulls(leftHull,rightHull){
        console.log("starting hull",rightHull);
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
        console.log(p);
        console.log(q);
    
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
        /*
        if(cpP != p || cpQ != q){
            cpP.cwnext = cpQ.index;
            cpQ.ccwnext = cpP.index;
        }*/
        //console.log(cpQ);
        //console.log(cpP);
        this.adjencyList[p.index].add(q.index);
        this.adjencyList[q.index].add(p.index);
        //this.adjencyList[cpP.index].add(cpQ.index);
        //this.adjencyList[cpQ.index].add(cpP.index);
        
        let leftCandidate = null;
        let rightCandidate = null;
        do{
            //console.log("P : ",p.index,"Q : ",q.index);
            leftCandidate = this.findNextCandidate("left",p,q);
            rightCandidate = this.findNextCandidate("right",p,q);
            //console.log(JSON.stringify(this.adjencyList));
            if(leftCandidate != null && rightCandidate != null){
                
                //console.log("Left cand",JSON.stringify(leftCandidate.index));
                //console.log("Left adj",JSON.stringify(this.adjencyList[leftCandidate.index]));
                //console.log("Right cand",JSON.stringify(rightCandidate.index));
                //console.log("Right adj",JSON.stringify(this.adjencyList[rightCandidate.index]));
                if(!leftCandidate.inCircle(p,rightCandidate,q)){
                    //console.log("Left candidate : ",leftCandidate.index," isn't in circumcircle :",p.index,rightCandidate.index,q.index);
                    this.adjencyList[rightCandidate.index].add(p.index);
                    this.adjencyList[p.index].add(rightCandidate.index);
                    //console.log("Moving q from:",q.index,"to :",rightCandidate.index);
                    q = rightCandidate;
                }else{
                    //console.log("Right candidate : ",rightCandidate.index,"isn't in circumcircle :",p.index,leftCandidate.index,q.index);
                    this.adjencyList[leftCandidate.index].add(q.index);
                    this.adjencyList[q.index].add(leftCandidate.index);
                    //console.log("Moving p from:",p.index,"to :",leftCandidate.index);
                    p = leftCandidate;
                }
                }else if(leftCandidate != null){
                    //.log("No right candidate");
                    //console.log("Left cand",JSON.stringify(leftCandidate.index));
                    //console.log("Left adj",JSON.stringify(this.adjencyList[leftCandidate.index]));
                    this.adjencyList[leftCandidate.index].add(q.index);
                    this.adjencyList[q.index].add(leftCandidate.index);
                    //console.log("Moving p from:",p.index,"to :",leftCandidate.index);
                    p = leftCandidate;
                }else if(rightCandidate != null){
                    //console.log("No left candidate");
                    //console.log("Right cand",JSON.stringify(rightCandidate.index));
                    //console.log("Right adj",JSON.stringify(this.adjencyList[rightCandidate.index]));
                    this.adjencyList[rightCandidate.index].add(p.index);
                    this.adjencyList[p.index].add(rightCandidate.index);
                    //console.log("Moving q from:",q.index,"to :",rightCandidate.index);
                    q = rightCandidate;
                }else{
                    //console.log("No choices made");
                }
        
        }while((leftCandidate != null || rightCandidate != null));
        //console.log("Out of candidte");

        
        
        //let start = p;
        let start = this.pts[Math.min.apply(null,leftHull)];
        let runner = start;
        let seen = new Set();
        let hull = [];
        do{
            //console.log("Start is ",start.index);
            //console.log("At :",p.index);
            hull.push(runner.index);
            /*if(seen.has(runner.index)){
                break;
            }*/
            seen.add(runner.index);
            runner = this.pts[runner.cwnext];
        }while(runner != start);
        //console.log("New hull",hull);
        return hull;
    }

    crossProduct(p1,p2){
        // if p1*p2>0 then p1 is clockwise to p2 else anticlockwise
        return p1.x*p2.y - p2.x*p1.y;
    }
    
    computeClockwiseAngle(p1,p2,p3){
        //console.log("Computing angle between ",p1.index,p2.index,p3.index);
        let v1 = p1.substract(p2);
        let v2 = p3.substract(p2);
        let dot = v1.x*v2.x + v1.y*v2.y;
        let det = v1.x*v2.y - v1.y*v2.x;
        let angle = Math.atan2(det,dot);
        let degrees = angle*180/Math.PI
        //console.log(angle,angle*180/Math.PI);
        return degrees;
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
            this.adjencyList[start] = new Set();
            this.adjencyList[start+1] = new Set();
            this.adjencyList[start].add(start+1);
            this.adjencyList[start+1].add(start);
            //drawLine2Points(this.pts[start],this.pts[start+1]);
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
            this.adjencyList[start] = new Set();
            this.adjencyList[start+1] = new Set();
            this.adjencyList[start+2] = new Set();
            this.adjencyList[start].add(start+1);
            this.adjencyList[start].add(start+2);
            this.adjencyList[start+1].add(start);
            this.adjencyList[start+1].add(start+2);
            this.adjencyList[start+2].add(start);
            this.adjencyList[start+2].add(start+1);
            //drawTriangle(this.pts[start],this.pts[start+1],this.pts[start+2]);
        }else{
            console.log("Errorr : No init hull for dist: ",dist);
        }
        
        return hull;
    }

    findNextCandidate(side,p,q){

        let sortedArrayAdj = [];
        let candidate = null;
        let nextCanditate = null;
        
        if(side == "right"){
            sortedArrayAdj = this.createClockwisePoints(side,p,q);
            //console.log("Sorted array is ",sortedArrayAdj);
            if(sortedArrayAdj.length === 1){
                candidate = sortedArrayAdj[0];
                //console.log("Only one candidate returning",candidate[0].index)
                return candidate[0];
            }
            for(let i = 0;i<sortedArrayAdj.length-1;i++){
                candidate = sortedArrayAdj[i];
                nextCanditate = sortedArrayAdj[i+1];            
                if(!nextCanditate[0].inCircle(candidate[0],q,p)){
                    //nextCanditate is outside the circumcirlce candidate,p,q : candidate is our target
                    //console.log("nextCanditate ",nextCanditate[0].index," is OUTSIDE the circumcirlce : [",candidate[0].index,p.index,q.index,"] returning",candidate[0].index);
                    //console.log("return candidate[0]",JSON.stringify(candidate[0]));
                    return candidate[0];
                }
                //console.log("nextCanditate ",nextCanditate[0].index," is INSIDE the circumcirlce : [",candidate[0].index,p.index,q.index,"] skipping",candidate[0].index);
                //break link between current candidate and p
                //console.log("Deleting edges between",candidate[0].index,q.index);
                this.adjencyList[candidate[0].index].delete(q.index);
                this.adjencyList[q.index].delete(candidate[0].index);
            }
            //console.log("Reached end of for loop returning nextCandidate");
            if(nextCanditate){
                //console.log(nextCanditate[0].index);
                return nextCanditate[0];
            }
            return null;
        }else if(side == "left"){
            sortedArrayAdj = this.createClockwisePoints(side,p,q);
            //console.log("Sorted array is ",sortedArrayAdj);
            if(sortedArrayAdj.length === 1){
                candidate = sortedArrayAdj[0];
                //console.log("Only one candidate returning",candidate[0].index)
                return candidate[0];
            }
            for(let i = 0;i<sortedArrayAdj.length-1;i++){
                candidate = sortedArrayAdj[i];
                nextCanditate = sortedArrayAdj[i+1];                
                if(!nextCanditate[0].inCircle(candidate[0],q,p)){
                    //nextCanditate is outside the circumcirlce candidate,p,q : candidate is our target
                    //console.log("return candidate[0] ",JSON.stringify(candidate[0]));
                    //console.log("nextCanditate ",nextCanditate[0].index," is OUTSIDE the circumcirlce : [",candidate[0].index,p.index,q.index,"] returning",candidate[0].index);
                    return candidate[0];
                }
                //console.log("nextCanditate ",nextCanditate[0].index," is INSIDE the circumcirlce : [",candidate[0].index,p.index,q.index,"] skipping",candidate[0].index);
                //break link between current candite and q
                //console.log("Deleting edges between",candidate[0].index,p.index)
                this.adjencyList[candidate[0].index].delete(p.index);
                this.adjencyList[p.index].delete(candidate[0].index);
            }
            //console.log("Reached end of for loop returning nextCandidate");
            if(nextCanditate){
                //console.log(nextCanditate[0].index);
                return nextCanditate[0];
            }
            return null;

        }
    }

    createClockwisePoints(side,p,q){
        let sortedArrayAdj = [];
        if(side == "left"){
            //console.log("Looking for left canditate");
            //console.log("Adj is ",JSON.stringify(p),this.adjencyList[p.index]);
            for(let item of this.adjencyList[p.index].values()){
                let pt = this.pts[item];
                let angle = -this.computeClockwiseAngle(q,p,pt);
                if(angle>0 && angle<180){
                    sortedArrayAdj.push([pt,angle]);
                }
                //console.log("Angle was btween",q.index,p.index,pt.index,":",angle);
            }
        }else{
            //console.log("Looking for right canditate");
            //console.log("Adj is ",JSON.stringify(q),this.adjencyList[q.index]);
            for(let item of this.adjencyList[q.index].values()){
                let pt = this.pts[item];
                let angle = this.computeClockwiseAngle(p,q,pt);
                //console.log("Angle was btween",p.index,q.index,pt.index,":",angle);
                if(angle>0 && angle<180){
                    sortedArrayAdj.push([pt,angle]);
                }
            }
        }
        sortedArrayAdj.sort(function(a,b){return a[1]-b[1];});
        return sortedArrayAdj;

    }


};
