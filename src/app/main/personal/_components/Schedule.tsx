"use client"
import * as React from "react"
 
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import useUserInfo from "@/hooks/useUserInfo"


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
    <>
      <Carousel className="m-20 w-full max-w-5xl">
        <CarouselContent>
          {Array.from({ length: 2 }).map((_, index) => (
            <CarouselItem key={index}>
              {index===0 &&(
                <div className="p-1 h-72">
                <Card>
                  <CardContent className="flex items-center justify-center">
                    <div className="grid grid-rows-5 grid-flow-col gap-4">
                      {_availableTime.map((available, i) => (
                        i <=34 &&(
                        <Button disabled key={i} className={available || appointment[i]!=="/" ? "bg-pink-700" : "bg-pink-200"}>
                          {appointment[i] === "/"? (9+(i%5)*2).toString()+":00 ~ "+(11+(i%5)*2).toString()+":00" :(appointment[i])}
                        </Button>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              )}
              {index===1 &&(
                <div className="p-1 h-72">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <div className="grid grid-rows-5 grid-flow-col gap-4">
                      {_availableTime.map((available, i) => (
                        i >34 &&(
                        <Button disabled key={i} className={available ? "bg-pink-700" : "bg-pink-200"}>
                          {9+(i%5)*2}:00 ~ {11+(i%5)*2}:00
                        </Button>
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

      <Button onClick = {() => {setDialogOpen(true)}}>編輯時程表</Button>
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Carousel className="max-w-3xl">
                    <CarouselContent>
                    {Array.from({ length: 2 }).map((_, index) => (
                        <CarouselItem key={index}>
                        {index===0 &&(
                            <div className="p-1 h-72">
                            <Card>
                            <CardContent className="flex items-center justify-center">
                                <div className="grid grid-rows-5 grid-flow-col gap-4">
                                {availableTime.map((available, i) => (
                                    i <=34 &&(
                                    <Button key={i} disabled = {appointment[i] !== "/"} className={available ? "bg-pink-700" : "bg-pink-200"} onClick={() => handleAvailable(i)}>
                                      {appointment[i] === "/"? (9+(i%5)*2).toString()+":00 ~ "+(11+(i%5)*2).toString()+":00" :(appointment[i])}
                                    </Button>
                                    )
                                ))}
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                        )}
                        {index===1 &&(
                            <div className="p-1 h-72">
                            <Card>
                            <CardContent className="flex items-center justify-center p-6">
                                <div className="grid grid-rows-5 grid-flow-col gap-4">
                                {availableTime.map((available, i) => (
                                    i >34 &&(
                                    <Button key={i} className={available ? "bg-pink-700" : "bg-pink-200"} onClick={() => handleAvailable(i)}>
                                      {9+(i%5)*2}:00 ~ {11+(i%5)*2}:00
                                    </Button>
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
      )}
    </>
    )
}