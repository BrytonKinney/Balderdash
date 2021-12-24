class Player {
    _id;
    _name;
    _isHost;
    constructor(id, name, isHost) {
        this._id = id;
        this._name = name;
        this._isHost = isHost;
    }
    get Id() {
        return this._id;
    }
    set Id(value) {
        this._id = value;
    }
    get Name() {
        return this._name;
    }
    set Name(value) {
        this._name = value;
    }
    get IsHost() {
        return this._isHost;
    }
}
export { Player };
//# sourceMappingURL=Player.js.map