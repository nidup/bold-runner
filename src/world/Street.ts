
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
}
