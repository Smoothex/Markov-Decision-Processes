import { TileParser } from "../util/tileParser";
import { Figure } from "../util/figure"
import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";

export class OurMovement {
    public static groupTileVisited = false;

    public static doMove(ourGame: OurGame, 
        figures: Figures, 
        tiles: Tiles, ourMap: OurMap, 
        scene: Phaser.Scene,
        direction: string,
        mapPosition: MapPosition,
        nextLevel: number, diff: number): void {

        if(direction === 'left') {
            ourGame.queenPos[0] -= 1;
            figures.figureList[0] = this.movePlayer(false, -Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition, figures.figureList);
            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(false, -Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(tiles, ourMap, scene, ourGame, mapPosition, figures.figureList);
            }
            else{
                OurMovement.groupTileVisited = false;
            }
  
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
        else if(direction === 'right') {
            ourGame.queenPos[0] += 1;
            figures.figureList[0] = this.movePlayer(false, Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition, figures.figureList);

            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(false, Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(tiles, ourMap, scene, ourGame, mapPosition, figures.figureList);
            }
            else{
                OurMovement.groupTileVisited = false;
            }

            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
        else if(direction === 'down') {
            ourGame.queenPos[1] += 1;
            figures.figureList[0] = this.movePlayer(true, Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition, figures.figureList);

            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(true, Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(tiles, ourMap, scene, ourGame, mapPosition, figures.figureList);
            }
            else{
                OurMovement.groupTileVisited = false;
            }

            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
        else if(direction === 'up') {
            ourGame.queenPos[1] -= 1;
            figures.figureList[0] = this.movePlayer(true, -Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition, figures.figureList);
            
            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(true, -Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(tiles, ourMap, scene, ourGame, mapPosition, figures.figureList);
            }
            else{
                OurMovement.groupTileVisited = false;
            } 
            
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
    }

    private static moveInGeneratedDirection(
        xory: boolean, 
        pos: number, 
        fig: Figures, 
        tiles: Tiles, 
        map: OurMap, 
        scene: Phaser.Scene, 
        ourGame: OurGame, 
        mapPosition: MapPosition): void {
        fig.figureList.forEach( (element) =>{
            if(element.isQueen == false){
                element = this.movePlayer(xory, pos, map, element,tiles, scene, ourGame, mapPosition, fig.figureList);
            }
        });
    }

    private static movePlayer(
        xory: boolean, 
        pos: number, 
        ourMap: OurMap, 
        element: Figure, 
        tiles: Tiles, 
        scene: Phaser.Scene, 
        ourGame: OurGame, 
        mapPosition: MapPosition,
        figuresList : Figure[]): Figure {
        let tile:Phaser.Tilemaps.Tile = null;
        let tileAction:Phaser.Tilemaps.Tile = null;
        let tilePr:Phaser.Tilemaps.Tile = null;
        let tileFr:Phaser.Tilemaps.Tile = null;
            

        // Determine if which axis we're moving on
        if (xory === false){
            tile = ourMap.layers.layerGround.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tileAction = ourMap.layers.layerAction.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tilePr = ourMap.layers.layerSplit.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tileFr = ourMap.layers.layerFragezeichen.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
        } else {
            tile = ourMap.layers.layerGround.getTileAtWorldXY(element.image.x, element.image.y+pos, true); 
            tileAction = ourMap.layers.layerAction.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
            tilePr = ourMap.layers.layerSplit.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
            tileFr = ourMap.layers.layerFragezeichen.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
        }
        // eslint-disable-next-line no-empty
        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
        else {   
            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playersOnTopCounter--;
            const index: number = tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playerOnTopList.indexOf(element);
            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playerOnTopList.splice(index, 1);

            if(element.isQueen && tiles.queenFieldIndicator != null){
                tiles.queenFieldIndicator.destroy();
            }
            
            if(xory === false){                 
                element.updateCoordinates(pos, 0);   
            } 
            else {
                element.updateCoordinates(0, pos);
            }

            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playersOnTopCounter++;
            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playerOnTopList.push(element);


            const depth = 1;
            if(element.isQueen){
                tiles.queenFieldIndicator = scene.add.image(mapPosition.mapPosX + element.x + Figure.STEP_SIZE / 2, mapPosition.mapPosY + element.y + Figure.STEP_SIZE / 2,'red').setDepth(depth);
                if(tileAction.index == 178 && tileAction.visible){
                    tileAction.setVisible(false);
                    OurMovement.collectAllAliens(element, tiles, ourMap, figuresList);
                    OurMovement.groupTileVisited = true;
                }
                if (tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].fragezeichen){
                    tileFr.setVisible(false);
                }
                if(tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].splitField){
                    ourGame.splitFieldsToVisit--;
                    if(ourGame.splitFieldsToVisit >= 0){
                        ourGame.survivorScoreText.setText('Win condition: ' + ourGame.winCond + ' aliens and ' + ourGame.splitFieldsToVisit + ' split fields');
                    }
                }
            }

            if(!ourGame.gameFinished
                && TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.STOP_ID
                && element.isQueen) {

                ourGame.scoreText.setText('Your final score: ' + ourGame.score + "!");
                ourGame.gameFinished = true;
            }
            
            if(TileParser.tileIDToAPIID_scifiLVL_Action(tileAction.index) == TileParser.ACTIONFIELD_ID) {
                ourMap.layers.layerAction.removeTileAt(tileAction.x, tileAction.y, false, false);
                ourGame.score += 1;
                ourGame.scoreText.setText('Coins: ' + ourGame.score + '/3');
            }
        }
        return element;
    }

    /**
     * This function decides in which direction the figure will be moved after stepping on a split field
     * @param tiles All tiles in the game
     * @param ourMap The map we use
     * @param scene The level we are currently on
     * @param ourGame The game we use
     * @param mapPosition The position on the map we use
     */
    private static onSplitField(
        tiles: Tiles, 
        ourMap : OurMap, 
        scene: Phaser.Scene, 
        ourGame: OurGame, 
        mapPosition: MapPosition,
        figures: Figure[]) : void{

        tiles.tilesList.forEach(tile => {
            if(tile.splitField){
                const playersToMove = Math.floor(tile.splitPercentage * tile.playersOnTopCounter);

                for (let i = 0; i < playersToMove; i++) {
                    if(tile.splitDirection == 0){ //up
                        this.movePlayer(true, -Figure.STEP_SIZE, ourMap, tile.playerOnTopList[tile.playerOnTopList.length - 1], tiles, scene, ourGame, mapPosition, figures);
                    }
                    else if(tile.splitDirection == 1){ //right
                        this.movePlayer(false, Figure.STEP_SIZE, ourMap, tile.playerOnTopList[tile.playerOnTopList.length - 1], tiles, scene, ourGame, mapPosition, figures);
                    }
                    else if(tile.splitDirection == 2){ //down
                        this.movePlayer(true, Figure.STEP_SIZE, ourMap, tile.playerOnTopList[tile.playerOnTopList.length - 1], tiles, scene, ourGame, mapPosition, figures);
                    }
                    else{ //left
                        this.movePlayer(false, -Figure.STEP_SIZE, ourMap, tile.playerOnTopList[tile.playerOnTopList.length - 1], tiles, scene, ourGame, mapPosition, figures);
                    }
                }
            }
        });
        
    }


    private static collectAllAliens(element: Figure, tiles : Tiles, ourMap: OurMap, figures: Figure[]) : void {
        figures.forEach((fig) => {
            if(!fig.isQueen){
                this.removeFigureFromPreviousTile(ourMap, fig, tiles);
                this.updateFigureCoordinates(fig, element);
                this.addFiguretoNewTile(element, ourMap, tiles, fig);
            }
        });
    }

    private static removeFigureFromPreviousTile(ourMap: OurMap, fig: Figure, tiles: Tiles): void {
        const width: number = ourMap.layers.layerGround.layer.width;
        const index: number = (fig.x + fig.y * width)/32;
        
        tiles.tilesList[index].playersOnTopCounter--;
        const indexUpdated: number = tiles.tilesList[index].playerOnTopList.indexOf(fig);
        tiles.tilesList[index].playerOnTopList.splice(indexUpdated, 1);
    }

    private static updateFigureCoordinates(fig: Figure, element: Figure): void {
        fig.x = element.x;
        fig.y = element.y;
        fig.image.x = element.image.x;
        fig.image.y = element.image.y;
    }

    private static addFiguretoNewTile(element: Figure, ourMap: OurMap, tiles: Tiles, fig: Figure): void {
        const width: number = ourMap.layers.layerGround.layer.width;
        const index = (element.x + element.y * width)/32;
        const targetTile = tiles.tilesList[index];
        
        targetTile.playersOnTopCounter++;
        targetTile.playerOnTopList.push(fig);

    }
}
