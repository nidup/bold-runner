
import {Civil} from "./Civil";

export class Civils
{
    private items : Civil[];

    public constructor()
    {
        this.items = [];
    }

    public all(): Civil[]
    {
        return this.items;
    }

    public allAlive(): Civil[]
    {
        return this.items.filter(function (civil: Civil) {
            return civil.health > 0;
        });
    }

    public add(civil: Civil): void
    {
        this.items.push(civil);
    }

    public remove(civil: Civil): void
    {
        const index = this.items.indexOf(civil);
        this.items.splice(index, 1);
    }

    public length(): number
    {
        return this.items.length;
    }
}
