
export class Level
{
    private num: number;
    private nbCopsWithGun: number;
    private nbCopsWithShotGun: number;
    private nbCitizens: number;

    constructor(num: number, data: any)
    {
        this.num = num;
        this.nbCopsWithGun = data['cops_with_gun'];
        this.nbCopsWithShotGun = data['cops_with_shotgun'];
        this.nbCitizens =  data['citizens'];
    }

    public number(): number
    {
        return this.num;
    }

    public copsWithGun(): number
    {
        return this.nbCopsWithGun;
    }

    public copsWithShotGun(): number
    {
        return this.nbCopsWithShotGun;
    }

    public citizens(): number
    {
        return this.nbCitizens;
    }
}
