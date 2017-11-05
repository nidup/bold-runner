
export default class Preload extends Phaser.State {

    public preload ()
    {
        this.loadAudio();
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
        this.load.spritesheet('ui', 'assets/sprites/ui.png', 300, 300);
        this.load.spritesheet('citizen1', 'assets/sprites/citizen1.png', 32, 32);
        this.load.spritesheet('cop', 'assets/sprites/cop.png', 32, 32);
        this.load.spritesheet('hero', 'assets/sprites/hero.png', 32, 32);
        this.load.spritesheet('Bullet', 'assets/sprites/Bullet3.png', 10, 10);
        this.load.spritesheet('Gun', 'assets/sprites/gun.png', 20, 20);
        this.load.spritesheet('ShotGun', 'assets/sprites/shotgun.png', 20, 20);
        this.load.spritesheet('Money', 'assets/sprites/money.png', 20, 20);
    }

    private loadUIImages()
    {
        this.load.bitmapFont('carrier-command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    }
}
