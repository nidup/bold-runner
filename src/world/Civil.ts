
export class Civil extends Phaser.Sprite
{
    constructor(group: Phaser.Group, x: number, y: number, key: string)
    {
        super(group.game, x, y, key, 0);

        this.anchor.setTo(.5, .5);
        this.scale.setTo(2, 2);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);

        this.animations.add('walk', [6, 7, 8, 9], 4, true);
        this.animations.add('shot', [0, 1, 2, 3, 4, 5], 4, true);
        this.animations.add('die', [10, 11, 12, 13, 14, 15, 16, 17], 4, true);
    }
}
