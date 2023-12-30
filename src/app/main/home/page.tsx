"use client"

import { useState, useEffect } from "react";

import useCharts from "@/hooks/useCharts"
import useUserInfo from "@/hooks/useUserInfo";
import type { Chart } from "@/lib/types/db"

import NavBar from "../_components/NavBar";
import MainChart from "./_components/MainChart";
import SubChart from "./_components/SubChart";
import { ThreeDots } from 'react-loader-spinner'
import { Card, CardContent } from "@/components/ui/card";
import RecentAppointment from "./_components/RecentAppointment";

export default function HomePage() {
  const today = new Date();
  const nowMonth = today.getMonth()+1;
  const nowYear = today.getFullYear();

  const [date, setDate] = useState<number>(1);
  const [month, setMonth] = useState<number>(nowMonth);
  const [year, setYear] = useState<number>(nowYear);
  const { getCharts } = useCharts();

  const [charts, setCharts] = useState<Chart[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [chartId, setChartId] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number[]>([]);

  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);

  const { getAvailableTime }= useUserInfo();
  const [recentAppoint, setRecentAppoint] = useState<string | null>(null);
  const [recentAppointTime, setRecentAppointTime] = useState<string | null>(null);

  const fetchCharts = async () => {
    setIsloading(true);
    try {
        const charts = await getCharts();

        if (!charts) return;
        setCharts(charts);
    } catch (error) {

        console.log("Error fetching charts: ", error);

    } finally {
        setIsloading(false);
        setIsFirstLoading(false);
    }
  }

  const fetchAvailableTime = async () => {
    setIsloading(true);
    try {
        const availableTime = await getAvailableTime();
        const appoint = availableTime.appointment.find((element: string) => element !== "/");
        const time = availableTime.appointment.findIndex((element: string) => element !== "/");
        if(appoint!==undefined)
        {
          setRecentAppoint(appoint);
          setRecentAppointTime((today.getMonth()+1).toString() + "/" + (today.getDate()).toString() + (9+time%5*2).toString() + ":00 ~ " + (11+time%5*2).toString() + ":00");
        }
    } catch (error) {
        console.log("Error fetching availableTime: ", error);
    } finally {
        setIsloading(false);
    }
  }

  useEffect(() => {
    if (isFirstLoading) return;
    fetchCharts();
  }, [totalTime])

  useEffect(() => {
    setIsFirstLoading(true)
    fetchCharts();
    fetchAvailableTime();
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
          <div className="flex flex-col w-full h-screen">
            <NavBar />
            <div className="h-fit">
              <div className="flex flex-row w-full h-full">
                <div className="w-6/12 h-full">
                  <MainChart
                    charts={charts}
                    chartId={chartId}
                    setChartId={setChartId}
                    totalTime={totalTime}
                    setTotalTime={setTotalTime}
                    date={date}
                    setDate={setDate}
                    year={year}
                    setYear={setYear}
                    month={month}
                    setMonth={setMonth}
                    isLoading={isLoading}
                  />
                </div>
                <div className="2xl:w-[200px] xl:w-[140px] w-[100px]"/>
                <div className="flex flex-col w-4/12 h-full justify-between content-between">
                  <div className="w-full h-full h-1/2">
                    {(recentAppoint && recentAppointTime) ? (
                      <RecentAppointment
                        recentAppointment={recentAppoint}
                        recentAppointmentTime={recentAppointTime}
                      />
                    ) : (
                      <NullAppointment/>
                    )}
                  </div>
                  <div className="w-full justify-self-end self-end">
                    <SubChart
                      date={date}
                      month={month}
                      setMonth={setMonth}
                      year={year}
                      charts={charts}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  );
}

export function NullAppointment() {
  return (
    <div className="mt-20 h-full">
      <Card className="h-full shadow-xl">
        <CardContent className="flex flex-col items-center h-full">
          <p className="font-bold text-2xl mt-8 underline">Recent Appointment</p>
          <div className="flex flex-col justify-center items-center h-full">
            沒有近期的預約
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
