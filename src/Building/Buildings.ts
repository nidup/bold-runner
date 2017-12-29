
import {Building} from "./Building";

export class Buildings
{
    private items : Building[];

    public constructor()
    {
        this.items = [];
    }

    public all(): Building[]
    {
        return this.items;
    }

    public add(citizen: Building): void
    {
        this.items.push(citizen);
    }

    public length(): number
    {
        return this.items.length;
    }
}
