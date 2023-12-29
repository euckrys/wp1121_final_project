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
        introduce,
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
        introduce: string,
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
                introduce,
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
        introduce,
    }: {
        displayName?: string,
        avatarUrl?: string,
        sportType?: string,
        age?: string,
        height?: string,
        weight?: string,
        place?: string,
        license?: string,
        introduce?: string;
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
                introduce,
            }),
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    const getAvailableTime = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/availableTime", {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const availableTime = data.availableTime;

        router.refresh();
        setLoading(false);
        return availableTime;
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
        getAvailableTime,
        updateAvailableTime,
        loading,
    }
}