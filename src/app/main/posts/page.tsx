"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import usePosts from "@/hooks/usePosts"

import type { PostWithReplies } from "@/lib/types/db"

import Link from "next/link";
import NavBar from "../_components/NavBar";
import { Button } from "@/components/ui/button";

import CreatePostDialog from "./_components/CreatePostDialog";

export default function PostPage() {
  const { data: session } = useSession();

  const [dialogOpen, setDialogOpen] = useState(false);
  const { getPosts, loading } = usePosts();
  const [posts, setPosts] = useState<PostWithReplies[]>([]);

  const username = session?.user?.username ? session.user.username : "";

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  const fetchPosts = async () => {
    try {
      const posts = await getPosts({
        postId: "",
        sportType: "",
        isMine: false,
        isCoach: true,
      })
      if (!posts) return;
      setPosts(posts);
    } catch (error) {
      console.log("Error fetchingPosts:", error);
    }
  }

  useEffect (() => {
    fetchPosts();
  }, [])

  return (
    <div>
      <NavBar/>
      <h1>Posts</h1>
      <Button
        onClick={() => {setDialogOpen(true)}}
        disabled={loading}
        className="font-bold text-base ml-2 rounded-md"
      >
        新增貼文
      </Button>
      <div>
        {posts.map((post) => (
          <Link href={`/main/posts/${post.postId}`} key={post.postId}>
            <p>{post.author}</p>
            <p>{post.description}</p>
            <p>{`reply: ${post.replies[0]?.content}`}</p>
          </Link>
        ))}
      </div>
      {dialogOpen && (
        <>
          <CreatePostDialog
            username={username}
            showDialog={dialogOpen}
            onclose={handleCloseDialog}
          />
        </>
      )}
    </div>
  );
}