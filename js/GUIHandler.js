"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GUIHandler = /** @class */ (function () {
    function GUIHandler(html, boardSettings, colorScheme) {
        this.html = html;
        this.boardSettings = boardSettings;
        this.colorScheme = colorScheme;
        this.activeNode = null;
        this.message = this.html.messageBox.children[1];
        this.context = this.html.canvas.getContext("2d");
        initBoard.bind(this)();
        setColorScheme.bind(this)(colorScheme);
        //-------------- function declaration ------------
        function initBoard() {
            this.html.canvas.height = (this.boardSettings.rows + 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth;
            this.html.canvas.width = (this.boardSettings.cols + 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth;
            this.html.canvas.addEventListener("click", this.handleClick);
            this.html.boardContainer.style.width = this.html.canvas.width + "px";
            this.html.boardContainer.style.height = this.html.canvas.height + "px";
        }
        function setColorScheme(colorScheme) {
            this.colorScheme = colorScheme;
            this.html.body.style.backgroundColor = colorScheme.backgroundColor;
            this.html.messageBox.style.backgroundColor = colorScheme.accentColor;
            this.html.messageBox.style.borderColor = colorScheme.accentColor2;
            this.html.messageBox.style.color = colorScheme.backgroundColor; //font color
            this.html.boardContainer.style.borderColor = colorScheme.accentColor;
        }
    }
    GUIHandler.prototype.getX = function (node) {
        return (this.boardSettings.gridLineWidth / 2) + this.boardSettings.spacing * (node.col + 1);
    };
    GUIHandler.prototype.getY = function (node) {
        return (this.boardSettings.gridLineWidth / 2) + this.boardSettings.spacing * (node.row + 1);
    };
    GUIHandler.prototype.firstEdgeX = function (node) {
        return this.getX(node) + this.boardSettings.gridLineWidth / 4;
    };
    GUIHandler.prototype.firstEdgeY = function (node) {
        return this.getY(node) + this.boardSettings.gridLineWidth / 4;
    };
    GUIHandler.prototype.secondEdgeX = function (node) {
        return this.getX(node) - this.boardSettings.gridLineWidth / 4;
    };
    GUIHandler.prototype.secondEdgeY = function (node) {
        return this.getY(node) - this.boardSettings.gridLineWidth / 4;
    };
    GUIHandler.prototype.processClick = function (event, nodes) {
        var clickX = event.offsetX;
        var clickY = event.offsetY;
        var clickedNode = getClickedNode.bind(this)(clickX, clickY, nodes);
        var result = null;
        if (clickedNode == null) {
        }
        else if (this.activeNode == null) {
            this.activeNode = clickedNode;
        }
        else if (this.activeNode === clickedNode) {
            this.activeNode = null;
        }
        else {
            result = new Array(this.activeNode, clickedNode);
            this.activeNode = null;
        }
        return result;
        /* --------- function defintion ---------*/
        function getClickedNode(clickX, clickY, nodes) {
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
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
    };
    GUIHandler.prototype.drawBoard = function (nodes, edges, highlightNode) {
        if (highlightNode === void 0) { highlightNode = null; }
        this.context.clearRect(0, 0, this.html.canvas.width, this.html.canvas.height);
        drawGroundBoard.bind(this)();
        drawGridTicks.bind(this)();
        drawEdges.bind(this)(edges);
        drawNodes.bind(this)(nodes, highlightNode);
        /* --------- function defintion ---------*/
        function drawNodes(nodes, highlightNode) {
            if (highlightNode === void 0) { highlightNode = null; }
            for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                var node = nodes_2[_i];
                this.context.fillStyle = this.colorScheme.nodeColor;
                this.context.beginPath();
                this.context.arc(this.getX(node), this.getY(node), this.boardSettings.nodeRadius, 0, 2 * Math.PI);
                this.context.fill();
                this.context.closePath();
                this.context.fillStyle = this.colorScheme.fontColor;
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
            for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
                var edge = edges_1[_i];
                var node1 = edge.node1;
                var node2 = edge.node2;
                this.context.strokeStyle = this.colorScheme.edgeColor;
                this.context.beginPath();
                switch (edge.equivEdgeOrdering) {
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
        function drawGroundBoard() {
            this.context.fillStyle = this.colorScheme.gridColor;
            for (var i = 0; i < this.boardSettings.rows; i++) {
                this.context.fillRect(this.boardSettings.spacing, (i + 1) * this.boardSettings.spacing, (this.boardSettings.cols - 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth, this.boardSettings.gridLineWidth);
            }
            for (var i = 0; i < this.boardSettings.cols; i++) {
                this.context.fillRect((i + 1) * this.boardSettings.spacing, this.boardSettings.spacing, this.boardSettings.gridLineWidth, (this.boardSettings.rows - 1) * this.boardSettings.spacing + this.boardSettings.gridLineWidth);
            }
        }
        function drawGridTicks() {
        }
    };
    return GUIHandler;
}());
exports.default = GUIHandler;
//# sourceMappingURL=GUIHandler.js.map