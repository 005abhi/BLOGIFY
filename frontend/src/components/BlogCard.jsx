// BlogCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const BASE_URL = "http://15.206.185.169:3001"; // ✅ Replace with your backend URL or IP

export function BlogCard({ post }) {
  let stringDate = "Invalid Date";
  if (post.dateCreated) {
    const date = new Date(post.dateCreated);
    if (!isNaN(date.getTime())) {
      stringDate = date.toDateString();
    }
  }

  return (
    <Link to={`/ReadBlog/${post._id}`} className="post">
      <h3>{post.title}</h3>
      <h4>{post.description}</h4>

      {post.imageid && (
        <img
          src={`${BASE_URL}/uploads/${post.imageid}`} // ✅ Correct path to access image
          alt="Blog"
          className="post-image"
          style={{ maxWidth: "100%", height: "auto", marginBottom: "1rem" }}
        />
      )}

      <p>{stringDate}</p>
    </Link>
  );
}

export default BlogCard;
