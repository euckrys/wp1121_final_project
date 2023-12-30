"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import type { Chart } from "@/lib/types/db"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import CreateRecordDialog from "./CreateRecordDialog"
import Record from "./Record"

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
    year: number,
    setYear: React.Dispatch<React.SetStateAction<number>>,
    isLoading: boolean,
}

const typeValues = ["bg-white", "bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700", "bg-red-800", "bg-red-900"];
const typeArray = typeValues.map((value) => value);

const monthArray: number[] = [];

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
    year,
    setYear,
    isLoading,
}: MainChartProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [api, setApi] = useState<CarouselApi>();
    const [isChanging, setIschanging] = useState<boolean>(false);

    const { data: session } = useSession();


    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    useEffect(() => {
        if (monthArray.length > 1)    return;
        for ( let i = 0; i < 6; i++ ) {
            monthArray.push(charts[i].month%12 == 0 ? 12 : charts[i].month%12);
        }
    }, [])

    useEffect(() => {
        if (!api)   return;

        setIschanging(true);
        api.scrollTo(monthArray.indexOf(month));
        setIschanging(false);

        api.on("select", () => {
            setIschanging(true);

            if (api.selectedScrollSnap() > api.previousScrollSnap())
                if (month + 1 > 12) {
                    setMonth(month-11);
                    setYear(year+1);
                }
                else {
                    setMonth(month+1)
                    setYear(year);
                }
            else if(api.selectedScrollSnap() < api.previousScrollSnap())
                if (month - 1 < 1) {
                    setMonth(month+11);
                    setYear(year-1);
                }
                else {
                    setMonth(month-1)
                    setYear(year);
                }

            setIschanging(false);
        })

    }, [api, month]);

    const getSumOfTime = (i:number) => {
        let sum = 0;
        charts[i].totalTime.forEach((num)=> {
            sum += num;
        })
        console.log(sum);
        const result: number = sum/2;
        return result;
    }

    const getFirstDay = (year:number, month:number) => {
        const firstDay = new Date(year, month-1, 1).getDay();
        return firstDay;
    }

    const getDaysInMonth = (year:number, month:number) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        return daysInMonth;
    }

    const getMonthName = (monthNumber:number) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', {
          month: 'long',
        });
    }

    return (
        <>
            <div className="w-full h-full">
                <Carousel
                    className="ml-20 mt-20 w-full h-3/6"
                    opts={{
                        startIndex: 3,
                        watchDrag: false,
                    }}
                    setApi={setApi}
                >
                    <CarouselContent className="h-3/6">
                        {charts.map((chart, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 h-2/6" style={{height: '50%'}}>
                                    <Card className="shadow-xl">
                                        <CardContent className="">
                                            <div className="flex flex-col m-4 mt-8 justify-center items-center">
                                                <p className="justify-center font-sans font-bold text-3xl">
                                                    {`${chart.year}.${chart.month%12 == 0 ? 12 : String(chart.month%12).padStart(2,'0')}`}
                                                </p>
                                                <Separator className="mt-5 mb-16"/>
                                                <div className="grid grid-cols-5 gap-x-0 w-full mb-8">
                                                    <div className="2xl:w-[448px] xl:w-[336px] lg:w-[224px] w-[168px] mt-0 col-span-3 self-center justify-self-center flex flex-col justify-center items-center">
                                                        <div className="w-full items-center justify-center grid grid-rows-1 grid-cols-7 gap-x-0 gao-y-0 mb-2">
                                                            <div className="self-center justify-self-center font-bold">S</div>
                                                            <div className="self-center justify-self-center font-bold">M</div>
                                                            <div className="self-center justify-self-center font-bold">T</div>
                                                            <div className="self-center justify-self-center font-bold">W</div>
                                                            <div className="self-center justify-self-center font-bold">T</div>
                                                            <div className="self-center justify-self-center font-bold">F</div>
                                                            <div className="self-center justify-self-center font-bold">S</div>
                                                        </div>
                                                        <div className="items-center justify-center grid grid-rows-5 grid-cols-7 gap-x-0 gap-y-0">
                                                            {[...Array(42)].map((_, index) => {
                                                                const Date = (index < getFirstDay(chart.year, month)+getDaysInMonth(chart.year, month) && index > getFirstDay(chart.year, month)-1) ? index-getFirstDay(chart.year, month)+1 : null;
                                                                const time = Date !== null ? chart.totalTime[Date-1] : null;
                                                                if (Date && time != null) {
                                                                    return(
                                                                        <div
                                                                            key={index+1}
                                                                            className={
                                                                            `border 2xl:h-16 2xl:w-16 xl:h-12 xl:w-12 lg:h-8 lg:w-8 h-6 w-6
                                                                                ${ Date == date ? "border-black border-4" : "" }
                                                                                ${ time > 10 ? typeArray[9] : typeArray[time] }`
                                                                            }
                                                                            onClick={() => {
                                                                                if (isLoading || isChanging) return;
                                                                                setDate(Date);
                                                                                setMonth(chart.month%12 == 0 ? 12 : chart.month%12);
                                                                                setYear(chart.year);
                                                                                setChartId(chart.chartId);
                                                                                setTotalTime(chart.totalTime);
                                                                            }}
                                                                        />
                                                                    )
                                                                } else {
                                                                    return(
                                                                        <div
                                                                            key={index+1}
                                                                            className={"border 2xl:h-16 2xl:w-16 xl:h-12 xl:w-12 lg:h-8 lg:w-8 h-6 w-6 bg-gray-100"}
                                                                        />
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                        <div className="mt-4 mb-4">
                                                            <p className="font-sans font-medium lg:text-xl md:text-base text-xs">{`Total time of ${getMonthName(month)} : `}
                                                                <span className="underline decoration-2">{` ${getSumOfTime(index)} hours`}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col col-span-2">
                                                        <p className="justify-center self-center font-sans font-bold text-2xl mt-[-4px] underline decoration-2">
                                                            {`${String(month).padStart(2,'0')}.${String(date).padStart(2,'0')}`}
                                                        </p>
                                                        <div className="flex flex-col h-full justify-self-start items-center mt-6">
                                                            {!chart.totalTime[date-1] ? (
                                                                <div className="h-full flex flex-col justify-center items-center">
                                                                    <div className="text-lg font-medium">{`這天沒有${session?.user?.isCoach ? "教學" : "運動"}紀錄 :)`}</div>
                                                                </div>
                                                            ) : (chart.records
                                                                    .filter((record) => record.date === date)
                                                                    .map((record) => (
                                                                        <Record
                                                                            key={record.id}
                                                                            sportType={record.sportType}
                                                                            time={record.time}
                                                                            description={record.description}
                                                                        />
                                                                    )
                                                                )
                                                            )}
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <Fab
                                                                color="secondary"
                                                                onClick={() => {
                                                                    setDialogOpen(true)
                                                                    setMonth(chart.month%12 == 0 ? 12 : chart.month%12);
                                                                    setYear(chart.year);
                                                                    setChartId(chart.chartId);
                                                                    setTotalTime(chart.totalTime);
                                                                }}
                                                                aria-label="add"
                                                                sx={{
                                                                    backgroundColor: "#FFCBCB",
                                                                    color: "black",
                                                                }}
                                                            >
                                                                <AddIcon fontSize="medium" />
                                                            </Fab>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                {dialogOpen && (
                                    <>
                                        <CreateRecordDialog
                                            toChartId={chartId}
                                            year={year}
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
                    <CarouselPrevious disabled={isLoading || isChanging} />
                    <CarouselNext disabled={isLoading || isChanging}/>
                </Carousel>
            </div>
        </>
    )
}