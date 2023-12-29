"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Input from "../_components/AuthInput";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserInfo from "@/hooks/useUserInfo";

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
  const [introduce, setIntroduce] = useState<string>("");
  const [availableTime] = useState<Array<boolean>>(Array(70).fill(true));
  const [coachAvailableTime] = useState<Array<boolean>>(Array(70).fill(false));
  const [appointment] = useState<Array<string>>(Array(35).fill("/"));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sportType || !age || !height || !weight) return;
    try {
      await updateUser();
      if (session?.user?.isCoach) {
        await postUserInfo({
          displayName,
          sportType,
          age,
          height,
          weight,
          place,
          license,
          introduce,
          availableTime: coachAvailableTime,
          appointment,
        });
      } else {
        await postUserInfo({
          displayName,
          sportType,
          age,
          height,
          weight,
          place,
          license,
          introduce,
          availableTime,
          appointment,
        });
      }
    } catch (error) {
      console.log(error);
      alert("Error update user profile");
    }

    router.push("/main");
  };

  return (
    <div className="flex justify-center p-12">
      {session?.user?.isCoach ? (
        <Card className="min-w-[300px] self-center">
          <CardHeader>
            <CardTitle>請填寫使用者資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-row">
              <div>
                <div className="p-2">
                  <Label>暱稱</Label>
                  <Input
                    label=""
                    type="text"
                    value={displayName}
                    setValue={setDisplayName}
                  />
                </div>
                <div className="p-2">
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
                <div className="p-2">
                  <Label>年齡</Label>
                  <Input label="" type="text" value={age} setValue={setAge} />
                </div>
                <div className="p-2">
                  <Label>體重</Label>
                  <Input
                    label=""
                    type="text"
                    value={weight}
                    setValue={setWeight}
                  />
                </div>
              </div>
              <div>
                <div className="p-2">
                  <Label>身高</Label>
                  <Input
                    label=""
                    type="text"
                    value={height}
                    setValue={setHeight}
                  />
                </div>
                <div className="p-2">
                  <Label>場館</Label>
                  <Input
                    label=""
                    type="text"
                    value={place}
                    setValue={setPlace}
                  />
                </div>
                <div className="p-2">
                  <Label>證照資訊</Label>
                  <Input
                    label=""
                    type="text"
                    value={license}
                    setValue={setLicense}
                  />
                </div>
                <div className="p-2">
                  <Label>介紹/教學理念</Label>
                  <Input
                    label=""
                    type="text"
                    value={introduce}
                    setValue={setIntroduce}
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-center py-4">
              <Button type="submit" className="w-52" disabled={loading}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="min-w-[300px] self-center">
          <CardHeader>
            <CardTitle>請填寫使用者資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="p-2">
                <Label>暱稱</Label>
                <Input
                  label=""
                  type="text"
                  value={displayName}
                  setValue={setDisplayName}
                />
              </div>
              <div className="p-2">
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
              <div className="p-2">
                <Label>年齡</Label>
                <Input label="" type="text" value={age} setValue={setAge} />
              </div>
              <div className="p-2">
                <Label>體重</Label>
                <Input
                  label=""
                  type="text"
                  value={weight}
                  setValue={setWeight}
                />
              </div>
              <div className="p-2">
                <Label>身高</Label>
                <Input
                  label=""
                  type="text"
                  value={height}
                  setValue={setHeight}
                />
              </div>
            </form>
            <div className="flex justify-center py-4">
              <Button type="submit" className="w-52" disabled={loading}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
