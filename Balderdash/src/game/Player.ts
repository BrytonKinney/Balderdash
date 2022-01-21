class Player {

    constructor(public id: string,
        public name: string,
        public isHost: boolean,
        public word: string,
        public definition: string,
        public hasRealDefinition: boolean,
        public hasSubmittedVote: boolean) {
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
    public setHasSubmittedVote(hasSubmittedVote: boolean): void {
        this.hasSubmittedVote = hasSubmittedVote;
    }

    public update(id: string, name: string, isHost: boolean, word: string, definition: string, hasRealDefinition: boolean): void {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.word = word;
        this.definition = definition;
        this.hasRealDefinition = hasRealDefinition;
    }
}

export { Player };