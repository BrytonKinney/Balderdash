﻿interface IGameEvent<T> {
    on(handler: { (data?: T): void }): void;
    off(handler: { (data?: T): void }): void;
}

class GameEvent<T> implements IGameEvent<T> {
    private handlers: { (data?: T): void; }[] = [];

    public on(handler: { (data?: T): void }): void {
        this.handlers.push(handler);
    }

    public off(handler: { (data?: T): void }): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data?: T) : void {
        this.handlers.slice(0).forEach(h => h(data));
    }

    public expose(): IGameEvent<T> {
        return this;
    }
}

export { IGameEvent, GameEvent };