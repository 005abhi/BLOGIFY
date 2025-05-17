import axios from "axios";

// Use Vite environment variable or fallback
const URL = import.meta.env.VITE_API_BASE_URL || "http://15.206.185.169:3001";

export async function getposts() {
  const res = await axios.get(`${URL}/post`);
  if (res.status === 200) return res.data;
}

export async function getpost(id) {
  const res = await fetch(`${URL}/post/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to fetch post");
  }

  return await res.json();
}

export async function createposts(post) {
  const data = await createimage(post.file);
  const imageid = data.data.filename;
  post.imageid = imageid;

  const res = await axios.post(`${URL}/post`, post);
  return res;
}

export async function updateposts(id, post) {
  const res = await axios.put(`${URL}/post/${id}`, post);
  return res;
}

export async function deleteposts(id) {
  const res = await axios.delete(`${URL}/post/${id}`);
  return res;
}

export async function getusers() {
  const res = await axios.get(`${URL}/user`);
  if (res.status === 200) {
    return res.data;
  }
}

export async function getuser(id) {
  const res = await axios.get(`${URL}/user/${id}`);
  if (res.status === 200) {
    return res.data;
  }
}

export async function createuser(user) {
  const res = await axios.post(`${URL}/user`, user);
  return res;
}

export async function updateuser(id, user) {
  const res = await axios.put(`${URL}/user/${id}`, user);
  return res;
}

export async function verifyuser(user) {
  const res = await axios.post(`${URL}/user/login`, user);
  if (res.data.success) {
    return res.data.token;
  }
}

export async function createimage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${URL}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res;
}

export async function getimage(filename) {
  const res = await axios.get(`${URL}/uploads/${filename}`, {
    responseType: "blob",
  });
  const imageBlob = res.data;
  return URL.createObjectURL(imageBlob);
}
