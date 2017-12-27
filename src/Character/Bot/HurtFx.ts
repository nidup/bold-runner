
export class HurtFx
{
    blinkHumanOrReplicant(host: Phaser.Sprite, replicant: boolean)
    {
        let tint = 0xb43232;
        if (replicant) {
            tint = 0xaabcff;
        }
        host.game.add.tween(host).to({
            tint: tint,
        }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        host.game.add.tween(host).to({
            x: host.x - 5,
        }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
    }
}
