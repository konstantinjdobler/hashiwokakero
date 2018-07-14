"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var Edge_1 = require("./Edge");
var GUIHandler_1 = require("./GUIHandler");
var ColorScheme = require("./ColorScheme");
function game() {
    var game = initGame();
    game.nodes.push(new Node_1.default(0, 0, 2), new Node_1.default(3, 4, 5), new Node_1.default(0, 12, 5), new Node_1.default(3, 3, 2));
    game.gui.drawBoard(game.nodes, game.edges);
    function initGame() {
        var boardSettings = {
            rows: 5,
            cols: 15,
            gridLineWidth: 20,
            spacing: 60,
            nodeRadius: 20,
            edgeWidth: 2
        };
        var html = {
            body: document.getElementById("body"),
            messageBox: document.getElementById("messagebox"),
            boardContainer: document.getElementById("playboard-container"),
            canvas: document.getElementById("playboard")
        };
        html.canvas.addEventListener("click", handleClick);
        var game = {
            nodes: new Array(),
            edges: new Array,
            gui: new GUIHandler_1.default(html, boardSettings, ColorScheme.blackOrangeGold())
        };
        return game;
    }
    function handleClick(event) {
        var result = game.gui.processClick(event, game.nodes);
        if (result === null) {
            return;
        }
        try {
            if (isValidEdge(result[0], result[1])) {
                result[0].edgeCount += 1;
                result[1].edgeCount += 1;
                return (new Edge_1.default(result[0], result[1]), game.edges);
            }
        }
        catch (error) {
            if (error.type === "EdgeNotValid") {
                handleCustomError(error);
            }
            else {
                throw error; //Do not catch errors but EdgeNotValid
            }
        }
        function handleCustomError(error) {
            setTimeout(function () { game.gui.message.textContent = ""; }, 5000);
            switch (error.message) {
                case "EdgeInPath":
                    game.gui.message.textContent = "Edges are not allowed to cross other Edges";
                    break;
                case "NodeInPath":
                    game.gui.message.textContent = "Edges are not allowed to go over Nodes";
                    break;
                case "DiagonalEdge":
                    game.gui.message.textContent = "Only orthogonal Edges are allowed";
                    break;
                case "TooManyEdgesOnNode":
                    game.gui.message.textContent = "A Node you selected is not allowed to have more Edges";
                    break;
                case "TooManyEdgesBetweenNodes":
                    game.gui.message.textContent = "You cannot have more than two Edges between Nodes";
                default:
                    console.log("Unhandled EdgeNotValid Error"); //shouldnt happen
                    break;
            }
        }
    }
    function isValidEdge(fromNode, toNode) {
        if (!(fromNode.row === toNode.row) && !(fromNode.col === toNode.col)) {
            throw { type: "EdgeNotValid", message: "DiagonalEdge" };
        }
        else if (fromNode.edgeCount === fromNode.neededEdges || toNode.edgeCount === toNode.neededEdges) {
            throw { type: "EdgeNotValid", message: "TooManyEdgesOnNode" };
        }
        var newEdge = new Edge_1.default(fromNode, toNode, game.edges);
        if (newEdge.equivEdgeOrdering >= 3) {
            throw { type: "EdgeNotValid", message: "TooManyEdgesBetweenNodes" };
        }
        for (var _i = 0, _a = game.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            for (var _b = 0, _c = newEdge.occupies; _b < _c.length; _b++) {
                var crossing = _c[_b];
                if (crossing.row === node.row && crossing.col === node.col) {
                    throw { type: "EdgeNotValid", message: "NodeInPath" };
                }
            }
        }
        for (var _d = 0, _e = game.edges; _d < _e.length; _d++) {
            var oldEdge = _e[_d];
            if (Edge_1.default.areEquivalent(oldEdge, newEdge)) {
                return true;
            }
            var _loop_1 = function (newEdgeCrossing) {
                if (oldEdge.occupies.some(function (oldEdgeCrossing) {
                    return oldEdgeCrossing.equals(newEdgeCrossing);
                })) {
                    throw { type: "EdgeNotValid", message: "EdgeInPath" };
                }
            };
            for (var _f = 0, _g = newEdge.occupies; _f < _g.length; _f++) {
                var newEdgeCrossing = _g[_f];
                _loop_1(newEdgeCrossing);
            }
        }
        return true;
    }
}
console.log("hallo");
game();
//# sourceMappingURL=main.js.map