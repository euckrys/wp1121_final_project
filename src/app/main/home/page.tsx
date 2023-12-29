"use client"

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import useCharts from "@/hooks/useCharts"

import type { Chart } from "@/lib/types/db"

import NavBar from "../_components/NavBar";
import MainChart from "./_components/MainChart";
import SubChart from "./_components/SubChart";
import { ThreeDots } from 'react-loader-spinner'

export default function HomePage() {
  const [date, setDate] = useState<number>(1);
  const [month, setMonth] = useState<number>(3);
  const { getCharts } = useCharts();

  const [charts, setCharts] = useState<Chart[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [chartId, setChartId] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number[]>([]);

  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchCharts = async () => {
    setIsloading(true);
    try {
        const charts = await getCharts();

        if (!charts) return;
        setCharts(charts);

    } catch (error) {

        console.log("Error fetching charts: ", error);

    } finally {
        const params = new URLSearchParams(searchParams);

        params.set("month", `${month}`);
        router.push(`${pathname}?${params.toString()}`);

        setIsloading(false);
        setIsFirstLoading(false);
    }
  }

  useEffect(() => {
    if (isFirstLoading) return;
    fetchCharts();
  }, [chartId, totalTime, date, month])

  useEffect(() => {
    setIsFirstLoading(true)
    fetchCharts();
  }, [])

  return (
    <>
      {isFirstLoading? (
        <>
          <NavBar/>
          <div className="w-full h-full flex justify-center">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </>
      ) : (
          <div>
            <NavBar/>
            <div>
              <MainChart
                charts={charts}
                chartId={chartId}
                setChartId={setChartId}
                totalTime={totalTime}
                setTotalTime={setTotalTime}
                date={date}
                setDate={setDate}
                month={month}
                setMonth={setMonth}
                isLoading={isLoading}
              />
              <SubChart
                charts={charts}
              />
            </div>
          </div>
      )}
    </>
  );
}
