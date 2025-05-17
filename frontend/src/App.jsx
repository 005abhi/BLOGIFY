import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import HomePage from "./pages/HomePage";
import ReadBlog from "./pages/ReadBlog";
import { Layout } from "./components/Layout";
import { useEffect } from "react";
import axios from "axios";
function App() {
  useEffect(() => {
    let token = sessionStorage.getItem("user");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing></Landing>} />
          <Route element={<Layout></Layout>}>
            <Route path="/Home" element={<HomePage></HomePage>} />
            <Route path="/Readblog/:id" element={<ReadBlog></ReadBlog>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
