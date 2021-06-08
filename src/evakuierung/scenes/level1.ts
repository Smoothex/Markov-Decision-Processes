import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { LevelFunctions } from "../util/levelFunctions";
import { AnimatedTile } from "../util/animatedTile";

import { level1prob } from "../util/level1prob";


type Layers = {
    layerGround: Phaser.Tilemaps.TilemapLayer;
    layerProbability: Phaser.Tilemaps.TilemapLayer;
    layerAction: Phaser.Tilemaps.TilemapLayer;
    layerDesign: Phaser.Tilemaps.TilemapLayer;
    layerPerspective: Phaser.Tilemaps.TilemapLayer;
};

type OurMap = {
    map: Phaser.Tilemaps.Tilemap;
    layers: Layers;
};

type Figures = {
    figureInitCount: number;
    figureList: Figure[];
};

type Tiles = {
    tilesList: TilePiece[];
    fieldColor: Phaser.GameObjects.Image;
    goalTile: TilePiece;
    animatedTiles: AnimatedTile[];
};

type MapPosition = {
    mapPosX: number;
    mapPosY: number;
};

type OurGame = {
    score: number;
    scoreText: Phaser.GameObjects.Text;
    queenPos: number[];
    gameFinished: boolean;
    preMovePos: number[];
    survivorScoreText: Phaser.GameObjects.Text;
    winCond: number;
};

export class level1 extends Phaser.Scene {
    private ourGame: OurGame;
    private mapPosition: MapPosition;
    private tiles: Tiles;
    private figures: Figures;
    private ourMap: OurMap;

    constructor() {
        super({
            key: "level1"
        });
    }

    gameRestart(): void {
        this.scene.restart();
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        );

