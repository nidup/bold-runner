
export class Level
{
    private num: number;
    private nbCopsWithGun: number;
    private nbCopsWithShotGun: number;
    private nbSwats: number;
    private nbCitizens: number;
    private nbReplicants: number;
    private tutorialText: string;
    private buildings: string[];

    constructor(num: number, data: any)
    {
        this.num = num;
        this.tutorialText = data['tutorial'];
        const characters = data['characters'];
        this.nbCopsWithGun = characters['cops_with_gun'];
        this.nbCopsWithShotGun = characters['cops_with_shotgun'];
        this.nbSwats = characters['swats'];
        this.nbCitizens =  characters['citizens'];
        this.nbReplicants = characters['replicants'];
        this.buildings = data['buildings'];
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

    public orderedBuildingTypes(): string[]
    {
        return this.buildings;
    }
}
