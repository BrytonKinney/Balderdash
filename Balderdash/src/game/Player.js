class Player {
    id;
    name;
    isHost;
    word;
    definition;
    hasRealDefinition;
    hasSubmittedVote;
    constructor(id, name, isHost, word, definition, hasRealDefinition, hasSubmittedVote) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.word = word;
        this.definition = definition;
        this.hasRealDefinition = hasRealDefinition;
        this.hasSubmittedVote = hasSubmittedVote;
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
    setHasSubmittedVote(hasSubmittedVote) {
        this.hasSubmittedVote = hasSubmittedVote;
    }
    update(id, name, isHost, word, definition, hasRealDefinition) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.word = word;
        this.definition = definition;
        this.hasRealDefinition = hasRealDefinition;
    }
}
export { Player };
//# sourceMappingURL=Player.js.map