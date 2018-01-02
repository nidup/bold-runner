
import {Config} from "../../Config";

export default class Preload extends Phaser.State
{
    private skipMenu = false;
    private skipToLevel = 1;

    public preload ()
    {
        this.loadAudio();
        this.loadLevels();
        this.loadGameImages();
        this.loadFonts();
    }

    public create ()
    {
        if (this.skipMenu) {
            if (Config.fakingMobileForDebug()) {
                this.game.state.start('Play', true, false, 'virtualpad', this.skipToLevel);
            } else {
                this.game.state.start('Play', true, false, 'keyboard', this.skipToLevel);
            }
        } else {
            this.game.state.start('Menu');
        }
    }

    private loadAudio()
    {
    }

    private loadLevels()
    {
        this.load.text('levels', 'assets/data/levels.json');
    }

    private loadGameImages()
    {
        this.load.spritesheet('ControllerIndicator', 'assets/controllers/controller-indicator.png', 16,16);
        this.load.atlas('xbox360', 'assets/controllers/xbox360.png', 'assets/controllers/xbox360.json');

        this.load.spritesheet('Top', 'assets/sprites/top.png', 1, 1);
        this.load.spritesheet('Side', 'assets/sprites/side.png', 12, 12);
        this.load.spritesheet('sky', 'assets/sprites/sky.png', 800, 600);
        this.load.spritesheet('background', 'assets/sprites/background.png', 800, 600);
        this.load.spritesheet('Inventory', 'assets/sprites/inventory.png', 300, 300);
        this.load.spritesheet('LevelInstructions', 'assets/sprites/level.png', 400, 300);
        this.load.spritesheet('citizen1', 'assets/sprites/citizen1.png', 32, 32);
        this.load.spritesheet('cop', 'assets/sprites/cop.png', 32, 32);
        this.load.spritesheet('cop-shotgun', 'assets/sprites/cop-shotgun.png', 32, 32);
        this.load.spritesheet('swat', 'assets/sprites/swat.png', 32, 32);
        this.load.spritesheet('hero', 'assets/sprites/hero.png', 32, 32);
        this.load.spritesheet('Bullet', 'assets/sprites/bullets.png', 10, 10);
        this.load.spritesheet('Marker', 'assets/sprites/markers.png', 20, 20);
        this.load.spritesheet('Gun', 'assets/sprites/gun.png', 20, 20);
        this.load.spritesheet('ShotGun', 'assets/sprites/shotgun.png', 20, 20);
        this.load.spritesheet('MachineGun', 'assets/sprites/machinegun.png', 20, 20);
        this.load.spritesheet('Money', 'assets/sprites/money.png', 20, 20);
        this.load.spritesheet('Menu', 'assets/sprites/menu.png', 800, 600);
        this.load.spritesheet('Street', 'assets/sprites/street.png', 80, 110);
        this.load.spritesheet('BuildingElectricSheep', 'assets/sprites/building-electric-sheep.png', 180, 240);
        this.load.spritesheet('BuildingBig', 'assets/sprites/building-big.png', 240, 240);
        this.load.spritesheet('BuildingMedium', 'assets/sprites/building-medium.png', 180, 240);
        this.load.spritesheet('BuildingSmall', 'assets/sprites/building-small.png', 120, 240);
        this.load.spritesheet('BuildingPub', 'assets/sprites/building-pub.png', 120, 240);
        this.load.spritesheet('BuildingHospital', 'assets/sprites/building-hospital.png', 180, 240);}

    private loadFonts()
    {
        this.load.bitmapFont('carrier-command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    }
}
