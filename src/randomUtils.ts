export function rndIntBetween(min: number, max: number) { // max excluded
        return Math.floor(Math.random() * (max - min) ) + min;
    };
export function randomChoice(arr: Array<any>){
        return arr[rndIntBetween(0, arr.length)];
    };