
import {CopBrain} from "./Brain/CopBrain";
import {Config} from "../../Config";
import {Gun} from "../../Weapon/Gun";
import {Street} from "../../Game/Street";
import {ShotGun} from "../../Weapon/ShotGun";
import {BulletHits} from "./BulletHits";
import {CanBeHurt} from "../CanBeHurt";
import {HorizontalDirection} from "../HorizontalDirection";
import {CharacterHurt} from "../SFX/CharacterHurt";
import {PickableItem} from "../Player/PickableItem";
import {BrainStateMarker} from "./BrainStateMarker";
import {CouldBeAReplicant} from "./CouldBeAReplicant";

export class Cop extends Phaser.Sprite implements CanBeHurt, CouldBeAReplicant
{
    public body: Phaser.Physics.Arcade.Body;
    private brain: CopBrain;
    private dead: boolean = false;
    protected isReplicant: boolean = false;
    private bulletHits: BulletHits;
    private group: Phaser.Group;
    private street: Street;

    constructor(group: Phaser.Group, x: number, y: number, key: string, street: Street, replicant: boolean)
    {
        super(group.game, x, y, key, 0);

        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);
        this.group = group;

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
            this.health = 40;
        } else {
            gun = new Gun(group, this);
            shotRate = 12;
            this.health = 1;
        }

        this.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12, 13], 12, true);
        this.animations.add('shot', [21, 22, 23, 24, 25, 26], shotRate, false);
        if (replicant) {
            this.animations.add('die', [27, 28, 29, 30, 31, 32, 33], 12, false);
        } else {
            this.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 12, false);
        }

        this.isReplicant = replicant;
        this.street = street;
        this.bulletHits = new BulletHits(this, gun, street);
        this.brain = new CopBrain(this, gun, street, group);

        new BrainStateMarker(group, this, this.brain, replicant);
    }

    update()
    {
        if (!this.dead) {
            this.brain.think();
            this.bulletHits.hit();
        }
    }

    die()
    {
        this.animations.play('die');
        if (this.key === 'cop') {
            new PickableItem(this.group, this.x, this.y, 'Gun', this.street.player());
        } else {
            new PickableItem(this.group, this.x, this.y, 'ShotGun', this.street.player());
        }
        this.dead = true;
    }

    walk()
    {
        this.animations.play('walk');
    }

    rest()
    {
        this.animations.play('idle');
    }

    shot()
    {
        this.animations.play('shot');
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

    replicant(): boolean
    {
        return this.isReplicant;
    }
}
