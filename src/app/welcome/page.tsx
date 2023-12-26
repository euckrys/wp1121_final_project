"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import useUserInfo from "@/hooks/useUserInfo";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Input from "../_components/AuthInput"

export default function ProfileForm() {
    const { data: session } = useSession();
    const router = useRouter();

    const { postUserInfo, updateUser, loading } = useUserInfo();

    const [displayName, setDisplayName] = useState<string>("");
    const [sportType, setSportType] = useState<string>("");
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [place, setPlace] = useState<string>("");
    const [license, setLicense] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!sportType || !age || !height || !weight) return;
        try {
            await updateUser();
            await postUserInfo({
                displayName,
                sportType,
                age,
                height,
                weight,
                place,
                license,
            });
        } catch (error) {
            console.log(error);
            alert("Error update user profile");
        }

        router.push("/main");
    }

    return (
        <Card className="min-w-[300px] self-center">
            <CardHeader>
                <CardTitle>請填寫使用者資訊</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
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
                        <Input
                            label=""
                            type="text"
                            value={sportType}
                            setValue={setSportType}
                        />
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
                        </>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        Continue
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}