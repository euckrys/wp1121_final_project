"use client";

import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

import NavBar from "../_components/NavBar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import usePosts from "@/hooks/usePosts";
import { pusherClient } from "@/lib/pusher/client";
import type { PostWithReplies } from "@/lib/types/db";
import useSportType from "@/hooks/useSportType";

import CreatePostDialog from "./_components/CreatePostDialog";
import PostsSearchBar from "./_components/PostsSearchBar";
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils/shadcn";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  const [expectedTime, setExpectedTime] = useState<string[]>([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
  ]);

  const username = session?.user?.username ? session.user.username : "";

  const { getSportType } = useSportType();

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
  }, [sportType, expectedTime, isMine, isCoach, search, dialogOpen]);


  return (
    <div>
      <div className="sticky top-0 z-50 w-full">
        <NavBar />
      </div>
      <div className="pl-32 pt-24">
        <div className="grid grid-cols-4">
          <div className="mt-20 col-span-1 items-center">

            <div className="grid grid-cols-3 items-center justify-center w-full mb-10">
              <div className="col-span-1">
                <p className="font-bold text-xl">搜尋教練姓名：</p>
              </div>
              <div className="col-span-2">
                <PostsSearchBar isCoach={isCoach} />
              </div>
            </div>


            <div className="grid grid-cols-3 items-center justify-center w-full mb-10">
              <div className="col-span-1">
                <p className="font-bold text-xl">依運動篩選：</p>
              </div>
              <div className="col-span-2">
                <Select
                  onValueChange={(value) => {
                    if (value == "%") setSportType("");
                    else setSportType(value);
                  }}
                >
                  <SelectTrigger className="w-full" disabled={loading}>
                    <SelectValue placeholder="想搜尋哪種運動嗎？" className={cn("placeholder:text-black placeholder:font-bold")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">ALL</SelectItem>
                    <SelectItem value="fitness">健身</SelectItem>
                    <SelectItem value="swimming">游泳</SelectItem>
                    <SelectItem value="yoga">瑜伽</SelectItem>
                    <SelectItem value="badminton">羽球</SelectItem>
                    <SelectItem value="basketball">籃球</SelectItem>
                    <SelectItem value="soccer">足球</SelectItem>
                    <SelectItem value="others">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 justify-center items-center ">
              <div className="col-span-1">
                <p className="font-bold text-xl">依時段篩選： </p>
              </div>
              <div className="col-span-2">
                <div className="w-full flex flex-row border-4 border-solid border-gray-600">
                  <ToggleGroup
                    type="multiple"
                    defaultValue={["0", "1", "2", "3", "4", "5"]}
                    value={expectedTime}
                    onValueChange={(value: string[]) => {
                      if((value.find((e) => e==="5"))!==undefined){
                        if((expectedTime.find((e) => e==="5"))===undefined){setExpectedTime(["0", "1", "2", "3", "4", "5"])}
                        else{const newValue: string[]=[];for(const v of value){if(v!=="5"){newValue.push(v)}};setExpectedTime(newValue)}
                      }
                      else if((expectedTime.find((e) => e==="5"))!==undefined) {setExpectedTime([])}
                      else{setExpectedTime(value)}
                    }}
                    className="w-full"
                  >
                    <div className="grid grid-rows-3 p-2">
                      <div className="p-2">
                        <ToggleGroupItem className="w-28" value="0" aria-label="Toggle 0">
                          09:00-11:00
                        </ToggleGroupItem>
                      </div>
                      <div className="p-2">
                        <ToggleGroupItem className="w-28" value="1" aria-label="Toggle 1">
                          11:00-13:00
                        </ToggleGroupItem>
                      </div>
                      <div className="p-2">
                        <ToggleGroupItem className="w-28" value="2" aria-label="Toggle 2">
                          13:00-15:00
                        </ToggleGroupItem>
                      </div>
                    </div>
                    <div className="grid grid-rows-3 p-2">
                      <div className="p-2">
                        <ToggleGroupItem className="w-28" value="3" aria-label="Toggle 3">
                          15:00-17:00
                        </ToggleGroupItem>
                      </div>
                      <div className="p-2">
                        <ToggleGroupItem className="w-28" value="4" aria-label="Toggle 4">
                          17:00-19:00
                        </ToggleGroupItem>
                      </div>
                      <div className="p-2">
                        <ToggleGroupItem className="w-28" value="5" aria-label="Toggle 5">
                          All
                        </ToggleGroupItem>
                      </div>
                    </div>
                  </ToggleGroup>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center px-2 mt-12">
              <div className="flex justify-center items-center">
                <Switch
                  className="mr-2"
                  defaultChecked={false}
                  onCheckedChange={(checked: boolean) => setIsMine(checked)}
                  disabled={loading}
                />
                <p className="lg:text-lg text-base font-semibold ml-4">Only show my posts and replies</p>
              </div>

              <div>
                <Fab
                  color="secondary"
                  onClick={() => {
                    setDialogOpen(true)
                  }}
                  disabled={loading}
                  aria-label="add"
                  sx={{
                    backgroundColor: "#FFCBCB",
                    color: "black",
                  }}
                >
                  <AddIcon fontSize="medium" />
                </Fab>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <div className="w-full flex flex-row justify-center">
              <div className="w-full flex flex-row justify-center">
                <Tabs
                  defaultValue="false"
                  className="w-full flex justify-center items-center"
                  onValueChange={(value) => {
                    if (value == "true") setIsCoach(true);
                    else if (value == "false") setIsCoach(false);
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="false" disabled={loading}>
                      <p className="font-bold text-xl">Posted by Users</p>
                    </TabsTrigger>
                    <TabsTrigger value="true" disabled={loading}>
                      <p className="font-bold text-xl">Posted by Coaches</p>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="overflow-y-auto w-full h-full flex flex-col items-center justify-center">
              {posts.map((post) =>
                <div key={post.id} className="flex flex-col w-3/5">
                  <Card className="w-full">
                    <CardContent className="w-full flex flex-col items-start p-8">
                    <Link href={`/main/posts/${post.postId}`} key={post.postId} className="w-full">
                      <div className="grid grid-rows-2 w-full mb-6">
                        <div className="row-span-2 flex items-center">
                          <p className="font-bold text-3xl p-2">@</p>
                          <p className="font-bold text-3xl p-2">{`${post.author}`}</p>
                        </div>
                      </div>
                      <Separator/>
                      <div className="grid grid-rows-auto w-full">
                        <div className="row-span-1 grid grid-cols-4 mt-8">
                          <div className="col-span-1">
                            <p className="font-bold text-xl ml-8">運動類別 : </p>
                          </div>
                          <div className="col-span-1">
                            <p className="font-bold text-xl bg-pink-100 w-fit px-6 py-1 rounded-2xl">{getSportType(post.sportType)}</p>
                          </div>
                        </div>
                        <div className="row-span-1 grid grid-cols-4 mt-4">
                          <div className="col-span-1">
                            <p className="font-bold text-xl ml-8">希望時段 : </p>
                          </div>
                          <div className="col-span-3">
                            <p className="font-semibold text-lg w-fit px-6 py-1 rounded-2xl">
                              {post.expectedTime.find((e) => e === "0") !==
                                undefined && (
                                <span className="rounded-full bg-gray-100 p-2 py-1 mr-4 ml-[-20px]">
                                  9:00 ~ 11:00
                                </span>
                              )}
                              {post.expectedTime.find((e) => e === "1") !==
                                undefined && (
                                <span className="rounded-full bg-gray-100 p-2 py-1 mr-4">
                                  11:00 ~ 13:00
                                </span>
                              )}
                              {post.expectedTime.find((e) => e === "2") !==
                                undefined && (
                                <span className="rounded-full bg-gray-100 p-2 py-1 mr-4">
                                  13:00 ~ 15:00
                                </span>
                              )}
                              {post.expectedTime.find((e) => e === "3") !==
                                undefined && (
                                <span className="rounded-full bg-gray-100 p-2 py-1 mr-4">
                                  15:00 ~ 17:00
                                </span>
                              )}
                              {post.expectedTime.find((e) => e === "4") !==
                                undefined && (
                                <span className="rounded-full bg-gray-100 p-2 py-1 mr-4">
                                  17:00 ~ 19:00
                                </span>
                              )}
                              {post.expectedTime.find((e) => e === "5") !==
                                undefined && (
                                <span className="rounded-full bg-gray-100 p-2 py-1 mr-4">
                                  All
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="row-span-auto grid grid-cols-4 mt-4">
                          <div className="col-span-1">
                            <p className="font-bold text-xl ml-8">簡介/要求 : </p>
                          </div>
                          <div className="col-span-3">
                            <p className="font-bold text-xl ml-3">{post.description}</p>
                          </div>
                        </div>
                        <div className="row-span-1 mt-8 bg-gray-200 rounded-3xl">
                          <div className="flex flex-row items-center w-full rounded-md">
                            <div>
                              <p className="font-bold text-xl p-2 ml-8">Latest Reply :</p>
                            </div>
                            <div>
                              <p className="flex justify-between p-4 ml-8 font-bold text-xl">
                                {post.replies[0]?.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>


                    </Link>





                    {/* <div className="flex w-full flex-col">
                      <Link href={`/main/posts/${post.postId}`} key={post.postId}>
                        <></>

                        <div className="flex p-2 text-xl font-bold">
                          <p className="font-bold text-xl p-2">{post.author}</p>
                        </div>

                        <div className="flex flex-row px-8">

                          <div className="flex flex-col px-8">
                            <span className="font-bold text-xl p-2">Sport</span>
                            <span className="font-bold text-xl p-2">Time</span>
                            <span className="font-bold text-xl p-2">Description</span>
                          </div>

                          <div className="flex flex-col px-8">
                            <span className="flex flex-row rounded-full  bg-red-100 p-2 py-1">
                            {post.sportType}
                            </span>
                            {post.expectedTime.find((e) => e === "0") !==
                              undefined && (
                              <span className="rounded-full bg-gray-300 p-2 py-1">
                                9:00 ~ 11:00
                              </span>
                            )}
                            {post.expectedTime.find((e) => e === "1") !==
                              undefined && (
                              <span className="rounded-full bg-gray-300 p-2 py-1 ">
                                11:00 ~ 13:00
                              </span>
                            )}
                            {post.expectedTime.find((e) => e === "2") !==
                              undefined && (
                              <span className="rounded-full bg-gray-300 p-2 py-1">
                                13:00 ~ 15:00
                              </span>
                            )}
                            {post.expectedTime.find((e) => e === "3") !==
                              undefined && (
                              <span className="rounded-full bg-gray-300 p-2 py-1">
                                15:00 ~ 17:00
                              </span>
                            )}
                            {post.expectedTime.find((e) => e === "4") !==
                              undefined && (
                              <span className="rounded-full bg-gray-300 p-2 py-1">
                                17:00 ~ 19:00
                              </span>
                            )}
                            {post.expectedTime.find((e) => e === "5") !==
                              undefined && (
                              <span className="rounded-full bg-gray-300 p-2 py-1">
                                All
                              </span>
                            )}
                            <span className="flex flex-row py-1">
                              {post?.description}
                            </span>
                          </div>
                        </div>
                      </Link> */}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

          </div>

        </div>
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

// <section className="grid grid-cols-1 justify-between overflow-y-auto">
// <div className="grid grid-rows-1">
//   {posts.map((post) => (
//     <div key={post.id} className="flex w-[600px] justify-between rounded-md p-4 shadow-lg">
//       <div className="flex w-full flex-col">
//         <Link href={`/main/posts/${post.postId}`} key={post.postId}>
//           <div className="flex p-2 text-xl font-bold">
//             <p>{post.author}</p>
//           </div>
//           <div className="flex flex-row px-8">
//             <div className="flex flex-col px-8">
//               <span className=" py-1">Sport</span>
//               <span className="py-1">Time</span>
//               <span className="py-1">Description</span>
//             </div>
//             <div className="flex flex-col px-8">
//               <span className="flex flex-row rounded-full  bg-red-100 p-2 py-1">
//                 {post.sportType}
//               </span>
//               {post.expectedTime.find((e) => e === "0") !==
//                 undefined && (
//                 <span className="rounded-full bg-gray-300 p-2 py-1">
//                   9:00 ~ 11:00
//                 </span>
//               )}
//               {post.expectedTime.find((e) => e === "1") !==
//                 undefined && (
//                 <span className="rounded-full bg-gray-300 p-2 py-1 ">
//                   11:00 ~ 13:00
//                 </span>
//               )}
//               {post.expectedTime.find((e) => e === "2") !==
//                 undefined && (
//                 <span className="rounded-full bg-gray-300 p-2 py-1">
//                   13:00 ~ 15:00
//                 </span>
//               )}
//               {post.expectedTime.find((e) => e === "3") !==
//                 undefined && (
//                 <span className="rounded-full bg-gray-300 p-2 py-1">
//                   15:00 ~ 17:00
//                 </span>
//               )}
//               {post.expectedTime.find((e) => e === "4") !==
//                 undefined && (
//                 <span className="rounded-full bg-gray-300 p-2 py-1">
//                   17:00 ~ 19:00
//                 </span>
//               )}
//               {post.expectedTime.find((e) => e === "5") !==
//                 undefined && (
//                 <span className="rounded-full bg-gray-300 p-2 py-1">
//                   All
//                 </span>
//               )}
//               <span className="flex flex-row py-1">
//                 {post?.description}
//               </span>
//             </div>
//           </div>
//         </Link>
//         <div className="flex w-full rounded-md bg-gray-300">
//           <div className="p-4">Latest Reply:</div>
//           <p className="flex justify-between p-4">
//             {post.replies[0]?.content}
//           </p>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
// </section>
