var allTriangles = new Trie();

function mainDebug(nbPoints){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts = [];
    
    for (let i = 0;i<nbPoints;i++){
        x = Math.random()*canvas.width;
        y = Math.random()*canvas.height;
        arrSize = pts.push([x,y]);
    }
    
    triangle = [pts[0],pts[1],pts[2]];
    console.log("Pre insert",triangle);
    drawTriangle(pts[0],pts[1],pts[2]);
    allTriangles.root[triangle] = new Trie();
    for(let i = 3;i<nbPoints;i++){
        allTriangles.insert(pts[i]);
    }

}