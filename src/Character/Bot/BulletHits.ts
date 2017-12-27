
import {Cop} from "./Cop";
import {Street} from "../../Game/Street";
import {Citizen} from "./Citizen";
import {Swat} from "./Swat";
import {Hero} from "../Player/Hero";
import {BaseGun} from "../../Weapon/BaseGun";

export class BulletHits
{
    private shooter: Phaser.Sprite;
    private gun: BaseGun;
    private street: Street;

    constructor(myself: Phaser.Sprite, myGun: BaseGun, street: Street)
    {
        this.shooter = myself;
        this.gun = myGun;
        this.street = street;
    }

    hit()
    {
        const myself = this.shooter;
        const myGun = this.gun;
        const otherAliveCops = this.street.cops().allAlive().filter(
            function (cop: Cop) {
                return cop !== myself;
            }
        );
        myGun.bulletHits(
            otherAliveCops,
            function(cop: Cop, bullet: Phaser.Bullet) {
                bullet.kill();
                cop.hurt(myGun.damage());
            }
        );

        const otherAliveSwats = this.street.swats().allAlive().filter(
            function (swat: Swat) {
                return swat !== myself;
            }
        );
        myGun.bulletHits(
            otherAliveSwats,
            function(swat: Swat, bullet: Phaser.Bullet) {
                bullet.kill();
                swat.hurt(myGun.damage());
            }
        );

        myGun.bulletHits(
            this.street.citizens().allAlive(),
            function(citizen: Citizen, bullet: Phaser.Bullet) {
                bullet.kill();
                citizen.hurt(myGun.damage());
            }
        );

        myGun.bulletHits(
            this.street.player(),
            function(hero: Hero, bullet: Phaser.Bullet) {
                bullet.kill();
                hero.hurt(myGun.damage());
            }
        );
    }
}
