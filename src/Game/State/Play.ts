
import {Street} from "../Street";
import {Citizen} from "../../Character/Bot/Citizen";
import {Cop} from "../../Character/Bot/Cop";
import {Inventory} from "../../Widget/Inventory";
import {BackBag} from "../../Character/Player/BackBag";
import {LevelInstructions} from "../../Widget/LevelInstructions";
import {FlashMessages} from "../../Widget/FlashMessages";
import {BuildingLayout} from "../../Building/BuildingLayout";
import {Config} from "../../Config";
import {LevelLoader} from "../LevelLoader";
import {GamePadController, KeyBoardController} from "../Controller";

export default class Play extends Phaser.State
{
    private debug: boolean = false;
    private sky: Phaser.TileSprite;
    private background: Phaser.TileSprite;
    private street: Street;
    private characterLayer: Phaser.Group;
    private levelNumber: number = 1;
    private switchingLevel: boolean = false;
    private previousInventory: {'gunAmno': number, 'shotgunAmno': number, 'machinegunAmno': number, 'money': number, 'currentGun': string} = null;
    private controllerType: string = null;

    public init (controllerType: string, level = 1, previousInventory = {'gunAmno': 100, 'shotgunAmno': 0, 'machinegunAmno': 0, 'money': 0, 'currentGun': 'Gun'})
    {
        this.levelNumber = level;
        this.previousInventory = previousInventory;
        this.switchingLevel = false;
        this.controllerType = controllerType;
    }

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        const levelLoader = new LevelLoader();
        const level = levelLoader.load(this.game, this.levelNumber);

        const skyLayer = this.game.add.group();
        skyLayer.name = 'Sky';

        const backgroundLayer = this.game.add.group();
        backgroundLayer.name = 'Background';

        const buildingsLayer = this.game.add.group();
        buildingsLayer.name = 'Buildings';

        const layout = new BuildingLayout(level, buildingsLayer);

        const streetWidth = layout.streetWidth();
        const height = 1200;
        const heightPosition = -400;

        this.sky = this.game.add.tileSprite(0,heightPosition, streetWidth, height,'sky',0, skyLayer);
        this.sky.tileScale.set(Config.pixelScaleRatio(), Config.pixelScaleRatio());

        this.background = this.game.add.tileSprite(0,heightPosition, streetWidth, height,'background',0, backgroundLayer);
        this.background.tileScale.set(Config.pixelScaleRatio(), Config.pixelScaleRatio());

        const streetHeight = 220;
        const streetPositionY = 580;
        const street = this.game.add.tileSprite(0, streetPositionY, streetWidth, streetHeight,'Street',0, buildingsLayer);
        street.tileScale.set(Config.pixelScaleRatio(), Config.pixelScaleRatio());

        this.characterLayer = this.game.add.group();
        this.characterLayer.name = 'Characters';

        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';

        let controller = null;
        if (this.controllerType === 'keyboard') {
            controller = new KeyBoardController(this.game);
        } else if (this.controllerType === 'gamepad') {
            controller = new GamePadController(this.game);
        } else {
            throw new Error('Unknown controller '+ this.controllerType);
        }

        const backbag = new BackBag(this.previousInventory);
        this.street = new Street(this.characterLayer, level, backbag, streetWidth, controller);

        new LevelInstructions(interfaceLayer, 0, 0, 'LevelInstructions', level);
        new Inventory(interfaceLayer, 600, 0, 'Inventory', this.street.player());
        new FlashMessages(interfaceLayer, this.street.player().pastGameEvents(), this.street.player());

        this.game.world.setBounds(0, 0, streetWidth, 800);
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
                        this.controllerType,
                        this.levelNumber,
                        {
                            'gunAmno': this.street.player().gunAmno(),
                            'shotgunAmno': this.street.player().shotgunAmno(),
                            'machinegunAmno': this.street.player().machinegunAmno(),
                            'money': this.street.player().money(),
                            'currentGun': this.street.player().equippedGun().identifier() // TODO: should not be passed in backbag
                        }
                    );
                } else {
                    this.game.state.start('Menu');
                }
            }, this);
        }
    }
}
