"use client";

import { useEffect, useState } from "react";
import * as React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import useUserInfo from "@/hooks/useUserInfo";
import type { UserInfo } from "@/lib/types/db";

import Schedule from "./_components/Schedule";
import UpdateProfileDialog from "./_components/UpdateProfileDialog";

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
  };

  const fetchUserInfo = async () => {
    try {
      const targetUserInfo = await getUserInfo();
      console.log("targetUserInfo: ", targetUserInfo);
      setUserInfo(targetUserInfo);
      console.log("userInfo: ", userInfo);
    } catch (error) {
      console.log(error);
      alert("Error getting userinfo");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [dialogOpen]);

  useEffect(() => {
    fetchUserInfo();
    // console.log(scheduleDialogOpen)
  }, [scheduleDialogOpen]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center p-4 ">
        <div className="flex flex-row justify-between border-2 border-black">
          <div className="flex flex-col p-2 px-10 font-sans font-bold">
            <span>Username</span>
            <span>Sport Type</span>
            <span>Age</span>
            <span>Height</span>
            <span>Weight</span>
          </div>
          <div className="flex flex-col p-2 px-10 font-sans">
            <span>{userInfo?.displayName}</span>
            <span>{userInfo?.sportType}</span>
            <span>{userInfo?.age}</span>
            <span>{userInfo?.height}</span>
            <span>{userInfo?.weight}</span>
          </div>
        </div>
        <div className="p-4">
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
            disabled={loading}
            className="ml-2 rounded-md p-2 text-base font-bold"
          >
            修改使用者資料
          </Button>
        </div>
      </div>

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

      {session?.user?.isCoach &&
        userInfo?.availableTime &&
        userInfo?.appointment && (
          <Schedule
            _availableTime={userInfo?.availableTime}
            _appointment={userInfo.appointment}
            dialogOpen={scheduleDialogOpen}
            setDialogOpen={setScheduleDialogOpen}
          />
        )}
    </div>
  );
}
