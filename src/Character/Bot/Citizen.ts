
import {Config} from "../../Config";
import {CitizenBrain} from "./Brain/CitizenBrain";
import {Street} from "../../Game/Street";
import {CouldBeAReplicant} from "./CouldBeAReplicant";
import {CanBeHurt} from "../CanBeHurt";
import {HorizontalDirection} from "../HorizontalDirection";
import {CharacterHurt} from "../SFX/CharacterHurt";
import {FearStatus} from "./FearStatus";
import {PickableItem} from "../Player/PickableItem";

export class Citizen extends Phaser.Sprite implements CouldBeAReplicant, CanBeHurt
{
    public body: Phaser.Physics.Arcade.Body;
    private brain: CitizenBrain;
    private dead: boolean = false;
    private isReplicant: boolean = false;
    private fearStatus: FearStatus;
    private group: Phaser.Group;
    private street: Street;
    private feelingSprite: Phaser.Sprite;

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

        this.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12, 13], 12, true);
        this.animations.add('run', [5, 6, 7, 8, 9, 10, 11, 12, 13], 24, true);
        this.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 12, false);
        this.animations.add('die-replicant', [21, 22, 23, 24, 25, 26, 27], 12, false);

        this.fearStatus = new FearStatus();
        this.brain = new CitizenBrain(this, street, group, this.fearStatus);
        this.isReplicant = replicant;
        this.street = street;

        this.feelingSprite = this.game.add.sprite(this.x - 10, this.y - 40, 'Marker', 0, group);
        this.feelingSprite.scale.set(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.feelingSprite.animations.add('nothing', [4], 4, true);
        this.feelingSprite.animations.add('afraid', [2, 3], 4, true);
        this.feelingSprite.animations.add('dying', [5, 6], 2, false);
        this.feelingSprite.animations.add('dying-replicant', [7, 8, 9], 2, false);
        this.feelingSprite.animations.play('afraid');
    }

    update()
    {
        if (!this.dead) {
            this.brain.think();

            if (this.isDying()) {
                if (this.replicant()) {
                    this.feelingSprite.play('dying-replicant', 4, false, true);
                } else {
                    this.feelingSprite.play('dying', 4, false, true);
                }
            } else if (this.isAfraid()) {
                this.feelingSprite.play('afraid');
            } else {
                this.feelingSprite.play('nothing');
            }

            this.feelingSprite.x = this.x - 22;
            this.feelingSprite.y = this.y - 60;
        }
    }

    replicant(): boolean
    {
        return this.isReplicant;
    }

    die()
    {
        if (!this.replicant()) {
            this.animations.play('die');
        } else {
            this.animations.play('die-replicant');
        }
        let randMoney = this.group.game.rnd.integerInRange(1, 3);
        if (randMoney === 1) {
            new PickableItem(this.group, this.x, this.y, 'Money', this.street.player());
        }

        this.dead = true;
    }

    run()
    {
        this.animations.play('run');
    }

    walk()
    {
        this.animations.play('walk');
    }

    rest()
    {
        this.animations.play('idle');
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

    isAfraid(): boolean
    {
        return this.fearStatus.isAfraid();
    }
}
