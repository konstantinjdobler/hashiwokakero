"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Crossing = /** @class */ (function () {
    function Crossing(row, col) {
        this.row = row;
        this.col = col;
    }
    Crossing.prototype.equals = function (otherCrossing) {
        return this.row === otherCrossing.row && this.col === otherCrossing.col;
    };
    return Crossing;
}());
exports.default = Crossing;
//# sourceMappingURL=Crossing.js.map