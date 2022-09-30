import styles from "../styles/Tile.module.css";

interface TileProps {
  char: string;
  selected: boolean;
  enterNotifier: () => void;
  leaveNotifier: () => void;
}

export default function Tile(props: TileProps) {
  return (
    <div
      class={props.selected ? styles.tileSelected : styles.tile}
      onmouseenter={() => props.enterNotifier()}
      onmouseleave={() => props.leaveNotifier()}
    >
      {props.char.toUpperCase()}
    </div>
  );
}
