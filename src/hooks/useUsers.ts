import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useUsers() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getAllUsers = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/allUsers", {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const users = data.users;

        router.refresh();
        setLoading(false);
        return users;
    }

    return {
        getAllUsers,
        loading,
    }
}