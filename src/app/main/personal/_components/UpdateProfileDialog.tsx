"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import useUserInfo from "@/hooks/useUserInfo"

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

type UpdateProfileDialogProps = {
    _displayName: string,
    _sportType: string,
    _age: string,
    _height: string,
    _weight: string,
    _place: string,
    _license: string,
    _introduce: string,
    showDialog: boolean;
    onclose: () => void;
}

export default function UpdateProfileDialog({
    _displayName,
    _sportType,
    _age,
    _height,
    _weight,
    _place,
    _license,
    _introduce,
    showDialog,
    onclose,
}: UpdateProfileDialogProps) {
    const { data: session } = useSession();
    const { updateUserInfo, loading } = useUserInfo();

    const [displayName, setDisplayName] = useState<string>(_displayName);
    const [sportType, setSportType] = useState<string>(_sportType);
    const [age, setAge] = useState<string>(_age);
    const [height, setHeight] = useState<string>(_height);
    const [weight, setWeight] = useState<string>(_weight);
    const [place, setPlace] = useState<string>(_place);
    const [license, setLicense] = useState<string>(_license);
    const [introduce, setIntroduce] = useState<string>(_introduce);

    const handleUpdate = async () => {
        try {
            await updateUserInfo({
                displayName,
                sportType,
                age,
                height,
                weight,
                place,
                license,
                introduce
            })
        } catch (error) {
            console.log(error);
            alert("Error updating profile");
        }

        onclose();
    };

    return (
        <>
            <Dialog open={showDialog} onOpenChange={onclose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                        <div>
                            <Label>暱稱</Label>
                            <Input
                                label=""
                                type="text"
                                value={displayName}
                                setValue={setDisplayName}
                            />
                        </div>
                        <div>
                            <Label>運動種類</Label>
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
                            <Label>年齡</Label>
                            <Input
                                label=""
                                type="text"
                                value={age}
                                setValue={setAge}
                            />
                        </div>
                        <div>
                            <Label>體重</Label>
                            <Input
                                label=""
                                type="text"
                                value={weight}
                                setValue={setWeight}
                            />
                        </div>
                        <div>
                            <Label>身高</Label>
                            <Input
                                label=""
                                type="text"
                                value={height}
                                setValue={setHeight}
                            />
                        </div>
                        {session?.user?.isCoach && (
                            <>
                                <div>
                                    <Label>場館</Label>
                                    <Input
                                        label=""
                                        type="text"
                                        value={place}
                                        setValue={setPlace}
                                    />
                                </div>
                                <div>
                                    <Label>證照資訊</Label>
                                    <Input
                                        label=""
                                        type="text"
                                        value={license}
                                        setValue={setLicense}
                                    />
                                </div>
                                <div>
                                <Label>介紹/教學理念</Label>
                                <Input
                                    label=""
                                    type="text"
                                    value={introduce}
                                    setValue={setIntroduce}
                                />
                            </div>
                            </>
                        )}
                    <DialogFooter>
                        <Button
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            更新使用者資料
                        </Button>
                        <Button onClick={onclose}>取消</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}