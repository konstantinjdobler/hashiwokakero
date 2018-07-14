/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Crossing {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    equals(otherCrossing) {
        return this.row === otherCrossing.row && this.col === otherCrossing.col;
    }
    moveIn(direction) {
        this.row += direction.row;
        this.col += direction.col;
    }
}
exports.default = Crossing;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Crossing_1 = __webpack_require__(0);
class Edge {
    constructor(node1, node2, allEdges = [], mode = null) {
        this.node1 = node1;
        this.node2 = node2;
        this.equivalentEdgeOrdering = this.otherEquivalentEdgesCount(allEdges) + 1;
        this.occupies = this.calculateOccupiedCrossings();
    }
    otherEquivalentEdgesCount(edges) {
        var number = 0;
        for (let edge of edges) {
            if (Edge.areEquivalent(edge, this) && edge != this) {
                number += 1;
            }
        }
        return number;
    }
    isDoubleEdge(edges) {
        let isDoubleEdge = false;
        for (let edge of edges) {
            if (Edge.areEquivalent(edge, this) && edge != this) {
                isDoubleEdge = true;
            }
        }
        return isDoubleEdge;
    }
    doesOccupy(crossing) {
        for (let c of this.occupies) {
            if (c.equals(crossing)) {
                return true;
            }
        }
        return false;
    }
    getEquivalentEdge(edges) {
        for (let edge of edges) {
            if (Edge.areEquivalent(edge, this) && edge != this) {
                return edge;
            }
        }
        throw "NoEquivalentEdgeFound";
    }
    calculateOccupiedCrossings() {
        var occupied = [];
        var fromNode = this.node1;
        var toNode = this.node2;
        if (fromNode.col === toNode.col) {
            for (let row = Math.min(fromNode.row, toNode.row) + 1; row < Math.max(fromNode.row, toNode.row); row++) {
                occupied.push(new Crossing_1.default(row, fromNode.col));
            }
        }
        else if (fromNode.row === toNode.row) {
            for (let col = Math.min(fromNode.col, toNode.col) + 1; col < Math.max(fromNode.col, toNode.col); col++) {
                occupied.push(new Crossing_1.default(fromNode.row, col));
            }
        }
        return occupied;
    }
    getOtherNode(node) {
        if (node.equals(this.node1)) {
            return this.node2;
        }
        else if (node.equals(this.node2)) {
            return this.node1;
        }
        else {
            throw "Given Node not in Edge";
        }
    }
    static areEquivalent(edge1, edge2) {
        if ((edge1.node1 === edge2.node1 && edge1.node2 === edge2.node2) ||
            (edge1.node2 === edge2.node1 && edge1.node1 === edge2.node2)) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = Edge;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Crossing_1 = __webpack_require__(0);
class Node {
    constructor(row, col, neededEdges = 0) {
        this.neededEdges = neededEdges;
        this.crossing = new Crossing_1.default(row, col);
        this.neededEdges = neededEdges;
    }
    getEdges(edges) {
        let foundEdges = new Array();
        for (let edge of edges) {
            if (edge.node1 === this || edge.node2 === this) {
                foundEdges.push(edge);
            }
        }
        return foundEdges;
    }
    edgeCount(edges) {
        return this.getEdges(edges).length;
    }
    get row() {
        return this.crossing.row;
    }
    get col() {
        return this.crossing.col;
    }
    equals(otherNode) {
        return this.row === otherNode.row && this.col == otherNode.col;
    }
}
exports.default = Node;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function rndIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.rndIntBetween = rndIntBetween;
;
function randomChoice(arr) {
    return arr[rndIntBetween(0, arr.length)];
}
exports.randomChoice = randomChoice;
;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Edge_1 = __webpack_require__(1);
const GUIHandler_1 = __webpack_require__(5);
const ColorScheme_1 = __webpack_require__(6);
const BoardGenerator_1 = __webpack_require__(7);
const randomUtils_1 = __webpack_require__(3);
class Game {
    constructor() {
        this.over = false;
        let boardSettings = {
            rows: 5,
            cols: 15,
            gridLineWidth: 1,
            spacing: 60,
            nodeRadius: 20,
            edgeWidth: 3
        };
        let html = {
            body: document.getElementById("body"),
            messageBox: document.getElementById("messagebox"),
            boardContainer: document.getElementById("playboard-container"),
            buttonBox: document.getElementById("buttonbox"),
            canvas: document.getElementById("playboard")
        };
        html.canvas.addEventListener("click", this.handleClick.bind(this));
        html.buttonBox.children[0].addEventListener("click", this.nextColorScheme.bind(this));
        html.buttonBox.children[1].addEventListener("click", this.toggleGrid.bind(this));
        html.buttonBox.children[2].addEventListener("click", this.showSolution.bind(this));
        html.buttonBox.children[3].addEventListener("click", this.newRandomBoard.bind(this, "easy"));
        html.buttonBox.children[4].addEventListener("click", this.newRandomBoard.bind(this, "medium"));
        html.buttonBox.children[5].addEventListener("click", this.newRandomBoard.bind(this, "hard"));
        this.nodes = new Array();
        this.edges = new Array();
        this.colorSchemes = ColorScheme_1.default.getAll();
        this.gui = new GUIHandler_1.default(html, boardSettings, this.colorSchemes[0]);
    }
    // -------- functions --------
    newRandomBoard(difficulty = "easy") {
        if (difficulty === "easy") {
            this.gui.boardSettings.rows = randomUtils_1.rndIntBetween(5, 7);
            this.gui.boardSettings.cols = randomUtils_1.rndIntBetween(7, 12);
        }
        else if (difficulty === "medium") {
            this.gui.boardSettings.rows = randomUtils_1.rndIntBetween(5, 8);
            this.gui.boardSettings.cols = randomUtils_1.rndIntBetween(9, 14);
        }
        else {
            this.gui.boardSettings.rows = randomUtils_1.rndIntBetween(5, 10);
            this.gui.boardSettings.cols = randomUtils_1.rndIntBetween(10, 15);
        }
        let newBoard = BoardGenerator_1.default(this.gui.boardSettings.rows, this.gui.boardSettings.cols, difficulty);
        this.nodes = newBoard.nodes;
        this.edges = [];
        this.solution = newBoard.solution;
        this.gui.activeNode = null;
        clearTimeout(this.messageTimer);
        setTimeout(() => { this.gui.message.textContent = ""; }, 5000);
        this.gui.message.textContent = "Good luck with your new game!";
        this.over = false;
        this.gui.updateBoardSize();
        this.gui.drawBoard(game.nodes, game.edges);
    }
    showSolution() {
        this.edges = this.solution;
        this.over = true;
        game.gui.drawBoard(this.nodes, this.edges);
        clearTimeout(this.messageTimer);
        this.gui.message.textContent = "Given up already? Try another one, you can do it!";
    }
    toggleGrid() {
        this.gui.showGrid = !this.gui.showGrid;
        this.gui.drawBoard(this.nodes, this.edges, this.gui.activeNode);
    }
    gameWon() {
        this.over = true;
        clearTimeout(this.messageTimer);
        this.gui.message.textContent = "Congratulations, you did it! Time for another one?";
    }
    checkGameState() {
        if (haveAllNodesCorrectEdgeCount.bind(this)() && areAllNodesConnected.bind(this)()) {
            this.gameWon();
        }
        function haveAllNodesCorrectEdgeCount() {
            return this.nodes.every(node => node.edgeCount(this.edges) === node.neededEdges);
        }
        function areAllNodesConnected() {
            //use depth fist search to walk through the graph
            //save all visited nodes into array
            //after the search check if the "visited" array has as many member as we have nodes
            var visited = new Array();
            depthFirstSearch.bind(this)(this.nodes[0]);
            return visited.length === this.nodes.length;
            function depthFirstSearch(node) {
                if (visited.includes(node)) {
                    return;
                }
                visited.push(node);
                for (let edge of node.getEdges(this.edges)) {
                    if (!visited.includes(edge.getOtherNode(node))) {
                        depthFirstSearch.bind(this)(edge.getOtherNode(node));
                    }
                }
            }
        }
    }
    nextColorScheme() {
        let curSchemeIndex = this.colorSchemes.indexOf(this.gui.colorScheme);
        this.gui.setColorScheme(this.colorSchemes[(curSchemeIndex + 1) % this.colorSchemes.length]);
        this.gui.drawBoard(this.nodes, this.edges, this.gui.activeNode);
    }
    handleClick(event) {
        if (this.over)
            return;
        let result = this.gui.processClick(event, this.nodes);
        if (result.inputNodesForEdge !== null) {
            let nodesToCheckForEdge = result.inputNodesForEdge;
            try {
                if (this.isValidEdge(nodesToCheckForEdge[0], nodesToCheckForEdge[1])) {
                    let egdeToAdd = new Edge_1.default(nodesToCheckForEdge[0], nodesToCheckForEdge[1], this.edges);
                    this.edges.push(egdeToAdd);
                }
            }
            catch (error) {
                if (error.type === "EdgeNotValid") {
                    handleCustomError.bind(this)(error);
                }
                else {
                    throw error; //do not catch errors but EdgeNotValid
                }
            }
        }
        this.gui.drawBoard(this.nodes, this.edges, result.activeNode);
        this.checkGameState();
        //----------- functions -------------
        function handleCustomError(error) {
            clearTimeout(this.messageTimer);
            switch (error.message) {
                case "EdgeInPath":
                    this.gui.message.textContent = "Edges are not allowed to cross other Edges.";
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
                    this.edges = this.edges.filter(edge => !Edge_1.default.areEquivalent(edge, error.edge));
                    break;
                default:
                    console.log("Unhandled EdgeNotValid Error"); //shouldnt happen (and doesnt)
                    break;
            }
            this.messageTimer = setTimeout(() => { this.gui.message.textContent = ""; }, 5000); //hide error message after 5 seconds
        }
    }
    isValidEdge(fromNode, toNode) {
        let newEdge = new Edge_1.default(fromNode, toNode, this.edges);
        if (newEdge.otherEquivalentEdgesCount(this.edges) >= 2) {
            throw { type: "EdgeNotValid", message: "TooManyEdgesBetweenNodes", edge: newEdge };
        }
        if (!(fromNode.row === toNode.row) && !(fromNode.col === toNode.col)) {
            throw { type: "EdgeNotValid", message: "DiagonalEdge" };
        }
        //do not throw TooManyEdgesOnNode so the user has a chance to exceed the edge limit in order to correct his input
        /*if (fromNode.edgeCount(this.edges) === fromNode.neededEdges || toNode.edgeCount(this.edges) === toNode.neededEdges) {
            throw { type: "EdgeNotValid", message: "TooManyEdgesOnNode", edge: newEdge};
        }*/
        for (const node of this.nodes) {
            for (const crossing of newEdge.occupies) {
                if (crossing.row === node.row && crossing.col === node.col) {
                    throw { type: "EdgeNotValid", message: "NodeInPath" };
                }
            }
        }
        for (let oldEdge of this.edges) {
            if (Edge_1.default.areEquivalent(oldEdge, newEdge)) {
                return true;
            }
            for (let newEdgeCrossing of newEdge.occupies) {
                if (oldEdge.occupies.some(function (oldEdgeCrossing) {
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __webpack_require__(2);
class GUIHandler {
    constructor(html, boardSettings, colorScheme) {
        this.html = html;
        this.boardSettings = boardSettings;
        this.colorScheme = colorScheme;
        this.activeNode = null;
        this.showGrid = false;
        this.message = this.html.messageBox.children[1];
        this.context = this.html.canvas.getContext("2d");
        this.updateBoardSize();
        this.setColorScheme(colorScheme);
    }
    updateBoardSize() {
        this.html.canvas.height = (this.boardSettings.rows + 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth;
        this.html.canvas.width = (this.boardSettings.cols + 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth;
        this.html.boardContainer.style.width = this.html.canvas.width + "px";
        this.html.boardContainer.style.height = this.html.canvas.height + "px";
    }
    setColorScheme(colorScheme) {
        this.colorScheme = colorScheme;
        this.html.body.style.backgroundColor = colorScheme.backgroundColor;
        this.html.messageBox.style.backgroundColor = colorScheme.accentColor;
        this.html.messageBox.style.borderColor = colorScheme.accentColor2;
        this.html.messageBox.style.color = colorScheme.backgroundColor; //font color
        this.html.boardContainer.style.borderColor = colorScheme.accentColor;
        this.html.buttonBox.style.backgroundColor = colorScheme.accentColor;
        this.html.buttonBox.style.borderColor = colorScheme.accentColor2;
        for (let i = 0; i < this.html.buttonBox.children.length; i++) {
            var temp = (this.html.buttonBox.children[i]);
            temp.style.backgroundColor = colorScheme.backgroundColor;
            temp.style.color = colorScheme.accentColor2;
        }
    }
    //return x or y of center of node
    getX(node) {
        return (this.boardSettings.gridLineWidth / 2) + this.boardSettings.spacing * (node.col + 1);
    }
    getY(node) {
        return (this.boardSettings.gridLineWidth / 2) + this.boardSettings.spacing * (node.row + 1);
    }
    //return the x or y of where a first/second edge should start from, used if there is a double edge
    firstEdgeX(node) {
        return this.getX(node) + this.boardSettings.nodeRadius / 4;
    }
    firstEdgeY(node) {
        return this.getY(node) + this.boardSettings.nodeRadius / 4;
    }
    secondEdgeX(node) {
        return this.getX(node) - this.boardSettings.nodeRadius / 4;
    }
    secondEdgeY(node) {
        return this.getY(node) - this.boardSettings.nodeRadius / 4;
    }
    processClick(event, nodes) {
        var clickX = event.offsetX;
        var clickY = event.offsetY;
        var clickedNode = getClickedNode.bind(this)(clickX, clickY, nodes);
        var resultingNodesForEdge = null; // either the nodes of user input or null
        if (clickedNode === null) {
        }
        else if (this.activeNode === null) {
            this.activeNode = clickedNode;
        }
        else if (this.activeNode === clickedNode) {
            this.activeNode = null;
        }
        else {
            resultingNodesForEdge = new Array(this.activeNode, clickedNode);
            this.activeNode = null;
        }
        return { activeNode: this.activeNode, inputNodesForEdge: resultingNodesForEdge };
        /* --------- function defintion ---------*/
        function getClickedNode(clickX, clickY, nodes) {
            for (let node of nodes) {
                if (isClickInNode.bind(this)(clickX, clickY, node)) {
                    return node;
                }
            }
            return null;
            function isClickInNode(x, y, node) {
                var dx = Math.abs(x - this.getX(node));
                var dy = Math.abs(y - this.getY(node));
                return (dx <= this.boardSettings.nodeRadius && dy <= this.boardSettings.nodeRadius);
            }
        }
    }
    drawBoard(nodes, edges, highlightNode = null) {
        this.context.clearRect(0, 0, this.html.canvas.width, this.html.canvas.height);
        if (this.showGrid)
            drawGroundBoard.bind(this)();
        drawGridTicks.bind(this)();
        drawEdges.bind(this)(edges);
        drawNodes.bind(this)(nodes, highlightNode);
        /* --------- function defintion ---------*/
        function drawNodes(nodes, highlightNode = null) {
            for (let node of nodes) {
                this.context.fillStyle = this.colorScheme.nodeColor;
                this.context.beginPath();
                this.context.arc(this.getX(node), this.getY(node), this.boardSettings.nodeRadius, 0, 2 * Math.PI);
                this.context.fill();
                this.context.closePath();
                this.context.fillStyle = this.colorScheme.nodeFontColor;
                this.context.font = this.boardSettings.nodeRadius + "px Arial";
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillText(node.neededEdges, this.getX(node), this.getY(node));
                if (node === highlightNode) {
                    this.context.strokeStyle = this.colorScheme.highlightNodeColor;
                    this.context.lineWidth = this.boardSettings.nodeRadius / 5;
                    this.context.beginPath();
                    this.context.arc(this.getX(node), this.getY(node), this.boardSettings.nodeRadius + this.context.lineWidth, 0, 2 * Math.PI);
                    this.context.stroke();
                    this.context.closePath();
                }
            }
        }
        function drawEdges(edges) {
            for (let edge of edges) {
                let node1 = edge.node1;
                let node2 = edge.node2;
                this.context.strokeStyle = this.colorScheme.edgeColor;
                this.context.beginPath();
                if (!edge.isDoubleEdge(edges)) {
                    this.context.lineWidth = this.boardSettings.edgeWidth;
                    this.context.moveTo(this.getX(node1), this.getY(node1));
                    this.context.lineTo(this.getX(node2), this.getY(node2));
                    this.context.stroke();
                }
                else {
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
                this.context.fillRect(this.boardSettings.spacing, (i + 1) * this.boardSettings.spacing, (this.boardSettings.cols - 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth, this.boardSettings.gridLineWidth);
            }
            for (let i = 0; i < this.boardSettings.cols; i++) {
                this.context.fillRect((i + 1) * this.boardSettings.spacing, this.boardSettings.spacing, this.boardSettings.gridLineWidth, (this.boardSettings.rows - 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth);
            }
        }
        function drawGridTicks() {
            this.context.strokeStyle = this.colorScheme.accentColor2;
            this.context.lineWidth = 3;
            for (let i = 0; i < this.boardSettings.rows; i++) {
                let node = new Node_1.default(i, 0, 1); //using node as workaround to be able to use getY
                let y = this.getY(node);
                this.context.beginPath(); //left board side ticks
                this.context.moveTo(0, y);
                this.context.lineTo(10, y);
                this.context.stroke();
                this.context.beginPath(); // right board side ticks
                this.context.moveTo(this.html.canvas.width, y);
                this.context.lineTo(this.html.canvas.width - 10, y);
                this.context.stroke();
            }
            for (let i = 0; i < this.boardSettings.cols; i++) {
                let node = new Node_1.default(0, i, 1); //using node as workaround to be able to use getX
                let x = this.getX(node);
                this.context.beginPath(); // up board side ticks
                this.context.moveTo(x, 0);
                this.context.lineTo(x, 10);
                this.context.stroke();
                this.context.beginPath(); // down board side ticks
                this.context.moveTo(x, this.html.canvas.height);
                this.context.lineTo(x, this.html.canvas.height - 10);
                this.context.stroke();
            }
        }
    }
}
exports.default = GUIHandler;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ColorScheme {
    //constructor takes object instead of separate values for better readability in the static colorScheme functions
    constructor(temp) {
        this.gridColor = temp.gridColor;
        this.nodeColor = temp.nodeColor;
        this.highlightNodeColor = temp.highlightNodeColor;
        this.edgeColor = temp.edgeColor;
        this.nodeFontColor = temp.nodeFontColor;
        this.backgroundColor = temp.backgroundColor;
        this.accentColor = temp.accentColor;
        this.accentColor2 = temp.accentColor2;
    }
    static getAll() {
        return new Array(ColorScheme.blackOrangeRed(), ColorScheme.redGoldBlack(), ColorScheme.goldWhiteGrey(), ColorScheme.blackWhiteBlue(), ColorScheme.whiteBlueGreen());
    }
    static whiteBlueGreen() {
        return new ColorScheme({
            gridColor: "rgba(20, 30, 30, 0.5)",
            nodeColor: "rgba(0, 0, 0, 1)",
            highlightNodeColor: "rgba(20, 20, 20, 0.9)",
            edgeColor: "rgba(0, 220, 220, 1)",
            nodeFontColor: "rgba(0, 220, 220, 1)",
            backgroundColor: "rgba(215, 237, 255, 1)",
            accentColor: "rgba(0, 100, 100, 0.8)",
            accentColor2: "rgba(0, 0, 0, 1)"
        });
    }
    static blackOrangeRed() {
        return new ColorScheme({
            gridColor: "rgba(200, 105, 105, 0.3)",
            nodeColor: "rgba(200, 100, 0, 1)",
            highlightNodeColor: "rgba(200, 160, 0, 0.95)",
            edgeColor: "rgba(100, 0, 0, 1)",
            nodeFontColor: "rgba(0, 0, 0, 1)",
            backgroundColor: "rgba(0, 0, 0, 1)",
            accentColor: "rgba(255, 100, 0, 0.8)",
            accentColor2: "rgba(200, 160, 0, 1)"
        });
    }
    static redGoldBlack() {
        return new ColorScheme({
            gridColor: "rgba(255, 255, 255, 0.6)",
            nodeColor: "rgba(200, 160, 0, 1)",
            highlightNodeColor: "rgba(200, 160, 0, 1)",
            edgeColor: "rgba(0, 0, 0, 1)",
            nodeFontColor: "rgba(0, 0, 0, 1)",
            backgroundColor: "rgba(100, 0, 0, 1)",
            accentColor: "rgba(200, 160, 0, 1)",
            accentColor2: "rgba(0, 0, 0, 1)"
        });
    }
    static goldWhiteGrey() {
        return new ColorScheme({
            gridColor: "rgba(255, 255, 255, 0.6)",
            nodeColor: "rgba(255, 255, 255, 1)",
            highlightNodeColor: "rgba(200, 200, 200, 0.8)",
            edgeColor: "rgba(0, 0, 0, 0.8)",
            nodeFontColor: "rgba(200, 160, 0, 1)",
            backgroundColor: "rgba(200, 160, 0, 1)",
            accentColor: "rgba(255, 255, 255, 0.8)",
            accentColor2: "rgba(200, 200, 200, 1)"
        });
    }
    static blackWhiteBlue() {
        return new ColorScheme({
            gridColor: "rgba(0, 0, 200, 0.2)",
            nodeColor: "rgba(0, 0, 0, 1)",
            highlightNodeColor: "rgba(0, 0, 200, 1)",
            edgeColor: "rgba(0,0, 0, 1)",
            nodeFontColor: "rgba(255, 255, 255, 1)",
            backgroundColor: "rgba(255, 255, 255, 1)",
            accentColor: "rgba(0, 0, 0, 1)",
            accentColor2: "rgba(0, 0, 200, 1)"
        });
    }
}
exports.default = ColorScheme;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __webpack_require__(2);
const Edge_1 = __webpack_require__(1);
const Crossing_1 = __webpack_require__(0);
const randomUtils_1 = __webpack_require__(3);
function randomBoard(rows, cols, difficulty = "easy") {
    var directions = {
        up: { row: -1, col: 0 },
        down: { row: 1, col: 0 },
        right: { row: 0, col: 1 },
        left: { row: 0, col: -1 }
    };
    switch (difficulty) {
        case "easy":
            var diffScaler = 1;
            break;
        case "medium":
            var diffScaler = 2;
            break;
        case "hard":
            var diffScaler = 3;
            break;
    }
    let nodes = new Array();
    let edges = new Array();
    let startNode = new Node_1.default(randomUtils_1.rndIntBetween(0, rows), randomUtils_1.rndIntBetween(0, cols));
    nodes.push(startNode);
    //second parameter specifies the number of nodes on the board
    //we place more nodes when difficulty is harder
    fillBoardFrom(startNode, rows * cols / (5 - diffScaler));
    for (let node of nodes) {
        node.neededEdges = node.edgeCount(edges);
    }
    return { nodes: nodes, solution: edges };
    // ----------------- helper functions -----------------
    function fillBoardFrom(fromNode, cutoff) {
        if (nodes.length >= cutoff) {
            return;
        }
        let posDirections = getPossibleDirectionsForNode(fromNode);
        if (posDirections.length === 0)
            return fillBoardFrom(randomUtils_1.randomChoice(nodes), cutoff);
        let chosen = randomUtils_1.randomChoice(posDirections);
        let result = edgeWalker(new Crossing_1.default(fromNode.crossing.row + chosen.row, fromNode.crossing.col + chosen.col), chosen);
        let newNode = new Node_1.default(result.crossing.row, result.crossing.col);
        switch (result.flag) {
            case "WalkedOnNode":
                edges.push(new Edge_1.default(fromNode, result.node, edges));
                if (Math.random() <= 0.5) {
                    edges.push(new Edge_1.default(fromNode, result.node, edges));
                }
                break;
            case "WalkedOnEdge"://place node on edge(s), remove the old edge(s) and add new ones
                var edgesToReplace = new Array(result.edge);
                if (result.edge.isDoubleEdge(edges)) {
                    edgesToReplace.push(result.edge.getEquivalentEdge(edges));
                }
                for (let edgeToReplace of edgesToReplace) {
                    edges = edges.filter(edge => edge != edgeToReplace);
                    edges.push(new Edge_1.default(result.edge.node1, newNode, edges));
                    edges.push(new Edge_1.default(newNode, result.edge.node2, edges));
                }
                edges.push(new Edge_1.default(fromNode, newNode, edges));
                nodes.push(newNode);
                break;
            case "CreateNewNode":
                nodes.push(newNode);
                edges.push(new Edge_1.default(fromNode, newNode, edges));
                if (Math.random() <= 0.5) {
                    edges.push(new Edge_1.default(fromNode, newNode, edges));
                }
                break;
        }
        return fillBoardFrom(randomUtils_1.randomChoice(nodes), cutoff);
    }
    function edgeWalker(crossing, direction) {
        while (true) {
            for (let oldEdge of edges) {
                if (oldEdge.occupies.some(oldEdgeCrossing => oldEdgeCrossing.equals(crossing))) {
                    return { crossing: crossing, flag: "WalkedOnEdge", edge: oldEdge }; // place node on edge
                }
            }
            for (let node1 of nodes) {
                if (node1.crossing.equals(crossing)) {
                    return { crossing: crossing, flag: "WalkedOnNode", node: node1 }; //new Crossing(crossing.row - direction.row, crossing.col - direction.col); // place the node one step back
                }
            }
            if (crossing.row + direction.row > rows - 1 || crossing.row + direction.row < 0
                || crossing.col + direction.col > cols - 1 || crossing.col + direction.col < 0) {
                return { crossing: crossing, flag: "CreateNewNode" };
            }
            if (Math.random() <= 0.5) {
                return { crossing: crossing, flag: "CreateNewNode" };
            }
            crossing.moveIn(direction);
        }
    }
    function getPossibleDirectionsForNode(node) {
        let invalid = new Array();
        let allDirections = [directions.up, directions.down, directions.left, directions.right];
        let crossing = node.crossing;
        if (crossing.col <= 0) {
            invalid.push(directions.left);
        }
        if (crossing.row <= 0) {
            invalid.push(directions.up);
        }
        if (crossing.col >= cols - 1) {
            invalid.push(directions.right);
        }
        if (crossing.row >= rows - 1) {
            invalid.push(directions.down);
        }
        for (let d of allDirections) {
            for (let edge of edges) {
                if (edge.doesOccupy(new Crossing_1.default(crossing.row + d.row, crossing.col + d.col))) {
                    invalid.push(d);
                }
            }
            for (let node of nodes) {
                if (node.crossing.equals(new Crossing_1.default(crossing.row + d.row, crossing.col + d.col))) {
                    invalid.push(d);
                }
            }
        }
        return allDirections.filter(ele => !invalid.includes(ele));
    }
}
exports.default = randomBoard;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map