import Edge from "./Edge";
import Crossing from "./Crossing";
export default class Node {
    public crossing: Crossing;
    constructor(row: number, col: number, public neededEdges: number = 0) {
        this.crossing = new Crossing(row,col);
        this.neededEdges = neededEdges;
    }
    getEdges(edges: Edge[]){
        let foundEdges = new Array();
        for(let edge of edges){
            if(edge.node1 === this || edge.node2 === this){
                foundEdges.push(edge);
            }
        }
        return foundEdges;
    }
    edgeCount(edges: Edge[]){
        return this.getEdges(edges).length;
    }
    get row(){ //shorthand
        return this.crossing.row;
    }
    get col(){ //shorthand
        return this.crossing.col;
    }
    equals(otherNode: Node){
        return this.row === otherNode.row && this.col == otherNode.col;
    }
    
}