var Player = /** @class */ (function () {
    function Player(id, name, isHost) {
        this._id = id;
        this._name = name;
        this.IsHost = isHost;
    }
    Object.defineProperty(Player.prototype, "Name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "Id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: false,
        configurable: true
    });
    return Player;
}());
export { Player };
//# sourceMappingURL=Player.js.map