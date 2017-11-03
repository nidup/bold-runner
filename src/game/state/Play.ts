
import {Civil} from "../../world/Civil";

export default class Play extends Phaser.State
{
    private debug: boolean = true;
    private sky: Phaser.TileSprite;
    private background: Phaser.TileSprite;
    private buildings: Phaser.TileSprite;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        const width = 1600;
        const height = 1200;
        const heightPosition = -400;

        const skyLayer = this.game.add.group();
        skyLayer.name = 'Sky';
        this.sky = this.game.add.tileSprite(0,heightPosition,width,height,'sky',0, skyLayer);
        this.sky.tileScale.set(2, 2);

        const backgroundLayer = this.game.add.group();
        backgroundLayer.name = 'Background';
        this.background = this.game.add.tileSprite(0,heightPosition,width,height,'background',0, backgroundLayer);
        this.background.tileScale.set(2, 2);

        const buildingsLayer = this.game.add.group();
        buildingsLayer.name = 'Buildings';
        this.buildings = this.game.add.tileSprite(0,heightPosition,width,height,'buildings',0, buildingsLayer);
        this.buildings.tileScale.set(2, 2);

        const charactersLayer = this.game.add.group();
        charactersLayer.name = 'Characters';

        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';

        const civilPositionY = 650;

        const civil1 = new Civil(charactersLayer, 100, civilPositionY, 'civil1');
        civil1.animations.play('walk');

        const civil2 = new Civil(charactersLayer, 180, civilPositionY, 'civil1');
        civil2.animations.play('shot');

        const civil3 = new Civil(charactersLayer, 260, civilPositionY, 'civil1');
        civil3.animations.play('die');
    }

    public update()
    {
        this.sky.tilePosition.x -= 0.02;
        this.background.tilePosition.x -= 0.05;
        this.buildings.tilePosition.x -= 0.2;
    }

    public render()
    {
        if (this.debug) {
            this.game.debug.text(
                "FPS: "  + this.game.time.fps + " ",
                2,
                14,
                "#00ff00"
            );
        }
    }
}
