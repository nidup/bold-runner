
import {CopBrain} from "./CopBrain";
import {Config} from "../game/Config";
import {Gun} from "./Weapon/Gun";
import {Street} from "./Street";
import {ShotGun} from "./Weapon/ShotGun";

export class Cop extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    private brain: CopBrain;
    private dead: boolean = false;

    constructor(group: Phaser.Group, x: number, y: number, key: string, street: Street)
    {
        super(group.game, x, y, key, 0);

        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);

        this.inputEnabled = true;
        this.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.anchor.setTo(0.5, 0.5);

        this.body.setCircle(9, 7, 8);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;

        let gun = null;
        let shotRate = 0;
        if (key === 'cop-shotgun') {
            gun = new ShotGun(group, this);
            shotRate = 6;
        } else {
            gun = new Gun(group, this);
            shotRate = 12;
        }
        this.brain = new CopBrain(this, gun, street, group);

        this.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12, 13], 12, true);
        this.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 12, false);
        this.animations.add('shot', [21, 22, 23, 24, 25, 26], shotRate, false);
    }

    update()
    {
        if (!this.dead) {
            this.brain.think();
        }
    }

    die()
    {
        this.dead = true;
    }
}
