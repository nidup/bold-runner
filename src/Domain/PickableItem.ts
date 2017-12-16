
import {Config} from "../game/Config";
import {Hero} from "./Hero";

export class PickableItem extends Phaser.Sprite
{
    private player: Hero;

    constructor(group: Phaser.Group, x: number, y: number, key: string, player: Hero)
    {
        super(group.game, x, y, key, 0);
        this.player = player;

        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);

        this.inputEnabled = true;
        this.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.anchor.setTo(0.5, 0.5);

        this.body.setCircle(9, 7, 8);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;

        this.animations.add('blink', [0, 1], 1, true);
        this.animations.play('blink');
    }

    public update()
    {
        this.game.physics.arcade.overlap(
            this.player,
            this,
            function(player: Hero, item: PickableItem) {
                player.pick(item);
            },
            null,
            this
        );
    }
}
