export interface IGameWord {
    word: string;
    definition: string;
}
export class GameWord implements IGameWord {
    constructor(public word: string, public definition: string) {

    }
}