export class PlayerSubmission {
    constructor(
        public submittedById: string,
        public word: string,
        public definition: string,
        public votes: number) { }
}