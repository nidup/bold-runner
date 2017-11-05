
import {Config} from "../game/Config";
import {CitizenBrain} from "./CitizenBrain";
import {Street} from "./Street";

export class Citizen extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    private brain: CitizenBrain;
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

        this.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12, 13], 12, true);
        this.animations.add('run', [5, 6, 7, 8, 9, 10, 11, 12, 13], 24, true);
        this.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 12, false);

        this.brain = new CitizenBrain(this, street, group);
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
