class Trie{
    constructor(){
        this.root = {};
        /*[A,B,C]->[[A,B,P],[P,B,C],[A,C,P]]
        A,B,C and P are points defined by their [x,y] coordinates*/
    }

    insert(p){
        var node = this;
        let insertFlag = true;
        let smallest = null;
        while(insertFlag){
            for (triangle in node){
                triangle = triangle.split(',').map(Number);
                let a = triangle.slice(0,2);
                let b = triangle.slice(2,4);
                let c = triangle.slice(4,6);
                if(insideTriangle(a,b,c,p)){
                    smallest = triangle;
                    node = node[triangle];
                    break;
                }
            }
            insertFlag = false;
        }
        //insert step
        
        if(smallest == null){
            //Create a new "biggest" triangle at root with p as a vertice and the 2 points of the closest plane
            console.log("new biggest triangle");
            let side = [];
            let min = Number.MAX_SAFE_INTEGER;
            for (triangle in this.root)
            {
                triangle = triangle.split(',').map(Number);
                let a = triangle.slice(0,2);
                let b = triangle.slice(2,4);
                let c = triangle.slice(4,6);
                if(Math.abs(getSidePlane(p,a,b))<min){
                    min = Math.abs(getSidePlane(p,a,b));
                    side = [a,b];
                }
                if(Math.abs(getSidePlane(p,a,c))<min){
                    min = Math.abs(getSidePlane(p,a,c));
                    side = [a,c];
                }
                if(Math.abs(getSidePlane(p,b,c))<min){
                    min = Math.abs(getSidePlane(p,b,c));
                    side = [b,c];
                }
            }
            triangle = [side[0],side[1],p];
            console.log("Sides are :",side[0],side[1],p);
            allTriangles.root[triangle] = new Trie();
            console.log("Root is now",this.root);
            drawTriangle(side[0],side[1],p);
        }else{
            //Insert p in the smallest triangle that has p inside it
            console.log("insert in triangle",a,b,c);
            let t1 = [p,b,c];
            let t2 = [a,p,c];
            let t3 = [a,b,p];
            node.root[t1] = new Trie();
            node.root[t2] = new Trie();
            node.root[t3] = new Trie();
            //node.root
            //drawTriangle(p,b,c);
            //drawTriangle(a,p,c);
            //drawTriangle(a,b,p);
        }

    }

}