import { Show } from "solid-js";
import styles from "../styles/WordList.module.css";

interface WordListingProps {
  wordLength: number;
  words: string[] | undefined;
}

export default function WordListing(props: WordListingProps) {
  return (
    <div>
      <div class={styles.letterHeading}>
        {props.wordLength} Buchstabe{props.wordLength != 1 && "n"}
      </div>
      <Show when={props.words}>
        <div class={styles.discoveredWords}>{props.words!.join(", ")}</div>
      </Show>
      <Show when={!props.words}>
        <div class={styles.noWords}>noch keine Wörter gefunden</div>
      </Show>
    </div>
  );
}
