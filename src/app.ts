/// <reference path="../lib/phaser.d.ts"/>

import Boot from "./Infrastructure/UI/Game/State/Boot";
import Preload from "./Infrastructure/UI/Game/State/Preload";
import Menu from "./Infrastructure/UI/Game/State/Menu";
import Play from "./Infrastructure/UI/Game/State/Play";

class SimpleGame extends Phaser.Game {

    constructor()
    {
        super(
            1200,
            800,
            Phaser.CANVAS,
            'content',
            null
        );

        this.antialias = false;
        this.state.add('Boot', Boot);
        this.state.add('Preload', Preload);
        this.state.add('Menu', Menu);
        this.state.add('Play', Play);
        this.state.start('Boot');
    }
}

window.onload = () => {
    new SimpleGame();
};
