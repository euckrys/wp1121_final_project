import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useCharts() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getCharts = async () => {
        if (loading) return;
        setLoading(false);

        const res = await fetch("/api/charts", {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const charts = data.charts;

        router.refresh();
        setLoading(false);
        return charts;
    }

    return {
        getCharts,
        loading,
    }
}