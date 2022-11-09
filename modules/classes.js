class Point{

    index = null;
    speedX = 0;
    speedY = 0;

    constructor(x,y,pts){
        this.x = x;
        this.y = y;
    }

    updateThrustPoint(){
        let newSpeedX = clampValue(this.speedX+(Math.random()-0.5)*acceleration,-maxSpeed,maxSpeed);
        let newSpeedY = clampValue(this.speedY+(Math.random()-0.5)*acceleration,-maxSpeed,maxSpeed);
        this.speedX = newSpeedX;
        this.speedY = newSpeedY;
    }

    substract(p){
        let newP = new Point(this.x-p.x,this.y-p.y);
        return newP;
    }

    
    inCircle(a,b,c){
        //!!! inCircle works when a,b,c are in clocwise order !!!
        //console.log("Points are",JSON.stringify(a),JSON.stringify(b),JSON.stringify(c),JSON.stringify(this));
        let ax_ = a.x-this.x;
        let ay_ = a.y-this.y;
        let bx_ = b.x-this.x;
        let by_ = b.y-this.y;
        let cx_ = c.x-this.x;
        let cy_ = c.y-this.y;
        return (
            (ax_*ax_ + ay_*ay_) * (bx_*cy_-cx_*by_) -
            (bx_*bx_ + by_*by_) * (ax_*cy_-cx_*ay_) +
            (cx_*cx_ + cy_*cy_) * (ax_*by_-bx_*ay_)
        ) > 0;
    }
};
