import React from "react";
import { getpost } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ReadBlog.css"; // <-- Add this

export const ReadBlog = () => {
  const [posts, setPosts] = useState({});

  let params = useParams();
  let id = params.id;

  let data = new Date(posts.dateCreated);
  let stringDate = data.toString();

  const usenavigate = useNavigate();
  useEffect(() => {
    async function loadpost() {
      let data = await getpost(id);
      setPosts(data);
    }
    loadpost();
  }, []);
  return (
    <div className="blog-container">
      <button onClick={() => usenavigate(-1)}>back</button>
      <h3>{posts.author}</h3>

      {posts.imageid && (
        <img
          src={`http://15.206.185.169:3001/images/${posts.imageid}`}
          alt="Blog"
          className="post-image"
        />
      )}
      <h3>{posts.title}</h3>
      <h3>{posts.description}</h3>
      <h3>{posts.content}</h3>
    </div>
  );
};

export default ReadBlog;
