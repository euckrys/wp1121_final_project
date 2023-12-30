"use client"

import { useState } from "react";

import useRecords from "@/hooks/useRecords";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Input from "@/app/_components/AuthInput"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import MyTimePicker from "./TimePicker";

import { useToast } from "@/components/ui/use-toast"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,

} from "@/components/ui/select";

type CreateRecordDialog = {
    toChartId: string,
    year: number,
    month: number,
    date: number,
    totalTime: number[],
    setTotalTime: React.Dispatch<React.SetStateAction<number[]>>,
    showDialog: boolean,
    onclose: () => void,
}

export default function CreateRecordDialog({
    toChartId,
    year,
    month,
    date,
    totalTime,
    setTotalTime,
    showDialog,
    onclose
}: CreateRecordDialog) {
    const { createRecord, loading } = useRecords();

    const [sportType, setSportType] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [startHour, setStartHour] = useState<string>("-1");
    const [startMinute, setStartMinute] = useState<string>("-1");
    const [endHour, setEndHour] = useState<string>("-1");
    const [endMinute, setEndMinute] = useState<string>("-1");

    const { toast } = useToast();

    const handelCreate = async () => {
        if (startHour == "-1" || startMinute == "-1" || endHour == "-1" || endMinute == "-1") {
            toast({
                title: "Wrong input of time",
                description: "All fields of Time input should be assigned a value"
            })
            return;
        }

        const timeInterval = 60*Number(endHour) + Number(endMinute) - 60*Number(startHour) - Number(startMinute)  ;

        if (timeInterval <= 0) {
            toast({
                title: "Wrong input of time",
                description: "The StartTime should be earlier than the EndTime"
            })
            return;
        }

        const updatedTotalTime = [...totalTime];
        updatedTotalTime[date-1]  = updatedTotalTime[date-1] + timeInterval/30;

        const time:string = `${startHour}:${startMinute}-${endHour}:${endMinute}`

        try {
            await createRecord({
                toChartId,
                year,
                month,
                date,
                sportType,
                time,
                description,
                totalTime: updatedTotalTime,
            })
        } catch (error) {
            console.log(error);
            alert("Error creating Record");
        } finally {
            setTotalTime(updatedTotalTime);
        }

        onclose();
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={onclose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>新增紀錄</DialogTitle>
                        <DialogDescription>輸入內容</DialogDescription>
                    </DialogHeader>
                        <div>
                            <Label>種類</Label>
                            <Select
                                onValueChange={(value) => {
                                    if (value == "%") setSportType("");
                                    else setSportType(value);
                                }}
                            >
                                <SelectTrigger className="w-[180px]" disabled={loading}>
                                    <SelectValue placeholder="SportType" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fitness">健身</SelectItem>
                                    <SelectItem value="swimming">游泳</SelectItem>
                                    <SelectItem value="yoga">瑜伽</SelectItem>
                                    <SelectItem value="badminton">羽球</SelectItem>
                                    <SelectItem value="basketball">籃球</SelectItem>
                                    <SelectItem value="soccer">足球</SelectItem>
                                    <SelectItem value="others">其他</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>時間</Label>
                            <MyTimePicker
                                setStartHour={setStartHour}
                                setStartMinute={setStartMinute}
                                setEndHour={setEndHour}
                                setEndMinute={setEndMinute}
                            />
                        </div>
                        <div>
                            <Label>敘述</Label>
                            <Input
                                label=""
                                type="text"
                                value={description}
                                setValue={setDescription}
                            />
                        </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={handelCreate}
                            disabled={loading}
                        >
                            新增
                        </Button>
                        <Button onClick={onclose}>取消</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}