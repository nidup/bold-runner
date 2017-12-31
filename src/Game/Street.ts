
import {Cops} from "../Character/Bot/Cops";
import {Cop} from "../Character/Bot/Cop";
import {Citizens} from "../Character/Bot/Citizens";
import {Citizen} from "../Character/Bot/Citizen";
import {Hero} from "../Character/Player/Hero";
import {Level} from "./Level";
import {BackBag} from "../Character/Player/BackBag";
import {Swats} from "../Character/Bot/Swats";
import {Swat} from "../Character/Bot/Swat";
import {Controller} from "./Controller";

export class Street
{
    private copRepository: Cops;
    private swatRepository: Swats;
    private citizenRepository: Citizens;
    private hero: Hero;
    private streetPositionX: number;
    private streetWidth: number;

    constructor(characterGroup: Phaser.Group, level: Level, backbag: BackBag, streetPositionX: number, streetWidth: number, heroController: Controller)
    {
        this.streetPositionX = streetPositionX;
        this.streetWidth = streetWidth;
        this.copRepository = new Cops();
        this.citizenRepository = new Citizens();
        this.swatRepository = new Swats();
        let nbReplicants = level.replicants();

        for (let indCop = 0; indCop < level.copsWithGun(); indCop++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            let isReplicant = false;
            let randReplicant = characterGroup.game.rnd.integerInRange(1, 5) === 1;
            if (nbReplicants > 0 && randReplicant) {
                isReplicant = true;
                nbReplicants--;
            }
            this.cops().add(new Cop(characterGroup, randX, randY, 'cop', this, isReplicant));
        }
        for (let indCop = 0; indCop < level.copsWithShotGun(); indCop++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            let isReplicant = false;
            let randReplicant = characterGroup.game.rnd.integerInRange(1, 5) === 1;
            if (nbReplicants > 0 && randReplicant) {
                isReplicant = true;
                nbReplicants--;
            }
            this.cops().add(new Cop(characterGroup, randX, randY, 'cop-shotgun', this, isReplicant));
        }
        for (let indSwat = 0; indSwat < level.swats(); indSwat++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            let isReplicant = false;
            let randReplicant = characterGroup.game.rnd.integerInRange(1, 5) === 1;
            if (nbReplicants > 0 && randReplicant) {
                isReplicant = true;
                nbReplicants--;
            }
            this.swats().add(new Swat(characterGroup, randX, randY, 'swat', this, isReplicant));
        }

        for (let indCiv = 0; indCiv < level.citizens(); indCiv++) {
            let randX = characterGroup.game.rnd.integerInRange(this.minX(), this.maxX());
            let randY = characterGroup.game.rnd.integerInRange(this.minY(), this.maxY());
            let isReplicant = false;
            if (nbReplicants > 0) {
                isReplicant = true;
                nbReplicants--;
            }
            this.citizens().add(new Citizen(characterGroup, randX, randY, 'citizen1', this, isReplicant));

        }

        this.hero = new Hero(characterGroup, this.minX(), this.maxY(), 'hero', this, backbag, heroController);
    }

    isEmpty(): boolean
    {
        return this.cops().allAlive().length === 0 && this.citizens().allAlive().length === 0 && this.swats().allAlive().length === 0;
    }

    player(): Hero
    {
        return this.hero;
    }

    cops(): Cops
    {
        return this.copRepository;
    }

    swats(): Swats
    {
        return this.swatRepository;
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
        return this.streetPositionX + 20;
    }

    maxX(): number
    {
        return this.streetWidth - 40;
    }
}
