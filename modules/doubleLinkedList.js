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
            if(value[0]>this.right.val[0]){
                this.right = newNode;
            }else if(value[0]<this.left.val[0]){
                this.left = newNode;
            }
            return newNode;
        }
        this.head = this.tail = newNode;
        this.left = newNode;
        this.right = newNode;
        newNode.next = this.head;
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