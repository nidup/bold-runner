
export interface Controller
{
    goingLeft(): boolean;
    goingRight(): boolean;
    goingDown(): boolean;
    goingUp(): boolean;
    shooting(): boolean;
    switchingWeapon(): boolean;
    supported(): boolean;
    identifier(): string;
}

export class KeyBoardController implements Controller
{
    private cursors: Phaser.CursorKeys;
    private shotKey: Phaser.Key;
    private switchKey: Phaser.Key;

    constructor(game: Phaser.Game)
    {
        this.cursors = game.input.keyboard.createCursorKeys();
        this.shotKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.switchKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    }

    goingLeft(): boolean
    {
        return this.cursors.left.isDown;
    }

    goingRight(): boolean
    {
        return this.cursors.right.isDown;
    }

    goingDown(): boolean
    {
        return this.cursors.down.isDown;
    }

    goingUp(): boolean
    {
        return this.cursors.up.isDown;
    }

    shooting(): boolean
    {
        return this.shotKey.isDown;
    }

    switchingWeapon(): boolean
    {
        return this.switchKey.isDown;
    }

    supported(): boolean
    {
        return true;
    }

    identifier(): string
    {
        return 'keyboard';
    }
}

export class GamePadController implements Controller
{
    private game: Phaser.Game;
    private pad: Phaser.SinglePad;

    constructor(game: Phaser.Game)
    {
        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
        this.game = game;

        if (!game.input.gamepad.supported) {
            throw new Error("Game pad not supported");
        }
        if (!game.input.gamepad.active) {
            throw new Error("Game pad is inactive");
        }
    }

    supported(): boolean
    {
        return this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected;
    }

    goingLeft(): boolean
    {
        return (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1);
    }

    goingRight(): boolean
    {
         return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1;
    }

    goingDown(): boolean
    {
         return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1;
    }

    goingUp(): boolean
    {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1;
    }

    shooting(): boolean
    {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_X);
    }

    switchingWeapon(): boolean
    {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_Y);
    }

    identifier(): string
    {
        return 'gamepad';
    }
}
