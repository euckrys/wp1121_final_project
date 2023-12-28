import { useRouter } from "next/navigation";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function useReview() {
    const { coachId: userId } = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getReview = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/review/${userId}`, {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        // console.log("data: ",data)
        const review = data.review.reviews;
        const totalStar = data.newTotalStar;
        const totalReview = data.newTotalReview;
        router.refresh();
        setLoading(false);
        return {review: review, totalStar: totalStar, totalReview: totalReview};
    }
    const postReview = async ({
        authorId,
        author,
        isAnonymous,
        star,
        content,
    }: {
        authorId: string,
        author: string,
        isAnonymous: boolean,
        star: number,
        content: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/review/${userId}`, {
            method: "POST",
            body: JSON.stringify({
                authorId,
                author,
                isAnonymous,
                star,
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
        getReview,
        postReview,
        loading,
    }
}