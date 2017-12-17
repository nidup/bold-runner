
export class BackBag
{
    private gunAmnoAmount: number;
    private shotgunAmnoAmount: number;
    private moneyAmount: number;

    public constructor(data: {'gunAmno': number, 'shotgunAmno': number, 'money': number})
    {
        this.gunAmnoAmount = data.gunAmno;
        this.shotgunAmnoAmount = data.shotgunAmno;
        this.moneyAmount = data.money;
    }

    public gunAmno(): number
    {
        return this.gunAmnoAmount;
    }

    public shotgunAmno(): number
    {
        return this.shotgunAmnoAmount;
    }

    public money(): number
    {
        return this.moneyAmount;
    }
}
