
import {Street} from "../../Game/Street";
import {Gun} from "../../Weapon/Gun";
import {PickableItem} from "./PickableItem";
import {ShotGun} from "../../Weapon/ShotGun";
import {BaseGun} from "../../Weapon/BaseGun";
import {BackBag} from "./BackBag";
import {
    GameEvents, GunPicked, HeroKilled, MachineGunPicked, MoneyPicked,
    ShotGunPicked
} from "./Events";
import {MachineGun} from "../../Weapon/MachineGun";
import {CanBeHurt} from "../CanBeHurt";
import {HorizontalDirection} from "../HorizontalDirection";
import {CharacterHurt} from "../SFX/CharacterHurt";
import {HeroCamera} from "../SFX/HeroCamera";
import {BulletHits} from "./BulletHits";
import {Config} from "../../Config";

export class Hero extends Phaser.Sprite implements CanBeHurt
{
    public body: Phaser.Physics.Arcade.Body;
    private speed: number = 150;
    private currentGun: BaseGun;
    private gun: Gun;
    private shotgun: ShotGun;
    private machinegun: MachineGun;
    private cursors: Phaser.CursorKeys;
    private shotKey: Phaser.Key;
    private switchKey: Phaser.Key;
    private switching: boolean = false;
    private street: Street;
    private aggressiveRating : number = 0;
    private dead: boolean = false;
    private moneyAmount: number = 0;
    private cameraFx: HeroCamera;
    private gameEvents: GameEvents;
    private bulletHits: BulletHits;

    constructor(group: Phaser.Group, x: number, y: number, key: string, street: Street, backbag: BackBag)
    {
        super(group.game, x, y, key, 0);
        this.street = street;

        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);

        this.inputEnabled = true;
        this.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.anchor.setTo(0.5, 0.5);
        this.body.setCircle(9, 7, 8);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;

        this.animations.add('idle-gun', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk-gun', [5, 6, 7, 8, 9, 10, 11, 12, 13], 12, true);
        this.animations.add('die-gun', [14, 15, 16, 17, 18, 19, 20], 12, false);
        this.animations.add('shot-gun', [21, 22, 23, 24, 25, 26], 12, false);

        this.animations.add('idle-shotgun', [27, 28, 29, 30, 31], 4, true);
        this.animations.add('walk-shotgun', [32, 33, 34, 35, 36, 37, 38, 39, 40], 12, true);
        this.animations.add('die-shotgun', [41, 42, 43, 44, 45, 46, 47], 12, false);
        this.animations.add('shot-shotgun', [48, 49, 50, 51, 52, 53], 6, false);

        this.animations.add('idle-machinegun', [54, 55, 56, 57, 58], 4, true);
        this.animations.add('walk-machinegun', [59, 60, 61, 62, 63, 64, 65, 66, 67], 12, true);
        this.animations.add('die-machinegun', [68, 69, 70, 71, 72, 73, 74], 12, false);
        this.animations.add('shot-machinegun', [75, 76, 77, 78, 79, 80], 24, false);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.shotKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.switchKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

        this.gun = new Gun(group, this, backbag.gunAmno());
        this.shotgun = new ShotGun(group, this, backbag.shotgunAmno());
        this.machinegun = new MachineGun(group, this, backbag.machinegunAmno());
        this.moneyAmount = backbag.money();

        switch (backbag.currentGunIdentifier()) {
            case 'gun':
                this.switchToGun();
                break;
            case 'shotgun':
                this.switchToShotGun();
                break;
            case 'machinegun':
                this.switchToMachineGun();
                break;
            default:
                throw new Error("Gun identifier "+backbag.currentGunIdentifier()+" is unknown");
        }

        this.cameraFx = new HeroCamera(group.game.camera);
        this.gameEvents = new GameEvents();
        this.bulletHits = new BulletHits(this, this.street);
    }

    public update()
    {
        if (this.health <= 0) {
            this.die();

        } else {
            this.move();
            this.bulletHits.hit();
        }
    }

    hurt(damage: number, fromDirection: HorizontalDirection)
    {
        this.health -= damage;
        const fx = new CharacterHurt();
        fx.blinkHero(this, fromDirection);
    }

    isDying(): boolean
    {
        return this.health <= 0;
    }

    movingToTheRight(): boolean
    {
        return this.body.velocity.x > 0;
    }

    movingToTheLeft(): boolean
    {
        return this.body.velocity.x < 0;
    }

    isAggressive(): boolean
    {
        return this.aggressiveRating > 0;
    }

    isDead(): boolean
    {
        return this.dead;
    }

    money(): number
    {
        return this.moneyAmount;
    }

    gunAmno(): number
    {
        return this.gun.amno();
    }

    shotgunAmno(): number
    {
        return this.shotgun.amno();
    }

