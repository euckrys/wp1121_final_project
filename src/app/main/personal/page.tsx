"use client"

import useUserInfo from "@/hooks/useUserInfo";
import { useEffect, useState } from "react";

import type { UserInfo } from "@/lib/types/db"

import { Button } from "@/components/ui/button";
import UpdateProfileDialog from "./_components/UpdateProfileDialog";

export default function HomePage() {
  const { getUserInfo, loading } = useUserInfo();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const targetUserInfo = await getUserInfo();
      setUserInfo(targetUserInfo);
    } catch (error) {
      console.log(error);
      alert("Error getting userinfo");
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [dialogOpen])

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
      {dialogOpen && (
        <UpdateProfileDialog
          _displayName={userInfo?.displayName ? userInfo.displayName : ""}
          _sportType={userInfo?.sportType ? userInfo.sportType : ""}
          _age={userInfo?.age ? userInfo.age : ""}
          _height={userInfo?.height ? userInfo.height : ""}
          _weight={userInfo?.weight ? userInfo.weight : ""}
          _place={userInfo?.place ? userInfo.place : ""}
          _license={userInfo?.license ? userInfo?.license : ""}
          showDialog={dialogOpen}
          onclose={handleCloseDialog}
        />
      )}
    </div>
  );
}