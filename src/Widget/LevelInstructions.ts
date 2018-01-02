
import {Config} from "../Config";
import {Level} from "../Game/Level";

export class LevelInstructions extends Phaser.Sprite
{
    constructor(group: Phaser.Group, x: number, y: number, key: string, level: Level)
    {
        super(group.game, x, y, key, 0);
        group.add(this);

        this.scale.setTo(Config.pixelScaleRatio(), Config.pixelScaleRatio());
        this.fixedToCamera = true;

        const fontLevelSize = 13;
        const fontTutorialSize = 10;

        const levelText = this.game.add.bitmapText(this.x + 55, 55, 'carrier-command', '', fontLevelSize, group);
        levelText.fixedToCamera = true;
        levelText.setText("Level " + level.number());

        const lineLength = 42;
        const fullText = level.tutorial();
        const tokens = fullText.split(' ');
        let lines = [];
        let line = "";
        tokens.forEach(function(token: string) {
            if ((line + token).length >= lineLength) {
                lines.push(line);
                line = "";
            }
            line += " " + token;
        });
        lines.push(line);
        let formattedText = "";
        lines.forEach(function(line: string) {
            formattedText += line + "\n\n";
        });


        const tutorialText = this.game.add.bitmapText(this.x + 225, 50, 'carrier-command', formattedText, fontTutorialSize, group);
        tutorialText.fixedToCamera = true;
    }
}
