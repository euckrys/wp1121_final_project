"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import useCharts from "@/hooks/useCharts"

export default function MainChart() {
    const { data: session } = useSession();

    const { getCharts, loading } = useCharts();

    const [charts, setCharts] = useState<[]>([]);

    // const fetchCharts = async () => {
    //     try {
    //         const charts = await getCharts({

    //         })
    //     }
    // }

    return (
        <>

        </>
    )
}