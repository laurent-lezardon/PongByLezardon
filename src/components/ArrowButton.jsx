import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";

export default function ArrowButton({ up, left, buttonWidth, handleClick }) {
  return (
    <button
      id="paddle-left-up"
      className={`flex flex-col h-1/2  items-center justify-center rounded border border-[blue] bg-gradient-to-br from-orange-100/80 to-slate-50`}
      style={{ width: `${buttonWidth}px` }}
      onClick={() => handleClick(up, left)}
    >
      {up ? (
        <ArrowBigUpDash color="orangered" />
      ) : (
        <ArrowBigDownDash color="orangered" />
      )}
    </button>
  );
}
