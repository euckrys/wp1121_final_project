"use client"

import { useState, useEffect } from "react";

import NavBar from "../_components/NavBar";
import MainChart from "./_components/MainChart";

export default function HomePage() {
  const [date, setDate] = useState<number>(1);
  const [month, setMonth] = useState<number>(3);

  useEffect(() => {
    console.log(month);
  }, [date, month])

  return (
    <>
      <div>
        <NavBar/>
        <div>
          <MainChart
            date={date}
            setDate={setDate}
            month={month}
            setMonth={setMonth}
          />
        </div>
      </div>
    </>
  );
}
