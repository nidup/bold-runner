
import {Config} from "../game/Config";
import {Hero} from "../world/Hero";
import {Level} from "../world/Level";

export class LevelPanel extends Phaser.Sprite
{
    private level: Level;

    constructor(group: Phaser.Group, x: number, y: number, key: string, level: Level)
    {
        super(group.game, x, y, key, 0);
        group.add(this);

        this.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.fixedToCamera = true;

        const fontLevelSize = 13;
        const fontTutorialSize = 10;

        const levelText = this.game.add.bitmapText(55, 55, 'carrier-command', '', fontLevelSize, group);
        levelText.fixedToCamera = true;
        levelText.setText("Level " + level.number());

        const tutorialText = this.game.add.bitmapText(230, 55, 'carrier-command', level.tutorial(), fontTutorialSize, group);
        tutorialText.fixedToCamera = true;
    }
}
