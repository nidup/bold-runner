
export default class Preload extends Phaser.State {

    public preload ()
    {
        this.loadAudio()
        this.loadTilemap();
        this.loadTileImages();
        this.loadGameImages();
        this.loadUIImages();
    }

    public create ()
    {
        this.game.state.start('Menu'); // TODO: shortcuts "Menu" state :)
    }

    private loadAudio()
    {
    }

    private loadTilemap()
    {
    }

    private loadTileImages()
    {
    }

    private loadGameImages()
    {
        this.load.spritesheet('walk', 'assets/sprites/mini-walker.png', 16, 16);
        this.load.spritesheet('shoot', 'assets/sprites/mini-shooter.png', 16, 16);
        this.load.spritesheet('die', 'assets/sprites/mini-dying.png', 16, 16);
    }

    private loadUIImages()
    {
        this.load.bitmapFont('carrier-command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    }
}
