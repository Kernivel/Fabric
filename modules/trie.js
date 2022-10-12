class Trie{
    constructor(){
        this.root = {};
        /*[A,B,C]->[[A,B,P],[P,B,C],[A,C,P]]
        A,B,C and P are points defined by their [x,y] coordinates*/
    }

    insert(p){
        let node = this.root;
        let insertFlag = true;
        let smallest = null;
        while(insertFlag){
            let a;
            let b;
            let c;
            [a,b,c] = triangle;
            for (triangle in node){
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
            let a;
            let b;
            let c;
            [a,b,c] = triangle;
            let side = [];
            let min = Number.MAX_SAFE_INTEGER;
            for (triangle in this.root){
                console.log(triangle);
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
            console.log(side[0],side[1],p);
            this.root[triangle] = new Trie();
            drawTriangle(side[0],side[1],p);
        }else{
            //Insert p in the smallest triangle that has p inside it
            let t1 = [p,b,c];
            let t2 = [a,p,c];
            let t3 = [a,b,p];
            smallest[t1] = new Trie();
            smallest[t2] = new Trie();
            smallest[t3] = new Trie();
            drawTriangle(p,b,c);
            drawTriangle(a,p,c);
            drawTriangle(a,b,p);
        }

    }

}