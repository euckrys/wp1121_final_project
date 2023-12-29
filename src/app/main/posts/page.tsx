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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import PostsSearchBar from "./_components/PostsSearchBar";
import CreatePostDialog from "./_components/CreatePostDialog";
import { pusherClient } from "@/lib/pusher/client";

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

  const { getAllPosts, loading } = usePosts();
  const [posts, setPosts] = useState<PostWithReplies[]>([]);
  const [expectedTime, setExpectedTime] = useState<string[]>(["0","1","2","3","4"]);

  const username = session?.user?.username ? session.user.username : "";

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  const fetchPosts = async () => {
    try {
      const posts = await getAllPosts({
        postId: "",
        sportType,
        expectedTime,
        isMine,
        isCoach,
        targetCoach: search,
      })
      if (!posts) return;
      setPosts(posts);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    const channel = pusherClient.subscribe("private-all-posts");

    channel.bind("post:update", async() => {
      console.log("Post update event received");
      fetchPosts();
    })

    return () => {
      channel.unbind();
    };
  }, [sportType, expectedTime, isMine, isCoach, search, dialogOpen])

  useEffect (() => {
    fetchPosts();
  }, [sportType, expectedTime, isMine, isCoach, search, dialogOpen])

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
        }
      }>
        <TabsList>
          <TabsTrigger value="false" disabled={loading}>Posted by Users</TabsTrigger>
          <TabsTrigger value="true" disabled={loading}>Posted by Coaches</TabsTrigger>
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
            {post.expectedTime.find((e) => e==="0") !== undefined && <span>9:00 ~ 11:00 </span>}
            {post.expectedTime.find((e) => e==="1") !== undefined && <span> 11:00 ~ 13:00 </span>}
            {post.expectedTime.find((e) => e==="2") !== undefined && <span> 13:00 ~ 15:00 </span>}
            {post.expectedTime.find((e) => e==="3") !== undefined && <span> 15:00 ~ 17:00 </span>}
            {post.expectedTime.find((e) => e==="4") !== undefined && <span> 17:00 ~ 19:00 </span>}
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
      <ToggleGroup type="multiple"
                   defaultValue={["0","1","2","3","4"]}
                   onValueChange={(value) => {setExpectedTime(value)}}
     >
        <ToggleGroupItem value="0" aria-label="Toggle 0">09:00-11:00</ToggleGroupItem>
        <ToggleGroupItem value="1" aria-label="Toggle 1">11:00-13:00</ToggleGroupItem>
        <ToggleGroupItem value="2" aria-label="Toggle 2">13:00-15:00</ToggleGroupItem>
        <ToggleGroupItem value="3" aria-label="Toggle 3">15:00-17:00</ToggleGroupItem>
        <ToggleGroupItem value="4" aria-label="Toggle 4">17:00-19:00</ToggleGroupItem>
      </ToggleGroup>
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