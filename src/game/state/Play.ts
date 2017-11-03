
import {Civil} from "../../world/Civil";

export default class Play extends Phaser.State
{
    private debug: boolean = true;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        const groundLayer = this.game.add.group();
        groundLayer.name = 'Ground';
        const unitLayer = this.game.add.group();
        unitLayer.name = 'Unit';
        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';
        console.log(this.game.rnd.state());

        const civil1 = new Civil(unitLayer, 100, 100, 'civil1');
        civil1.animations.play('walk');

        const civil2 = new Civil(unitLayer, 180, 100, 'civil1');
        civil2.animations.play('shot');

        const civil3 = new Civil(unitLayer, 260, 100, 'civil1');
        civil3.animations.play('die');
    }

    public update()
    {
    }

    public render()
    {
        if (this.debug) {
            this.game.debug.text(
                "FPS: "  + this.game.time.fps + " ",
                2,
                14,
                "#00ff00"
            );
        }
    }
}
