import Node from "./Node"
import Edge from "./Edge"
import Crossing from "./Crossing"
import {rndIntBetween, randomChoice} from "./randomUtils"


export default function randomBoard(rows: number, cols: number, difficulty: string = "easy"){
    var directions = {
        up: {row: -1, col: 0},
        down: {row: 1, col: 0},
        right: {row: 0, col: 1},
        left: {row: 0, col: -1}
    }
    switch(difficulty){
        case "easy": var diffScaler = 1; break;
        case "medium": var diffScaler = 2; break;
        case "hard": var diffScaler = 3; break;
    }
    let nodes: Node[] = new Array();
    let edges: Edge[] = new Array();
    let startNode = new Node(rndIntBetween(0,rows), rndIntBetween(0,cols));
    nodes.push(startNode);
    //second parameter specifies the number of nodes on the board
    //we place more nodes when difficulty is harder
    fillBoardFrom(startNode, rows*cols/(5-diffScaler)); 
    for(let node of nodes){
        node.neededEdges = node.edgeCount(edges);
    }
    return {nodes: nodes, solution: edges};
    

    // ----------------- helper functions -----------------

    function fillBoardFrom(fromNode: Node, cutoff: number){
        if(nodes.length >= cutoff){
            return;
        }
        let posDirections = getPossibleDirectionsForNode(fromNode);
        if(posDirections.length === 0) return fillBoardFrom(randomChoice(nodes), cutoff);
        let chosen = randomChoice(posDirections);
        let result = edgeWalker(new Crossing(fromNode.crossing.row + chosen.row, fromNode.crossing.col + chosen.col), chosen);
        let newNode = new Node(result.crossing.row, result.crossing.col);
        switch(result.flag){
            case "WalkedOnNode": 
                edges.push(new Edge(fromNode, result.node, edges)); 
                if(Math.random() <= 0.5){ //chance for double edge
                    edges.push(new Edge(fromNode, result.node, edges));
                }
                break;
            case "WalkedOnEdge": //place node on edge(s), remove the old edge(s) and add new ones
                var edgesToReplace = new Array(result.edge);
                if(result.edge.isDoubleEdge(edges)){ // walked on double edge so we have to replace both
                    edgesToReplace.push(result.edge.getEquivalentEdge(edges));
                }
                for(let edgeToReplace of edgesToReplace){
                    edges = edges.filter(edge => edge != edgeToReplace); 
                    edges.push(new Edge(result.edge.node1, newNode, edges));
                    edges.push(new Edge(newNode, result.edge.node2, edges));
                }       
                edges.push(new Edge(fromNode, newNode, edges));
                nodes.push(newNode);
                break;
            case "CreateNewNode": 
                nodes.push(newNode);
                edges.push(new Edge(fromNode, newNode, edges));
                if(Math.random() <= 0.5){ //chance for double edge
                    edges.push(new Edge(fromNode, newNode, edges));
                }
                break;                
        }
        return fillBoardFrom(randomChoice(nodes), cutoff);
    }
    function edgeWalker(crossing: Crossing, direction: any): any{
        while (true) {
            for(let oldEdge of edges){
                if(oldEdge.occupies.some(oldEdgeCrossing => oldEdgeCrossing.equals(crossing))){ // walked into edge
                    return {crossing: crossing, flag: "WalkedOnEdge", edge: oldEdge}; // place node on edge
                }
            }
            for(let node1 of nodes){
                if(node1.crossing.equals(crossing)){ // walked into node
                    return {crossing: crossing, flag: "WalkedOnNode", node: node1}; //new Crossing(crossing.row - direction.row, crossing.col - direction.col); // place the node one step back
                }
            }
            if(crossing.row + direction.row > rows - 1 || crossing.row + direction.row < 0 
                || crossing.col + direction.col > cols - 1 || crossing.col + direction.col < 0){
                return {crossing: crossing, flag:"CreateNewNode"};

            }
            if(Math.random() <= 0.5){ //chnace to create node
                return {crossing: crossing, flag: "CreateNewNode"};
            }
            crossing.moveIn(direction); 
        }
                
    }
    function getPossibleDirectionsForNode(node: Node){
        let invalid = new Array();
        let allDirections = [directions.up, directions.down, directions.left, directions.right];
        let crossing = node.crossing;
        if(crossing.col <= 0){
            invalid.push(directions.left);
        }
        if(crossing.row <= 0){
            invalid.push(directions.up);
        }
        if(crossing.col >= cols-1){
            invalid.push(directions.right);
        }
        if(crossing.row >= rows-1){
            invalid.push(directions.down);
        }
        for(let d of allDirections){
            for(let edge of edges){
                if(edge.doesOccupy(new Crossing(crossing.row + d.row, crossing.col + d.col))){
                    invalid.push(d);
                }
            }
            for(let node of nodes){
                if(node.crossing.equals(new Crossing(crossing.row + d.row, crossing.col + d.col))){
                    invalid.push(d);
                }
            }
        }
        
        
        return allDirections.filter(ele => !invalid.includes(ele));
    }
    
}


