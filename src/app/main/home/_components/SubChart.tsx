"use client"

import { useState } from "react";

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
} from "@/components/ui/carousel"

type SubChartsProps = {
    charts: Chart[],
}

const array: number[] = Array.from({ length: 31 }, (_, index) => index+1);


export default function SubChart({
    charts,
}: SubChartsProps) {
    const [skipAnimation, setSkipAnimation] = useState(false);

    const [itemNb, setItemNb] = useState(5);
    const handleItemNbChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number' || !event) {
          return;
        }
        if (newValue > 24)  newValue = 24;
        setItemNb(newValue);
    };

    return (
        <>
            <div>
                <Carousel
                    className="m-20 w-full max-w-5xl"
                >
                    <CarouselContent>
                        {charts.map((chart, chartIndex) => (
                                <CarouselItem key={`${chartIndex}`}>
                                    <Card>
                                        <CardContent>
                                            <p>{chart.month}</p>
                                            <Box>
                                                <BarChart
                                                    height={300}
                                                    width={500}
                                                    xAxis={[{ scaleType: 'band', data: array.slice(itemNb, itemNb+7)}]}
                                                    yAxis={[{ min: 0, max: Math.max(...chart.totalTime), hideTooltip: true}]}
                                                    series={[{ data: chart.totalTime.slice(itemNb, itemNb+7), color: "#FFCBCB" }]}
                                                    skipAnimation={skipAnimation}
                                                    leftAxis={null}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <div className="w-96">
                    <Slider
                        value={itemNb}
                        onChange={handleItemNbChange}
                        valueLabelDisplay="auto"
                        // step={7}
                        min={0}
                        max={24}
                        aria-labelledby="input-item-number"
                    />
                    <FormControlLabel
                        checked={skipAnimation}
                        control={
                            <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
                        }
                        label="skipAnimation"
                        labelPlacement="end"
                    />
                </div>
            </div>
        </>
    )
}