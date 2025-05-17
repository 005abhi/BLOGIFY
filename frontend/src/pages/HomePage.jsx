import { getposts, createposts } from "../api";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import * as jwt_decode from "jwt-decode";

export function HomePage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const inputFile = useRef(null);
  const postRefs = useRef({});
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const navigate = useNavigate();

  useEffect(() => {
    async function initialize() {
      const token = sessionStorage.getItem("user");
      if (!token) return;

      const decodedUser = jwt_decode.jwtDecode(token);
      setUser(decodedUser);

      const allPosts = await getposts();
      const sortedPosts = allPosts.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      );

      setPosts(sortedPosts);
    }

    initialize();
  }, []);

  const handlePowerOff = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      description,
      content,
      file,
      dateCreated: new Date().toISOString(),
      user: user.email,
    };

    await createposts(newPost);

    setTitle("");
    setDescription("");
    setContent("");
    setFile(null);
    if (inputFile.current) inputFile.current.value = "";

    const updatedPosts = await getposts();
    setPosts(
      updatedPosts.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const ext = file.name.slice(file.name.lastIndexOf("."));

    if (![".jpg", ".png", ".jpeg"].includes(ext)) {
      alert("Please upload a valid image file (jpg or png)");
      resetFileInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5MB limit");
      resetFileInput();
      return;
    }

    setFile(file);
  };

  const resetFileInput = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "file";
    }
  };

  const userPosts = posts.filter((p) => p.userEmail === user.email);

  return (
    <div className="app-container">
      <header className="top-bar">
        <h1 className="logo">BLOGIFY</h1>
        <button className="power-button" onClick={handlePowerOff}>
          ⏻
        </button>
      </header>

      <div className="main">
        {/* Create Blog Sidebar */}
        <aside className="create-sidebar">
          <section className="create-blog">
            <h2 className="ha">CREATE BLOG</h2>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                maxLength={100}
                required
              />

              <label>Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                maxLength={200}
                required
              />

              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                required
              />

              <label>Image</label>
              <input
                type="file"
                onChange={handleFileUpload}
                ref={inputFile}
                required
              />

              <button type="submit">Submit</button>
            </form>
          </section>
        </aside>

        {/* Blog Posts */}
        <main className="blog-page">
          {posts.length > 0 ? (
            posts.map((post, idx) => {
              const date = new Date(post.dateCreated);
              const stringDate = isNaN(date.getTime())
                ? "Invalid Date"
                : date.toDateString();

              return (
                <div
                  key={idx}
                  ref={(el) => (postRefs.current[post._id] = el)}
                  className="post"
                >
                  <Link
                    to={`/ReadBlog/${post._id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    {post.imageid && (
                      <img
                        src={`http://15.206.185.169:3001/images/${post.imageid}`}
                        alt="Blog"
                        className="post-image"
                      />
                    )}
                    <h3>{post.title}</h3>
                    <h4>{post.description}</h4>
                  </Link>
                </div>
              );
            })
          ) : (
            <h1>No Blogs Found</h1>
          )}
        </main>

        {/* Profile Sidebar */}
        <aside className="profile-sidebar">
          <section className="profile">
            <h2>PROFILE</h2>
            <div className="avatar">{user.name?.[0]?.toUpperCase() || "?"}</div>
            <h2>{user.name}</h2>
            <h2>{user.email}</h2>
            <h2>{userPosts.length} Blog(s)</h2>

            <div className="user-post-links">
              {userPosts.map((post) => (
                <p
                  key={post._id}
                  onClick={() =>
                    postRefs.current[post._id]?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  style={{
                    cursor: "pointer",
                    color: "#3b82f6",
                    marginBottom: "8px",
                  }}
                >
                  {post.title}
                </p>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default HomePage;
