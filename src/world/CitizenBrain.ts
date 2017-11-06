
import {StackFSM} from "../ai/fsm/StackFSM";
import {State} from "../ai/fsm/State";
import {Cop} from "./Cop";
import {Config} from "../game/Config";
import {Citizen} from "./Citizen";
import {Street} from "./Street";
import {PickableItem} from "./PickableItem";

export class CitizenBrain
{
    private host: Citizen;
    private fsm: StackFSM;
    private left = -1;
    private right = 1;
    private directionX;
    private speed = 0;
    private walkSpeed: number = 50;
    private runSpeed: number = 150;
    private visionScope: number = 200;
    private energy: number;
    private street: Street;
    private group: Phaser.Group;

    public constructor(citizen: Citizen, street: Street, group: Phaser.Group)
    {
        this.fsm = new StackFSM();
        this.host = citizen;
        this.street = street;
        this.group = group;
        this.fsm.pushState(new State('walk', this.walk));
        this.changeToWalkSpeed();
        this.turnToARandomDirection();
        this.recoverARandomEnergy();
    }

    public think()
    {
        this.fsm.update();
    }

    public walk = () =>
    {
        this.energy--;

        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));

        } else if (this.playerIsCloseAndAggressive()) {
            this.changeToProgressiveRunSpeed();
            this.turnFromThePlayer();
            this.fsm.pushState(new State('flee', this.flee));

        } else if (this.energy <= 0) {
            this.fsm.pushState(new State('resting', this.resting));

        } else {
            this.changeToWalkSpeed();
            if (this.host.body.blocked.left && this.directionX === this.left) {
                this.turnToTheRight();
            }
            if (this.host.body.blocked.right && this.directionX === this.right) {
                this.turnToTheLeft();
            }

            this.host.animations.play('walk');
        }
    }

    public resting = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));

        } else if (this.playerIsCloseAndAggressive()) {
            this.changeToProgressiveRunSpeed();
            this.turnFromThePlayer();
            this.fsm.pushState(new State('flee', this.flee));

        } else {
            this.host.body.velocity.x = 0;
            this.host.body.velocity.y = 0;
            this.host.animations.play('idle');
            this.energy++;
            if (this.energy > 1000) {
                this.recoverARandomEnergy();
                this.changeToWalkSpeed();
                this.turnToARandomDirection();
                this.fsm.popState();
            }
        }
    }

    public flee = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));

        } else if (this.playerIsClose()) {

            this.changeToProgressiveRunSpeed();
            if (this.host.body.blocked.left && this.directionX === this.left) {
                this.turnToTheRight();
            }
            if (this.host.body.blocked.right && this.directionX === this.right) {
                this.turnToTheLeft();
            }

            this.host.animations.play('run');

        } else {
            this.changeToWalkSpeed();
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
        let randMoney = this.group.game.rnd.integerInRange(1, 3);
        if (randMoney === 1) {
            new PickableItem(this.group, this.host.x, this.host.y, 'Money', this.street.player());
        }
    }

    private changeToWalkSpeed()
    {
        this.speed = this.walkSpeed;
    }

    private changeToProgressiveRunSpeed()
    {
        const player = this.street.player();
        const distance = Phaser.Math.distance(player.x, player.y, this.host.x, this.host.y);

        if (distance < this.visionScope / 2) {
            this.speed = this.runSpeed;
        } else {
            this.speed = this.runSpeed * 0.7;
        }
    }

    private turnToTheRight()
    {
        this.directionX = this.right;
        this.host.scale.x = Config.pixelScaleRatio();
        this.host.body.velocity.x = this.speed;
    }

    private turnToTheLeft()
    {
        this.directionX = this.left;
        this.host.scale.x = -Config.pixelScaleRatio();
        this.host.body.velocity.x = -this.speed;
    }

    private turnFromThePlayer()
    {
        if (this.street.player().x < this.host.x) {
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
