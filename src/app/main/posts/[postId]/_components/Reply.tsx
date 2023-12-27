"use client"

type ReplyProps = {
    author: string,
    content: string,
}

export default function Reply({
    author,
    content,
}: ReplyProps) {


    return (
        <>
            <h1>{author}</h1>
            <h1>{content}</h1>
        </>
    )
}