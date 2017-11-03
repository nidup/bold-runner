
export class Jojo extends Phaser.Sprite
{
    constructor(group: Phaser.Group, x: number, y: number, key: string)
    {
        super(group.game, x, y, key, 0);

        this.anchor.setTo(.5, .5);
        //this.scale.setTo(1.5, 1.5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);

        this.animations.add(key, null, 4, true);
    }
}
