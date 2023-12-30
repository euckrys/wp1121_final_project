import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useRecords() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const createRecord = async ({
        toChartId,
        year,
        month,
        date,
        sportType,
        time,
        description,
        totalTime,
    }: {
        toChartId: string,
        year: number,
        month: number,
        date: number,
        sportType: string,
        time: string,
        description: string,
        totalTime: number[],
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/records", {
            method: "POST",
            body: JSON.stringify({
                toChartId,
                year,
                month,
                date,
                sportType,
                time,
                description,
                totalTime,
            })
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    return {
        createRecord,
        loading,
    }
}