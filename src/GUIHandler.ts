import Node from "./Node"
import Edge from "./Edge"
import ColorScheme from "./ColorScheme"


export default class GUIHandler {
    activeNode: Node | null = null;
    context: CanvasRenderingContext2D;
    message: HTMLParagraphElement;
    public showGrid: boolean = false;
    constructor(private html: {body: HTMLBodyElement, messageBox: HTMLDivElement, boardContainer: HTMLDivElement, buttonBox: HTMLDivElement, canvas:HTMLCanvasElement},
                public boardSettings: {rows: number, cols: number, gridLineWidth: number, spacing: number, nodeRadius: number, edgeWidth: number}, 
                public colorScheme: ColorScheme){ 
        
        this.message = <HTMLParagraphElement>this.html.messageBox.children[1];
        this.context = this.html.canvas.getContext("2d");
        this.updateBoardSize();
        this.setColorScheme(colorScheme);		
    }
    updateBoardSize(){
        this.html.canvas.height = (this.boardSettings.rows + 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth;
        this.html.canvas.width = (this.boardSettings.cols + 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth;

        this.html.boardContainer.style.width = this.html.canvas.width + "px";
        this.html.boardContainer.style.height = this.html.canvas.height + "px";
    }
    
    setColorScheme(colorScheme: ColorScheme) {
        this.colorScheme = colorScheme;

        this.html.body.style.backgroundColor = colorScheme.backgroundColor;

        this.html.messageBox.style.backgroundColor = colorScheme.accentColor;
        this.html.messageBox.style.borderColor = colorScheme.accentColor2;
        this.html.messageBox.style.color = colorScheme.backgroundColor; //font color

        this.html.boardContainer.style.borderColor = colorScheme.accentColor;

        this.html.buttonBox.style.backgroundColor = colorScheme.accentColor;
        this.html.buttonBox.style.borderColor = colorScheme.accentColor2;

        for (let i = 0; i < this.html.buttonBox.children.length; i++) {
            var temp = <HTMLButtonElement>(this.html.buttonBox.children[i]);
            temp.style.backgroundColor = colorScheme.backgroundColor;
            temp.style.color = colorScheme.accentColor2; 
            
        }
        
        
        
    }
    //return x or y of center of node
    getX(node: Node) {
        return (this.boardSettings.gridLineWidth / 2) + this.boardSettings.spacing * (node.col + 1);
    }
    getY(node: Node) {
        return (this.boardSettings.gridLineWidth / 2) + this.boardSettings.spacing * (node.row + 1);
    }
    //return the x or y of where a first/second edge should start from, used if there is a double edge
    firstEdgeX(node: Node) {
        return this.getX(node) + this.boardSettings.nodeRadius / 4;
    }
    firstEdgeY(node: Node) {
        return this.getY(node) + this.boardSettings.nodeRadius / 4;
    }
    secondEdgeX(node: Node) {
        return this.getX(node) - this.boardSettings.nodeRadius / 4;
    }
    secondEdgeY(node: Node) {
        return this.getY(node) - this.boardSettings.nodeRadius / 4;
    }
    processClick(event: any, nodes: Node[]) {
        var clickX = event.offsetX;
        var clickY = event.offsetY;
        var clickedNode: Node = getClickedNode.bind(this)(clickX, clickY, nodes);
        var resultingNodesForEdge: Node[] | null = null; // either the nodes of user input or null

        if (clickedNode === null) { //click not on a node, nothing changes
        } else if (this.activeNode === null) { //user chooses new starting point for edge
            this.activeNode = clickedNode;
        } else if (this.activeNode === clickedNode) { //click on already chosen starting point cancels edge selection
            this.activeNode = null;
        } else { //edge chosen, return it to check if it is valid
            resultingNodesForEdge = new Array(this.activeNode,clickedNode);
            this.activeNode = null;
        }
        return {activeNode: this.activeNode, inputNodesForEdge: resultingNodesForEdge};

        /* --------- function defintion ---------*/

        function getClickedNode(clickX: number, clickY: number, nodes: Node[]) {
            for (let node of nodes) {
                if (isClickInNode.bind(this)(clickX, clickY, node)) {
                    return node;
                }
            }
            return null;

            function isClickInNode(x: number, y: number, node: Node) {
                var dx = Math.abs(x - this.getX(node));
                var dy = Math.abs(y - this.getY(node));
                return (dx <= this.boardSettings.nodeRadius && dy <= this.boardSettings.nodeRadius);
            }
        }
        
    }
    
    drawBoard(nodes: Node[], edges: Edge[], highlightNode: Node = null) {
        this.context.clearRect(0, 0, this.html.canvas.width, this.html.canvas.height);
        if(this.showGrid) drawGroundBoard.bind(this)();
        drawGridTicks.bind(this)();
        drawEdges.bind(this)(edges);
        drawNodes.bind(this)(nodes, highlightNode);

        /* --------- function defintion ---------*/

        function drawNodes(nodes: Node[], highlightNode: Node = null) {
            for (let node of nodes){
                this.context.fillStyle = this.colorScheme.nodeColor;
                this.context.beginPath();
                this.context.arc(this.getX(node), this.getY(node), this.boardSettings.nodeRadius, 0, 2 * Math.PI);
                this.context.fill();
                this.context.closePath();

                this.context.fillStyle = this.colorScheme.nodeFontColor;
                this.context.font = this.boardSettings.nodeRadius + "px Arial";
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillText(node.neededEdges, this.getX(node),this.getY(node));

                if (node === highlightNode) { // draw circle around highlightNode
                    this.context.strokeStyle = this.colorScheme.highlightNodeColor;
                    this.context.lineWidth = this.boardSettings.nodeRadius / 5;
                    this.context.beginPath();
                    this.context.arc(this.getX(node), this.getY(node), this.boardSettings.nodeRadius + this.context.lineWidth, 0, 2 * Math.PI);
                    this.context.stroke();
                    this.context.closePath();
                }
            }
        }
        function drawEdges(edges: Edge[]) {
            for (let edge of edges) {
                let node1 = edge.node1;
                let node2 = edge.node2;
                this.context.strokeStyle = this.colorScheme.edgeColor;
                this.context.beginPath();
                if(!edge.isDoubleEdge(edges)){ // means only edge between pair of nodes --> we can draw in the middle
                    this.context.lineWidth = this.boardSettings.edgeWidth;
                    this.context.moveTo(this.getX(node1), this.getY(node1));
                    this.context.lineTo(this.getX(node2), this.getY(node2));
                    this.context.stroke();
                }else{							//since there are 2 edges between the nodes we have to draw the edges slightly apart
                    switch (edge.equivalentEdgeOrdering) {
                        case 1:
                            this.context.lineWidth = this.boardSettings.edgeWidth;
                            this.context.moveTo(this.firstEdgeX(node1), this.firstEdgeY(node1));
                            this.context.lineTo(this.firstEdgeX(node2), this.firstEdgeY(node2));
                            this.context.stroke();
                            break;
                        case 2:
                            this.context.lineWidth = this.boardSettings.edgeWidth;
                            this.context.moveTo(this.secondEdgeX(node1), this.secondEdgeY(node1));
                            this.context.lineTo(this.secondEdgeX(node2), this.secondEdgeY(node2));
                            this.context.stroke();
                            break;
                    }
                }
            }
        }
        function drawGroundBoard() {
            this.context.fillStyle = this.colorScheme.gridColor;
            for (let i = 0; i < this.boardSettings.rows; i++) {
                this.context.fillRect(this.boardSettings.spacing, (i + 1) * this.boardSettings.spacing,
                    (this.boardSettings.cols - 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth, this.boardSettings.gridLineWidth);
            }
            for (let i = 0; i < this.boardSettings.cols; i++) {
                this.context.fillRect((i + 1) * this.boardSettings.spacing, this.boardSettings.spacing,
                    this.boardSettings.gridLineWidth, (this.boardSettings.rows - 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth);
            }
        }
        function drawGridTicks() {
            this.context.strokeStyle = this.colorScheme.accentColor2;
            this.context.lineWidth = 3;
            for (let i = 0; i < this.boardSettings.rows; i++) {
                let node = new Node(i,0,1); //using node as workaround to be able to use getY
                let y = this.getY(node);

                this.context.beginPath(); //left board side ticks
                this.context.moveTo(0,y);
                this.context.lineTo(10,y);
                this.context.stroke();

                this.context.beginPath(); // right board side ticks
                this.context.moveTo(this.html.canvas.width, y);
                this.context.lineTo(this.html.canvas.width - 10,y);
                this.context.stroke();
            }
            for (let i = 0; i < this.boardSettings.cols; i++) {
                let node = new Node(0,i,1); //using node as workaround to be able to use getX
                let x = this.getX(node);
                
                this.context.beginPath(); // up board side ticks
                this.context.moveTo(x,0);
                this.context.lineTo(x,10);
                this.context.stroke();

                this.context.beginPath(); // down board side ticks
                this.context.moveTo(x,this.html.canvas.height);
                this.context.lineTo(x,this.html.canvas.height - 10);
                this.context.stroke();
            }
        }
    }
}