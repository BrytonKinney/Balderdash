class Player {
    id;
    name;
    isHost;
    constructor(id, name, isHost) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
    }
    setName(name) {
        this.name = name;
    }
    setId(id) {
        this.id = id;
    }
    setIsHost(isHost) {
        this.isHost = isHost;
    }
}
export { Player };
//# sourceMappingURL=Player.js.map