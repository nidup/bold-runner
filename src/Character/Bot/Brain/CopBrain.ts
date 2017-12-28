
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
import {Steering} from "../Steering";

export class CopBrain
{
    private host: Cop;
    private fsm: StackFSM;
    private attackScope: number = 200;
    private gun: BaseGun;
    private street: Street;
    private group: Phaser.Group;
    private energy: Energy;
    private steering: Steering;

    public constructor(cop: Cop, gun: BaseGun, street: Street, group: Phaser.Group)
    {
        this.fsm = new StackFSM();
        this.host = cop;
        this.gun = gun;
        this.street = street;
        this.group = group;
        this.energy = new Energy(this.host.game.rnd);
        this.steering = new Steering(this.host.game.rnd, this.host, this.gun);
        this.fsm.pushState(new State('patrol', this.patrol));
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

        if (this.steering.blockedToTheLeft()) {
            this.steering.turnToTheRight();
        }
        if (this.steering.blockedToTheRight()) {
            this.steering.turnToTheLeft();
        }

        this.host.animations.play('walk');

        this.energy.decrease();
        if (this.energy.empty()) {
            this.fsm.pushState(new State('resting', this.resting));
        }
    }

    public resting = () =>
    {
        this.steering.stop();
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
            this.steering.turnToARandomDirection();
            this.fsm.popState();
        }
    }

    public attack = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));
        }

        if (this.playerIsCloseAndAlive()) {
            this.steering.turnToTheSprite(this.street.player());
            this.steering.stop();
            this.host.animations.play('shot');
            this.gun.fire();

        } else {
            this.steering.turnToARandomDirection();
            this.fsm.popState();
        }
    }

    public dying = () =>
    {
        this.steering.stop();
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
