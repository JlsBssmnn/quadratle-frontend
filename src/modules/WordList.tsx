import { For, Show } from "solid-js";
import WordListing from "./WordListing";
import styles from "../styles/WordList.module.css";

interface WordListProps {
  discoveredWords: Map<number, string[]>;
  counts: { [key: string]: number };
}

export default function WordList(props: WordListProps) {
  return (
    <div class={styles.wordList}>
      <div class={styles.container}>
        <For each={Object.keys(props.counts)}>
          {(item, index) => (
            <>
              <WordListing
                wordLength={parseInt(item)}
                words={props.discoveredWords.get(parseInt(item))}
                totalWords={props.counts[item]}
              />
              <Show when={index() != props.counts.length - 1}>
                <hr class={styles.line} />
              </Show>
            </>
          )}
        </For>
      </div>
    </div>
  );
}
