"use client"
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/shadcn";
type UpdateProfileDialogProps = {
    _availableTime: Array<boolean>,
    _appointment: Array<string>,
}
export default function Schedule({
    _availableTime,
    _appointment,
}: UpdateProfileDialogProps){
    const thisWeek: Date[] = [];
    const SuntoMon: string[] = ["日", "一", "二", "三", "四", "五", "六"];
    for (let i = 0; i < 7; i++) {
        const today = new Date();
        today.setDate(today.getDate() + i);
        thisWeek.push(today);
    }
    return (
    <div className="grid justify-items-center">
        <Card className={cn("w-5/6 ml-20 mr-20 shadow border-1 rounded-none items-center justify-center")}>
            <CardContent className="flex items-center justify-center">
                <div className="grid grid-rows-6 grid-flow-col gap-4">
                    {_availableTime.map((available, i) => (
                    i <=34 &&(
                    <>
                    {i%5==0 &&(
                        <div className="ml-7">{(thisWeek[i/5].getMonth()+1).toString() +"/"+(thisWeek[i/5].getDate()).toString() +"("+SuntoMon[(thisWeek[i/5].getDay())] +")"}</div>
                    )}
                        <Button disabled key={i} className={(available || _appointment[i]==="/" ? "bg-pink-200" : "bg-pink-700") + " w-32"}>
                            {_appointment[i] === "/"? (9+(i%5)*2).toString()+":00 ~ "+(11+(i%5)*2).toString()+":00" :("已預約"+_appointment[i])}
                        </Button>
                    </>
                    )
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
    )
}