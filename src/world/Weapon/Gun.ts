
export class Gun
{
    private game: Phaser.Game;
    private weapon: Phaser.Weapon;

    constructor(group: Phaser.Group, owner: Phaser.Sprite)
    {
        this.weapon = group.game.add.weapon(-1, 'Bullet', 14, group);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 600;
        this.weapon.trackSprite(owner, 0, -8, false);
        this.weapon.fireAngle = 0;
        this.game = group.game;
    }

    public fire()
    {
        this.weapon.fire();
    }

    public turnToTheLeft()
    {
        this.weapon.fireAngle = 180;
    }

    public turnToTheRight()
    {
        this.weapon.fireAngle = 0;
    }

    public bullets()
    {
        return this.weapon.bullets;
    }

    public bulletHits(targets, overlapCallback)
    {
        this.game.physics.arcade.overlap(
            this.weapon.bullets,
            targets,
            overlapCallback,
            null,
            this
        );
    }
}
