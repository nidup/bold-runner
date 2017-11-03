
export default class Play extends Phaser.State
{
    private debug: boolean = false;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        const groundLayer = this.game.add.group();
        groundLayer.name = 'Ground';
        const unitLayer = this.game.add.group();
        unitLayer.name = 'Unit';
        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';
        console.log(this.game.rnd.state());

    }

    public update()
    {
    }

    public render()
    {
        if (this.debug) {
            /*
            // TODO: try https://github.com/samme/phaser-plugin-debug-arcade-physics ?
            // this.game.debug.body(this.vehicles.get(1));
            // this.game.debug.bodyInfo(this.vehicles.get(1), 240, 410);
            const game = this.game;
            this.vehicles.all().map(function(vehicle: Vehicle) {
                game.debug.body(vehicle);
            });
            this.buildings.all().map(function(building: Building) {
                game.debug.body(building);
            });
            this.items.all().map(function(item: Item) {
                game.debug.body(item);
            });
            */
            this.game.debug.text(
                "FPS: "  + this.game.time.fps + " ",
                2,
                14,
                "#00ff00"
            );
        }
    }
}
