// import { createRoot } from "react-dom/client";
// import App from "./App";

// createRoot(document.querySelector("#content")).render(<App />);

import { createRoot } from "react-dom/client";
import App from "./App";
import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './redux/store';
import { Provider } from 'react-redux';

createRoot(document.querySelector("#content")).render(
    <Provider store={store}>
        <App />
    </Provider>
);