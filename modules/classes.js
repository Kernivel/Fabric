class Point{
    cwnext = null;
    ccwnext = null;
    index = null;
    thrustX = 0;
    thrustY = 0;

    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    updateThrustPoint(){
        let newThrustX = clampValue((this.thrustX+Math.random()-0.5),-5,5);
        let newThrustY = clampValue((this.thrustY+Math.random()-0.5),-5,5);
        this.thrustX = newThrustX;
        this.thrustY = newThrustY;
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

class DoubleCyclingLinkedList{
    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.left = null;
        this.right = null;
    }
    insert(value){
        let newNode = new Node(value);
        this.length += 1;
        if(this.tail){
            newNode.prev = this.tail;
            newNode.next = this.head;
            this.tail.next = newNode;
            this.tail = this.tail.next;
            if(pts[value].x>pts[this.right].x){
                this.right = newNode;
            }else if(pts[value].x<val[this.left].x){
                this.left = newNode;
            }
            return newNode;
        }
        this.head = this.tail = newNode;
        this.left = newNode;
        this.right = newNode;
        newNode.next = this.head;
        newNode.prev = this.head;
        return newNode;
    }
}

class Node{
    constructor(value){
        this.val = value;
        this.next = null;
        this.prev = null;
    }
};