import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { AnimatedTile } from "../util/animatedTile";

import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";
import { RestartButton } from "../util/RestartButton";

export class OurMovement {
    public static doMove(ourGame: OurGame, 
        figures: Figures, 
        tiles: Tiles, ourMap: OurMap, 
        scene: Phaser.Scene,
        direction: string,
        mapPosition: MapPosition,
        nextLevel: number): void {

        if(direction === 'left') {
            ourGame.queenPos[0] -= 1;
            figures.figureList[0] = this.movePlayer(false, -Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition);
            
            this.moveInGeneratedDirection(false, -Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
            LevelFunctionsUpgraded.updatePlayerCountText(tiles.tilesList);  
            ourGame.preMovePos[0] -= Figure.STEP_SIZE;    
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel);
        }
        else if(direction === 'right') {
            ourGame.queenPos[0] += 1;
            figures.figureList[0] = this.movePlayer(false, Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition);

            this.moveInGeneratedDirection(false, Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
            LevelFunctionsUpgraded.updatePlayerCountText(tiles.tilesList);
            ourGame.preMovePos[0] += Figure.STEP_SIZE;
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel);
        }
        else if(direction === 'down') {
            ourGame.queenPos[1] += 1;
            figures.figureList[0] = this.movePlayer(true, Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition);

            this.moveInGeneratedDirection(true, Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
            LevelFunctionsUpgraded.updatePlayerCountText(tiles.tilesList);    

            ourGame.preMovePos[1] += Figure.STEP_SIZE;
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel);
        }
        else if(direction === 'up') {
            ourGame.queenPos[1] -= 1;
            figures.figureList[0] = this.movePlayer(true, -Figure.STEP_SIZE, ourMap, figures.figureList[0], tiles, scene, ourGame, mapPosition);

            this.moveInGeneratedDirection(true, -Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
            LevelFunctionsUpgraded.updatePlayerCountText(tiles.tilesList);    
            
            ourGame.preMovePos[1] -= Figure.STEP_SIZE;
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel);
        }
    }

    public static moveInGeneratedDirection(
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
                element = this.movePlayer(xory, pos, map, element,tiles, scene, ourGame, mapPosition);
            }
        });
    }

    public static movePlayer(
        xory: boolean, 
        pos: number, 
        ourMap: OurMap, 
        element: Figure, 
        tiles: Tiles, 
        scene: Phaser.Scene, 
        ourGame: OurGame, 
        mapPosition: MapPosition): Figure {
        let tile:Phaser.Tilemaps.Tile = null;
        let tileAction:Phaser.Tilemaps.Tile = null;
        let tilePr:Phaser.Tilemaps.Tile = null;
            

        // Determine if which axis we're moving on
        if (xory === false){
            tile = ourMap.layers.layerGround.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tileAction = ourMap.layers.layerAction.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tilePr = ourMap.layers.layerProbability.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
        } else {
            tile = ourMap.layers.layerGround.getTileAtWorldXY(element.image.x, element.image.y+pos, true); 
            tileAction = ourMap.layers.layerAction.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
            tilePr = ourMap.layers.layerProbability.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
        }
        // eslint-disable-next-line no-empty
        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
        else {   
            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playersOnTop--; 

            if(element.isQueen && tiles.fieldColor != null){
                tiles.fieldColor.destroy();
            }
            
            if(xory === false){                 
                element.updateCoordinates(pos, 0);   
            } 
            else {
                element.updateCoordinates(0, pos);
            }

            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playersOnTop++;


            const depth = 1;
            if(element.isQueen){
                ///////// log Tile at queens position //////////
                // console.log(this.tilesList.find((tile) => (tile.tileCoordinates[0] === element.x && tile.tileCoordinates[1] === element.y)).toString());
                ////////////////////////////////////////////////
                if(tilePr.index == 153){
                    tiles.fieldColor = scene.add.image(mapPosition.mapPosX + element.x + Figure.STEP_SIZE / 2, mapPosition.mapPosY + element.y + Figure.STEP_SIZE / 2,'green').setDepth(depth);
                }
                else if(tilePr.index == 165){
                    tiles.fieldColor = scene.add.image(mapPosition.mapPosX + element.x + Figure.STEP_SIZE / 2, mapPosition.mapPosY + element.y + Figure.STEP_SIZE / 2,'orange').setDepth(depth);
                }
                else if(tilePr.index == 164){
                    tiles.fieldColor = scene.add.image(mapPosition.mapPosX + element.x + Figure.STEP_SIZE / 2, mapPosition.mapPosY + element.y + Figure.STEP_SIZE / 2,'yellow').setDepth(depth);
                }
                else if(tilePr.index == 166){
                    tiles.fieldColor = scene.add.image(mapPosition.mapPosX + element.x + Figure.STEP_SIZE / 2, mapPosition.mapPosY + element.y + Figure.STEP_SIZE / 2,'red').setDepth(depth);
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
                ourGame.scoreText.setText('Coins collected: ' + ourGame.score);
            }
        }
        return element;
    }
}