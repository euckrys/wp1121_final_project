"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import usePosts from "@/hooks/usePosts"

import type { PostWithReplies } from "@/lib/types/db"

import Link from "next/link";
import NavBar from "../_components/NavBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import CreatePostDialog from "./_components/CreatePostDialog";

export default function PostPage() {
  const { data: session } = useSession();

  const [dialogOpen, setDialogOpen] = useState(false);
  const { getPosts, loading } = usePosts();
  const [posts, setPosts] = useState<PostWithReplies[]>([]);
  const [sportType, setSportType] = useState<string>("");

  const username = session?.user?.username ? session.user.username : "";

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  const fetchPosts = async () => {
    try {
      const posts = await getPosts({
        postId: "",
        sportType,
        isMine: false,
        isCoach: false,
      })
      if (!posts) return;
      setPosts(posts);
    } catch (error) {
      console.log("Error fetchingPosts:", error);
    }
  }

  useEffect (() => {
    fetchPosts();
  }, [sportType])

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
      <Select onValueChange={(value) => {
          if (value == "%") setSportType("");
          else setSportType(value);
        }}
      >
        <SelectTrigger className="w-[180px]" disabled={loading}>
          <SelectValue placeholder="SportType" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="%">ALL</SelectItem>
          <SelectItem value="fitness">健身</SelectItem>
          <SelectItem value="swimming">游泳</SelectItem>
          <SelectItem value="others">其他</SelectItem>
        </SelectContent>
      </Select>
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