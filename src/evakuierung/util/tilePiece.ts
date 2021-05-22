// Class for each tile. There will be 13 * 7 tiles in total with each of them having
// their probabilities (for each direction) hard coded.

export class TilePiece{
    x: number;
    y: number;
    upProbability: number;
    downProbability: number;
    leftProbability: number;
    rightProbability: number;
    private _playersOnTop: any[] = [];   // this is where the players on top of a tile are stored, it should be a list of objects, when the piglet class is created

    constructor(x: number, y: number, upProbability: number, downProbability: number, leftProbability: number, rightProbability: number) {
        this.x = x;
        this.y = y;
        this.upProbability = upProbability;
        this.downProbability = downProbability;
        this.leftProbability = leftProbability;
        this.rightProbability = rightProbability;
    }

    // can be accessed with dot notation
    public get playersOnTop() {
        return this._playersOnTop;
    }
}