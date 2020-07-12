import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.onload = () => {
    console.log("loading");
    console.log(document.getElementById("root"));
    ReactDOM.render(<App />, document.getElementById("root"));
};
