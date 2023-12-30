"use client"

import { useState } from "react";
import usePosts from "@/hooks/usePosts"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import Input from "@/app/_components/AuthInput"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type CreatePostDialogProps = {
    username: string,
    showDialog: boolean,
    onclose: () => void,
}

export default function CreatePostDialog({
    username,
    showDialog,
    onclose
}: CreatePostDialogProps) {
    const { createPost, loading } = usePosts();
    const [sportType, setSportType] = useState<string>("");
    const [expectedTime, setExpectedTime] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");

    const handleCreate = async () => {
        try {
            await createPost({
                author: username,
                sportType,
                expectedTime,
                description,
            })
        } catch (error) {
            console.log(error);
            alert("Error creating Post");
        }

        onclose();
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={onclose}>
                <DialogContent className="p-10">
                    <DialogHeader>
                        <DialogTitle className="text-xl">要新增貼文嗎？</DialogTitle>
                        <DialogDescription className="text-lg">請輸入您的內容！</DialogDescription>
                    </DialogHeader>
                        <div className="w-full flex flex-col items-center">
                            <p>ji</p>
                        </div>
                        <div className="w-full">
                            <Label>種類</Label>
                            <Select
                                onValueChange={(value) => {
                                    if (value == "%") setSportType("");
                                    else setSportType(value);
                                }}
                            >
                                <SelectTrigger className="w-full" disabled={loading}>
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
                        {/* <Select>
                            <SelectTrigger className="w-[180px]" disabled={loading}>
                                <SelectValue placeholder="SportType" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">09:00-11:00</SelectItem>
                                <SelectItem value="1">11:00-13:00</SelectItem>
                                <SelectItem value="2">13:00-15:00</SelectItem>
                                <SelectItem value="3">15:00-17:00</SelectItem>
                                <SelectItem value="4">17:00-19:00</SelectItem>
                            </SelectContent>
                        </Select> */}
                        <ToggleGroup type="multiple"
                                     onValueChange={(value) => {setExpectedTime(value)}}
                        >
                            <ToggleGroupItem value="0" aria-label="Toggle 0">09:00-11:00</ToggleGroupItem>
                            <ToggleGroupItem value="1" aria-label="Toggle 1">11:00-13:00</ToggleGroupItem>
                            <ToggleGroupItem value="2" aria-label="Toggle 2">13:00-15:00</ToggleGroupItem>
                            <ToggleGroupItem value="3" aria-label="Toggle 3">15:00-17:00</ToggleGroupItem>
                            <ToggleGroupItem value="4" aria-label="Toggle 4">17:00-19:00</ToggleGroupItem>
                         </ToggleGroup>
                        <div>
                            <Label>簡介</Label>
                            <Input
                                label=""
                                type="text"
                                value={description}
                                defaultValue="請輸入貼文簡述"
                                setValue={setDescription}
                            />
                        </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={handleCreate}
                            disabled={loading}
                        >
                            新增
                        </Button>
                        <Button onClick={onclose}>取消</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}