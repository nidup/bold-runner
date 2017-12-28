
import {Config} from "../../Config";
import {Street} from "../../Game/Street";
import {SwatBrain} from "./Brain/SwatBrain";
import {MachineGun} from "../../Weapon/MachineGun";
import {CouldBeAReplicant} from "./CouldBeAReplicant";
import {BulletHits} from "./BulletHits";
import {CanBeHurt} from "../CanBeHurt";
import {HorizontalDirection} from "../HorizontalDirection";
import {CharacterHurt} from "../SFX/CharacterHurt";

export class Swat extends Phaser.Sprite implements CouldBeAReplicant, CanBeHurt
{
    public body: Phaser.Physics.Arcade.Body;
    private brain: SwatBrain;
    private dead: boolean = false;
    private isReplicant: boolean = false;
    private bulletHits: BulletHits;

    constructor(group: Phaser.Group, x: number, y: number, key: string, street: Street, replicant: boolean)
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

        let gun = new MachineGun(group, this);
        let shotRate = 24;
        this.brain = new SwatBrain(this, gun, street, group);

        this.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12, 13], 12, true);
        this.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 12, false);
        this.animations.add('shot', [21, 22, 23, 24, 25, 26], shotRate, false);
        this.animations.add('die-replicant', [27, 28, 29, 30, 31, 32, 33], 12, false);

        this.isReplicant = replicant;
        this.bulletHits = new BulletHits(this, gun, street);
        this.health = 100;
    }

    update()
    {
        if (!this.dead) {
            this.brain.think();
            this.bulletHits.hit();
        }
    }

    replicant(): boolean
    {
        return this.isReplicant;
    }

    die()
    {
        this.dead = true;
    }

    hurt(damage: number, fromDirection: HorizontalDirection)
    {
        this.health -= damage;
        const fx = new CharacterHurt();
        fx.blinkHumanOrReplicant(this, fromDirection, this.replicant());
    }

    isDying(): boolean
    {
        return this.health <= 0;
    }
}
