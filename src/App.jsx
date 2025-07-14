import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Video from "./Pages/Video.jsx";
import Article from "./Pages/Article.jsx";
import VidLibrary from "./Pages/VidLibrary.jsx";
import ArtLibrary from "./Pages/ArtLibrary.jsx";
/*
import Victim from "./Pages/Victim.jsx";
import Officer from "./Pages/Officer.jsx"
import VicLibrary from "./Pages/VicLibrary.jsx";
import OffLibrary from "./Pages/OffLibrary.jsx"
*/

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles/:id" element={<Article />} />
      <Route path="/videos/:id" element={<Video />} />
      <Route path="/morearticles" element={<ArtLibrary />} />
      <Route path="/morevideos" element={<VidLibrary />} />
      {/*
      <Route path="/victims/:id" element={<Victim />} />
      <Route path="/officers/:id" element={<Officer />} />
      <Route path="/morevictims" element={<VicLibrary />} />
      <Route path="/moreofficers" element={<OffLibrary />} />
      */}
    </Routes>
  );
}

export default App;