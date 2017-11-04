
import {Cops} from "./Cops";

export class Street
{
    private copRepository: Cops;

    constructor()
    {
        this.copRepository = new Cops();
    }

    cops(): Cops
    {
        return this.copRepository;
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
