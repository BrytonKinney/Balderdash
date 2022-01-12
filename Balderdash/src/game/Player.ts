class Player {

    constructor(public id: string,
        public name: string,
        public isHost: boolean,
        public word: string,
        public definition: string,
        public hasRealDefinition: boolean) {
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
    public setWord(word: string): void {
        this.word = word;
    }
    public setDefinition(definition: string): void {
        this.definition = definition;
    }
    public setHasRealDefinition(hasRealDefinition: boolean): void {
        this.hasRealDefinition = hasRealDefinition;
    }
}

export { Player };