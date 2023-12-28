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


type CreateRecordDialog = {
    toChartId: string,
    month: number,
    date: number,
    totalTime: number[],
    showDialog: boolean,
    onclose: () => void,
}

export default function CreateRecordDialog({
    toChartId,
    month,
    date,
    totalTime,
    showDialog,
    onclose
}: CreateRecordDialog) {
    const { createRecord, loading } = useRecords();

    const [sportType, setSportType] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handelCreate = async () => {
        const updatedTotalTime = [...totalTime];
        updatedTotalTime[date-1]  = updatedTotalTime[date-1] + 1;

        try {
            await createRecord({
                toChartId,
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
                            <Input
                                label=""
                                type="text"
                                value={sportType}
                                setValue={setSportType}
                            />
                        </div>
                        <div>
                            <Label>時間</Label>
                            <Input
                                label=""
                                type="text"
                                value={time}
                                setValue={setTime}
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