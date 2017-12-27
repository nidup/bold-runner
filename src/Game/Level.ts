
export class Level
{
    private num: number;
    private nbCopsWithGun: number;
    private nbCopsWithShotGun: number;
    private nbSwats: number;
    private nbCitizens: number;
    private nbReplicants: number;
    private tutorialText: string;

    constructor(num: number, data: any)
    {
        this.num = num;
        this.nbCopsWithGun = data['cops_with_gun'];
        this.nbCopsWithShotGun = data['cops_with_shotgun'];
        this.nbSwats = data['swats'];
        this.nbCitizens =  data['citizens'];
        this.tutorialText = data['tutorial'];
        this.nbReplicants = data['replicants'];
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

    public swats(): number
    {
        return this.nbSwats;
    }

    public citizens(): number
    {
        return this.nbCitizens;
    }

    public replicants(): number
    {
        return this.nbReplicants;
    }

    public tutorial(): string
    {
        return this.tutorialText;
    }
}
