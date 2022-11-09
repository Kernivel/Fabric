class Delaunay{
    pts = null;
    adjencyList = {};
    hull = null;

    delaunization(pts){
        let objDelaun = new Delaunay();
        objDelaun.pts = pts;
        objDelaun.hull = [];
        if(pts.length == 2 || pts.length == 3){
            objDelaun.initHull();
            return objDelaun;
        }else{
            let mid = Math.ceil(objDelaun.pts.length/2);
            let delaunLeft = this.delaunization(objDelaun.pts.slice(0,mid));
            let delaunRight = this.delaunization(objDelaun.pts.slice(mid,objDelaun.pts.length));
            //console.log("Merging left,right",hullLeft,hullRight);
            objDelaun.mergeDelaun(delaunLeft,delaunRight);
            //console.log("New merged hull",hull);
            return objDelaun;
        }
    };


    mergeHulls(delaunLeft,delaunRight){
        let pIndex = delaunLeft.hull.indexOf(Math.max(delaunLeft.hull));
        let qIndex = delaunRight.hull.indexOf(Math.min(delaunRight.hull));
        let cpPIndex = pIndex;
        let cpQIndex = qIndex;

        pIndex,pIndex = this.lowerBridge(delaunLeft,delaunRight,pIndex,qIndex);
        cpPIndex,cpQIndex = this.upBridge(delaunLeft,delaunRight,cpPIndex,cpQIndex);

        console.log("Base LR edge (P to Q) is now : [",pIndex," : ",qIndex,"]");
        console.log("Top LR edge (cpP to cpQ) is now : [",cpPIndex," : ",cpQIndex,"]");

        delaunLeft.adjencyList[delaunLeft.hull[pIndex]].add(delaunRight.hull[qIndex]);
        delaunRight.adjencyList[delaunRight.hull[qIndex]].add(delaunLeft.hull[pIndex]);

        
        let leftCandidate = null;
        let rightCandidate = null;

        console.log("----- LOOKING FOR CANDIDATES ---------");
        do{
            if(p == cpP && q == cpQ){
                break;
            }
            leftCandidate = this.findNextCandidate("left",p,q);
            rightCandidate = this.findNextCandidate("right",p,q);
            if(leftCandidate != null && rightCandidate != null){
                console.log("Case : Two candidates");
                console.log("Left candidate : ",JSON.stringify(leftCandidate.index),"Right canditdate : ",JSON.stringify(rightCandidate.index) );
                if(!leftCandidate.inCircle(p,rightCandidate,q)){
                    console.log("Right candidate ",rightCandidate.index," is the correct one");
                    //console.log("Left candidate : ",leftCandidate.index," isn't in circumcircle :",p.index,rightCandidate.index,q.index);
                    this.adjencyList[rightCandidate.index].add(p.index);
                    this.adjencyList[p.index].add(rightCandidate.index);

                    console.log("Moving q from : ",q.index," to : ",rightCandidate.index);
                    q = rightCandidate;
                }else{
                    console.log("Left candidate ",leftCandidate.index," is the correct one");
                    //console.log("Right candidate : ",rightCandidate.index,"isn't in circumcircle :",p.index,leftCandidate.index,q.index);
                    this.adjencyList[leftCandidate.index].add(q.index);
                    this.adjencyList[q.index].add(leftCandidate.index);
                    console.log("Moving p from : ",p.index," to : ",leftCandidate.index);
                    p = leftCandidate;

                }
            }else if(leftCandidate != null){
                console.log("Case : no right candidate");
                console.log("Left cand",JSON.stringify(leftCandidate.index));
                //console.log("Left adj",JSON.stringify(this.adjencyList[leftCandidate.index]));
                this.adjencyList[leftCandidate.index].add(q.index);
                this.adjencyList[q.index].add(leftCandidate.index);
                //console.log("Moving p from:",p.index,"to :",leftCandidate.index);
                p = leftCandidate;
            }else if(rightCandidate != null){
                console.log("Case : no left candidate");
                console.log("Right cand",JSON.stringify(rightCandidate.index));
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

        
        let start = p;
        //let start = this.pts[Math.min.apply(null,leftHull)];
        let runner = start;
        let seen = new Set();
        let hull = [];
        console.log("Follwing the hull starting at : ",start.index);
        
        do{
            
            console.log("At : ",runner.index);
            console.log("Next is : ", runner.cwnext);
            if(seen.has(runner.index)){
                break;
            }
            hull.push(runner.index);
            seen.add(runner.index);
            runner = this.pts[runner.cwnext];
        }while(runner != start);
        console.log("----- Resulting hull -----",JSON.stringify(hull));
        for(let i = 0;i<hull.length;i++){
            console.log(hull[i]," is connected to cw ",this.pts[hull[i]].cwnext," and ccw",this.pts[hull[i]].ccwnext);
        }
        drawHull(this,hull);
        return hull;
    }

    lowerBridge(delaunLeft,delaunRight,pIndex,qIndex){
        console.log("---- Lowering bridge ----");
        let prevPIndex = null;
        let prevQIndex = null;
        while(true){
            prevPIndex = pIndex;
            let cwPIndex = pIndex+1>=delaunLeft.hull.length? 0 : pIndex+1;
            let shiftP = this.direction(delaunLeft.pts[pIndex],delaunRight[qIndex],delaunLeft.pts[cwPIndex]);
            while(shiftP<0){
                pIndex = cwPIndex;
            }

            prevQIndex = qIndex;
            let ccwQIndex = qIndex-1<0? delaunLeft.hull.length-1 : qIndex-1;
            let shiftQ = this.direction(delaunLeft.pts[qIndex],delaunRight[pIndex],delaunLeft.pts[ccwQIndex]);
            while(shiftQ>0){
                qIndex = ccwQIndex;
            }
            
            if(pIndex == prevPIndex && qIndex == prevQIndex){
                break;
            }
        }

    }

    upBridge(delaunLeft,delaunRight,pIndex,qIndex){
        console.log("---- Upping bridge ----");
        let prevPIndex = null;
        let prevQIndex = null;
        while(true){
            prevPIndex = pIndex;
            let ccwPIndex = pIndex-1<0? delaunLeft.hull.length-1 : pIndex-1;
            let shiftP = this.direction(delaunLeft.pts[pIndex],delaunRight[qIndex],delaunLeft.pts[ccwPIndex]);
            while(shiftP<0){
                pIndex = ccwPIndex;
            }

            prevQIndex = qIndex;
            let cwQIndex = qIndex+1<delaunLeft.hull.length? 0 : qIndex+1;
            let shiftQ = this.direction(delaunLeft.pts[qIndex],delaunRight[pIndex],delaunLeft.pts[nextQIndex]);
            while(shiftQ>0){
                qIndex = cwQIndex;
            }
            
            if(pIndex == prevPIndex && qIndex == prevQIndex){
                break;
            }
        }
        return {pIndex,qIndex}
    }

    


    
    initHull(){
        let hull = [];
        if(this.pts.length == 2){
            this.adjencyList[start] = new Set();
            this.adjencyList[start+1] = new Set();
            this.adjencyList[start].add(start+1);
            this.adjencyList[start+1].add(start);
            for(let i = 0;i<this.pts.length;i++){
                hull.push(this.pts[i].index);
            }
        }else if(this.pts.length  == 3){
            hull.push(this.pts[0].index);
            if (this.direction(this.pts[0],this.pts[1],this.pts[2])<=0){
                hull.push(this.pts[1].index);
                hull.push(this.pts[2].index);
            }else{
                hull.push(this.pts[2].index);
                hull.push(this.pts[1].index);
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
        }
    }

    findNextCandidate(side,p,q){
        console.log("Candidate search on the",side," starting from base edge [",p.index,":",q.index,"]");
        let sortedArrayAdj = [];
        let candidate = null;
        let nextCanditate = null;
        
        if(side == "right"){
            sortedArrayAdj = this.createClockwisePoints(side,p,q);
            console.log("Clockwise points from q (right) are ",JSON.stringify(sortedArrayAdj));
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
                console.log("Deleting edges between",candidate[0].index,q.index);
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
            console.log("Clockwise points from p (left) are ",JSON.stringify(sortedArrayAdj));
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
                console.log("Deleting edges between",candidate[0].index,p.index)
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
        console.log("Creating candidate list for left p : ",p.index," base edge is [",p.index,":",q.index,"]");
            for(let item of this.adjencyList[p.index].values()){
                
                let pt = this.pts[item];
                let angle = -this.computeClockwiseAngle(q,p,pt);
                console.log("Pt : ",pt.index,"has an angle of :", angle);
                if(angle>0 && angle<180){
                    sortedArrayAdj.push([pt,angle]);
                }
            }
        }else{

            console.log("Creating candidate list for right q : ",q.index," base edge is [",p.index,":",q.index,"]");
            for(let item of this.adjencyList[q.index].values()){
                let pt = this.pts[item];
                let angle = this.computeClockwiseAngle(p,q,pt);
                console.log("Pt : ",pt.index,"has an angle of",angle);
                if(angle>0 && angle<180){
                    sortedArrayAdj.push([pt,angle]);
                }
            }
        }
        sortedArrayAdj.sort(function(a,b){return a[1]-b[1];});
        return sortedArrayAdj;

    }


    
    /** ---------------------------------------------------------------------------------------------
     *                                 FUNCTIONS TO MOVE THE POINTS AROUND  
     -----------------------------------------------------------------------------------------------*/

    updateThrustPts(){
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].updateThrustPoint();
        }
    }


    movePointsThrustOffset(){
        for(let i = 0;i<this.pts.length;i++){
            if(this.pts[i].x<10){
                this.pts[i].thrustX = maxSpeed;
            }else if(this.pts[i].x>canvas.width-10){
                this.pts[i].thrustX = -maxSpeed;
            }
            if(this.pts[i].y<10){
                this.pts[i].thrustY = maxSpeed;
            }else if(this.pts[i].y>canvas.height-10){
                this.pts[i].thrustY = -maxSpeed;
            }

            if(this.pts[i].x <= 0 || this.pts[i].x >= canvas.width || this.pts[i].y <= 0 || this.pts[i].y >= canvas.height){
                this.pts[i].thrustX = 0;
                this.pts[i].thrustY = 0;
            }

            this.pts[i].x += this.pts[i].thrustX;
            
            this.pts[i].y += this.pts[i].thrustY;
        }
        this.pts.sort(function(a,b){if(a.x === b.x)return a.y-b.y;
            return a.x-b.x});
        for(let i = 0;i<this.pts.length;i++){
            this.pts[i].index = i;
            ctx.fillText(i,this.pts[i].x,this.pts[i].y);
        }
    }

    /** ---------------------------------------------------------------------------------------------
     *                                          BASIC FUNCTIONS
     -----------------------------------------------------------------------------------------------*/

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
        return degrees;
    }
    
    direction(p1,p2,p3){
        return this.crossProduct(p3.substract(p1),p2.substract(p1));
    }

};
