
import {Street} from "./Street";
import {Cop} from "./Cop";
import {Civil} from "./Civil";

export class Hero extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    private speed: number = 150;
    private scaleRatio = 2;
    private weapon: Phaser.Weapon;
    private spaceKey;
    private street: Street;

    constructor(group: Phaser.Group, x: number, y: number, key: string, street: Street)
    {
        super(group.game, x, y, key, 0);

        this.street = street;

        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);

        this.scale.setTo(this.scaleRatio, this.scaleRatio);
        this.anchor.setTo(0.5, 0.5);
        this.body.setCircle(9, 7, 8);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;

        this.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12, 13], 12, true);
        this.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 12, false);
        this.animations.add('shot', [21, 22, 23, 24, 25, 26], 12, false);

        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.weapon = group.game.add.weapon(-1, 'Bullet', 14, group);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 600;
        this.weapon.trackSprite(this, 0, -8, false);
    }

    move (cursors: Phaser.CursorKeys)
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if (cursors.left.isDown) {
            this.scale.x = -this.scaleRatio;
            this.body.velocity.x = -this.speed;
            this.animations.play('walk');
            this.weapon.fireAngle = 180;

        } else if (cursors.right.isDown) {
            this.scale.x = this.scaleRatio;
            this.body.velocity.x = this.speed;
            this.animations.play('walk');
            this.weapon.fireAngle = 0;

        } else if (cursors.up.isDown && (this.street.minY() + 10) <= this.position.y ) {
            this.body.velocity.y = -this.speed;
            this.animations.play('walk');

        } else if (cursors.down.isDown) {
            this.body.velocity.y = this.speed;
            this.animations.play('walk');

        } else if (this.spaceKey.isDown) {
            this.animations.play('shot');
            this.weapon.fire();

        } else {
            this.animations.play('idle');
        }
    }

    public update()
    {
        this.game.physics.arcade.overlap(
            this.weapon.bullets,
            this.street.cops().allAlive(),
            function(cop: Cop, bullet: Phaser.Bullet) {
                bullet.kill();
                cop.health = 0;
            },
            null,
            this
        );

        this.game.physics.arcade.overlap(
            this.weapon.bullets,
            this.street.civils().allAlive(),
            function(civil: Civil, bullet: Phaser.Bullet) {
                bullet.kill();
                civil.health = 0;
            },
            null,
            this
        );
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
