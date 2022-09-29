import { For, Show } from "solid-js";
import WordListing from "./WordListing";
import styles from "../styles/WordList.module.css";

interface WordListProps {
  discoveredWords: Map<number, string[]>;
  wordLengths: number[];
}

export default function WordList(props: WordListProps) {
  return (
    <div class={styles.wordList}>
      <For each={props.wordLengths}>
        {(item, index) => (
          <>
            <WordListing
              wordLength={item}
              words={props.discoveredWords.get(item)}
            />
            <Show when={index() != props.wordLengths.length - 1}>
              <hr />
            </Show>
          </>
        )}
      </For>
    </div>
  );
}
