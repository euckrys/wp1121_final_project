"use client"

import ReplyInput from "./_components/ReplyInput"

type PostDetailsPageProps = {
    params: {
        postId: string;
    };
    searchParams: {
        search?: string;
    }
}

export default function PostDetailsPage({
    params: { postId },
}: PostDetailsPageProps) {

    return (
        <>
            <h1>{`Post Details: ${postId}`}</h1>
            <ReplyInput postId={postId}></ReplyInput>
        </>
    )
}