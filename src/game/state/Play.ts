
import {Cop} from "../../world/Cop";

export default class Play extends Phaser.State
{
    private debug: boolean = false;
    private sky: Phaser.TileSprite;
    private background: Phaser.TileSprite;
    private buildings: Phaser.TileSprite;
    private cursors: Phaser.CursorKeys;
    private hero: Cop;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        const tileSpriteRatio = 2;
        const width = 1600;
        const height = 1200;
        const heightPosition = -400;

        const skyLayer = this.game.add.group();
        skyLayer.name = 'Sky';
        this.sky = this.game.add.tileSprite(0,heightPosition,width,height,'sky',0, skyLayer);
        this.sky.tileScale.set(tileSpriteRatio, tileSpriteRatio);

        const backgroundLayer = this.game.add.group();
        backgroundLayer.name = 'Background';
        this.background = this.game.add.tileSprite(0,heightPosition,width,height,'background',0, backgroundLayer);
        this.background.tileScale.set(tileSpriteRatio, tileSpriteRatio);

        const buildingsLayer = this.game.add.group();
        buildingsLayer.name = 'Buildings';
        this.buildings = this.game.add.tileSprite(0,heightPosition,width,height,'buildings',0, buildingsLayer);
        this.buildings.tileScale.set(tileSpriteRatio, tileSpriteRatio);

        const charactersLayer = this.game.add.group();
        charactersLayer.name = 'Characters';

        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';

        const civilPositionY = 570;
        /*
        const civil1 = new Civil(charactersLayer, 100, civilPositionY, 'civil1');
        civil1.animations.play('walk');

        const civil2 = new Civil(charactersLayer, 180, civilPositionY, 'civil1');
        civil2.animations.play('shot');

        const civil3 = new Civil(charactersLayer, 260, civilPositionY, 'civil1');
        civil3.animations.play('die');*/

        this.cursors = this.input.keyboard.createCursorKeys();

        this.hero = new Cop(charactersLayer, 400, civilPositionY, 'cop');
        this.hero.animations.play('idle');
    }

    public update()
    {
        this.hero.move(this.cursors);

        const skyParallaxSpeed = 0.03;
        this.sky.tilePosition.x -= skyParallaxSpeed;

        const backgroundParallaxSpeed = 0.05;
        const buildingsParallaxSpeed = 0.2;
        if (this.hero.movingToTheRight()) {
            this.background.tilePosition.x -= backgroundParallaxSpeed;
            this.buildings.tilePosition.x -= buildingsParallaxSpeed;
        } else if (this.hero.movingToTheLeft()) {
            this.background.tilePosition.x += backgroundParallaxSpeed;
            this.buildings.tilePosition.x += buildingsParallaxSpeed;
        }
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
            this.game.debug.body(this.hero);
        }
    }
}
