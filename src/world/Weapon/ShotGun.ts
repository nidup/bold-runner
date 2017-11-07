
import {BaseGun} from "./BaseGun";

export class ShotGun implements BaseGun
{
    private game: Phaser.Game;
    private weapon: Phaser.Weapon;

    constructor(group: Phaser.Group, owner: Phaser.Sprite)
    {
        this.weapon = group.game.add.weapon(-1, 'Bullet', 14, group);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        this.weapon.bulletKillDistance = 300;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 1200;
        this.weapon.trackSprite(owner, 0, -8, false);
        this.weapon.fireAngle = 0;
        this.weapon.bulletAngleVariance = 10;
        this.game = group.game;
    }

    public fire()
    {
        const originalRate = this.weapon.fireRate;
        this.weapon.fireRate = 0;
        this.weapon.fire();
        this.weapon.fire();
        this.weapon.fireRate = originalRate;
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
