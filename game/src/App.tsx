import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router";
import Ending from "./pages/Ending";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Scene from "./pages/Scene";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene/:sceneId" element={<Scene />} />
        <Route path="/result" element={<Results />} />
        <Route path="/ending" element={<Ending />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
