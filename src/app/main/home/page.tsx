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
  const [month, setMonth] = useState<number>(12);
  const { getCharts } = useCharts();

  const [charts, setCharts] = useState<Chart[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [chartId, setChartId] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number[]>([]);

  const [year, setYear] = useState<number>(new Date().getFullYear());

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
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ThreeDots
              visible={true}
              height="100"
              width="100"
              color="#FFCBCB"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <p className="font-bold text-2xl text-gray-800">Loading Charts...</p>
          </div>
        </>
      ) : (
          <div className="flex flex-col">
            <NavBar/>
              <div className="flex flex-row">
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
                  year={year}
                  setYear={setYear}
                  isLoading={isLoading}
                />
              <div className="flex flex-col">
                <div className="h-64">

                </div>
                <SubChart
                  date={date}
                  month={month}
                  setMonth={setMonth}
                  charts={charts}
                />
              </div>
          </div>
        </div>
      )}
    </>
  );
}
