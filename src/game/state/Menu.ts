
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

        this.startText = this.game.add.bitmapText(240, 450, 'carrier-command','Press space to start', 10);
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
