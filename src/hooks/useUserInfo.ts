import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useUserInfo() {
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

    const postUserInfo = async ({
        displayName,
        sportType,
        age,
        height,
        weight,
        place,
        license,
        availableTime,
        appointment,
    }: {
        displayName: string,
        sportType: string,
        age: string,
        height: string,
        weight: string,
        place: string,
        license: string,
        availableTime: Array<boolean>,
        appointment: Array<string>
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("api/userInfo", {
            method: "POST",
            body: JSON.stringify({
                displayName,
                sportType,
                age,
                height,
                weight,
                place,
                license,
                availableTime,
                appointment,
            }),
        });

        if(!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    const updateUser = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/users", {
            method: "PUT",
        });

        if(!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    const updateUserInfo = async ({
        displayName,
        avatarUrl,
        sportType,
        age,
        height,
        weight,
        place,
        license,
    }: {
        displayName?: string,
        avatarUrl?: string,
        sportType?: string,
        age?: string,
        height?: string,
        weight?: string,
        place?: string,
        license?: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/userInfo", {
            method: "PUT",
            body: JSON.stringify({
                displayName,
                avatarUrl,
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

    const updateAvailableTime = async({
        availableTime,
        appointment
    }:{
        availableTime: Array<boolean>,
        appointment?:Array<string>,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/availableTime", {
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
        getUserInfo,
        postUserInfo,
        updateUser,
        updateUserInfo,
        updateAvailableTime,
        loading,
    }
}