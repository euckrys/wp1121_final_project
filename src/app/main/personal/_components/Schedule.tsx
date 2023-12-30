"use client"
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouselNotHome"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialogNoCross";
import { useState } from "react";
import useUserInfo from "@/hooks/useUserInfo"
import { cn } from "@/lib/utils/shadcn";


type UpdateProfileDialogProps = {
    _availableTime: Array<boolean>,
    _appointment: Array<string>,
    dialogOpen: boolean,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function Schedule({
    _availableTime,
    _appointment,
    dialogOpen,
    setDialogOpen
}: UpdateProfileDialogProps) {
    const [availableTime, setAvailableTime] = useState<Array<boolean>>(_availableTime);
    const [appointment] = useState<Array<string>>(_appointment);
    const { updateAvailableTime, loading } = useUserInfo();
    const thisWeek: Date[] = [];    
    const nextWeek: Date[] = [];
    const SuntoMon: string[] = ["日", "一", "二", "三", "四", "五", "六"];
    for (let i = 0; i < 7; i++) {
        const today = new Date();
        today.setDate(today.getDate() + i);
        thisWeek.push(today);
    }
    for (let i = 0; i < 7; i++) {
      const today = new Date();
      today.setDate(today.getDate() + 7+i);
      nextWeek.push(today);
  }

    const handleOpenDialog = () => {
      setAvailableTime(_availableTime);
      setDialogOpen(true);
  }
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setAvailableTime(_availableTime);
    }
    const handleUpdate = async () => {
        try {
            await updateAvailableTime({
                availableTime
            })
        } catch (error) {
            console.log(error);
            alert("Error updating schedule")
        }

        handleCloseDialog();
    };

    const handleAvailable = (index: number) => {
        const newAvailableTime = availableTime.map((a, i) => {
            if (i === index) {
              return !a;
            } else {
              return a;
            }
          });

        setAvailableTime(newAvailableTime);
    }
    return (
    <div className="grid justify-items-center">
      <Carousel className="m-20 w-full max-w-5xl">
        <CarouselContent>
          {Array.from({ length: 2 }).map((_, index) => (
            <CarouselItem key={index}>
              {index===0 &&(
                <div className="p-1 h-72 mb-10">
                <Card className={cn("w-5/6 ml-20 mr-20 shadow-none border-1 rounded-none items-center justify-center")}>
                  <CardContent className="flex items-center justify-center">
                    <div className="grid grid-rows-6 grid-flow-col gap-4">
                      {_availableTime.map((available, i) => (
                        i <=34 &&(
                        <>
                        {i%5==0 &&(
                            <div className="ml-7">{(thisWeek[i/5].getMonth()+1).toString() +"/"+(thisWeek[i/5].getDate()).toString() +"("+SuntoMon[(thisWeek[i/5].getDay())] +")"}</div>
                        )}
                        <Button disabled key={i} className={(available || _appointment[i]!=="/" ? "bg-pink-700" : "bg-pink-200") + " w-32"}>
                          {appointment[i] === "/"? (9+(i%5)*2).toString()+":00 ~ "+(11+(i%5)*2).toString()+":00" :"已預約"+(appointment[i])}
                        </Button>
                        </>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              )}
              {index===1 &&(
                <div className="p-1 h-72 ">
                <Card className={cn("w-5/6 ml-20 mr-20 shadow-none border-1 rounded-none items-center justify-center")}>
                  <CardContent className="flex items-center justify-center">
                    <div className="grid grid-rows-6 grid-flow-col gap-4">
                      {_availableTime.map((available, i) => (
                        i>34 &&(
                        <>
                        {i%5==0 &&
                        <div className="ml-7">{(nextWeek[(i-35)/5].getMonth()+1).toString()+"/"+(nextWeek[(i-35)/5].getDate()).toString()+"("+SuntoMon[(nextWeek[(i-35)/5].getDay())] +")"}</div>
                        }
                        <Button disabled key={i} className={(available ? "bg-pink-700" : "bg-pink-200") + " w-32"}>
                          {9+(i%5)*2}:00 ~ {11+(i%5)*2}:00
                        </Button>
                        </>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <div className="grid justify-items-center" >
          <Button onClick = {() => {handleOpenDialog()}}>編輯時程表</Button>
        </div>
      </Carousel>
      {dialogOpen &&(
        <div className="static">
          <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="left-96 bg-transparent border-0">
                <Carousel className="w-full max-w-5xl">
                    <CarouselContent>
                    {Array.from({ length: 2 }).map((_, index) => (
                        <CarouselItem key={index}>
                        {index===0 &&(
                            <div className="p-1 h-72">
                            <Card className={cn("shadow-none border-0")}>
                            <CardContent className="flex items-center justify-center">
                                <div className="grid grid-rows-6 grid-flow-col gap-4">
                                {availableTime.map((available, i) => (
                                    i <=34 &&(
                                    <>
                                      {i%5==0 &&(
                                        <div className="ml-5">{(thisWeek[i/5].getMonth()+1).toString() +"/"+(thisWeek[i/5].getDate()).toString() +"("+SuntoMon[(thisWeek[i/5].getDay())] +")"}</div>
                                      )}
                                      <Button key={i} disabled = {appointment[i] !== "/"} className={(available || appointment[i]!=="/"? "bg-pink-700" : "bg-pink-200" ) + " w-32"} onClick={() => handleAvailable(i)}>
                                        {appointment[i] === "/"? (9+(i%5)*2).toString()+":00 ~ "+(11+(i%5)*2).toString()+":00" :(appointment[i])}
                                      </Button>
                                    </>
                                    )
                                ))}
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                        )}
                        {index===1 &&(
                            <div className="p-1 h-72">
                            <Card className={cn("shadow-none border-0")}>
                            <CardContent className="flex items-center justify-center">
                                <div className="grid grid-rows-6 grid-flow-col gap-4">
                                {availableTime.map((available, i) => (
                                    i >34 &&(
                                    <>
                                      {i%5==0 &&
                                        <div className="ml-7">{(nextWeek[(i-35)/5].getMonth()+1).toString()+"/"+(nextWeek[(i-35)/5].getDate()).toString()+"("+SuntoMon[(nextWeek[(i-35)/5].getDay())] +")"}</div>
                                      }
                                    <Button key={i} className={(available ? "bg-pink-700" : "bg-pink-200") + " w-32"} onClick={() => handleAvailable(i)}>
                                      {9+(i%5)*2}:00 ~ {11+(i%5)*2}:00
                                    </Button>
                                    </>
                                    )
                                ))}
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                        )}
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <DialogFooter>
                    <Button
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        更新時程表
                    </Button>
                    <Button onClick={handleCloseDialog}>取消</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
      )}
      </div>
    )
}