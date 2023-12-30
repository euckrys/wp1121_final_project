"use client";

import { useState, useEffect } from "react";

import NavBar from "../../_components/NavBar";

import usePosts from "@/hooks/usePosts";
import { pusherClient } from "@/lib/pusher/client";
import type { PostWithReplies } from "@/lib/types/db";

import Reply from "./_components/Reply";
import ReplyInput from "./_components/ReplyInput";

type PostDetailsPageProps = {
  params: {
    postId: string;
  };
};

export default function PostDetailsPage({
  params: { postId },
}: PostDetailsPageProps) {
  const { getPost } = usePosts();
  const [post, setPost] = useState<PostWithReplies>();

  const fetchPost = async () => {
    try {
      const post = await getPost();
      console.log(post);
      if (!post) return;
      setPost(post);
    } catch (error) {
      console.log("Error fetching Posts:", error);
    }
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(`private-${postId}`);

    channel.bind("reply:update", async () => {
      console.log("Reply update event received");
      fetchPost();
    });

    return () => {
      channel.unbind();
    };
  }, [post, postId]);

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center">
        <div className="flex  flex-col items-center border-2 shadow-lg">
          <div className="flex flex-col p-2">
            <section className="sticky flex flex-col">
              <div className="flex flex-col p-4">
                <div className="flex rounded-md border-2 border-gray-500 p-4">
                  <div className="flex w-full flex-col">
                    <div className="flex p-2 px-24">
                      <p>{post?.author}</p>
                    </div>
                    <div className="flex flex-row px-32">
                      <div className="flex flex-col px-8">
                        <span className="py-1">Sport</span>
                        <span className="py-1">Time</span>
                        <span className="py-1">Description</span>
                      </div>
                      <div className="flex flex-col px-8">
                        <span className="py-1">Sports name</span>
                        <span className="py-1">time</span>
                        <span className="py-1">{post?.description}</span>
                      </div>
                    </div>

                    <div className="flex w-full rounded-md bg-gray-300 px-2">
                      <div className="p-4 px-4">Reply Icon </div>
                      <p className="flex justify-between p-4">
                        {/* {post.replies[0].content} */}Reply info here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex p-2">
                <ReplyInput postId={postId}></ReplyInput>
              </div>
            </section>
            <div className="flex flex-col items-center justify-start overflow-y-auto p-4">
              {post?.replies.map((reply, i) => (
                <Reply
                  key={i}
                  author={reply.author}
                  content={reply.content}
                ></Reply>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
