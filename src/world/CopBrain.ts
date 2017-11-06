
import {StackFSM} from "../ai/fsm/StackFSM";
import {State} from "../ai/fsm/State";
import {Cop} from "./Cop";
import {Config} from "../game/Config";
import {Street} from "./Street";
import {Gun} from "./Weapon/Gun";
import {Citizen} from "./Citizen";
import {Hero} from "./Hero";
import {PickableItem} from "./PickableItem";
import {BaseGun} from "./Weapon/BaseGun";

export class CopBrain
{
    private host: Cop;
    private fsm: StackFSM;
    private left = -1;
    private right = 1;
    private directionX;
    private speed: number = 50;
    private attackScope: number = 200;
    private energy: number;
    private gun: BaseGun;
    private street: Street;
    private group: Phaser.Group;

    public constructor(cop: Cop, gun: BaseGun, street: Street, group: Phaser.Group)
    {
        this.fsm = new StackFSM();
        this.host = cop;
        this.gun = gun;
        this.street = street;
        this.group = group;
        this.fsm.pushState(new State('patrol', this.patrol));
        this.turnToARandomDirection();
        this.recoverARandomEnergy();
    }

    public think()
    {
        this.fsm.update();

        const myself = this.host;
        const otherAliveCops = this.street.cops().allAlive().filter(
            function (cop: Cop) {
                return cop !== myself;
            }
        );
        this.gun.bulletHits(
            otherAliveCops,
            function(cop: Cop, bullet: Phaser.Bullet) {
                bullet.kill();
                cop.health = 0;
            }
        );
        this.gun.bulletHits(
            this.street.citizens().allAlive(),
            function(citizen: Citizen, bullet: Phaser.Bullet) {
                bullet.kill();
                citizen.health = 0;
            }
        );
        this.gun.bulletHits(
            this.street.player(),
            function(hero: Hero, bullet: Phaser.Bullet) {
                bullet.kill();
                hero.health = 0;
            }
        );
    }

    public patrol = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));
        }

        if (this.playerIsCloseAndAliveAndAggressive()) {
            this.fsm.pushState(new State('attack', this.attack));
        }

        if (this.host.body.blocked.left && this.directionX === this.left) {
            this.turnToTheRight();
        }
        if (this.host.body.blocked.right && this.directionX === this.right) {
            this.turnToTheLeft();
        }

        this.host.animations.play('walk');

        this.energy--;
        if (this.energy <= 0) {
            this.fsm.pushState(new State('resting', this.resting));
        }
    }

    public resting = () =>
    {
        this.host.body.velocity.x = 0;
        this.host.body.velocity.y = 0;
        this.host.animations.play('idle');

        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));
        }

        if (this.playerIsCloseAndAliveAndAggressive()) {
            this.fsm.pushState(new State('attack', this.attack));
        }

        this.energy++;
        if (this.energy > 1000) {
            this.recoverARandomEnergy();
            this.turnToARandomDirection();
            this.fsm.popState();
        }
    }

    public attack = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));
        }

        if (this.playerIsCloseAndAlive()) {
            this.turnToThePlayer();
            this.host.body.velocity.x = 0;
            this.host.body.velocity.y = 0;
            this.host.animations.play('shot');
            this.gun.fire();

        } else {
            this.turnToARandomDirection();
            this.fsm.popState();
        }
    }

    public dying = () =>
    {
        this.host.body.velocity.x = 0;
        this.host.body.velocity.y = 0;
        this.host.animations.play('die');
        this.host.die();
        if (this.host.key === 'cop') {
            new PickableItem(this.group, this.host.x, this.host.y, 'Gun', this.street.player());
        } else {
            new PickableItem(this.group, this.host.x, this.host.y, 'ShotGun', this.street.player());
        }
    }

    private turnToTheRight()
    {
        this.directionX = this.right;
        this.gun.turnToTheRight();
        this.host.scale.x = Config.pixelScaleRatio();
        this.host.body.velocity.x = this.speed;
    }

    private turnToTheLeft()
    {
        this.directionX = this.left;
        this.gun.turnToTheLeft();
        this.host.scale.x = -Config.pixelScaleRatio();
        this.host.body.velocity.x = -this.speed;
    }

    private turnToThePlayer()
    {
        if (this.street.player().x > this.host.x) {
            this.turnToTheRight();
        } else {
            this.turnToTheLeft();
        }
    }

    private turnToARandomDirection()
    {
        this.directionX = this.host.game.rnd.sign();
        if (this.directionX === -1) {
            this.turnToTheLeft();
        } else {
            this.turnToTheRight();
        }
    }

    private recoverARandomEnergy()
    {
        this.energy = this.host.game.rnd.integerInRange(50, 5000);
    }

    private playerIsCloseAndAliveAndAggressive(): boolean
    {
        return this.street.player().isAggressive() && this.playerIsCloseAndAlive();
    }

    private playerIsCloseAndAlive(): boolean
    {
        const player = this.street.player();

        return !player.isDead() && Phaser.Math.distance(player.x, player.y, this.host.x, this.host.y) < this.attackScope;
    }
}
