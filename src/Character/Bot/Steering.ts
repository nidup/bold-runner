
import {Config} from "../../Config";
import {BaseGun} from "../../Weapon/BaseGun";

export class Steering
{
    private bot: Phaser.Sprite;
    private botGun: BaseGun;
    private left = -1;
    private right = 1;
    private directionX;
    private speed: number = 50;
    private randomGenerator: Phaser.RandomDataGenerator;

    constructor(randomGenerator: Phaser.RandomDataGenerator, host: Phaser.Sprite, hostGun: BaseGun = null)
    {
        this.randomGenerator = randomGenerator;
        this.bot = host;
        this.botGun = hostGun;
        this.turnToARandomDirection();
    }

    blockedToTheLeft(): boolean
    {
        return this.bot.body.blocked.left && this.directionX === this.left;
    }

    blockedToTheRight(): boolean
    {
        return this.bot.body.blocked.right && this.directionX === this.right;
    }

    stop()
    {
        this.bot.body.velocity.x = 0;
        this.bot.body.velocity.y = 0;
    }

    turnToTheRight()
    {
        this.directionX = this.right;
        if (this.botGun) {
            this.botGun.turnToTheRight();
        }
        this.bot.scale.x = Config.pixelScaleRatio();
        this.bot.body.velocity.x = this.speed;
    }

    turnToTheLeft()
    {
        this.directionX = this.left;
        if (this.botGun) {
            this.botGun.turnToTheLeft();
        }
        this.bot.scale.x = -Config.pixelScaleRatio();
        this.bot.body.velocity.x = -this.speed;
    }

    turnToTheSprite(sprite: Phaser.Sprite)
    {
        if (sprite.x > this.bot.x) {
            this.turnToTheRight();
        } else {
            this.turnToTheLeft();
        }
    }

    turnFromTheSprite(sprite: Phaser.Sprite)
    {
        if (sprite.x < this.bot.x) {
            this.turnToTheRight();
        } else {
            this.turnToTheLeft();
        }
    }

    turnToARandomDirection()
    {
        this.directionX = this.bot.game.rnd.sign();
        if (this.directionX === -1) {
            this.turnToTheLeft();
        } else {
            this.turnToTheRight();
        }
    }
}
