
import {Street} from "../../world/Street";
import {Citizen} from "../../world/Citizen";
import {Cop} from "../../world/Cop";
import {Inventory} from "../../ui/Inventory";
import {Level} from "../../world/Level";
import {BackBag} from "../../world/BackBag";
import {LevelPanel} from "../../ui/LevelPanel";

export default class Play extends Phaser.State
{
    private debug: boolean = false;
    private sky: Phaser.TileSprite;
    private background: Phaser.TileSprite;
    private buildings: Phaser.TileSprite;
    private street: Street;
    private characterLayer: Phaser.Group;
    private levelNumber: number = 1;
    private switchingLevel: boolean = false;
    private previousInventory: {'gunAmno': number, 'shotgunAmno': number, 'money': number} = null;

    public init (level = 1, previousInventory = {'gunAmno': 100, 'shotgunAmno': 0, 'money': 0})
    {
        this.levelNumber = level;
        this.previousInventory = previousInventory;
        this.switchingLevel = false;
    }

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
        this.buildings.animations.add('idle', [0, 1, 2], 2, true);
        this.buildings.animations.play('idle');

        this.characterLayer = this.game.add.group();
        this.characterLayer.name = 'Characters';

        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';

        const levelsData = JSON.parse(this.game.cache.getText('levels'));
        const levelData = levelsData[this.levelNumber - 1];
        const level = new Level(this.levelNumber, levelData);
        const backbag = new BackBag(this.previousInventory);
        this.street = new Street(this.characterLayer, level, backbag);

        new LevelPanel(interfaceLayer, 0, 0, 'LevelPanel', level);

        new Inventory(interfaceLayer, 600, 0, 'InventoryPanel', this.street.player());

        this.game.world.setBounds(0, 0, 1600, 800);
        this.game.camera.follow(this.street.player());
    }

    public update()
    {
        if (this.street.isEmpty()) {
            this.nextLevel();
        }

        const skyParallaxSpeed = 0.03;
        this.sky.tilePosition.x -= skyParallaxSpeed;

        const backgroundParallaxSpeed = 0.05;
        if (this.street.player().movingToTheRight()) {
            this.background.tilePosition.x -= backgroundParallaxSpeed;
        } else if (this.street.player().movingToTheLeft()) {
            this.background.tilePosition.x += backgroundParallaxSpeed;
        }

        this.characterLayer.sort('y', Phaser.Group.SORT_ASCENDING);
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
            this.game.debug.body(this.street.player());
            this.game.debug.cameraInfo(this.game.camera, 32, 32);

        }
    }

    public shutdown()
    {
        this.sky.destroy();
        this.background.destroy();
        this.buildings.destroy();
        this.street.player().destroy();
        this.street.citizens().all().map(function(citizen: Citizen) { citizen.destroy()});
        this.street.cops().all().map(function(cop: Cop) { cop.destroy()});
        this.street = null;
    }

    public nextLevel()
    {
        if (this.switchingLevel === false) {
            this.switchingLevel = true;
            const levelsData = JSON.parse(this.game.cache.getText('levels'));
            const lastLevelNumber = levelsData.length;
            this.levelNumber++;
            this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                if (this.levelNumber <= lastLevelNumber) {
                    this.game.state.start(
                        'Play',
                        true,
                        false,
                        this.levelNumber,
                        {
                            'gunAmno': this.street.player().gunAmno(),
                            'shotgunAmno': this.street.player().shotgunAmno(),
                            'money': this.street.player().money()
                        }
                    );
                } else {
                    this.game.state.start('Menu');
                }
            }, this);
        }
    }
}
