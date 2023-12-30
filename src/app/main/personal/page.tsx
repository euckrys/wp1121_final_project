"use client";

import { useEffect, useState } from "react";
import * as React from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import useUserInfo from "@/hooks/useUserInfo";
import type { UserInfo } from "@/lib/types/db";

import NotCoachSchedule from "./_components/NotCoachSchedule"
import Schedule from "./_components/Schedule";
import UpdateProfileDialog from "./_components/UpdateProfileDialog";
import Divider from '@mui/material/Divider';

export default function HomePage() {
  const { data: session } = useSession();
  const { getUserInfo, loading } = useUserInfo();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

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
        <div className="border-2 border-black">
          <div className="flex justify-center">
            <Image
              src={userInfo?.avatarUrl ? userInfo.avatarUrl : ""}
              width={400}
              height={400}
              alt="123"
              className="mr-1 mt-0.5 h-40 w-40 rounded-full"
            />
          </div>
          <div className="flex flex-row justify-between">
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
          _avatar={userInfo?.avatarUrl ? userInfo.avatarUrl : ""}
          showDialog={dialogOpen}
          onclose={handleCloseDialog}
        />
      )}
      <Divider className="text-black">My Schedule</Divider>

      {session?.user?.isCoach &&
        userInfo?.availableTime &&
        userInfo?.appointment && (
          <div className="mt-5">
          <Schedule
            _availableTime={userInfo?.availableTime}
            _appointment={userInfo.appointment}
            dialogOpen={scheduleDialogOpen}
            setDialogOpen={setScheduleDialogOpen}
          />
          </div>
        )}
       {!session?.user?.isCoach &&
        userInfo?.availableTime &&
        userInfo?.appointment && (
          <div className="mt-10">
          <NotCoachSchedule
            _availableTime={userInfo?.availableTime}
            _appointment={userInfo.appointment}
          />
          </div>
        )}
    </div>
  );
}
