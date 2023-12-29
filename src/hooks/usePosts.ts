import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function usePosts() {
    const { postId } = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getAllPosts = async ({
        postId,
        sportType,
        expectedTime,
        isMine,
        isCoach,
        targetCoach,
    }: {
        postId: string,
        sportType: string,
        expectedTime?: string[],
        isMine: boolean,
        isCoach: boolean,
        targetCoach?: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/posts?postId=${postId}&sportType=${sportType}&expectedTime=${expectedTime}&isMine=${isMine}&isCoach=${isCoach}&targetCoach=${targetCoach}`,
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

    const getPost = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/posts/${postId}`, {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const post = data.post;

        router.refresh();
        setLoading(false);
        return post;
    }

    const createPost = async ({
        author,
        sportType,
        expectedTime,
        description,
    }: {
        author: string,
        sportType: string,
        expectedTime?: string[],
        description: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                author,
                sportType,
                expectedTime,
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
        getAllPosts,
        getPost,
        createPost,
        loading,
    }
}