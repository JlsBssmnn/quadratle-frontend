import { createEffect, createSignal } from "solid-js";
import styles from "../styles/Game.module.css";

export default function ProgressBar(props: { progress: number }) {
  const [shaking, setShaking] = createSignal<boolean>(false);

  createEffect(() => {
    props.progress; // because the progress is a dependency of the effect
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
    }, 1000);
  });

  return (
    <div classList={{ [styles.shake]: shaking(), [styles.progressBar]: true }}>
      <div
        class={styles.progress}
        style={{
          transform: `scaleX(${Math.max(Math.min(props.progress, 100), 0)})`,
        }}
      ></div>
    </div>
  );
}
