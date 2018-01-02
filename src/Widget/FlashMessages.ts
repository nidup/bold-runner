
import {
    BaseEvent, CitizenKilled, CopKilled, GameEvents, HeroKilled, HeroNursed, MoneyPicked,
    ShotGunPicked
} from "../Character/Player/Events";
import {Hero} from "../Character/Player/Hero";

export class FlashMessages
{
    private group: Phaser.Group;
    private gameEvents: GameEvents;
    private hero: Hero;

    constructor(group: Phaser.Group, gameEvents: GameEvents, hero: Hero)
    {
        this.group = group;
        this.gameEvents = gameEvents;
        this.gameEvents.addListener(this.buildMessages, this);
        this.hero = hero;
    }

    private buildMessages(raisedEvent: BaseEvent, callbackContext: any): void
    {
        const messages = [];
        if (raisedEvent instanceof CopKilled) {
            callbackContext.buildCopKillerMessage(messages);
            callbackContext.buildCarnageMessage(messages);
        }

        if (raisedEvent instanceof CitizenKilled) {
            callbackContext.buildCarnageMessage(messages);
        }

        if (raisedEvent instanceof ShotGunPicked) {
            callbackContext.buildFirstShotgunMessage(messages);
        }

        if (raisedEvent instanceof MoneyPicked) {
            callbackContext.buildPickedMoneyMessage(messages, raisedEvent);
        }

        if (raisedEvent instanceof HeroNursed) {
            messages.push(new Message("Got nursed :)"));
        } else if (raisedEvent instanceof HeroKilled) {
            messages.push(new Message("Got killed :("));
        }

        const x = callbackContext.hero.x - 130;
        const fromY = 500;
        let startDelay = 0;
        messages.forEach(function(message: Message) {
            const newMessage = callbackContext.group.game.add.bitmapText(x, fromY, 'carrier-command', message.content(), 20);
            const duration = 3000;
            const tweenAlpha = callbackContext.group.game.add.tween(newMessage).to( { alpha: 0 }, duration, "Linear", true, startDelay);
            callbackContext.group.game.add.tween(newMessage).to( { y: newMessage.y - 400 }, duration, "Linear", true, startDelay);
            tweenAlpha.onComplete.addOnce(function () {newMessage.destroy();});
            startDelay = startDelay + 350;
        });
    }

    private buildCopKillerMessage(messages: Message[])
    {
        const lastSeconds = this.group.game.time.now - 10000;
        const lastKilledEvents = this.gameEvents.all()
            .filter(function(event: BaseEvent) {
                return event instanceof CopKilled;
            }).filter(function(event: BaseEvent) {
                return event.time() >= lastSeconds;
            });

        if (lastKilledEvents.length >= 10) {
            messages.push(new Message("Cop killer! " + lastKilledEvents.length + " cops killed!!!"));
        } else if (lastKilledEvents.length >= 5) {
            messages.push(new Message("Cop killer! " + lastKilledEvents.length + " cops killed!!!"));
        } else if (lastKilledEvents.length >= 2) {
            messages.push(new Message("Cop killer! " + lastKilledEvents.length + " cops killed!!!"));
        }
    }

    private buildCarnageMessage(messages: Message[])
    {
        const lastSeconds = this.group.game.time.now - 10000;
        const lastKilledEvents = this.gameEvents.all()
            .filter(function(event: BaseEvent) {
                return event instanceof CitizenKilled || event instanceof CopKilled;
            }).filter(function(event: BaseEvent) {
                return event.time() >= lastSeconds;
            });

        if (lastKilledEvents.length >= 10) {
            messages.push(new Message("Rampage! " + lastKilledEvents.length + " killed!!!"));
        } else if (lastKilledEvents.length >= 6) {
            messages.push(new Message("Carnage! " + lastKilledEvents.length + " killed!!!"));
        } else if (lastKilledEvents.length >= 3) {
            messages.push(new Message("Butchery! " + lastKilledEvents.length + " killed!!!"));
        }
    }

    private buildFirstShotgunMessage(messages: Message[])
    {
        const shotgunPickedEvents = this.gameEvents.all().filter(function(event: BaseEvent) {
            return event instanceof ShotGunPicked;
        });
        if (shotgunPickedEvents.length === 1) {
            messages.push(new Message("Got a shotgun, hell yeah!"));
        }
    }

    private buildPickedMoneyMessage(messages: Message[], raisedEvent: MoneyPicked)
    {
        const moneyPickedEvents = this.gameEvents.all().filter(function(event: BaseEvent) {
            return event instanceof MoneyPicked;
        });
        if (raisedEvent.totalAmount() >= 500 && raisedEvent.totalAmount() - raisedEvent.pickedAmount() <= 500) {
            messages.push(new Message("Money! 500 credits picked!"));
        } else if (raisedEvent.totalAmount() >= 1000 && raisedEvent.totalAmount() - raisedEvent.pickedAmount() <= 1000) {
            messages.push(new Message("Money! 1000 credits picked!"));
        } else if (moneyPickedEvents.length === 1) {
            messages.push(new Message("Money! "+raisedEvent.pickedAmount()+" credits picked!"));
        }
    }
}

class Message
{
    private text: string;

    constructor(content: string)
    {
        this.text = content;
    }

    content()
    {
        return this.text;
    }
}
