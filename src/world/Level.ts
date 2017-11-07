
export class Level
{
    private num: number;
    private nbCops: number;
    private nbCitizens: number;

    constructor(num: number, data: any)
    {
        this.num = num;
        this.nbCops = data['cops'];
        this.nbCitizens =  data['citizens'];
    }

    public number(): number
    {
        return this.num;
    }

    public cops(): number
    {
        return this.nbCops;
    }

    public citizens(): number
    {
        return this.nbCitizens;
    }
}
