
import {Config} from "../../Config";
import {GamePadController, KeyBoardController} from "../Controller";

export default class Menu extends Phaser.State {

    private startText : Phaser.BitmapText;
    private controlsKey: Phaser.Key;
    private cursors: Phaser.CursorKeys;
    private keyboardController: KeyBoardController;
    private gamepadController: GamePadController;
    private gamepadIndicatorSprite: Phaser.Sprite;
    private gamepadIndicatorText : Phaser.BitmapText;
    private controlsKeyboardText: string;
    private controlsGamepadText: string;
    private controlsText: Phaser.BitmapText;
    private choseController: string;

    public create ()
    {
        const smallFontSize = 10;
        const largeFontSize = 34;
        this.game.stage.backgroundColor = '#1b1128';
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //this.background = this.game.add.sprite(0, 0, 'Menu');
        //this.background.scale.set(Config.pixelScaleRatio(), Config.pixelScaleRatio());

        const titleX = 260;
        const titleY = 213;
        this.game.add.bitmapText(titleX, titleY, 'carrier-command','Bold Runner', largeFontSize);

        const storyX = titleX;
        const storyY = titleY + 100;
        const storyText = "You're Rick and you're missioned to destroy androids which\n\n"
            +"escape from Rosen industries during their transfer to Mars.\n\n\n"
            +"Your employer wants to keep this mission secret, you have \n\n"
            +"no support and there is no way to recognize androids and\n\n"
            +"citizens.";
        this.game.add.bitmapText(storyX, storyY, 'carrier-command',storyText, smallFontSize);

        const controlsChoiceX = storyX;
        const controlsChoiceY = storyY + 150;
        this.controlsKeyboardText = "Keyboard controls:\n\n"
            +" - Move: arrows\n\n"
            +" - Fire: space bar\n\n"
            +" - Switch weapon: S\n\n";

        this.controlsGamepadText = "Gamepad controls:\n\n"
            +" - Move: arrows\n\n"
            +" - Fire: button X\n\n"
            +" - Switch weapon: button Y\n\n";

        this.controlsText = this.game.add.bitmapText(controlsChoiceX, controlsChoiceY, 'carrier-command',this.controlsKeyboardText, smallFontSize);

        this.keyboardController = new KeyBoardController(this.game);
        this.gamepadController = new GamePadController(this.game);

        const indicatorX = controlsChoiceX;
        const indicatorY = controlsChoiceY + 100;
        this.gamepadIndicatorSprite = this.game.add.sprite(indicatorX,indicatorY, 'ControllerIndicator');
        this.gamepadIndicatorSprite.scale.set(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.gamepadIndicatorText = this.game.add.bitmapText(indicatorX + 50, indicatorY + 10, 'carrier-command','', smallFontSize);

        const startX = indicatorX;
        const startY = indicatorY + 80;
        this.startText = this.game.add.bitmapText(startX, startY, 'carrier-command','Press space to start', smallFontSize);
        this.startText.alpha = 1;
        const tweenAlpha = this.game.add.tween(this.startText).to( { alpha: 0.3 }, 0, "Linear", true);
        tweenAlpha.repeat(10000, 500);

        const authorX = 1000;
        const authorY = 740;
        this.game.add.bitmapText(authorX, authorY, 'carrier-command','Nidup, 2018', smallFontSize);

        const spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);
        this.controlsKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.choseController = 'keyboard';
    }

    public update()
    {
        if (this.gamepadController.supported()) {
            this.gamepadIndicatorSprite.animations.frame = 0;
            this.gamepadIndicatorText.setText('Gamepad is supported, press X to switch controls');
            if (this.controlsKey.justDown) {
                if (this.choseController === 'keyboard') {
                    this.choseController = 'gamepad';
                    this.controlsText.setText(this.controlsGamepadText);
                } else {
                    this.choseController = 'keyboard';
                    this.controlsText.setText(this.controlsKeyboardText);
                }
            }
        } else {
            this.gamepadIndicatorSprite.animations.frame = 1;
            this.gamepadIndicatorText.setText('Gamepad is not supported, try to re-plug');
            this.choseController = 'keyboard';
        }
    }

    public startGame ()
    {
        this.game.state.start('Play', true, false, this.choseController);
    }

    public shutdown ()
    {
        this.startText.destroy();
    }
}
