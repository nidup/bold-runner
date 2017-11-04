
import {Cops} from "./Cops";
import {Civils} from "./Civils";

export class Street
{
    private copRepository: Cops;
    private civilRepository: Civils;

    constructor()
    {
        this.copRepository = new Cops();
        this.civilRepository = new Civils();
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
