
// We don't use damage() method as it calls kill() on sprite
export interface CanBeHurt
{
    hurt(damage: number);

    isDying(): boolean;
}