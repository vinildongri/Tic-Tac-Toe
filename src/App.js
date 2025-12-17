import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Game from "./components/Game";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
