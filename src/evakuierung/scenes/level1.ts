import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { AnimatedTile } from "../util/animatedTile";

import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";
import { RestartButton } from "../util/RestartButton";
import { OurMovement } from "../util/OurMovement";


export class level1 extends Phaser.Scene {
    private ourGame: OurGame;
    private mapPosition: MapPosition;
    private tiles: Tiles;
    private figures: Figures;
    private ourMap: OurMap;

    private score = 0;
    private winCondition = 6;

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

    create(): void {
        this.input.keyboard.enabled = true;
        this.cameras.main.setZoom(1.2,1.2);

        // MAP
        this.mapPosition = {
            mapPosX: this.sys.game.config.width as number * 1/50,
            mapPosY: this.sys.game.config.height as number * 3.5/20
        };
        
        const tmpMap = this.make.tilemap({
            key: 'map',
            tileWidth: 32,
            tileHeight: 32
        });
        const tileset = tmpMap.addTilesetImage('scifi', 'tileset-scifi');
        console.log(tileset);
        this.ourMap = {
            map: tmpMap,
            layers: LevelFunctionsUpgraded.setupLayer(tileset, this.mapPosition, tmpMap)
        };

        // TILES
        const t1 = TileParser.tileTupleAPI(this.ourMap.layers.layerGround, this.ourMap.layers.layerAction, this.ourMap.layers.layerSplit, this.ourMap.layers.layerDirection);
        const t2 = LevelFunctionsUpgraded.getGoalTile(t1);
        this.tiles = {
            tilesList: t1,
            fieldColor: null,
            goalTile: t2,
            animatedTiles: []
        };
        LevelFunctionsUpgraded.activateAnimations(tileset, this.ourMap.map, this.tiles.animatedTiles);

        // FIGURES
        const startingPosition: [number, number] = LevelFunctionsUpgraded.getStartPostition(this.ourMap.layers.layerGround);
        this.figures = {
            figureInitCount: 14,
            figureList: LevelFunctionsUpgraded.initFigureList(14, startingPosition)
        };
        this.figures.figureList.forEach((figure) => {
            this.tiles.tilesList[figure.x/32 + figure.y/32 * this.ourMap.layers.layerAction.layer.width].playersOnTop++;
            figure.image = this.add.image(this.mapPosition.mapPosX + figure.x + Figure.STEP_SIZE / 2, 
                this.mapPosition.mapPosY + figure.y + Figure.STEP_SIZE / 2,'queen').setDepth(4);
        });

        // GAME
        this.ourGame = {
            score: this.score,
            scoreText: this.add.text(
                this.mapPosition.mapPosX + 70, 
                this.mapPosition.mapPosY - 40,  
                'Coins collected: ' + this.score
            ),
            queenPos: [startingPosition[0]/32, startingPosition[1]/32],
            gameFinished: false,
            preMovePos: [400,48],
            survivorScoreText: this.add.text(
                this.mapPosition.mapPosX + 70, 
                this.mapPosition.mapPosY - 20,  
                '' + this.winCondition + ' aliens (including queen) must reach the goal! ' 
            ),
            winCond: this.winCondition
        };

        // RESTART BUTTON
        const restartButton = this.add.image(this.mapPosition.mapPosX+610, this.mapPosition.mapPosY-27, 'restartButton');
        RestartButton.init(restartButton, this.mapPosition, this, this.ourGame);

        // MOVEMENT
        LevelFunctionsUpgraded.addReturnButton(this);
        LevelFunctionsUpgraded.createPlayerCountText(this.tiles.tilesList, this.add);
        
        this.input.keyboard.on('keydown-A', () =>{
            if(LevelFunctionsUpgraded.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'left', this.mapPosition, 2);
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(false, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'right', this.mapPosition, 2);
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'down', this.mapPosition, 2);
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'up', this.mapPosition, 2);
        });
    }

    update(): void {
        this.tiles.animatedTiles.forEach(tile => tile.update(14));
    }
}
