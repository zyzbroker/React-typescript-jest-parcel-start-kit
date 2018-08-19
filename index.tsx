import * as React from "react";
import ReactDOM from "react-dom";
import Hello from "./hello";
import message from "./message";
import "./style.scss";

ReactDOM.render(
    <Hello name={message} enthusiasmLevel={10} />,
    document.querySelector("#placeholder") as HTMLElement,
);
