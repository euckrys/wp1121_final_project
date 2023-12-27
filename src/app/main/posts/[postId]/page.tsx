"use client"

import { useState, useEffect } from "react";

import usePosts from "@/hooks/usePosts"

import type { PostWithReplies } from "@/lib/types/db"

import Reply from "./_components/Reply";
import ReplyInput from "./_components/ReplyInput"

type PostDetailsPageProps = {
    params: {
        postId: string;
    };
}

export default function PostDetailsPage({
    params: { postId },
}: PostDetailsPageProps) {

    const { getPosts } = usePosts();
    const [post, setPost] = useState<PostWithReplies>();

    const fetchPosts = async () => {
        try {
          const posts = await getPosts({
            postId,
            sportType: "",
            isMine: false,
            isCoach: true,
          })
          if (!posts) return;
          setPost(posts[0]);
        } catch (error) {
          console.log("Error fetchingPosts:", error);
        }
      }

    useEffect (() => {
        fetchPosts();
    }, [])

    return (
        <>
            <h1>{`Post Details: ${postId}`}</h1>
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