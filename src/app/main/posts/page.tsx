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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import PostsSearchBar from "./_components/PostsSearchBar";
import CreatePostDialog from "./_components/CreatePostDialog";

type PostPageProps = {
  searchParams: {
    search?: string;
  };
};

export default function PostPage({
  searchParams: { search },
}: PostPageProps) {
  const { data: session } = useSession();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sportType, setSportType] = useState<string>("");
  const [isMine, setIsMine] = useState<boolean>(false);
  const [isCoach, setIsCoach] = useState<boolean>(false);

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
        sportType,
        isMine,
        isCoach,
        targetCoach: search,
      })
      if (!posts) return;
      setPosts(posts);
    } catch (error) {
      console.log("Error fetchingPosts:", error);
    }
  }

  useEffect (() => {
    fetchPosts();
  }, [sportType, isMine, isCoach, search])

  return (
    <div>
      <NavBar/>
      <h1>Posts</h1>

      <Tabs
        defaultValue="false"
        className="w-[400px]"
        onValueChange={(value) => {
          if (value == "true")  setIsCoach(true);
          else if (value == "false")  setIsCoach(false);
          console.log(isCoach);
        }
      }>
        <TabsList>
          <TabsTrigger value="false">Posted by Users</TabsTrigger>
          <TabsTrigger value="true">Posted by Coaches</TabsTrigger>
        </TabsList>
      </Tabs>

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

      <PostsSearchBar isCoach={isCoach}/>

      <div className="flex items-center space-x-2">
        <Checkbox id="isMine" onCheckedChange={(value) => setIsMine(Boolean(value))}/>
        <label
          htmlFor="isMine"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Only show my posts and replies
        </label>
      </div>

      <Select
        onValueChange={(value) => {
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