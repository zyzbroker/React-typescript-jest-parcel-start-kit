import * as React from "react";
import ReactDOM from "react-dom";
import {App} from "./lib/App";
import message from "./message";
import "./style.scss";

ReactDOM.render(
    <App/>,
    document.querySelector("#placeholder") as HTMLElement,
);
