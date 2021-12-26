class Player {
    _id: string;
    _name: string;
    _isHost: boolean;

    constructor(id: string, name: string, isHost: boolean) {
        this._id = id;
        this._name = name;
        this._isHost = isHost;
    }

    get Id() {
        return this._id;
    }

    set Id(value: string) {
        this._id = value;
    }

    get Name() {
        return this._name;
    }

    set Name(value: string) {
        this._name = value;
    }

    get IsHost() {
        return this._isHost;
    }
}

export { Player };