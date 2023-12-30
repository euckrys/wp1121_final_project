"use client";

import { useState ,useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Input from "../_components/AuthInput";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThreeDots } from "react-loader-spinner";

import useUserInfo from "@/hooks/useUserInfo";
import useUsers from "@/hooks/useUsers";
type UniqueUser = {
  displayId: true,
  email:string,
  username: string,
}
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
  const { toast } = useToast();
  const { getAllUsers } = useUsers();
  const [users, setUsers] = useState<UniqueUser[]>([]);
  const fetchUsers = async () => {
    try {
      const targetUsers = await getAllUsers();
      console.log(targetUsers);
      setUsers(targetUsers);
    } catch (error) {
      console.log(error);
      alert("Error getting coachinfo");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (displayName===""){
        toast({
            title: "Uh oh!",
            description: "請輸入暱稱",
        })
        return;
    }
    else if((users.find(e => e.username===displayName))!==undefined){
      if((users.find(e => e.username===displayName))?.displayId !== session?.user?.id){
        toast({
            title: "Uh oh!",
            description: "暱稱已被使用",
        })
        return;
      }
    }
    else if(sportType===""){
        toast({
            title: "Uh oh!",
            description: "請選擇運動種類",
        })
        return;
    }
    else if(age===""){
        toast({
            title: "Uh oh!",
            description: "請輸入年齡",
        })
        return;
    }
    else if(weight===""){
        toast({
            title: "Uh oh!",
            description: "請輸入體重",
        })
        return;
    }
    else if(height==="")
    {
        toast({
            title: "Uh oh!",
            description:  "請輸入身高",
        })
        return;
    }

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
    } finally {
      router.push("/main");
    }
  };

  return (
    (!session?.user?.id ? (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <ThreeDots
          visible={true}
          height="100"
          width="100"
          color="#FFCBCB"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <p className="font-bold text-2xl text-gray-800">Intialization...</p>
      </div>
    ): (
    <div className="flex justify-center p-12">
          {session?.user?.isCoach ? (
            <Card className="min-w-[300px] self-center">
              <CardHeader>
                <CardTitle>請填寫使用者資訊</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex flex-row">
                  <div className="flex flex-col">
                    <div className="p-2">
                      <Label>暱稱</Label>
                      <Input
                        label=""
                        type="text"
                        value={displayName}
                        setValue={setDisplayName}
                        defaultValue="Age"
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
                      <Input label="" type="text" value={age} setValue={setAge} defaultValue="Age"/>
                    </div>
                    <div className="p-2">
                      <Label>體重</Label>
                      <Input
                        label=""
                        type="text"
                        value={weight}
                        setValue={setWeight}
                        defaultValue="Weight"
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
                        defaultValue="Height"
                      />
                    </div>
                    <div className="p-2">
                      <Label>場館</Label>
                      <Input
                        label=""
                        type="text"
                        value={place}
                        setValue={setPlace}
                        defaultValue="Input"
                      />
                    </div>
                    <div className="p-2">
                      <Label>證照資訊</Label>
                      <Input
                        label=""
                        type="text"
                        value={license}
                        setValue={setLicense}
                        defaultValue="License"
                      />
                    </div>
                    <div className="p-2">
                      <Label>介紹/教學理念</Label>
                      <Input
                        label=""
                        type="text"
                        value={introduce}
                        setValue={setIntroduce}
                        defaultValue="Introduce"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center py-4">
                  <Button type="submit" className="w-52" disabled={loading}>
                    Continue
                  </Button>
                </div>
                </form>
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
                      defaultValue="NickName"
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
                    <Input label="" type="text" value={age} setValue={setAge} defaultValue="Age"/>
                  </div>
                  <div className="p-2">
                    <Label>體重</Label>
                    <Input
                      label=""
                      type="text"
                      value={weight}
                      setValue={setWeight}
                      defaultValue="Weight"
                    />
                  </div>
                  <div className="p-2">
                    <Label>身高</Label>
                    <Input
                      label=""
                      type="text"
                      value={height}
                      setValue={setHeight}
                      defaultValue="Height"
                    />
                  </div>
                <div className="flex justify-center py-4">
                  <Button type="submit" className="w-52" disabled={loading}>
                    Continue
                  </Button>
                </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
    ))
  );
}

