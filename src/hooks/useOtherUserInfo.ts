import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function useOtherUser() {
    const { coachId: userId } = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getOtherUserInfo = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/userInfo/${userId}`, {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const userInfo = data.userInfo;

        router.refresh();
        setLoading(false);
        return userInfo;
    }

    const updateOtherAvailableTime = async({
        availableTime,
        appointment
    }:{
        availableTime: Array<boolean>,
        appointment?:Array<string>,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/availableTime/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                availableTime,
                appointment,
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
        getOtherUserInfo,
        updateOtherAvailableTime,
        loading,
    }
}