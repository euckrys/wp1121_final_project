"use client"

import { useState, useEffect } from "react";

import usePosts from "@/hooks/usePosts"

import type { PostWithReplies } from "@/lib/types/db"

import Reply from "./_components/Reply";
import ReplyInput from "./_components/ReplyInput"
import { pusherClient } from "@/lib/pusher/client";

type PostDetailsPageProps = {
    params: {
        postId: string;
    };
}

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
      }

    useEffect(() => {
        const channel = pusherClient.subscribe(`private-${postId}`);

        channel.bind("reply:update", async() => {
            console.log("Reply update event received");
            fetchPost();
        });

        return () => {
            channel.unbind();
        }
    }, [post, postId])

    useEffect (() => {
        fetchPost();
    }, [])

    return (
        <>
            {/* <h1>{`Post Details: ${postId}`}</h1> */}
            <h1>{post?.postId}</h1>
            <h1>{post?.description}</h1>
            <div>
                {post?.replies.map((reply, i) => (
                    <Reply key={i} author={reply.author} content={reply.content}></Reply>
                ))}
            </div>
            <ReplyInput postId={postId}></ReplyInput>
        </>
    )
}