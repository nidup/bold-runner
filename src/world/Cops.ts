
import {Cop} from "./Cop";

export class Cops
{
    private items : Cop[];

    public constructor()
    {
        this.items = [];
    }

    public all(): Cop[]
    {
        return this.items;
    }

    public add(cop: Cop): void
    {
        this.items.push(cop);
    }

    public remove(cop: Cop): void
    {
        const index = this.items.indexOf(cop);
        this.items.splice(index, 1);
    }

    public length(): number
    {
        return this.items.length;
    }
}
