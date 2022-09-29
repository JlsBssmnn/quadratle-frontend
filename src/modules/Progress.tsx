import ProgressBar from "./ProgressBar";

interface ProgressProps {
  discoveredWords: number;
  totalWords: number;
}

export default function Progress(props: ProgressProps) {
  return (
    <>
      <div>
        {props.discoveredWords} / {props.totalWords} Wörter
      </div>
      <ProgressBar progress={props.discoveredWords / props.totalWords} />
    </>
  );
}
