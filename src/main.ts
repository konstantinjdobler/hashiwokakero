import Node from "./Node"
import Edge from "./Edge"
import Crossing from "./Crossing"
import GUI from "./GUIHandler"
import ColorScheme from "./ColorScheme"
import randomBoard from "./BoardGenerator"
import {rndIntBetween} from "./randomUtils"

class Game{
    public nodes: Node[]
    public edges: Edge[];
    public gui: GUI;
    public colorSchemes: ColorScheme[];
    public solution: Edge[];
    public over: boolean = false;
    public messageTimer;
    constructor(){
        let boardSettings = {
            rows:  5,
            cols: 15,
            gridLineWidth: 1,
            spacing: 60,
            nodeRadius: 20,
            edgeWidth: 3
        };
        let  html = {
            body: <HTMLBodyElement>document.getElementById("body"),
            messageBox: <HTMLDivElement>document.getElementById("messagebox"),
            boardContainer: <HTMLDivElement>document.getElementById("playboard-container"),
            buttonBox: <HTMLDivElement>document.getElementById("buttonbox"),
            canvas: <HTMLCanvasElement>document.getElementById("playboard")
        };
        html.canvas.addEventListener("click", this.handleClick.bind(this));
        html.buttonBox.children[0].addEventListener("click", this.nextColorScheme.bind(this));
        html.buttonBox.children[1].addEventListener("click", this.toggleGrid.bind(this));
        html.buttonBox.children[2].addEventListener("click", this.showSolution.bind(this));
        html.buttonBox.children[3].addEventListener("click", this.newRandomBoard.bind(this,"easy"));
        html.buttonBox.children[4].addEventListener("click", this.newRandomBoard.bind(this, "medium"));
        html.buttonBox.children[5].addEventListener("click", this.newRandomBoard.bind(this, "hard"));
        
        this.nodes = new Array();
        this.edges = new Array();
        this.colorSchemes = ColorScheme.getAll();
        this.gui = new GUI(html, boardSettings, this.colorSchemes[0]);
        
        
    }
    

    // -------- functions --------
    newRandomBoard(difficulty: string = "easy"){
        if(difficulty === "easy"){
            this.gui.boardSettings.rows = rndIntBetween(5,7);
            this.gui.boardSettings.cols = rndIntBetween(7,12);
        }else if(difficulty === "medium"){
            this.gui.boardSettings.rows = rndIntBetween(5,8);
            this.gui.boardSettings.cols = rndIntBetween(9,14);
        }else{
            this.gui.boardSettings.rows = rndIntBetween(5,10);
            this.gui.boardSettings.cols = rndIntBetween(10,15);
        }
        
        let newBoard = randomBoard(this.gui.boardSettings.rows,this.gui.boardSettings.cols, difficulty);
        this.nodes = newBoard.nodes;
        this.edges = [];
        this.solution = newBoard.solution;
        this.gui.activeNode = null;
        clearTimeout(this.messageTimer);
        setTimeout(() => {this.gui.message.textContent = ""}, 5000);
        this.gui.message.textContent = "Good luck with your new game!";
        this.over = false;
        this.gui.updateBoardSize();
        this.gui.drawBoard(game.nodes, game.edges);
    }
    showSolution(){
        this.edges = this.solution;
        this.over = true;
        game.gui.drawBoard(this.nodes, this.edges);
        clearTimeout(this.messageTimer);
        this.gui.message.textContent = "Given up already? Try another one, you can do it!"
    }
    toggleGrid(){
        this.gui.showGrid = !this.gui.showGrid;
        this.gui.drawBoard(this.nodes,this.edges, this.gui.activeNode);
    }
    gameWon(){
        this.over = true;
        clearTimeout(this.messageTimer);
        this.gui.message.textContent = "Congratulations, you did it! Time for another one?"
    }
    checkGameState(){
        if(haveAllNodesCorrectEdgeCount.bind(this)() && areAllNodesConnected.bind(this)()){
            this.gameWon();
        }

        function haveAllNodesCorrectEdgeCount(){
            return this.nodes.every(node => node.edgeCount(this.edges) === node.neededEdges);
        }

        function areAllNodesConnected(){
            //use depth fist search to walk through the graph
            //save all visited nodes into array
            //after the search check if the "visited" array has as many member as we have nodes

            var visited: Node[] = new Array();
            depthFirstSearch.bind(this)(this.nodes[0]);
            return visited.length === this.nodes.length;

            function depthFirstSearch(node: Node){ 
                if(visited.includes(node)){
                    return;
                }
                visited.push(node);
                for (let edge of node.getEdges(this.edges)){
                    if(!visited.includes(edge.getOtherNode(node))){ 
                        depthFirstSearch.bind(this)(edge.getOtherNode(node));
                    }
                }

            }
        }
    }
    nextColorScheme(){
        let curSchemeIndex = this.colorSchemes.indexOf(this.gui.colorScheme);
        this.gui.setColorScheme(this.colorSchemes[(curSchemeIndex+1)%this.colorSchemes.length]);
        this.gui.drawBoard(this.nodes, this.edges, this.gui.activeNode);
    }

