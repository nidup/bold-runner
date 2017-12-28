
import {Street} from "../../../Game/Street";
import {PickableItem} from "../../Player/PickableItem";
import {BaseGun} from "../../../Weapon/BaseGun";
import {StackFSM} from "./FSM/StackFSM";
import {State} from "./FSM/State";
import {Swat} from "../Swat";
import {Energy} from "../Energy";
import {Steering} from "../Steering";
import {Vision} from "../Vision";

export class SwatBrain
{
    private host: Swat;
    private fsm: StackFSM;
    private gun: BaseGun;
    private street: Street;
    private group: Phaser.Group;
    private energy: Energy;
    private steering: Steering;
    private vision: Vision;

    public constructor(swat: Swat, gun: BaseGun, street: Street, group: Phaser.Group)
    {
        this.fsm = new StackFSM();
        this.host = swat;
        this.gun = gun;
        this.street = street;
        this.group = group;
        this.energy = new Energy(this.host.game.rnd);
        this.steering = new Steering(this.host.game.rnd, this.host, this.gun);
        this.vision = new Vision(this.host, this.street);
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

        if (this.vision.playerIsCloseAndAliveAndAggressive()) {
            this.fsm.pushState(new State('attack', this.attack));
        }

        if (this.steering.blockedToTheLeft()) {
            this.steering.walkToTheRight();
        }
        if (this.steering.blockedToTheRight()) {
            this.steering.walkToTheLeft();
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

        if (this.vision.playerIsCloseAndAliveAndAggressive()) {
            this.fsm.pushState(new State('attack', this.attack));
        }

        this.energy.increase();
        if (this.energy.minimalAmountToMoveIsReached()) {
            this.energy.resetWithRandomAmount();
            this.steering.walkToARandomDirection();
            this.fsm.popState();
        }
    }

    public attack = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));
        }

        if (this.vision.playerIsCloseAndAlive()) {
            this.steering.stopAndTurnToTheSprite(this.street.player());
            this.host.animations.play('shot');
            this.gun.fire();

        } else {
            this.steering.walkToARandomDirection();
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
        new PickableItem(this.group, this.host.x, this.host.y, 'MachineGun', this.street.player());
    }
}
