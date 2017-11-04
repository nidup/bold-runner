
import {Cop} from "../../world/Cop";
import {Street} from "../../world/Street";
import {Hero} from "../../world/Hero";
import {Civil} from "../../world/Civil";

export default class Play extends Phaser.State
{
    private debug: boolean = false;
    private sky: Phaser.TileSprite;
    private background: Phaser.TileSprite;
    private buildings: Phaser.TileSprite;
    private cursors: Phaser.CursorKeys;
    private hero: Hero;
    private street: Street;

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

        this.cursors = this.input.keyboard.createCursorKeys();

        this.street = new Street();

        const nbCops = 10;
        for (let indCop = 1; indCop < nbCops; indCop++) {
            let randX = this.game.rnd.integerInRange(this.street.minX(), this.street.maxX());
            let randY = this.game.rnd.integerInRange(this.street.minY(), this.street.maxY());
            this.street.cops().add(new Cop(charactersLayer, randX, randY, 'cop'));
        }

        const nbCivil = 30;
        for (let indCiv = 1; indCiv < nbCivil; indCiv++) {
            let randX = this.game.rnd.integerInRange(this.street.minX(), this.street.maxX());
            let randY = this.game.rnd.integerInRange(this.street.minY(), this.street.maxY());
            this.street.civils().add(new Civil(charactersLayer, randX, randY, 'civil1'));
        }

        this.hero = new Hero(charactersLayer, this.street.minX(), this.street.maxY(), 'hero', this.street);

        this.game.world.setBounds(0, 0, 1600, 800);
        this.game.camera.follow(this.hero);
    }

    public update()
    {
        this.hero.move(this.cursors);

        this.street.cops().all().map(function(cop: Cop) {
            cop.patrol();
        });

        this.street.civils().all().map(function(civil: Civil) {
            civil.walk();
        });

        const skyParallaxSpeed = 0.03;
        this.sky.tilePosition.x -= skyParallaxSpeed;

        const backgroundParallaxSpeed = 0.05;
        if (this.hero.movingToTheRight()) {
            this.background.tilePosition.x -= backgroundParallaxSpeed;
        } else if (this.hero.movingToTheLeft()) {
            this.background.tilePosition.x += backgroundParallaxSpeed;
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
            this.game.debug.cameraInfo(this.game.camera, 32, 32);

        }
    }
}
