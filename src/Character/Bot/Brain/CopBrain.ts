
import {Cop} from "../Cop";
import {Config} from "../../../Config";
import {Street} from "../../../Game/Street";
import {Gun} from "../../../Weapon/Gun";
import {Citizen} from "../Citizen";
import {Hero} from "../../Player/Hero";
import {PickableItem} from "../../Player/PickableItem";
import {BaseGun} from "../../../Weapon/BaseGun";
import {StackFSM} from "./FSM/StackFSM";
import {State} from "./FSM/State";
import {Swat} from "../Swat";
import {Energy} from "../Energy";

export class CopBrain
{
    private host: Cop;
    private fsm: StackFSM;
    private left = -1;
    private right = 1;
    private directionX;
    private speed: number = 50;
    private attackScope: number = 200;
    private gun: BaseGun;
    private street: Street;
    private group: Phaser.Group;
    private energy: Energy;

    public constructor(cop: Cop, gun: BaseGun, street: Street, group: Phaser.Group)
    {
        this.fsm = new StackFSM();
        this.host = cop;
        this.gun = gun;
        this.street = street;
        this.group = group;
        this.energy = new Energy(this.host.game.rnd);
        this.fsm.pushState(new State('patrol', this.patrol));
        this.turnToARandomDirection();
    }

    public think()
    {
        this.fsm.update();
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

        this.energy.decrease();
        if (this.energy.empty()) {
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

        this.energy.increase();
        if (this.energy.minimalAmountToMoveIsReached()) {
            this.energy.resetWithRandomAmount();
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
        if (!this.host.replicant()) {
            this.host.animations.play('die');
        } else {
            this.host.animations.play('die-replicant');
        }
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
