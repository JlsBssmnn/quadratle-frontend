import { For, Show } from "solid-js";
import { TilePath, TilePosition } from "./Grid";
import styles from "../styles/Path.module.css";

export default function Path(props: { path: TilePath; offset: number }) {
  const n = () => props.path.length;

  const tileSize = (100 - 3 * props.offset) / 4;
  const circleSize = 11;
  const innerOffsetCircle = tileSize / 2 - circleSize / 2;
  const lineSize = tileSize / 4;
  const innerOffsetLine = tileSize / 2 - lineSize / 2;
  const additionalLineLength = 3; // How much the line goes beyond the center of a tile

  function getRotation(tile1: TilePosition, tile2: TilePosition): number[] {
    if (tile1.column - tile2.column == 1) {
      switch (tile1.row - tile2.row) {
        case 1:
          return [225, Math.sqrt(2)];
        case 0:
          return [180, 1];
        case -1:
          return [135, Math.sqrt(2)];
      }
    } else if (tile1.column - tile2.column == 0) {
      switch (tile1.row - tile2.row) {
        case 1:
          return [270, 1];
        case -1:
          return [90, 1];
      }
    } else if (tile1.column - tile2.column == -1) {
      switch (tile1.row - tile2.row) {
        case 1:
          return [315, Math.sqrt(2)];
        case 0:
          return [0, 1];
        case -1:
          return [45, Math.sqrt(2)];
      }
    }
    throw new Error(`Got wrong tiles in path ${tile1}, ${tile2}`);
  }

  return (
    <Show when={n() > 0}>
      <div class={styles.container}>
        <div
          class={styles.circle}
          style={{
            width: `${circleSize}%`,
            height: `${circleSize}%`,
            top: `${
              props.path[0].row * (tileSize + props.offset) + innerOffsetCircle
            }%`,
            left: `${
              props.path[0].column * (tileSize + props.offset) +
              innerOffsetCircle
            }%`,
          }}
        ></div>
        {() => {
          // calculate rotations and horizontal scaling for each path segment
          var rotations = new Array(n() - 1);
          var scalings = new Array(n() - 1);

          props.path.slice(0, -1).forEach((val, i) => {
            const calc = getRotation(val, props.path[i + 1]);
            rotations[i] = calc[0];

            if (calc[0] % 10 != 0) {
              scalings[i] =
                ((tileSize + props.offset) * calc[1] + additionalLineLength) /
                (tileSize + props.offset + additionalLineLength);
            } else {
              scalings[i] = calc[1];
            }
          });
          return (
            <For each={props.path}>
              {(tile, index) => (
                <Show when={index() < n() - 1}>
                  <div
                    class={styles.line}
                    style={{
                      height: `${lineSize}%`,
                      width: `${
                        tileSize + props.offset + additionalLineLength
                      }%`,
                      top: `${
                        tile.row * (tileSize + props.offset) + innerOffsetLine
                      }%`,
                      left: `${
                        tile.column * (tileSize + props.offset) + tileSize / 2
                      }%`,
                      "transform-origin": "0% 50%",
                      transform: `rotate(${rotations[index()]}deg) scaleX(${
                        scalings[index()]
                      })`,
                      "border-radius": `0 ${2 * additionalLineLength}% ${
                        2 * additionalLineLength
                      }% 0 / 0 50% 50% 0`,
                    }}
                  ></div>
                </Show>
              )}
            </For>
          );
        }}
      </div>
    </Show>
  );
}
