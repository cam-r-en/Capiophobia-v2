import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Search from "./Pages/Search.jsx";
import Video from "./Pages/Video.jsx";
import Article from "./Pages/Article.jsx";
import Victim from "./Pages/Victim.jsx";
import Officer from "./Pages/Officer.jsx";
import SubmitStory from "./Pages/SubmitStory.jsx";
import StoryLibrary from "./Pages/StoryLibrary.jsx";
import Story from "./Pages/Story.jsx";
import VidLibrary from "./Pages/VidLibrary.jsx";
import ArtLibrary from "./Pages/ArtLibrary.jsx";
import VicLibrary from "./Pages/VicLibrary.jsx";
import OffLibrary from "./Pages/OffLibrary.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/video/:id" element={<Video />} />
      <Route path="/victims/:id" element={<Victim />} />
      <Route path="/officers/:id" element={<Officer />} />
      <Route path="/submit-story" element={<SubmitStory />} />
      <Route path="/story/:id" element={<Story />} />
      <Route path="/morearticles" element={<ArtLibrary />} />
      <Route path="/morevideos" element={<VidLibrary />} />
      <Route path="/morevictims" element={<VicLibrary />} />
      <Route path="/moreofficers" element={<OffLibrary />} />
      <Route path="/morestories" element={<StoryLibrary />} />
    </Routes>
  );
}

export default App;
