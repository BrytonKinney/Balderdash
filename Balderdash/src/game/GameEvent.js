class GameEvent {
    handlers = [];
    on(handler) {
        this.handlers.push(handler);
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    trigger(data) {
        this.handlers.slice(0).forEach(h => h(data));
    }
    expose() {
        return this;
    }
}
export { GameEvent };
//# sourceMappingURL=GameEvent.js.map