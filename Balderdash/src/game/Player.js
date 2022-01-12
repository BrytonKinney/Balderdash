class Player {
    id;
    name;
    isHost;
    word;
    definition;
    hasRealDefinition;
    constructor(id, name, isHost, word, definition, hasRealDefinition) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.word = word;
        this.definition = definition;
        this.hasRealDefinition = hasRealDefinition;
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
    setWord(word) {
        this.word = word;
    }
    setDefinition(definition) {
        this.definition = definition;
    }
    setHasRealDefinition(hasRealDefinition) {
        this.hasRealDefinition = hasRealDefinition;
    }
}
export { Player };
//# sourceMappingURL=Player.js.map