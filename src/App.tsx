import React from "react";
import 'fontsource-roboto';
import Bar from "./components/Bar";
import LoadTask from "./components/LoadTask/LoadTask";

export default function App() {
    return (
        <React.Fragment>
           <Bar />
           <LoadTask />
        </React.Fragment>
    )
}