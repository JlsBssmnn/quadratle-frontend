import { createEffect, createSignal, For, Setter } from "solid-js";
import Tile from "./Tile";
import styles from "../styles/Grid.module.css";
import Path from "./Path";

export interface TilePosition {
  row: number;
  column: number;
}

export type TilePath = TilePosition[];

interface GridProps {
  board: string[][];
  correctWords: string[];
  submitPathRecording: () => void;
  newRecording: () => void;
  setRecordedWord: Setter<string>;
}

export default function Grid(props: GridProps) {
  const [selectedTiles, setSelectedTiles] = createSignal<TilePath>([]);
  const [recordPath, setRecordPath] = createSignal<boolean>(false);
  const [hoveredTile, setHoveredTile] = createSignal<TilePosition | null>(null);

  const gridGap = 2;

  let timerId: number;

  createEffect(() => {
    if (!recordPath()) {
      return;
    }
    if (hoveredTile() != null) {
      // Is this tile already in our path?
      if (
        selectedTiles().some(
          (tile) =>
            tile.row == hoveredTile()?.row &&
            tile.column == hoveredTile()?.column
        )
      ) {
        return;
      }

      // Are we actually allowed to select the tile?
      const tiles = selectedTiles();
      const l = tiles.length;
      const tile = hoveredTile() as TilePosition;
      if (
        l != 0 &&
        (Math.abs(tiles[l - 1].row - tile.row) > 1 ||
          Math.abs(tiles[l - 1].column - tile.column) > 1)
      ) {
        return;
      }

      setSelectedTiles((tiles) => [...tiles, hoveredTile() as TilePosition]);
      props.setRecordedWord(
        (old) => old + props.board[hoveredTile()!.row][hoveredTile()!.column]
      );
    }
  });

  function mouseDown(e: MouseEvent) {
    e.preventDefault();
    if (hoveredTile() != null) {
      setRecordPath(true);
      setSelectedTiles([hoveredTile() as TilePosition]);

      clearTimeout(timerId);
      props.setRecordedWord(
        props.board[hoveredTile()!.row][hoveredTile()!.column]
      );
      props.newRecording();
    }
  }

  function finishRecording() {
    if (!recordPath()) {
      return;
    }
    setRecordPath(false);
    props.submitPathRecording();
    setSelectedTiles([]);

    timerId = setTimeout(() => {
      props.setRecordedWord("");
    }, 2000);
  }

  function mouseUp() {
    finishRecording();
  }

  function mouseLeave() {
    finishRecording();
  }

  function tileEnter(row: number, column: number) {
    return (e: MouseEvent) => {
      setHoveredTile({
        row,
        column,
      });
    };
  }

  function tileLeave(row: number, column: number) {
    return (e: MouseEvent) => {
      setHoveredTile(null);
    };
  }

  return (
    <div
      class={styles.grid}
      style={{ gap: `${gridGap}%` }}
      onmousedown={(e) => mouseDown(e)}
      onmouseup={() => mouseUp()}
      onmouseleave={() => mouseLeave()}
    >
      <Path path={selectedTiles()} offset={gridGap} />
      <For each={props.board}>
        {(item, index) => (
          <For each={item}>
            {(item2, index2) => (
              <Tile
                char={item2}
                selected={selectedTiles().some(
                  (tile) => tile.row == index() && tile.column == index2()
                )}
                enterNotifier={tileEnter(index(), index2())}
                leaveNotifier={tileLeave(index(), index2())}
              />
            )}
          </For>
        )}
      </For>
    </div>
  );
}
