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
import Input from "@/app/_components/AuthInput"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select"
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>新增貼文</DialogTitle>
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