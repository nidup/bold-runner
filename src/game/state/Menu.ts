
import {Jojo} from "../../world/jojo";

export default class Menu extends Phaser.State {

    private titleText : Phaser.BitmapText;
    private subtitleText : Phaser.BitmapText;
    private startText : Phaser.BitmapText;

    public create ()
    {
        this.game.stage.backgroundColor = '#1b1128';

        let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);

        this.titleText = this.game.add.bitmapText(850, 700, 'carrier-command','PixelArt SandBox', 20);
        this.subtitleText = this.game.add.bitmapText(850, 740, 'carrier-command','XXXX Game Jam #x by nidup', 10);

//        this.startText = this.game.add.bitmapText(240, 450, 'carrier-command','Press space to start', 10);

        const unitLayer = this.game.add.group();
        unitLayer.name = 'Unit';

        const jojo1 = new Jojo(unitLayer, 100, 100, 'die');
        jojo1.animations.play('die');

        const jojo2 = new Jojo(unitLayer, 180, 100, 'shoot');
        jojo2.animations.play('shoot');

        const jojo3 = new Jojo(unitLayer, 260, 100, 'walk');
        jojo3.animations.play('walk');
    }

    public startGame ()
    {
        this.game.state.start('Play');
    }

    public shutdown ()
    {
        this.titleText.destroy();
        this.subtitleText.destroy();
        this.startText.destroy();
    }
}
