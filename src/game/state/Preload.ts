
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
        this.game.state.start('Play'); // TODO: shortcuts "Menu" state :)
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
        this.load.spritesheet('sky', 'assets/sprites/sky.png', 800, 600);
        this.load.spritesheet('background', 'assets/sprites/background.png', 800, 600);
        this.load.spritesheet('buildings', 'assets/sprites/buildings.png', 800, 600);
        this.load.spritesheet('civil1', 'assets/sprites/civil1.png', 16, 16);
        this.load.spritesheet('cop', 'assets/sprites/cop.png', 32, 32);
    }

    private loadUIImages()
    {
        this.load.bitmapFont('carrier-command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    }
}
