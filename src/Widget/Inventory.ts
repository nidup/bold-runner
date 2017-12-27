
import {Config} from "../Config";
import {Hero} from "../Player/Hero";
import {CameraFX} from "../Game/CameraFX";

export class Inventory extends Phaser.Sprite
{
    private player: Hero;
    private gunText: Phaser.BitmapText;
    private gunSprite: Phaser.Sprite;
    private shotgunText: Phaser.BitmapText;
    private shotgunSprite: Phaser.Sprite;
    private moneyText: Phaser.BitmapText;
    private cameraFX: CameraFX;

    constructor(group: Phaser.Group, x: number, y: number, key: string, player: Hero)
    {
        super(group.game, x, y, key, 0);
        this.player = player;
        group.add(this);

        this.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.fixedToCamera = true;

        this.animations.add('idle', [0, 1, 2, 3], 4, true);
        this.animations.add('warning', [4, 5, 6, 7], 4, true);
        this.animations.add('dead', [8, 9, 10, 11], 4, true);
        this.animations.play('idle');

        const fontSize = 13;
        const marginLeftAmountToImage = 80;
        const marginTopAmountToImage = 15;

        const gunX = 1127;
        const gunY = 145;
        this.gunSprite = group.game.add.sprite(gunX, gunY, 'Gun', 1, group);
        this.gunSprite.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.gunSprite.fixedToCamera = true;
        this.gunSprite.animations.add('unselected', [0]);
        this.gunSprite.animations.add('selected', [0, 1], 1, true);
        this.gunSprite.play('selected');

        this.gunText = this.game.add.bitmapText(gunX - marginLeftAmountToImage, gunY + marginTopAmountToImage, 'carrier-command','0', fontSize, group);
        this.gunText.fixedToCamera = true;
        this.gunText.align = 'right';

        const shotgunX = gunX;
        const shotgunY = gunY + 70;
        this.shotgunSprite = group.game.add.sprite(shotgunX, shotgunY, 'ShotGun', 1, group);
        this.shotgunSprite.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.shotgunSprite.fixedToCamera = true;
        this.shotgunSprite.animations.add('unselected', [0]);
        this.shotgunSprite.animations.add('selected', [0, 1], 1, true);
        this.shotgunSprite.play('unselected');

        this.shotgunText = this.game.add.bitmapText(shotgunX - marginLeftAmountToImage, shotgunY + marginTopAmountToImage, 'carrier-command','0', fontSize, group);
        this.shotgunText.fixedToCamera = true;
        this.shotgunText.align = 'right';

        const moneyX = shotgunX;
        const moneyY = shotgunY + 70;
        const moneySprite = group.game.add.sprite(moneyX, moneyY, 'Money', 1, group);
        moneySprite.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        moneySprite.fixedToCamera = true;

        this.moneyText = this.game.add.bitmapText(moneyX - marginLeftAmountToImage, moneyY + marginTopAmountToImage, 'carrier-command','0', fontSize, group);
        this.moneyText.fixedToCamera = true;

        this.cameraFX = new CameraFX(group.game.camera);
    }

    public update()
    {
        if (this.player.isDead()) {
            this.animations.play('dead');
            this.cameraFX.dyingEffect();
        } else if (this.player.isAggressive()) {
            this.animations.play('warning');
            this.cameraFX.warningEffect();
        } else {
            this.animations.play('idle');
        }

        if (this.player.isEquipedWithGun()) {
            this.gunSprite.play('selected');
            this.shotgunSprite.play('unselected');
        } else {
            this.gunSprite.play('unselected');
            this.shotgunSprite.play('selected');
        }

        this.moneyText.setText(this.alignText(this.player.money()));
        this.gunText.setText(this.alignText(this.player.gunAmno()));
        this.shotgunText.setText(this.alignText(this.player.shotgunAmno()));
    }

    private alignText(amount: number): string
    {
        let text = "" + amount;
        if (amount < 10) {
            text = "  " + amount;
        } else if (amount < 100) {
            text = " " + amount;
        }

        return text;
    }
}
