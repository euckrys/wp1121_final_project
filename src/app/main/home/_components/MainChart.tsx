"use client"

import { useState } from "react"

import type { Chart } from "@/lib/types/db"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

import CreateRecordDialog from "./CreateRecordDialog"

type MainChartProps = {
    charts: Chart[],
    chartId: string,
    setChartId: React.Dispatch<React.SetStateAction<string>>,
    totalTime: number[],
    setTotalTime: React.Dispatch<React.SetStateAction<number[]>>,
    date: number,
    setDate: React.Dispatch<React.SetStateAction<number>>,
    month: number,
    setMonth: React.Dispatch<React.SetStateAction<number>>,
    isLoading: boolean,
}

const arrayValues = ["bg-red-50","bg-red-100","bg-red-200","bg-red-300","bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700", "bg-red-800", "bg-red-900"];
const array = arrayValues.map((value) => value);

export default function MainChart({
    charts,
    chartId,
    setChartId,
    totalTime,
    setTotalTime,
    date,
    setDate,
    month,
    setMonth,
    isLoading,
}: MainChartProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    return (
        <>
            <div>
                <Carousel
                    className="m-20 w-full max-w-5xl"
                    opts={{startIndex: 2}}
                >
                    <CarouselContent>
                        {charts.map((chart, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 h-fit">
                                    <Card>
                                        <CardContent className="flex-row items-center justify-center">
                                            {(date < 10) ? (
                                                <p className="flex justify-center">{`${chart.month}/0${date}`}</p>
                                            ) : (
                                                <p className="flex justify-center">{`${chart.month}/${date}`}</p>
                                            )}
                                            <div className="items-center justify-center grid grid-rows-5 grid-cols-7">
                                                {chart.totalTime.map((time, Date) => (
                                                    <div
                                                        key={Date+1}
                                                        className={
                                                           `p-2 text-center border
                                                            ${ Date+1 == date ? "border-black border-8" : "" }
                                                            ${ time > 10 ? array[9] : array[time] }`
                                                    }
                                                        onClick={() => {
                                                            setDate(Date+1);
                                                            setMonth(chart.month);
                                                            setChartId(chart.chartId);
                                                            setTotalTime(chart.totalTime);
                                                        }}
                                                    >
                                                        {time}
                                                    </div>
                                                ))}
                                             </div>
                                             <div>
                                                {chart.records
                                                    .filter((record) => record.date === date)
                                                    .map((record) => (
                                                        <div key={record.id}>
                                                            <p>{record.sportType}</p>
                                                            <p>{record.time}</p>
                                                            <p>{record.description}</p>
                                                        </div>
                                                ))}
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    setDialogOpen(true)
                                                    setMonth(chart.month);
                                                    setChartId(chart.chartId);
                                                    setTotalTime(chart.totalTime);
                                                }}
                                                disabled={isLoading}
                                                className="font-bold text-base ml-2 rounded-md"
                                            >
                                                新增紀錄
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                                {dialogOpen && (
                                    <>
                                        <CreateRecordDialog
                                            toChartId={chartId}
                                            month={month}
                                            date={date}
                                            totalTime={totalTime}
                                            setTotalTime={setTotalTime}
                                            showDialog={dialogOpen}
                                            onclose={handleCloseDialog}
                                        />
                                    </>
                                )}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious disabled={isLoading} />
                    <CarouselNext disabled={isLoading}/>
                </Carousel>
            </div>
        </>
    )
}