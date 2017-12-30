
export default class Boot extends Phaser.State {

    public create ()
    {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        this.game.state.start('Preload');
    }
}

