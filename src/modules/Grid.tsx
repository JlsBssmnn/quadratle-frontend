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

  // the id of the touch event that we want to track
  const [activeTouchEvent, setActiveTouchEvent] = createSignal<
    number | undefined
  >();

  const gridGap = 4;
  const dimensionality = 4;

  let timerId: number;

  let grid: HTMLElement | undefined = undefined;

  // this will be called whenever we hover over a different tile
  // we then might update the path that we record
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

  /**
   * This function gets a touch event and determines which tile is being hoverd
   * given this event. Note that we only track the `activeTouchEvent` to avoid
   * weird behavoir when using multiple fingers.
   */
  function updateHoveredTileTouch(e: TouchEvent) {
    const event = e.changedTouches[0];
    if (event.identifier !== activeTouchEvent()) {
      return;
    }

    const xPos =
      event.pageX - (grid!.getBoundingClientRect().left + window.scrollX);
    const yPos =
      event.pageY - (grid!.getBoundingClientRect().top + window.scrollY);
    const gridWidth = grid!.clientWidth;
    const gridHeight = grid!.clientHeight;

    if (xPos < 0 || xPos > gridWidth || yPos < 0 || yPos > gridHeight) {
      setHoveredTile(null);
      return;
    }
    const gapSize = (gridWidth * gridGap) / 100;
    const tileSize =
      (gridWidth - (dimensionality - 1) * gapSize) / dimensionality;

    const row = Math.floor(yPos / (tileSize + gapSize));
    const column = Math.floor(xPos / (tileSize + gapSize));

    const offsetX = xPos % (tileSize + gapSize);
    const offsetY = yPos % (tileSize + gapSize);

    if (offsetX <= tileSize && offsetY <= tileSize) {
      setHoveredTile({ row, column });
    } else {
      setHoveredTile(null);
    }
  }

  function startRecording() {
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

  function mouseDown(e: MouseEvent) {
    e.preventDefault();
    startRecording();
  }

  function touchStart(e: TouchEvent) {
    e.preventDefault();
    setActiveTouchEvent(e.changedTouches[0].identifier);
    updateHoveredTileTouch(e);
    startRecording();
  }

  function touchMove(e: TouchEvent) {
    e.preventDefault();
    updateHoveredTileTouch(e);
  }

  function mouseUp() {
    finishRecording();
  }

  function mouseLeave() {
    finishRecording();
  }

  function tileEnter(row: number, column: number) {
    return () => {
      setHoveredTile({
        row,
        column,
      });
    };
  }

  function tileLeave() {
    setHoveredTile(null);
  }

  return (
    <div
      class={styles.grid}
      style={{ gap: `${gridGap}%` }}
      onmousedown={(e) => mouseDown(e)}
      // @ts-ignore
      on:touchstart={(e: TouchEvent) => touchStart(e)}
      // @ts-ignore
      on:touchmove={(e: TouchEvent) => touchMove(e)}
      onmouseup={() => mouseUp()}
      onmouseleave={() => mouseLeave()}
      onTouchEnd={() => finishRecording()}
      onTouchCancel={() => finishRecording()}
      ref={grid}
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
                leaveNotifier={tileLeave}
              />
            )}
          </For>
        )}
      </For>
    </div>
  );
}
