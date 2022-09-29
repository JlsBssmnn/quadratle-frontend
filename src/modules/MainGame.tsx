import Grid, { TilePath } from "./Grid";

import styles from "../styles/Game.module.css";
import { createEffect, createSignal } from "solid-js";
import WordList from "./WordList";
import PathEvaluater from "../logic/PathEvaluater";
import Progress from "./Progress";

export interface GameProps {
  grid: string[][];
  correctWords: string[];
  wordLengths: number[];
}

type WordState = "recording" | "right" | "wrong";

export default function MainGame(props: GameProps) {
  const [discoveredWords, setDiscoveredWords] = createSignal<
    Map<number, string[]>
  >(new Map());
  const [recordedWord, setRecordedWord] = createSignal<string>("");
  const [wordState, setWordState] = createSignal<WordState>("recording");

  const evaluater = new PathEvaluater(props.grid, props.correctWords);

  function newRecording() {
    setWordState("recording");
  }

  function pathRecordEnding() {
    if (evaluater.verifyWord(recordedWord(), setDiscoveredWords)) {
      setWordState("right");
    } else {
      setWordState("wrong");
    }
  }

  function numberOfCorrectWords(): number {
    return Array.from(discoveredWords().values()).reduce(
      (previousValue, currentValue) => previousValue + currentValue.length,
      0
    );
  }

  return (
    <div class={styles.game}>
      <WordList
        wordLengths={props.wordLengths}
        discoveredWords={discoveredWords()}
      />
      <div class={styles.main}>
        <Progress
          discoveredWords={numberOfCorrectWords()}
          totalWords={props.correctWords.length}
        />
        <div
          classList={{
            [styles.recordedWord]: true,
            [styles.rightWord]: wordState() == "right",
            [styles.wrongWord]: wordState() == "wrong",
          }}
        >
          {recordedWord()}
        </div>
        <Grid
          board={props.grid}
          correctWords={props.correctWords}
          submitPathRecording={pathRecordEnding}
          setRecordedWord={setRecordedWord}
          newRecording={newRecording}
        />
      </div>
    </div>
  );
}