        this.load.image('tileset-scifi','./assets/sprites/tileset-scifi.png');
        this.load.tilemapTiledJSON('map','./assets/sprites/Level_1.json');   
        this.load.image('queen', './assets/sprites/alien.svg');
        this.load.image('restartButton', './assets/sprites/restartButton.png');
        this.load.image('nextLevelButton', './assets/sprites/nextLevelButton.png');
        this.load.image('returnMainMenuButton', './assets/sprites/returnMainMenu.png');
        this.load.image('green', './assets/sprites/green.png');
        this.load.image('red', './assets/sprites/red.png');
        this.load.image('orange', './assets/sprites/orange.png');
        this.load.image('yellow', './assets/sprites/yellow.png');
    }

    init(): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 8);
    }

    /**
     * -----------DIRECTIONS-----------
     * 
     *               W(0)
     *          A(3) S(2) D(1)
     */

    create(): void {
        this.input.keyboard.enabled = true;
        this.cameras.main.setZoom(1.2,1.2);

        this.mapPosition = {
            mapPosX: this.sys.game.config.width as number * 1/50,
            mapPosY: this.sys.game.config.height as number * 3.5/20
        };
        
        this.ourMap.map = this.make.tilemap({
            key: 'map',
            tileWidth: 32,
            tileHeight: 32
        });
        const tileset = this.ourMap.map.addTilesetImage('scifi', 'tileset-scifi');
        LevelFunctions.setupLayer(tileset, this.mapPosition, this.ourMap);

        this.ourGame = {
            score: 0,
            scoreText: null,
            queenPos: [],
            gameFinished: false,
            preMovePos: [],
            survivorScoreText: null,
            winCond: 6
        };
        
        const t1 = TileParser.tileTupleAPI(this.ourMap.layers.layerGround, this.ourMap.layers.layerAction);
        const t2 = LevelFunctions.getGoalTile(t1);
        this.tiles = {
            tilesList: t1,
            fieldColor: null,
            goalTile: t2,
            animatedTiles: []
        };

        this.figures = {
            figureInitCount: 14,
            figureList: []
        };

        // -------- animation -------------
        LevelFunctions.activateAnimations(tileset, this.ourMap.map, this.tiles.animatedTiles);


        // sets the Startposition automatically by reading the Map
        const startingPosition: [number, number] = LevelFunctions.getStartPostition(this.ourMap.layers.layerGround);

        this.figures.figureList = LevelFunctions.initFigureList(this.figures.figureInitCount, startingPosition);
        this.ourGame.queenPos = [startingPosition[0]/32, startingPosition[1]/32];
        this.figures.figureList.forEach((figure) => {
            this.tiles.tilesList[figure.x/32 + figure.y/32 * this.ourMap.layers.layerAction.layer.width].playersOnTop++;
            figure.image = this.add.image(this.mapPosition.mapPosX + figure.x + Figure.STEP_SIZE / 2, 
                this.mapPosition.mapPosY + figure.y + Figure.STEP_SIZE / 2,'queen').setDepth(4);
        });

        this.ourGame.scoreText = this.add.text(
            this.mapPosition.mapPosX + 70, 
            this.mapPosition.mapPosY - 40,  
            'Coins collected: ' + this.ourGame.score
        );
        
        this.ourGame.survivorScoreText = this.add.text(
            this.mapPosition.mapPosX + 70, 
            this.mapPosition.mapPosY - 20,  
            '' + this.ourGame.winCond + ' aliens (including queen) must reach the goal! ' 
        );
        
        this.ourGame.preMovePos = [400,48];
        
        const restartButton = this.add.image(this.mapPosition.mapPosX + 610, this.mapPosition.mapPosY - 27, 'restartButton');
        restartButton.setInteractive();
        restartButton.on('pointerup', () => {
            this.input.keyboard.enabled = true;
            this.ourGame.gameFinished = false;
            this.ourGame.score = 0;
            this.scene.restart();
        });
        restartButton.on('pointerover', function(){restartButton.setScale(0.85, 0.85)});
        restartButton.on('pointerout', function(){restartButton.setScale(1, 1)});

        LevelFunctions.addReturnButton(this);
        LevelFunctions.createPlayerCountText(this.tiles.tilesList, this.add);
        
        this.input.keyboard.on('keydown-A', () =>{
            if(LevelFunctions.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.ourMap.layers.layerGround, this.figures.figureList[0])) {
                if(!this.ourGame.gameFinished) {

                    this.ourGame.queenPos[0] -= 1;
                    this.figures.figureList[0] = this.movePlayer(false, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]);
                    
                    this.moveInGeneratedDirection(false, -Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    LevelFunctions.updatePlayerCountText(this.tilesList);  
                    this.preMovePos[0] -= Figure.STEP_SIZE;    
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 2);              
                }
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctions.queenValidMoveCheck(false, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {

                    this.queenPos[0] += 1;
                    this.figureList[0] = this.movePlayer(false, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);

                    this.moveInGeneratedDirection(false, Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    LevelFunctions.updatePlayerCountText(this.tilesList);

                    this.preMovePos[0] += Figure.STEP_SIZE;
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);                
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 2); 
                }
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {

                    this.queenPos[1] += 1;
                    this.figureList[0] = this.movePlayer(true, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);

                    this.moveInGeneratedDirection(true, Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    LevelFunctions.updatePlayerCountText(this.tilesList);    

                    this.preMovePos[1] += Figure.STEP_SIZE;
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);                
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 2);              

                } 
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {

                    this.queenPos[1] -= 1;
                    this.figureList[0] = this.movePlayer(true, -Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);

                    this.moveInGeneratedDirection(true, -Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    LevelFunctions.updatePlayerCountText(this.tilesList);    
                    
                    this.preMovePos[1] -= Figure.STEP_SIZE;
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);                
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 2);
                }
            }
        });
    }

    /**
     * Moves non-queen players in queen's or a random directions
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     */
    public moveInGeneratedDirection(xory: boolean, pos: number, figureList: Figure[], tilesList: TilePiece[],
        layerGround: Phaser.Tilemaps.TilemapLayer, layerAction: Phaser.Tilemaps.TilemapLayer, map: Phaser.Tilemaps.Tilemap): void {
        figureList.forEach( (element) =>{
            if(element.isQueen == false){
                if(LevelFunctions.followQueen(tilesList[(element.x + element.y * layerGround.layer.width)/32])){
                    element = this.movePlayer(xory, pos, layerGround, layerAction, map, element);
                }
                else{
                    const direction: number = LevelFunctions.generateDirection(tilesList[(element.x + element.y * layerGround.layer.width)/32]);
                    switch(direction){
                        case 0: 
                            element = this.movePlayer(true, -Figure.STEP_SIZE, layerGround, layerAction, map, element);
                            break;
                        case 1: 
                            element = this.movePlayer(false, Figure.STEP_SIZE, layerGround, layerAction, map, element);
                            break;
                        case 2: 
                            element = this.movePlayer(true, Figure.STEP_SIZE, layerGround, layerAction, map, element);
                            break;
                        case 3: 
                            element = this.movePlayer(false, -Figure.STEP_SIZE, layerGround, layerAction, map, element);
                            break;
                    }
                }
            }
        });
    }

    /**
     * Moves a figure in a given direction (including the queen!)
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @param map the map we're operating on
     */

    private movePlayer(xory: boolean, pos: number, mapAndLayers: OurMap, element: Figure): Figure {        
        let tile:Phaser.Tilemaps.Tile = null;
        let tileAction:Phaser.Tilemaps.Tile = null;
        let tilePr:Phaser.Tilemaps.Tile = null;
            

        // Determine if which axis we're moving on
        if (xory === false){
            tile = mapAndLayers.layers.layerGround.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tileAction = mapAndLayers.layers.layerAction.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tilePr = this.ourMap.layers.layerProbability.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
        } else {
            tile = mapAndLayers.layers.layerGround.getTileAtWorldXY(element.image.x, element.image.y+pos, true); 
            tileAction = mapAndLayers.layers.layerAction.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
            tilePr = this.ourMap.layers.layerProbability.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
        }
        // eslint-disable-next-line no-empty
        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
        else {   
            this.tiles.tilesList[(element.x + element.y * mapAndLayers.layers.layerGround.layer.width)/32].playersOnTop--; 

            if(element.isQueen && this.tiles.fieldColor != null){
                this.tiles.fieldColor.destroy();
            }
            
            if(xory === false){                 
                element.updateCoordinates(pos, 0);   
            } 
            else {
                element.updateCoordinates(0, pos);
            }

            this.tiles.tilesList[(element.x + element.y * mapAndLayers.layers.layerGround.layer.width)/32].playersOnTop++;


            const depth = 1;
            if(element.isQueen){
                ///////// log Tile at queens position //////////
                // console.log(this.tilesList.find((tile) => (tile.tileCoordinates[0] === element.x && tile.tileCoordinates[1] === element.y)).toString());
                ////////////////////////////////////////////////
                if(tilePr.index == 153){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'green').setDepth(depth);
                }
                else if(tilePr.index == 165){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'orange').setDepth(depth);
                }
                else if(tilePr.index == 164){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'yellow').setDepth(depth);
                }
                else if(tilePr.index == 166){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'red').setDepth(depth);
                }
            }

            if(!this.gameFinished) {
                if(TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.STOP_ID) {
                    if (element.isQueen) {
                        this.scoreText.setText('Your final score: ' + this.score + "!");
                        //this.input.keyboard.enabled = false;
                        this.gameFinished = true;
                    }
                }
            }
            
            if(TileParser.tileIDToAPIID_scifiLVL_Action(tileAction.index) == TileParser.ACTIONFIELD_ID) {
                layerAction.removeTileAt(tileAction.x, tileAction.y, false, false);
                //layerAction.putTileAt(0, tileAction.x, tileAction.y, false);
                this.score += 1;
                this.scoreText.setText('Coins collected: ' + this.score);
            }
        }
        return element;
    }

    update(): void {
        this.tiles.animatedTiles.forEach(tile => tile.update(14));
    }
}
