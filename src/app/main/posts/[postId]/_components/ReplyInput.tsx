"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

import useReplies from "@/hooks/useReplies";

type ReplyInputProps = {
    postId: string;
}

export default function ReplyInput({
    postId,
}: ReplyInputProps) {
    const { data: session } = useSession();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { postReply, loading } = useReplies();

    const username = session?.user?.username? session.user.username : "";

    const handleSend = async () => {
        const content = textareaRef.current?.value;
        if (!content) {
            alert("Please enter some content");
            return;
        }

        try {
            await postReply({
                toPostId: postId,
                author: username,
                content,
            })
            textareaRef.current.value = "";

        } catch (error) {
            console.log(error);
            alert("Error sending reply or updating chat");
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }

    return (
        <div onClick={() => textareaRef.current?.focus()} className="mb-5">
            <div className="flex flex-row justify-between">
                <div className="w-full">
                    <textarea
                        ref={textareaRef}
                        className={`flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 placeholder:text-gray-700 placeholder:font-semibold`}
                        style={{ resize: "none", overflow: "hidden", border: "1px solid gray"}}
                        placeholder={"輸入回覆 ..."}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="ml-3 self-center">
                    <Button
                        onClick={handleSend}
                        disabled={loading}
                        className="font-bold text-base p-5"
                    >
                        <p className="text-xl">Reply</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}