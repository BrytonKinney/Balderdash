class Player {

    constructor(public id: string, public name: string, public isHost: boolean) {
    }

    public setName(name: string): void {
        this.name = name;
    }
    public setId(id: string): void {
        this.id = id;
    }
    public setIsHost(isHost: boolean): void {
        this.isHost = isHost;
    }
}

export { Player };