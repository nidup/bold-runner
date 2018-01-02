
import {StreetLimits} from "../Game/StreetLimits";
import {Hero} from "./Player/Hero";
import {Level} from "../Game/Level";
import {BackBag} from "./Player/BackBag";
import {Controller} from "../Game/Controller";
import {Street} from "../Game/Street";
import {Cop} from "./Bot/Cop";
import {Cops} from "./Bot/Cops";
import {Swat} from "./Bot/Swat";
import {Citizen} from "./Bot/Citizen";
import {Citizens} from "./Bot/Citizens";
import {Swats} from "./Bot/Swats";

export class CharactersGenerator
{
    private limits: StreetLimits;
    private characterGroup: Phaser.Group;
    private backbag: BackBag;
    private level: Level;
    private controller: Controller;
    private heroGunType: string;
    private heroPosition: Phaser.Point;
    
    constructor(
        characterGroup: Phaser.Group,
        limits: StreetLimits,
        level: Level,
        backbag: BackBag,
        heroController: Controller,
        heroGunType: string,
        heroPosition: Phaser.Point
    ) {
        this.limits = limits;
        this.characterGroup = characterGroup;
        this.level = level;
        this.backbag = backbag;
        this.controller = heroController;
        this.heroGunType = heroGunType;
        this.heroPosition = heroPosition;
    }

    generateHero(street: Street): Hero
    {
        const x = (this.heroPosition) ? this.heroPosition.x : this.limits.minX();
        const y = (this.heroPosition) ? this.heroPosition.y : this.limits.maxY();

        return new Hero(
            this.characterGroup,
            x,
            y,
            'hero',
            street,
            this.backbag,
            this.controller,
            this.heroGunType
        );
    }

    generateBots(street: Street, cops: Cops, citizens: Citizens, swats: Swats): void
    {
        let nbReplicants = this.level.replicants();
        for (let indCop = 0; indCop < this.level.copsWithGun(); indCop++) {
            let randX = this.characterGroup.game.rnd.integerInRange(this.limits.minX(), this.limits.maxX());
            let randY = this.characterGroup.game.rnd.integerInRange(this.limits.minY(), this.limits.maxY());
            let isReplicant = false;
            let randReplicant = this.characterGroup.game.rnd.integerInRange(1, 5) === 1;
            if (nbReplicants > 0 && randReplicant) {
                isReplicant = true;
                nbReplicants--;
            }
            cops.add(new Cop(this.characterGroup, randX, randY, 'cop', street, isReplicant));
        }
        for (let indCop = 0; indCop < this.level.copsWithShotGun(); indCop++) {
            let randX = this.characterGroup.game.rnd.integerInRange(this.limits.minX(), this.limits.maxX());
            let randY = this.characterGroup.game.rnd.integerInRange(this.limits.minY(), this.limits.maxY());
            let isReplicant = false;
            let randReplicant = this.characterGroup.game.rnd.integerInRange(1, 5) === 1;
            if (nbReplicants > 0 && randReplicant) {
                isReplicant = true;
                nbReplicants--;
            }
            cops.add(new Cop(this.characterGroup, randX, randY, 'cop-shotgun', street, isReplicant));
        }
        for (let indSwat = 0; indSwat < this.level.swats(); indSwat++) {
            let randX = this.characterGroup.game.rnd.integerInRange(this.limits.minX(), this.limits.maxX());
            let randY = this.characterGroup.game.rnd.integerInRange(this.limits.minY(), this.limits.maxY());
            let isReplicant = false;
            let randReplicant = this.characterGroup.game.rnd.integerInRange(1, 5) === 1;
            if (nbReplicants > 0 && randReplicant) {
                isReplicant = true;
                nbReplicants--;
            }
            swats.add(new Swat(this.characterGroup, randX, randY, 'swat', street, isReplicant));
        }

        for (let indCiv = 0; indCiv < this.level.citizens(); indCiv++) {
            let randX = this.characterGroup.game.rnd.integerInRange(this.limits.minX(), this.limits.maxX());
            let randY = this.characterGroup.game.rnd.integerInRange(this.limits.minY(), this.limits.maxY());
            let isReplicant = false;
            if (nbReplicants > 0) {
                isReplicant = true;
                nbReplicants--;
            }
            citizens.add(new Citizen(this.characterGroup, randX, randY, 'citizen1', street, isReplicant));
        }
    }
}
