
export interface BaseGun
{
    fire();
    turnToTheLeft();
    turnToTheRight();
    bullets();
    bulletHits(targets, overlapCallback);
    amno(): number;
    reload(amount: number);
}