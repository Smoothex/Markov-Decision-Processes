import { TilePiece } from "./tilePiece";

export class TileParser {


    // API Codes
    public static readonly WALL_ID = 9;
    public static readonly START_ID = 10;
    public static readonly STOP_ID = 11;
    // ----- Actionfields -----
    public static readonly ACTIONFIELD_ID = 12;
    public static readonly COIN_ID = 12;
    public static readonly PORTAL_BLUE_ID = 13;
    public static readonly PORTAL_ORANGE_ID = 14;
    // ----- Probability -----
    public static readonly PROBABILITY: number[] = [0,15,30,55]

    
    
    constructor() {
        // maybe pass level informations, so we can determine the Layer in here?
    }

    // as the Tileset is the same in every Level, the TileIDs are in every Level the same

    // Want to add new Tiles to map? 
    // open Tiled, click on the Tile (down-right corner) u want to add and count +1 to the TileID

    /**
     * Use only the Ground-Layer Tiles as Input
     */
    public static tileIDToAPIID_scifiLVL_Ground(tileID: number): number {
        if(tileID === 5 || tileID === 18 || tileID === 43)  return TileParser.WALL_ID;
        if(tileID === 1 || tileID === 2 || tileID === 15 || tileID === 16) return TileParser.START_ID;
        if(tileID === 69 || tileID === 70 || tileID === 83 || tileID === 84) return TileParser.STOP_ID;
        return -1;
    }

    /**
     * Use only the Action-Layer Tiles as Input
     */
    public static tileIDToAPIID_scifiLVL_Action(tileID: number): number {
        if(tileID === 155 || tileID === 156|| tileID === 157|| tileID === 158|| tileID === 159|| tileID === 160) return TileParser.COIN_ID;
        if(tileID === 93) return TileParser.PORTAL_BLUE_ID;
        if(tileID === 94) return TileParser.PORTAL_ORANGE_ID;
        return -1;
    }


    /**
     * Use only the Probability-Layer Tiles as Input
     */
    public static tileIDToAPIID_scifiLVL_Probability(tileID: number): number {
        if(tileID === 153) return TileParser.PROBABILITY[0]; //green
        if(tileID === 164) return TileParser.PROBABILITY[1]; //yellow
        if(tileID === 165) return TileParser.PROBABILITY[2]; //orange
        if(tileID === 166) return TileParser.PROBABILITY[3]; //red
        return 0;
    }

    /**
     * @param layerGround groundLayer des Levels, um herauszufinden welcher Tile eine Wand, Ziel und Start ist 
     * @returns tileTuple, access the tiles in the tileTuple with coordinates, e.g. tileTuple[x+y*tilemapwidth], 
     *          wobei das erste Tile oben links ist, x=0 und y=0 ist oben links
     */
    public static tileTupleAPI (layerGround: Phaser.Tilemaps.TilemapLayer, layerAction: Phaser.Tilemaps.TilemapLayer) : TilePiece[] {
        const tileTuple: TilePiece[] = [];
       
        layerGround.forEachTile((tile) => {
            const index: number = this.tileIDToAPIID_scifiLVL_Ground(tile.index);
            if(index === this.WALL_ID)
                tileTuple.push(new TilePiece(
                    [tile.pixelX, tile.pixelY], 
                    [0, 0, 0, 0, 100], // up, right, down, left, followQueen
                    [true, false, false]
                ));

            else if (index === this.STOP_ID)
                tileTuple.push(new TilePiece(
                    [tile.pixelX, tile.pixelY], 
                    [0, 0, 0, 0, 100], // up, right, down, left, followQueen
                    [false, false, true]
                ));

            else {
                tileTuple.push(new TilePiece( //its a normal field
                    [tile.pixelX, tile.pixelY], 
                    [0, 0, 0, 0, 100], // up, right, down, left, followQueen
                    [false, false, false]
                ));
            }
        });
        layerAction.forEachTile((tile) => { //check if it is an actionField
            const index: number = this.tileIDToAPIID_scifiLVL_Action(tile.index);
            if (index === this.ACTIONFIELD_ID){
                const x = tileTuple[tile.x+(tile.y*layerAction.layer.width)];
                x.tileType[1] = true;
            }
        });

        return tileTuple;      
    }
}
