import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useCoach() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getCoaches = async ({
        sportType,
        search,
    }: {
        sportType?: string,
        search?: string,
    }) => {
        if (loading) return;
        setLoading(true);
           
        const res = await fetch(`/api/users?sportType=${sportType}&targetCoach=${search}`, {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const coaches = data.coaches;
        router.refresh();
        setLoading(false);
        return coaches;
    }

    return {
        getCoaches,
        loading,
    }
}