import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useReplies() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const postReply = async ({
        toPostId,
        author,
        content,
    }: {
        toPostId: string,
        author: string,
        content: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/replies", {
            method: "POST",
            body: JSON.stringify({
                toPostId,
                author,
                content,
            }),
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    return {
        postReply,
        loading,
    }
}