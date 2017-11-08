
import {Cops} from "./Cops";
import {Cop} from "./Cop";
import {Citizens} from "./Citizens";
import {Citizen} from "./Citizen";
import {Hero} from "./Hero";
import {Level} from "./Level";
import {BackBag} from "./BackBag";

export class Street
{
    private copRepository: Cops;
    private citizenRepository: Citizens;
    private hero: Hero;

    constructor(characterGroup: Phaser.Group, level: Level, backbag: BackBag)
    {
        this.copRepository = new Cops();
        this.citizenRepository = new Citizens();

        for (let indCop = 0; indCop < level.copsWithGun(); indCop++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            this.cops().add(new Cop(characterGroup, randX, randY, 'cop', this));
        }
        for (let indCop = 0; indCop < level.copsWithShotGun(); indCop++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            this.cops().add(new Cop(characterGroup, randX, randY, 'cop-shotgun', this));
        }

        for (let indCiv = 0; indCiv < level.citizens(); indCiv++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            this.citizens().add(new Citizen(characterGroup, randX, randY, 'citizen1', this));
        }

        this.hero = new Hero(characterGroup, this.minX(), this.maxY(), 'hero', this, backbag);
    }

    isEmpty(): boolean
    {
        return this.cops().allAlive().length === 0 && this.citizens().allAlive().length === 0;
    }

    player(): Hero
    {
        return this.hero;
    }

    cops(): Cops
    {
        return this.copRepository;
    }

    citizens(): Citizens
    {
        return this.citizenRepository;
    }

    minY(): number
    {
        return 570;
    }

    maxY(): number
    {
        return 750;
    }

    minX(): number
    {
        return 20;
    }

    maxX(): number
    {
        return 1560;
    }
}
