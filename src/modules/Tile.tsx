import styles from "../styles/Tile.module.css";

interface TileProps {
  char: string;
  selected: boolean;
  enterNotifier: (e: MouseEvent) => void;
  leaveNotifier: (e: MouseEvent) => void;
}

export default function Tile(props: TileProps) {
  return (
    <div
      class={props.selected ? styles.tileSelected : styles.tile}
      onmouseenter={(e) => props.enterNotifier(e)}
      onmouseleave={(e) => props.leaveNotifier(e)}
    >
      {props.char.toUpperCase()}
    </div>
  );
}
