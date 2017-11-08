
import {BaseGun} from "./BaseGun";

export class Gun implements BaseGun
{
    private game: Phaser.Game;
    private weapon: Phaser.Weapon;
    private amnoAmount: number;

    constructor(group: Phaser.Group, owner: Phaser.Sprite, amno: number = 10000)
    {
        this.game = group.game;
        this.amnoAmount = amno;
        this.weapon = group.game.add.weapon(-1, 'Bullet', 0, group);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        this.weapon.bulletKillDistance = 600;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 600;
        this.weapon.trackSprite(owner, 0, -8, false);
        this.weapon.fireAngle = 0;
        this.weapon.onFire.add(
            function () {
                this.amnoAmount--;
            },
            this
        );
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

    public amno(): number
    {
        return this.amnoAmount;
    }

    public reload(amount: number)
    {
        this.amnoAmount = this.amnoAmount + amount;
    }
}
