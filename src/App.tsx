import { Component, createEffect, createSignal, Show } from "solid-js";

import styles from "./App.module.css";
import MainGame, { GameProps } from "./modules/MainGame";

const App: Component = () => {
  const [gameState, setGameState] = createSignal<GameProps>();

  createEffect(async () => {
    const res = await fetch("https://quadratle-backend.herokuapp.com/");
    const json = await res.json();

    const grid = json.grid as string[][];
    const wordLengths = Object.keys(json.counts).map((num) => parseInt(num));

    setGameState({
      grid,
      correctWords: json.solution,
      wordLengths,
    });
  });

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Show when={gameState() != null}>
          <MainGame
            grid={gameState()!.grid}
            correctWords={gameState()!.correctWords}
            wordLengths={gameState()!.wordLengths}
          />
        </Show>
        <Show when={gameState() == null}>Loading...</Show>
      </header>
    </div>
  );
};

export default App;
