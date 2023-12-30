"use client"
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button";

import { useState } from "react";
import useUserInfo from "@/hooks/useUserInfo"
import useOtherUserInfo from "@/hooks/useOtherUserInfo"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UpdateProfileDialogProps = {
    _coach_availableTime: Array<boolean>,
    _coach_appointment: Array<string>,
    _availableTime: Array<boolean>,
    _appointment: Array<string>,
    coachname: string,
    username: string,
    dialogOpen: boolean,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    cancelDialogOpen: boolean,
    setCancelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isCoach: boolean,
}
export default function Schedule({
    _coach_availableTime,
    _coach_appointment,
    _availableTime,
    _appointment,
    coachname,
    username,
    dialogOpen,
    setDialogOpen,
    cancelDialogOpen,
    setCancelDialogOpen,
    isCoach,
}: UpdateProfileDialogProps) {
    const [coach_availableTime, setCoach_AvailableTime] = useState<Array<boolean>>(_coach_availableTime);
    const [coach_appointment, setCoach_Appointment] = useState<Array<string>>(_coach_appointment);
    const [availableTime, setAvailableTime] = useState<Array<boolean>>(_availableTime);
    const [appointment, setAppointment] = useState<Array<string>>(_appointment);
    const [appointmentIndex, setAppointmentIndex] = useState<number>(0);
    const { updateAvailableTime, loading } = useUserInfo();
    const { updateOtherAvailableTime, loading:loading2 } = useOtherUserInfo();
    const thisWeek: Date[] = [];    
    const SuntoMon: string[] = ["日", "一", "二", "三", "四", "五", "六"];
    for (let i = 0; i < 7; i++) {
        const today = new Date();
        today.setDate(today.getDate() + i);
        thisWeek.push(today);
    }
    const handleOpenDialog = (index: number) => {
      setDialogOpen(true);
      setAppointmentIndex(index);
      if(_availableTime[index] === true && _appointment[index] === "/")
      {
        const newAvailableTime = availableTime.map((a, i) => {
          if (i === index) {
            return !a;
          } else {
            return a;
          }
        });
        setAvailableTime(newAvailableTime);
        const newAppointment = appointment.map((a, i) => {
          if (i === index) {
            return coachname;
          } else {
            return a;
          }
        });
        setAppointment(newAppointment);
        const newCoach_AvailableTime = coach_availableTime.map((a, i) => {
          if (i === index) {
            return !a;
          } else {
            return a;
          }
        });
        setCoach_AvailableTime(newCoach_AvailableTime);
        const newCoach_Appointment = coach_appointment.map((a, i) => {
          if (i === index) {
            return username;
          } else {
            return a;
          }
        });
        setCoach_Appointment(newCoach_Appointment);

      }
      else
      {
        alert("這個時段已預約別人!!!")
        handleCloseDialog();
      }
    }
    const handleCloseDialog = () => {
      setCoach_AvailableTime(_coach_availableTime);
      setCoach_Appointment(_coach_appointment);
      setAvailableTime(_availableTime);
      setAppointment(_appointment);
      setAppointmentIndex(-1);
      setDialogOpen(false);
      setCancelDialogOpen(false);
    }
    const handleUpdate = async () => {
      try {
          await updateAvailableTime({
              availableTime,
              appointment
          })
          await updateOtherAvailableTime({
            availableTime: coach_availableTime,
            appointment: coach_appointment
          })
      } catch (error) {
          console.log(error);
          alert("Error updating schedule");
      }

      setDialogOpen(false);
      setCancelDialogOpen(false);

    }


    const handleOpenCancelDialog = (index: number) => {
      setCancelDialogOpen(true);
      setAppointmentIndex(index);
      if(_availableTime[index] === false)
      {
        const newAvailableTime = availableTime.map((a, i) => {
          if (i === index) {
            return !a;
          } else {
            return a;
          }
        });
        setAvailableTime(newAvailableTime);
        const newAppointment = appointment.map((a, i) => {
          if (i === index) {
            return "/";
          } else {
            return a;
          }
        });
        setAppointment(newAppointment);
        const newCoach_AvailableTime = coach_availableTime.map((a, i) => {
          if (i === index) {
            return !a;
          } else {
            return a;
          }
        });
        setCoach_AvailableTime(newCoach_AvailableTime);
        const newCoach_Appointment = coach_appointment.map((a, i) => {
          if (i === index) {
            return "/";
          } else {
            return a;
          }
        });
        setCoach_Appointment(newCoach_Appointment);

      }
      else
      {
        alert("errorrrrrrrrrrrrr")
        handleCloseDialog();
      }
    }


    return (
    <>
      <div className="p-1 h-72">
        {!isCoach && (
        <Card>
          <CardContent className="flex items-center justify-center">
            <div className="grid grid-rows-6 grid-flow-col gap-4">
              {_coach_availableTime.map((available, i) => (
                i <= 34 && (
                available && _appointment[i] =="/" ?(
                  <>
                  {i%5==0 &&(
                      <div className="ml-7">{(thisWeek[i/5].getMonth()+1).toString() +"/"+(thisWeek[i/5].getDate()).toString() +"("+SuntoMon[(thisWeek[i/5].getDay())] +")"}</div>
                  )}
                  <Button key={i} className="bg-pink-700 w-32" onClick={() => handleOpenDialog(i)}>
                    {9+(i%5)*2}:00 ~ {11+(i%5)*2}:00
                  </Button>
                  </>
                  )
                :(
                  <>
                  {i%5==0 &&(
                      <div className="ml-7">{(thisWeek[i/5].getMonth()+1).toString() +"/"+(thisWeek[i/5].getDate()).toString() +"("+SuntoMon[(thisWeek[i/5].getDay())] +")"}</div>
                  )}
                  <Button key={i} disabled={!available && _availableTime[i]} className={(_availableTime[i]? "bg-inherit border-white": "bg-pink-300") + " w-32" } onClick={() => handleOpenCancelDialog(i)}>
                    {_availableTime[i] || _appointment[i] === "/" ?"":"已預約"+_appointment[i]}
                  </Button>
                  </>
                )
                )
              ))}
            </div>
          </CardContent>
        </Card>)}
        {isCoach && (
        <Card>
          <CardContent className="flex items-center justify-center">
            <div className="grid grid-rows-6 grid-flow-col gap-4">
              {_coach_availableTime.map((available, i) => (
                i <= 34 && (
                available?(
                  <>
                  {i%5==0 &&(
                      <div className="ml-7">{(thisWeek[i/5].getMonth()+1).toString() +"/"+(thisWeek[i/5].getDate()).toString() +"("+SuntoMon[(thisWeek[i/5].getDay())] +")"}</div>
                  )}
                  <Button disabled key={i} className="bg-pink-700 w-32">
                    {9+(i%5)*2}:00 ~ {11+(i%5)*2}:00
                  </Button>
                  </>
                  )
                :(
                  <>
                  {i%5==0 &&(
                      <div className="ml-7">{(thisWeek[i/5].getMonth()+1).toString() +"/"+(thisWeek[i/5].getDate()).toString() +"("+SuntoMon[(thisWeek[i/5].getDay())] +")"}</div>
                  )}
                  <Button key={i} disabled className={(_coach_appointment[i]==="/"?"bg-inherit border-white":"bg-pink-700") + " w-32"}>
                    {_coach_appointment[i]==="/" ? "":"已預約"}
                  </Button>
                  </>
                )
                )
              ))}
            </div>
          </CardContent>
        </Card>)}
        {dialogOpen && (
          <Dialog open={dialogOpen} onOpenChange={handleCloseDialog} >
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle></DialogTitle>
                      <DialogDescription> 確定預約{coachname}教練於{9+(appointmentIndex%5)*2}:00 ~ {11+(appointmentIndex%5)*2}:00 </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                      <Button
                          onClick={() => handleUpdate()}
                          disabled={loading || loading2}
                      >
                          確定
                      </Button>
                      <Button onClick={handleCloseDialog}>返回</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        )}
        {cancelDialogOpen && (
          <Dialog open={cancelDialogOpen} onOpenChange={handleCloseDialog} >
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle></DialogTitle>
                      <DialogDescription> 確定取消預約{coachname}教練於{9+(appointmentIndex%5)*2}:00 ~ {11+(appointmentIndex%5)*2}:00 </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                      <Button
                          onClick={() => handleUpdate()}
                          disabled={loading || loading2}
                      >
                          確定取消
                      </Button>
                      <Button onClick={handleCloseDialog}>返回</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        )}
      </div>

    </>
    )
}