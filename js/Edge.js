"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Crossing_1 = require("./Crossing");
var Edge = /** @class */ (function () {
    function Edge(node1, node2, allEdges) {
        if (allEdges === void 0) { allEdges = null; }
        this.node1 = node1;
        this.node2 = node2;
        this.allEdges = allEdges;
        this.equivEdgeOrdering = this.calculateEquivalentEdgeCount() + 1;
        this.occupies = this.calculateOccupiedCrossings();
    }
    Edge.prototype.calculateEquivalentEdgeCount = function () {
        var number = 0;
        for (var _i = 0, _a = this.allEdges; _i < _a.length; _i++) {
            var edge = _a[_i];
            if (Edge.areEquivalent(edge, this)) {
                number += 1;
            }
        }
        return number;
    };
    Edge.prototype.calculateOccupiedCrossings = function () {
        var occupied = [];
        var fromNode = this.node1;
        var toNode = this.node2;
        if (fromNode.col === toNode.col) {
            for (var row = Math.min(fromNode.row, toNode.row) + 1; row < Math.max(fromNode.row, toNode.row); row++) {
                occupied.push(new Crossing_1.default(row, fromNode.col));
            }
        }
        else if (fromNode.row === toNode.row) {
            for (var col = Math.min(fromNode.col, toNode.col) + 1; col < Math.max(fromNode.col, toNode.col); col++) {
                occupied.push(new Crossing_1.default(fromNode.row, col));
            }
        }
        return occupied;
    };
    Edge.prototype.equals = function (otherEdge) {
        if ((this.node1 === otherEdge.node1 && this.node2 === otherEdge.node2) ||
            (this.node1 === otherEdge.node2 && this.node2 === otherEdge.node1)) {
            return true;
        }
        else {
            return false;
        }
    };
    Edge.areEquivalent = function (edge1, edge2) {
        if ((edge1.node1 === edge2.node1 && edge1.node2 === edge2.node2) ||
            (edge1.node2 === edge2.node1 && edge1.node1 === edge2.node2)) {
            return true;
        }
        else {
            return false;
        }
    };
    return Edge;
}());
exports.default = Edge;
//# sourceMappingURL=Edge.js.map