
import {StackFSM} from "../ai/fsm/StackFSM";
import {State} from "../ai/fsm/State";
import {Cop} from "./Cop";
import {Config} from "../game/Config";
import {Citizen} from "./Citizen";

export class CitizenBrain
{
    private host: Citizen;
    private fsm: StackFSM;
    private left = -1;
    private right = 1;
    private directionX;
    private speed: number = 50;
    private energy: number;

    public constructor(citizen: Citizen)
    {
        this.fsm = new StackFSM();
        this.host = citizen;
        this.fsm.pushState(new State('walk', this.walk));
        this.directionX = citizen.game.rnd.sign();
        this.energy = this.randEnergy();
    }

    public think()
    {
        this.fsm.update();
    }

    public walk = () =>
    {
        if (this.host.health <= 0) {
            this.fsm.pushState(new State('dying', this.dying));
        }

        if (this.host.body.blocked.left && this.directionX === this.left) {
            this.directionX = this.right;
        }
        if (this.host.body.blocked.right && this.directionX === this.right) {
            this.directionX = this.left;
        }

        if (this.directionX === this.left) {
            this.host.scale.x = -Config.pixelScaleRatio();
            this.host.body.velocity.x = -this.speed;
            this.host.animations.play('walk');

        } else if (this.directionX === this.right) {
            this.host.scale.x = Config.pixelScaleRatio();
            this.host.body.velocity.x = this.speed;
            this.host.animations.play('walk');
        }

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

        this.energy++;
        if (this.energy > 1000) {
            this.energy = this.randEnergy();
            this.fsm.popState();
        }
    }

    public dying = () =>
    {
        this.host.body.velocity.x = 0;
        this.host.body.velocity.y = 0;
        this.host.animations.play('die');
        this.host.die();
    }

    private randEnergy(): number
    {
        return this.host.game.rnd.integerInRange(50, 5000);
    }
}
