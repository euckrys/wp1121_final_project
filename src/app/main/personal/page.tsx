"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import * as React from "react"
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";

import type { UserInfo } from "@/lib/types/db"
import useUserInfo from "@/hooks/useUserInfo";
import UpdateProfileDialog from "./_components/UpdateProfileDialog";
import Schedule from "./_components/Schedule"

export default function HomePage() {
  const { data: session } = useSession();
  const { getUserInfo, loading } = useUserInfo();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const [testing, setTesting] = useState(false);
  const router = useRouter();
  const testCron = async () => {

    if (testing) return;
        setTesting(true);

        const res = await fetch("/api/cron", {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }
        router.refresh();
        setTesting(false);
        return res;
  }

  const fetchUserInfo = async () => {
    try {
      const targetUserInfo = await getUserInfo();
      console.log("targetUserInfo: ", targetUserInfo);
      setUserInfo(targetUserInfo);
      console.log("userInfo: ",userInfo);
    } catch (error) {
      console.log(error);
      alert("Error getting userinfo");
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [dialogOpen])

  useEffect(() => {
    fetchUserInfo();
    // console.log(scheduleDialogOpen)
  }, [scheduleDialogOpen])

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  return (
    <div>
      <h1>{userInfo?.displayName}</h1>
      <h1>{userInfo?.sportType}</h1>
      <h1>{userInfo?.age}</h1>
      <h1>{userInfo?.height}</h1>
      <h1>{userInfo?.weight}</h1>
      <Button
        onClick = {() => {setDialogOpen(true)}}
        disabled={loading}
        className="font-bold text-base ml-2 rounded-md"
      >
        修改使用者資料
      </Button>
      <Button onClick={() => testCron()}>
        Test Cron
      </Button>
      {dialogOpen && (
        <UpdateProfileDialog
          _displayName={userInfo?.displayName ? userInfo.displayName : ""}
          _sportType={userInfo?.sportType ? userInfo.sportType : ""}
          _age={userInfo?.age ? userInfo.age : ""}
          _height={userInfo?.height ? userInfo.height : ""}
          _weight={userInfo?.weight ? userInfo.weight : ""}
          _place={userInfo?.place ? userInfo.place : ""}
          _license={userInfo?.license ? userInfo?.license : ""}
          _introduce={userInfo?.introduce ? userInfo?.introduce : ""}
          showDialog={dialogOpen}
          onclose={handleCloseDialog}
        />
      )}

      {session?.user?.isCoach && userInfo?.availableTime && userInfo?.appointment && <Schedule _availableTime={userInfo?.availableTime} _appointment={userInfo.appointment} dialogOpen={scheduleDialogOpen} setDialogOpen={setScheduleDialogOpen}/>}
    </div>
  );
}