    handleClick(event: any){
        if(this.over) return;
        let result = this.gui.processClick(event, this.nodes);
        if (result.inputNodesForEdge !== null) {
            let nodesToCheckForEdge = result.inputNodesForEdge;
            try {
                if (this.isValidEdge(nodesToCheckForEdge[0], nodesToCheckForEdge[1])) { //valid start and end point, create and add edge	
                    let egdeToAdd = new Edge(nodesToCheckForEdge[0], nodesToCheckForEdge[1], this.edges);
                    this.edges.push(egdeToAdd);
                }
            } catch (error) {
                if (error.type === "EdgeNotValid") { //start and endpoint not valid for edge
                    handleCustomError.bind(this)(error);
                } else {
                    throw error; //do not catch errors but EdgeNotValid
                }
            }
        }
        this.gui.drawBoard(this.nodes, this.edges, result.activeNode);
        this.checkGameState();

        //----------- functions -------------

        function handleCustomError(error: any) {
            clearTimeout(this.messageTimer);
            switch (error.message) { //display customized error message for user
                case "EdgeInPath":
                    this.gui.message.textContent ="Edges are not allowed to cross other Edges.";
                    break;
                case "NodeInPath":
                    this.gui.message.textContent = "Edges are not allowed to go over Nodes.";
                    break;
                case "DiagonalEdge":
                    this.gui.message.textContent = "Edges are not allowed to be diagonal.";
                    break;
                //TooManyEdgesOnNode is not thrown anymore, so the user hase a chance to correct
                //bad edges from nodes which already have the number of edges they need
                /*case "TooManyEdgesOnNode":
                    this.gui.message.textContent = "One of the Nodes you selected is not allowed to have more Edges";
                    this.edges = this.edges.filter(edge => !Edge.areEquivalent(edge, error.edge));  
                    break;*/
                case "TooManyEdgesBetweenNodes":
                    this.gui.message.textContent = "You cannot have more than two Edges between Nodes.";
                    
                    // delete the double egde where the user tried to place three edges between nodes
                    this.edges = this.edges.filter(edge => !Edge.areEquivalent(edge, error.edge)); 
                    break;
                default:
                    console.log("Unhandled EdgeNotValid Error"); //shouldnt happen (and doesnt)
                    break;
            }
            this.messageTimer = setTimeout(() => { this.gui.message.textContent = ""}, 5000); //hide error message after 5 seconds
        }
    }
    isValidEdge(fromNode: Node, toNode: Node) {
        let newEdge = new Edge(fromNode, toNode, this.edges);
        if (newEdge.otherEquivalentEdgesCount(this.edges) >= 2) { //third equivalent edge but only two allowed
            throw { type: "EdgeNotValid", message: "TooManyEdgesBetweenNodes", edge: newEdge };
        }

        if (!(fromNode.row === toNode.row) && !(fromNode.col === toNode.col)) { //edge is diagonal
            throw { type: "EdgeNotValid", message: "DiagonalEdge" };
        }
        //do not throw TooManyEdgesOnNode so the user has a chance to exceed the edge limit in order to correct his input
        /*if (fromNode.edgeCount(this.edges) === fromNode.neededEdges || toNode.edgeCount(this.edges) === toNode.neededEdges) {
            throw { type: "EdgeNotValid", message: "TooManyEdgesOnNode", edge: newEdge};
        }*/
        for (const node of this.nodes) { //check if edge goes over other node
            for (const crossing of newEdge.occupies) {
                if (crossing.row === node.row && crossing.col === node.col) {
                    throw { type: "EdgeNotValid", message: "NodeInPath" };
                }
            }
        }
        for (let oldEdge of this.edges) { //check if edge crosses other edge
            if (Edge.areEquivalent(oldEdge, newEdge)) { //already checked if we already had 2 edges between the nodes, so if we have valid equivalent edge, this one is valid too
                return true;
            }
            for (let newEdgeCrossing of newEdge.occupies) { //for every crossing newEdge occupies, check if oldEdge occupies it --> throw error
                if (oldEdge.occupies.some(function (oldEdgeCrossing: any) {
                    return oldEdgeCrossing.equals(newEdgeCrossing);
                })) {
                    throw { type: "EdgeNotValid", message: "EdgeInPath" };
                }
            }
        }
        return true;
    }
    
}


// ------ final call to start the game -------

let game = new Game();
game.newRandomBoard();
//your example board ;) if you REALLY want to have a predefined board 
//instead of the random one, comment out the line above and uncomment out the lines below
/*game.nodes.push(new Node(0,0,2), new Node(0,2,3), new Node(0,5,3), new Node(0,12,6), new Node(0,14,3),
                    new Node(1,1,2), new Node(1,9,4), new Node(1,11,3),
                    new Node(2,2,3), new Node(2,6,2), new Node(2,12,2),
                    new Node(3,1,3), new Node(3,5,2), new Node(3,7,2), new Node(3,9,3),
                    new Node(4,0,1), new Node(4,2,1), new Node(4,11,4), new Node(4,14,3));*/






