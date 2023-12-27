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

type CreatePostDialogProps = {
    username: string,
    showDialog: boolean;
    onclose: () => void;
}

export default function CreatePostDialog({
    username,
    showDialog,
    onclose
}: CreatePostDialogProps) {
    const { createPost, loading } = usePosts();
    const [sportType, setSportType] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleCreate = async () => {
        try {
            await createPost({
                author: username,
                sportType,
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