"use client"

import { useState, useEffect } from "react";

import type { Chart } from "@/lib/types/db"

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

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

type SubChartsProps = {
    charts: Chart[],
    date: number,
    month: number,
    setMonth: React.Dispatch<React.SetStateAction<number>>,
}

const XaxisDataSet: number[] = Array.from({ length: 31 }, (_, index) => index+1);
const monthArray: number[] = [];

export default function SubChart({
    charts,
    date,
    month,
    setMonth,
}: SubChartsProps) {
    const [skipAnimation, setSkipAnimation] = useState(false);

    const [startNb, setStartNb] = useState(date);
    const [itemNb] = useState(7);

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


    return (
        <>
            <div>
                <Carousel
                    className="m-20 w-full max-w-2xl"
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
                                                {`${chart.year}.${chart.month%12 == 0 ? 12 : String(chart.month%12).padStart(2,'0')}`}
                                            </p>
                                            <Separator className="mt-5"/>
                                            <div className="mt-0 flex flex-col items-center justify-center">
                                                <FormControlLabel
                                                    checked={skipAnimation}
                                                    control={
                                                        <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
                                                    }
                                                    label="skipAnimation"
                                                    labelPlacement="end"
                                                    disabled={isChanging}
                                                />
                                                <Box>
                                                    <BarChart
                                                        height={250}
                                                        width={500}
                                                        xAxis={[{ scaleType: 'band', data: XaxisDataSet.slice(startNb, startNb+itemNb)}]}
                                                        yAxis={[{ min: 0, max: Math.max(...chart.totalTime), hideTooltip: true}]}
                                                        series={[{ data: chart.totalTime.slice(startNb, startNb+itemNb), color: "#FFCBCB" }]}
                                                        skipAnimation={skipAnimation}
                                                        leftAxis={null}
                                                    />
                                                </Box>
                                                <div className="w-96">
                                                    <Slider
                                                        value={startNb}
                                                        onChange={handleStartNbChange}
                                                        valueLabelDisplay="auto"
                                                        min={0}
                                                        max={24}
                                                        aria-labelledby="input-item-number"
                                                        disabled={isChanging}
                                                        sx={{
                                                            color: "#FFCBCB"
                                                        }}
                                                    />
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