import { Component, createEffect, createSignal, Show } from "solid-js";

import styles from "./App.module.css";
import MainGame, { GameProps } from "./modules/MainGame";

const App: Component = () => {
  const [gameState, setGameState] = createSignal<GameProps>();

  createEffect(async () => {
    const res = await fetch("https://quadratle-backend.herokuapp.com/");
    const json = await res.json();

    const grid = json.grid as string[][];

    let initialDiscoveredWords: string[] | undefined = undefined;

    if (
      localStorage.getItem("timestamp") ===
      new Date().toLocaleDateString("de-DE")
    ) {
      const storedWords = localStorage.getItem("discoveredWords");
      if (storedWords != null) {
        initialDiscoveredWords = JSON.parse(storedWords);
      }
    } else {
      localStorage.removeItem("discoveredWords");
      localStorage.setItem("timestamp", new Date().toLocaleDateString("de-DE"));
    }

    setGameState({
      grid,
      correctWords: json.solution,
      counts: json.counts,
      initialDiscoveredWords,
    });
  });

  return (
    <div class={styles.header}>
      <Show when={gameState() != null}>
        <MainGame
          grid={gameState()!.grid}
          correctWords={gameState()!.correctWords}
          counts={gameState()!.counts}
          initialDiscoveredWords={gameState()!.initialDiscoveredWords}
        />
      </Show>
      <Show when={gameState() == null}>Loading...</Show>
    </div>
  );
};

export default App;
