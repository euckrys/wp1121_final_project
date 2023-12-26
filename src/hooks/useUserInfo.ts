import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useUser() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getUserInfo = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/userInfo", {
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

    const updateUserInfo = async ({
        displayName,
        sportType,
        age,
        height,
        weight,
        place,
        license,
    }: {
        displayName: string,
        sportType: string,
        age: string,
        height: string,
        weight: string,
        place: string,
        license: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/userInfo", {
            method: "PUT",
            body: JSON.stringify({
                displayName,
                sportType,
                age,
                height,
                weight,
                place,
                license,
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
        getUserInfo,
        updateUserInfo,
        loading,
    }
}