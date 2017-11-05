
import {Cops} from "./Cops";
import {Cop} from "./Cop";
import {Civils} from "./Civils";
import {Civil} from "./Civil";
import {Hero} from "./Hero";

export class Street
{
    private copRepository: Cops;
    private civilRepository: Civils;
    private hero: Hero;

    constructor(characterGroup: Phaser.Group, nbCops: number, nbCitizens: number)
    {
        this.copRepository = new Cops();
        this.civilRepository = new Civils();

        for (let indCop = 0; indCop < nbCops; indCop++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            this.cops().add(new Cop(characterGroup, randX, randY, 'cop', this));
        }

        for (let indCiv = 0; indCiv < nbCitizens; indCiv++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            this.civils().add(new Civil(characterGroup, randX, randY, 'civil1'));
        }

        this.hero = new Hero(characterGroup, this.minX(), this.maxY(), 'hero', this);
    }

    player(): Hero
    {
        return this.hero;
    }

    cops(): Cops
    {
        return this.copRepository;
    }

    civils(): Civils
    {
        return this.civilRepository;
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
