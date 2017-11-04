
export class Hero extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    private speed: number = 150;
    private scaleRatio = 2;

    private spaceKey;

    constructor(group: Phaser.Group, x: number, y: number, key: string)
    {
        super(group.game, x, y, key, 0);

        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);

        this.scale.setTo(this.scaleRatio, this.scaleRatio);
        this.anchor.setTo(0.5, 0.5);
        this.body.setCircle(9, 7, 8);

        this.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12, 13], 8, true);
        this.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 12, false);
        this.animations.add('shot', [21, 22, 23, 24, 25, 26], 12, false);

        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    move (cursors: Phaser.CursorKeys) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if (cursors.left.isDown) {
            this.scale.x = -this.scaleRatio;
            this.body.velocity.x = -this.speed;
            this.animations.play('walk');

        } else if (cursors.right.isDown) {
            this.scale.x = this.scaleRatio;
            this.body.velocity.x = this.speed;
            this.animations.play('walk');

        } else if (cursors.up.isDown) {
            this.body.velocity.y = -this.speed;
            this.animations.play('walk');

        } else if (cursors.down.isDown) {
            this.body.velocity.y = this.speed;
            this.animations.play('walk');

        } else if (this.spaceKey.isDown) {
            this.animations.play('shot');

        } else {
            this.animations.play('idle');
        }
    }

    movingToTheRight(): boolean
    {
        return this.body.velocity.x > 0;
    }

    movingToTheLeft(): boolean
    {
        return this.body.velocity.x < 0;
    }
}