    machinegunAmno(): number
    {
        return this.machinegun.amno();
    }

    switchToNextUsableGun()
    {
        if (this.currentGun === this.gun) {
            if (this.shotgunAmno() > 0) {
                this.switchToShotGun();
            } else if (this.machinegunAmno() > 0) {
                this.switchToMachineGun();
            }
        } else if (this.currentGun === this.shotgun) {
            if (this.machinegunAmno() > 0) {
                this.switchToMachineGun();
            } else if (this.gunAmno() > 0) {
                this.switchToGun();
            }
        } else if (this.currentGun === this.machinegun) {
            if (this.gunAmno() > 0) {
                this.switchToGun();
            } else if (this.shotgunAmno() > 0) {
                this.switchToShotGun();
            }
        }
    }

    switchToMachineGun()
    {
        this.currentGun = this.machinegun;
    }

    switchToShotGun()
    {
        this.currentGun = this.shotgun;
    }

    switchToGun()
    {
        this.currentGun = this.gun;
    }

    isEquipedWithGun(): boolean
    {
        return this.currentGun == this.gun;
    }

    isEquipedWithShotgun(): boolean
    {
        return this.currentGun == this.shotgun;
    }

    equippedGun(): BaseGun
    {
        return this.currentGun;
    }

    pick(item: PickableItem)
    {
        if (item.key === 'Money') {
            const randAmount = this.game.rnd.integerInRange(2, 50);
            this.moneyAmount = this.moneyAmount + randAmount;
            this.gameEvents.register(new MoneyPicked(this.game.time.now, randAmount, this.moneyAmount));
        } else if (item.key === 'Gun') {
            this.gun.reload(11);
            this.gameEvents.register(new GunPicked(this.game.time.now));
        } else if (item.key === 'ShotGun') {
            if (this.shotgunAmno() === 0) {
                this.switchToShotGun();
            }
            this.shotgun.reload(6);
            this.gameEvents.register(new ShotGunPicked(this.game.time.now));
        } else if (item.key === 'MachineGun') {
            if (this.machinegunAmno() === 0) {
                this.switchToMachineGun();
            }
            this.machinegun.reload(15);
            this.gameEvents.register(new MachineGunPicked(this.game.time.now));
        }
        item.kill();
    }

    pastGameEvents(): GameEvents
    {
        return this.gameEvents;
    }

    private move()
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if (this.cursors.left.isDown) {
            this.scale.x = -Config.pixelScaleRatio();
            this.body.velocity.x = -this.speed;
            this.animations.play('walk-'+this.currentGun.identifier());
            this.gun.turnToTheLeft();
            this.shotgun.turnToTheLeft();
            this.machinegun.turnToTheLeft();

        } else if (this.cursors.right.isDown) {
            this.scale.x = Config.pixelScaleRatio();
            this.body.velocity.x = this.speed;
            this.animations.play('walk-'+this.currentGun.identifier());
            this.gun.turnToTheRight();
            this.shotgun.turnToTheRight();
            this.machinegun.turnToTheRight();

        } else if (this.cursors.up.isDown && (this.street.minY() + 10) <= this.position.y ) {
            this.body.velocity.y = -this.speed;
            this.animations.play('walk-'+this.currentGun.identifier());

        } else if (this.cursors.down.isDown) {
            this.body.velocity.y = this.speed;
            this.animations.play('walk-'+this.currentGun.identifier());

        } else if (this.shotKey.isDown) {
            this.shot();

        } else if (this.switchKey.isDown && !this.switching) {
            this.switching = true;
            this.switchToNextUsableGun();
            this.switching = false;

        } else {
            this.animations.play('idle-'+this.currentGun.identifier());
        }
    }

    private shot()
    {
        this.animations.play('shot-'+this.currentGun.identifier());
        this.currentGun.fire();
        this.shotCameraEffects();
        if (this.currentGun === this.machinegun && this.machinegunAmno() === 0) {
            this.switchToShotGun();
        }
        if (this.currentGun === this.shotgun && this.shotgunAmno() === 0) {
            this.switchToGun();
        }
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
            this.aggressiveRating++;
        }, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
            this.aggressiveRating--;
        }, this);
    }

    private shotCameraEffects()
    {
        if (this.currentGun === this.machinegun) {
            this.cameraFx.machinegunEffect();
        } else if (this.currentGun === this.shotgun) {
            this.cameraFx.shootgunEffect();
        } else {
            this.cameraFx.gunEffect();
        }
    }

    private die()
    {
        if (!this.dead) {
            this.dead = true;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.play('die-'+this.currentGun.identifier());
            this.gameEvents.register(new HeroKilled(this.game.time.now));
            this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
                this.game.state.start('Play', true, false, 1);
            }, this);
        }
    }
}
