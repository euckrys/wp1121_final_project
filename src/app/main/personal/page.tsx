"use client"

import useUserInfo from "@/hooks/useUserInfo";
import { useEffect, useState } from "react";

import type { UserInfo } from "@/lib/types/db"

export default function HomePage() {
  const { getUserInfo } = useUserInfo();
  const [ userInfo, setUserInfo ] = useState<UserInfo>();

  const fetchUserInfo = async () => {
    try {
      const targetUserInfo = await getUserInfo();
      setUserInfo(targetUserInfo);
    } catch (error) {
      console.log(error);
      alert("Error geting userinfo");
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [])

  return (
    <div>
      <h1>{userInfo?.displayName}</h1>
      <h1>{userInfo?.sportType}</h1>
      <h1>{userInfo?.age}</h1>
      <h1>{userInfo?.height}</h1>
      <h1>{userInfo?.weight}</h1>
    </div>
  );
}