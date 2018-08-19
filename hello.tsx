import * as React from "react";

export interface IProps {
  name: string;
  enthusiasmLevel?: number;
}

function getExclamation(level: number) {
  return Array(level).join("!");
}

export default function Hello({ name, enthusiasmLevel = 1 }: IProps) {
  if (enthusiasmLevel <= 0) {
    throw new Error("Need more enthusiams");
  }
  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamation(enthusiasmLevel)}
      </div>
    </div>
  );
}
