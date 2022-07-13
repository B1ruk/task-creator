import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { TaskActivityReport } from "./components/report/TaskActivityReport";
import { TaskList } from "./components/task/TaskList";
import "./index.css";

import store from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/activityReport/:modelId"
            element={<TaskActivityReport />}
          />
          <Route path="taskList/:modelId" element={<TaskList />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
