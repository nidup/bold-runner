
import {Config} from "../../Config";

export default class Menu extends Phaser.State {

    private titleText : Phaser.BitmapText;
    private subtitleText : Phaser.BitmapText;
    private startText : Phaser.BitmapText;
    private background: Phaser.Sprite;

    public create ()
    {
        this.game.stage.backgroundColor = '#1b1128';

        this.background = this.game.add.sprite(0, 0, 'Menu');
        this.background.scale.set(Config.pixelScaleRatio(), Config.pixelScaleRatio());

        const spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);

        this.titleText = this.game.add.bitmapText(380, 213, 'carrier-command','Bold Runner', 34);
        this.subtitleText = this.game.add.bitmapText(850, 740, 'carrier-command','XXXX Game Jam #x by nidup', 10);

        this.startText = this.game.add.bitmapText(460, 322, 'carrier-command','Press space to start', 12);
        this.startText.alpha = 1;
        const tweenAlpha = this.game.add.tween(this.startText).to( { alpha: 0.3 }, 0, "Linear", true);
        tweenAlpha.repeat(10000, 500);
    }

    public startGame ()
    {
        this.game.state.start('Play');
    }

    public shutdown ()
    {
        this.background.destroy();
        this.titleText.destroy();
        this.subtitleText.destroy();
        this.startText.destroy();
    }
}
