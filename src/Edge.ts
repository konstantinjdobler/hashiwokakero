import Node from "./Node"
import Crossing from "./Crossing"

export default class Edge {
    equivalentEdgeOrdering: number;
    occupies: Crossing[];
    constructor(public node1: Node, public node2: Node, allEdges: Edge[] = [], mode: string = null) {

        this.equivalentEdgeOrdering = this.otherEquivalentEdgesCount(allEdges) + 1;
        this.occupies = this.calculateOccupiedCrossings();
    }
    otherEquivalentEdgesCount(edges: Edge[]) {
        var number = 0;

        for (let edge of edges) {
            if (Edge.areEquivalent(edge, this) && edge != this) { //equivalent edge but not same
                number += 1;
            }
        }
        return number;
    }
    isDoubleEdge(edges: Edge[]) {
        let isDoubleEdge = false;

        for (let edge of edges) {
            if (Edge.areEquivalent(edge, this) && edge != this) { //equivalent edge but not same
                isDoubleEdge = true;
            }
        }
        return isDoubleEdge;
    }
    doesOccupy(crossing: Crossing){
        for(let c of this.occupies){
            if(c.equals(crossing)){
                return true;
            }
        }
        return false;
    }
    getEquivalentEdge(edges: Edge[]){
        for(let edge of edges){
            if(Edge.areEquivalent(edge, this) && edge != this){
                return edge;
            }
        }
        throw "NoEquivalentEdgeFound";
    }
    calculateOccupiedCrossings() {
        var occupied: Crossing[] = [];
        var fromNode = this.node1;
        var toNode = this.node2;
        if (fromNode.col === toNode.col) { //edge moves vertically
            for (let row = Math.min(fromNode.row, toNode.row) + 1; row < Math.max(fromNode.row, toNode.row); row++) {
                occupied.push(new Crossing(row, fromNode.col));
            }
        } else if (fromNode.row === toNode.row) { //edge moves horizontally
            for (let col = Math.min(fromNode.col, toNode.col) + 1; col < Math.max(fromNode.col, toNode.col); col++) {
                occupied.push(new Crossing(fromNode.row, col));
            }
        }
        return occupied;
    }
    getOtherNode(node: Node){
        if(node.equals(this.node1)){
            return this.node2;
        }else if(node.equals(this.node2)){
            return this.node1;
        }else{
            throw "Given Node not in Edge";
        }
    }
    
    static areEquivalent(edge1: Edge, edge2: Edge) {
        if ((edge1.node1 === edge2.node1 && edge1.node2 === edge2.node2) ||
            (edge1.node2 === edge2.node1 && edge1.node1 === edge2.node2)) {
            return true;
        } else {
            return false;
        }
    }
}
