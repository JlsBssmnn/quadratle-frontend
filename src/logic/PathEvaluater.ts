import { TilePath } from "../modules/Grid";
import { sha256 } from "js-sha256";
import { Setter } from "solid-js";

export default class PathEvaluater {
  board: string[][];
  correctWords: Set<string>;
  undiscoveredWords: Set<string>;
  discoveredWords: Set<string>;

  constructor(
    board: string[][],
    correctWords: string[],
    initialDiscoveredWords?: string[]
  ) {
    this.board = board;
    this.correctWords = new Set(correctWords);
    this.discoveredWords = new Set(
      initialDiscoveredWords?.filter((word) =>
        this.correctWords.has(sha256(word))
      )
    );

    const hashedDiscoveredWords = Array.from(this.discoveredWords).map((word) =>
      sha256(word)
    );
    this.undiscoveredWords = new Set(
      correctWords.filter((word) => !hashedDiscoveredWords.includes(word))
    );
  }

  pathToString(path: TilePath): string {
    let s = "";
    for (let tile of path) {
      s += this.board[tile.row][tile.column];
    }
    return s;
  }

  verifyWord(
    s: string,
    discoveredWords: Setter<Map<number, string[]>>
  ): boolean {
    let hash = sha256(s);
    const correct = this.undiscoveredWords.has(hash);

    if (correct) {
      this.undiscoveredWords.delete(hash);
      this.discoveredWords.add(s);

      localStorage.setItem(
        "discoveredWords",
        JSON.stringify(Array.from(this.discoveredWords))
      );

      discoveredWords((old) => {
        if (old.has(s.length)) {
          return new Map(old.set(s.length, [...old.get(s.length)!, s]));
        } else {
          return new Map(old.set(s.length, [s]));
        }
      });
    }

    return correct;
  }
}
