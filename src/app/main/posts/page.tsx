"use client";

import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

import NavBar from "../_components/NavBar";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from "@/components/ui/select";
import usePosts from "@/hooks/usePosts";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { pusherClient } from "@/lib/pusher/client";
import type { PostWithReplies } from "@/lib/types/db";

import CreatePostDialog from "./_components/CreatePostDialog";
import PostsSearchBar from "./_components/PostsSearchBar";

type PostPageProps = {
  searchParams: {
    search?: string;
  };
};

export default function PostPage({ searchParams: { search } }: PostPageProps) {
  const { data: session } = useSession();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sportType, setSportType] = useState<string>("");
  const [isMine, setIsMine] = useState<boolean>(false);
  const [isCoach, setIsCoach] = useState<boolean>(false);

  const [hasEvent, setHasEvent] = useState<boolean>(false);

  const { getAllPosts, loading } = usePosts();
  const [posts, setPosts] = useState<PostWithReplies[]>([]);
  const [expectedTime, setExpectedTime] = useState<string[]>(["0","1","2","3","4"]);

  const username = session?.user?.username ? session.user.username : "";

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const fetchPosts = async () => {
    try {
      const posts = await getAllPosts({
        postId: "",
        sportType,
        expectedTime,
        isMine,
        isCoach,
        targetCoach: search,
      });
      if (!posts) return;
      setPosts(posts);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const channel = pusherClient.subscribe("private-all-posts");

    channel.bind("post:update", async () => {
      console.log("Post update event received");
      fetchPosts();
      setHasEvent(true);
    });

    if (!hasEvent)  fetchPosts();

    return () => {
      channel.unbind();
      setHasEvent(false);
    };

  }, [sportType, expectedTime, isMine, isCoach, search, dialogOpen])


  return (
    <div>
      <div className="sticky top-0 z-50 w-full">
        <NavBar />
      </div>
      <div>

        <div className="flex justify-between p-2">
          <div className="flex p-2">
            <Button
              onClick={() => {
                setDialogOpen(true);
              }}
              disabled={loading}
              className="rounded-md px-2 py-4 text-base font-bold"
            >
              新增貼文
            </Button>
          </div>
          <Tabs
            defaultValue="false"
            className="w-[800px]"
            onValueChange={(value) => {
              if (value == "true") setIsCoach(true);
              else if (value == "false") setIsCoach(false);
            }}
          >
            <TabsList>
              <TabsTrigger value="false" disabled={loading}>
                Posted by Users
              </TabsTrigger>
              <TabsTrigger value="true" disabled={loading}>
                Posted by Coaches
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-row justify-between">
          <section className="flex flex-col items-center p-4 ">
            <PostsSearchBar isCoach={isCoach} />
            <div>
              <div className="flex items-center p-4">
                <Checkbox
                  id="isMine"
                  onCheckedChange={(value) => setIsMine(Boolean(value))}
                />
                <label
                  htmlFor="isMine"
                  className="p-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Only show my posts and replies
                </label>
              </div>
              <div className="flex p-4">
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
          </section>

          <section className="flex max-h-[80vh] min-h-[300px] flex-col justify-between overflow-y-auto pr-32">
            <div className="flex flex-col">
              {posts.map((post) => (
                <div key={post.id} className="flex w-[600px] justify-between rounded-md p-4 shadow-lg">
                  <div className="flex w-full flex-col">
                    <Link href={`/main/posts/${post.postId}`} key={post.postId}>
                      <div className="flex p-2">
                        <p>{post.author}</p>
                      </div>
                      <div className="flex flex-row px-8">
                        <div className="flex flex-col px-8">
                          <span className=" py-1">Sport</span>
                          <span className="py-1">Time</span>
                          <span className="py-1">Description</span>
                        </div>
                        <div className="flex flex-col px-8">
                          <span className="rounded-full bg-red-100 p-2 py-1">
                            Sports name
                          </span>
                          <span className="rounded-full bg-gray-300 p-2 py-1">
                            time
                          </span>
                          <span className="py-1">{post?.description}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex w-full rounded-md bg-gray-300">
                      <div className="p-4">Reply Icon </div>
                      <p className="flex justify-between p-4">
                        {/* {post.replies[0].content} */}Reply info here
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
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
        <ToggleGroup type="multiple"
                   defaultValue={["0","1","2","3","4"]}
                   onValueChange={(value:string[]) => {setExpectedTime(value)}}
     >
        <ToggleGroupItem value="0" aria-label="Toggle 0">09:00-11:00</ToggleGroupItem>
        <ToggleGroupItem value="1" aria-label="Toggle 1">11:00-13:00</ToggleGroupItem>
        <ToggleGroupItem value="2" aria-label="Toggle 2">13:00-15:00</ToggleGroupItem>
        <ToggleGroupItem value="3" aria-label="Toggle 3">15:00-17:00</ToggleGroupItem>
        <ToggleGroupItem value="4" aria-label="Toggle 4">17:00-19:00</ToggleGroupItem>
      </ToggleGroup>
      </div>


    </div>
  );
}
