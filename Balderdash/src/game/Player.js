class Player {
    id;
    name;
    isHost;
    word;
    definition;
    hasRealDefinition;
    hasSubmittedVote;
    wasKicked;
    constructor(id, name, isHost, word, definition, hasRealDefinition, hasSubmittedVote, wasKicked) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.word = word;
        this.definition = definition;
        this.hasRealDefinition = hasRealDefinition;
        this.hasSubmittedVote = hasSubmittedVote;
        this.wasKicked = wasKicked;
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
    setWasKicked(wasKicked) {
        this.wasKicked = wasKicked;
    }
    update(id, name, isHost, word, definition, hasRealDefinition, wasKicked) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.word = word;
        this.definition = definition;
        this.hasRealDefinition = hasRealDefinition;
        this.wasKicked = wasKicked;
    }
}
export { Player };
//# sourceMappingURL=Player.js.map