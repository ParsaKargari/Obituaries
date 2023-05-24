import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./Layout";
import Empty from "./Empty";
import reportWebVitals from "./reportWebVitals";
// import Obituaries from "./Obituaries";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Empty />} />
          {/* <Route path="/obituaries" element={<Obituaries />} /> */}

          {/* <Route path="/notes" element={<Empty />} /> */}
          {/* <Route  */}
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);

reportWebVitals();
