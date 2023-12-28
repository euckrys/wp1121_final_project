"use client"

import { useState, useEffect } from "react";

import useCharts from "@/hooks/useCharts"

import type { Chart } from "@/lib/types/db"

import NavBar from "../_components/NavBar";
import MainChart from "./_components/MainChart";

// export default function HomePage() {
//   const [date, setDate] = useState<number>(1);
//   const [month, setMonth] = useState<number>(3);


//   useEffect(() => {
//     console.log(month);
//   }, [date, month])

//   return (
//     <>
//       <div>
//         <NavBar/>
//         <div>
//           <MainChart
//             date={date}
//             setDate={setDate}
//             month={month}
//             setMonth={setMonth}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

export default function HomePage() {
  const [date, setDate] = useState<number>(1);
  const [month, setMonth] = useState<number>(3);
  const { getCharts } = useCharts();

  const [charts, setCharts] = useState<Chart[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [chartId, setChartId] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number[]>([]);

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
    }
}

  useEffect(() => {
    setIsloading(true);
    fetchCharts();
  }, [chartId, totalTime, date, month])

  return (
    <>
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
        </div>
      </div>
    </>
  );
}
