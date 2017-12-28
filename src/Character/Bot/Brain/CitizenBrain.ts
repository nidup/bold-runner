
import {StackFSM} from "./FSM/StackFSM";
import {State} from "./FSM/State";
import {Citizen} from "../Citizen";
import {Street} from "../../../Game/Street";
import {PickableItem} from "../../Player/PickableItem";
import {Energy} from "../Energy";
import {Steering} from "../Steering";

export class CitizenBrain
{
    private host: Citizen;
    private fsm: StackFSM;
    private visionScope: number = 200;
    private street: Street;
    private group: Phaser.Group;
    private energy: Energy;
    private steering: Steering;

    public constructor(citizen: Citizen, street: Street, group: Phaser.Group)
    {
        this.fsm = new StackFSM();
        this.host = citizen;
        this.street = street;
        this.group = group;
        this.energy = new Energy(this.host.game.rnd);
        this.steering = new Steering(this.host.game.rnd, this.host);
        this.fsm.pushState(new State('walk', this.walk));
    }

    public think()
    {
        this.fsm.update();
    }

    public walk = () =>
    {
        this.energy.decrease();

        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));

        } else if (this.playerIsCloseAndAggressive()) {
            this.steering.runFromTheSprite(this.street.player());
            this.fsm.pushState(new State('flee', this.flee));

        } else if (this.energy.empty()) {
            this.fsm.pushState(new State('resting', this.resting));

        } else {
            if (this.steering.blockedToTheLeft()) {
                this.steering.walkToTheRight();
            }
            if (this.steering.blockedToTheRight()) {
                this.steering.walkToTheLeft();
            }

            this.host.animations.play('walk');
        }
    }

    public resting = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));

        } else if (this.playerIsCloseAndAggressive()) {
            this.steering.runFromTheSprite(this.street.player());
            this.fsm.pushState(new State('flee', this.flee));

        } else {
            this.steering.stop();
            this.host.animations.play('idle');
            this.energy.increase();
            if (this.energy.minimalAmountToMoveIsReached()) {
                this.energy.resetWithRandomAmount();
                this.steering.walkToARandomDirection();
                this.fsm.popState();
            }
        }
    }

    public flee = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));

        } else if (this.playerIsClose()) {

            if (this.steering.blockedToTheLeft()) {
                this.steering.runToTheRight();
            }
            if (this.steering.blockedToTheRight()) {
                this.steering.runToTheLeft();
            }

            this.host.animations.play('run');

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
        let randMoney = this.group.game.rnd.integerInRange(1, 3);
        if (randMoney === 1) {
            new PickableItem(this.group, this.host.x, this.host.y, 'Money', this.street.player());
        }
    }

    private playerIsCloseAndAggressive(): boolean
    {
        return this.street.player().isAggressive() && this.playerIsClose();
    }

    private playerIsClose(): boolean
    {
        const player = this.street.player();

        return Phaser.Math.distance(player.x, player.y, this.host.x, this.host.y) < this.visionScope;
    }
}
