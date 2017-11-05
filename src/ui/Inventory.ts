
import {Config} from "../game/Config";
import {Hero} from "../world/Hero";

export class Inventory extends Phaser.Sprite
{
    private player: Hero;
    private gunText: Phaser.BitmapText;
    private moneyText: Phaser.BitmapText;

    constructor(group: Phaser.Group, x: number, y: number, key: string, player: Hero)
    {
        super(group.game, x, y, key, 0);
        this.player = player;
        group.add(this);

        this.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.fixedToCamera = true;

        this.animations.add('idle', [0], 1, true);
        this.animations.play('idle');

        const gunX = 1020;
        const gunY = 45;
        const gunSprite = group.game.add.sprite(1020, 45, 'Gun', 1, group);
        gunSprite.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        gunSprite.fixedToCamera = true;

        this.gunText = this.game.add.bitmapText(gunX - 40, gunY + 30, 'carrier-command','0', 10);
        this.gunText.fixedToCamera = true;

        const moneyX = 1130;
        const moneyY = 45;
        const moneySprite = group.game.add.sprite(moneyX, moneyY, 'Money', 1, group);
        moneySprite.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        moneySprite.fixedToCamera = true;

        this.moneyText = this.game.add.bitmapText(moneyX - 40, moneyY + 30, 'carrier-command','0', 10);
        this.moneyText.fixedToCamera = true;
    }

    public update()
    {
        this.moneyText.setText(""+this.player.money());
        this.gunText.setText(""+this.player.gunAmno());
    }
}