"use client"

import { useState, useEffect } from "react";

import type { Chart } from "@/lib/types/db"

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Slider from '@mui/material/Slider';

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
import { Switch } from "@/components/ui/switch"


type SubChartsProps = {
    charts: Chart[],
    date: number,
    month: number,
    setMonth: React.Dispatch<React.SetStateAction<number>>,
    year: number,
}

const XaxisDataSet: number[] = Array.from({ length: 31 }, (_, index) => index+1);
const monthArray: number[] = [];

export default function SubChart({
    charts,
    date,
    month,
    setMonth,
    year,
}: SubChartsProps) {
    const [skipAnimation, setSkipAnimation] = useState(false);

    const [startNb, setStartNb] = useState(date);
    const [itemNb, setItemNb] = useState(7);

    const [api, setApi] = useState<CarouselApi>();
    const [isChanging, setIschanging] = useState<boolean>(false);

    const handleStartNbChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number' || !event) return;
        if (newValue > 24)  newValue = 24;
        setStartNb(newValue);
    };

    useEffect(() => {
        if (monthArray.length > 1) return;
        for ( let i = 0; i < 6; i++ ) {
            monthArray.push(charts[i].month%12 == 0 ? 12 : charts[i].month%12);
        }
    }, [])

    useEffect(() => {
        if (date < 5) setStartNb(0);
        else if (date > 28) setStartNb(24);
        else setStartNb(date-4);
    }, [date])

    useEffect(() => {
        if (!api)   return;

        setIschanging(true);
        api.scrollTo(monthArray.indexOf(month));
        setIschanging(false);

        api.on("select", () => {
            setIschanging(true);

            if (api.selectedScrollSnap() > api.previousScrollSnap())
                setMonth((month + 1) > 12 ? month-11 : month+1);
            else if(api.selectedScrollSnap() < api.previousScrollSnap())
                setMonth((month - 1) < 1 ? month+11 : month-1);

            setIschanging(false);
        })

    }, [api, month])

    const getDaysInMonth = (year: number, month: number) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        return daysInMonth;
    }

    const handleToggleFull = (checked: boolean) => {
        if (checked) {
            setItemNb(getDaysInMonth(year, month))
            setStartNb(0);
        } else {
            setItemNb(7);
            if (date < 5) setStartNb(0);
            else if (date > 28) setStartNb(24);
            else setStartNb(date-4);
        }
    }


    return (
        <>
            <div className="w-full">
                <Carousel
                    className="mt-20 w-full"
                    opts={{
                        startIndex: 3,
                        watchDrag: false,
                    }}
                    setApi={setApi}
                >
                    <CarouselContent>
                        {charts.map((chart, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 h-fit">
                                    <Card className="shadow-xl">
                                        <CardContent className="flex flex-col m-4 mt-8 items-center justify-center">
                                            <p className="justify-center font-sans font-bold text-3xl">
                                                {`${chart.month%12 == 0 ? 12 : String(chart.month%12).padStart(2,'0')}
                                                    .${String(XaxisDataSet[startNb]).padStart(2,'0')}
                                                    - ${chart.month%12 == 0 ? 12 : String(chart.month%12).padStart(2,'0')}
                                                    .${getDaysInMonth(year, month) - startNb < 7 ? String(getDaysInMonth(year, month)) : String(XaxisDataSet[startNb+itemNb-1]).padStart(2,'0')}`
                                                }
                                            </p>
                                            <Separator className="mt-5 mb-5"/>
                                            <div className="mt-0 flex flex-col items-center justify-center">
                                                    <div className="flex justify-center items-center">
                                                        <Switch
                                                            className="mr-2"
                                                            defaultChecked={true}
                                                            onCheckedChange={(checked: boolean) => setSkipAnimation(!checked)}
                                                        />
                                                        <p className="lg:text-lg text-base font-semibold">{`${skipAnimation ? "取消" : "開啟"}轉場動畫`}</p>
                                                    </div>
                                                    <div className="flex justify-center items-center">
                                                        <Switch
                                                            className="mr-2"
                                                            onCheckedChange={(checked) => handleToggleFull(checked)}
                                                        />
                                                        <p className="lg:text-lg text-base font-semibold">{`顯示${itemNb > 7 ? "全月" : "單週"}數據`}</p>
                                                    </div>
                                                <BarChart
                                                    height={225}
                                                    width={450}
                                                    xAxis={[{ scaleType: 'band', data: XaxisDataSet.slice(startNb, startNb+itemNb)}]}
                                                    yAxis={[{ min: 0, max: Math.max(...chart.totalTime), hideTooltip: true}]}
                                                    series={[{ data: chart.totalTime.slice(startNb, startNb+itemNb), color: "#FFCBCB" }]}
                                                    skipAnimation={skipAnimation}
                                                    leftAxis={null}
                                                />
                                                <div className="flex justify-start items-center">
                                                    <div className="flex flex-col justify-center items-center">
                                                        <p className="font-semibold lg:text-base text-sm">Start Date</p>
                                                        <p className="font-semibold lg:text-base text-sm">Picker</p>
                                                    </div>
                                                    <div className="2xl:w-88 xl:w-76 lg:w-60 w-32 ml-8">
                                                        <Slider
                                                            value={startNb}
                                                            onChange={handleStartNbChange}
                                                            valueLabelDisplay="auto"
                                                            min={0}
                                                            max={24}
                                                            aria-labelledby="input-item-number"
                                                            disabled={isChanging || itemNb > 7}
                                                            sx={{
                                                                color: "#FFCBCB"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious disabled={isChanging}/>
                    <CarouselNext disabled={isChanging}/>
                </Carousel>
            </div>
        </>
    )
}