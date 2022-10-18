class Point{
    cwnext = null;
    ccwnext = null;
    index = null;
    
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    substract(a,b){
        let newPoint = new Point(a.x-b.x,a.y-b.y);
        return newPoint;
    }
}

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
}