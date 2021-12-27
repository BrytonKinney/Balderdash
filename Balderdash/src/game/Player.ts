class Player {

    constructor(public id: string, public name: string, public readonly isHost: boolean) {
    }

    public setName(name: string): void {
        this.name = name;
    }
    public setId(id: string): void {
        this.id = id;
    }
}

export { Player };