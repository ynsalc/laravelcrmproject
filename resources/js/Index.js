import React, { Component, StrictMode } from "react";
import ReactDOM from "react-dom";
import Main from "./Router";
import { BrowserRouter, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Provider } from "mobx-react";
import Store from "./Store";

class Index extends Component {
    render() {
        return (
            <Provider {...Store}>
                <BrowserRouter>
                    <StrictMode>
                        <Route component={Main} />
                    </StrictMode>
                </BrowserRouter>
            </Provider>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("index"));
