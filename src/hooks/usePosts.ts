import { useRouter } from "next/navigation";
import { useState } from "react";

export default function usePost() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getPosts = async ({
        postId,
        sportType,
        isMine,
        isCoach,
        targetCoach,
    }: {
        postId: string,
        sportType: string,
        isMine: boolean,
        isCoach: boolean,
        targetCoach?: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(
            `/api/posts?postId=${postId}&sportType=${sportType}&isMine=${isMine}&isCoach=${isCoach}&targetCoach=${targetCoach}`,
            {
                method: "GET",
            }
        );

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const posts = data.posts;

        router.refresh();
        setLoading(false);
        return posts;
    }

    const createPost = async ({
        author,
        sportType,
        description,
    }: {
        author: string,
        sportType: string,
        description: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                author,
                sportType,
                description,
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
        getPosts,
        createPost,
        loading,
    }
}