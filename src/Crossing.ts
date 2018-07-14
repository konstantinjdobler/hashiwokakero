export default class Crossing {
    constructor(public row: number, public col: number) { }
    equals(otherCrossing: Crossing) {
        return this.row === otherCrossing.row && this.col === otherCrossing.col;
    }
    moveIn(direction: any){
        this.row += direction.row;
        this.col += direction.col;
    }
}