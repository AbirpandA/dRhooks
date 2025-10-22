"use client";
import React, { useState } from "react";
import { useFetch } from "../hooks/use-fetch"; // Make sure to import your hook

// A simple component to display the post data
function PostDisplay() {
  const [postId, setPostId] = useState(1);

  // Use your hook. The URL will change whenever `postId` changes.
  const { data, loading, error, refetch } = useFetch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );

  // Handler for manually refetching the *same* post
  const handleRefetch = () => {
    console.log("Manual refetch requested...");
    refetch();
  };

  // Handlers for changing the URL, which triggers an automatic refetch
  const getNextPost = () => {
    setPostId((prevId) => prevId + 1);
  };

  const getFirstPost = () => {
    setPostId(1);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>useFetch Example</h2>
      
      <div style={{ marginBottom: "15px" }}>
        <button onClick={getNextPost} disabled={loading}>
          {loading ? "Loading..." : "Fetch Next Post"}
        </button>
        <button onClick={handleRefetch} disabled={loading} style={{ marginLeft: "10px" }}>
          Refetch Post {postId}
        </button>
        <button onClick={getFirstPost} disabled={loading || postId === 1} style={{ marginLeft: "10px" }}>
          Reset to Post 1
        </button>
      </div>

      {/* 1. Loading State */}
      {loading && <p>Loading data...</p>}

      {/* 2. Error State */}
      {error && (
        <p style={{ color: "red" }}>
          Error fetching data: {error.message}
        </p>
      )}

      {/* 3. Data State */}
      {data && (
        <article>
          <h3>{data.title} (Post ID: {data.id})</h3>
          <p>{data.body}</p>
        </article>
      )}
    </div>
  );
}

// Define the type for the data we expect
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default PostDisplay;