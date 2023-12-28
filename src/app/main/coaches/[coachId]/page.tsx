"use client"
import NavBar from "../../_components/NavBar";
import useOtherUserInfo from "@/hooks/useOtherUserInfo";
import useUserInfo from "@/hooks/useUserInfo";
import { useEffect, useState } from "react";
import Schedule from "@/app/main/_components/Schedule"
import { useSession } from "next-auth/react";
import type { UserInfo } from "@/lib/types/db"
import Image from "next/image";

export default function HomePage() {
  const { data: session } = useSession();
  const { getOtherUserInfo } = useOtherUserInfo();
  const { getUserInfo } = useUserInfo();
  const [ userInfo, setUserInfo ] = useState<UserInfo>();
  const [ coachInfo, setCoachInfo ] = useState<UserInfo>();
  const [ scheduleDialogOpen, setScheduleDialogOpen ] = useState<boolean>(false);
  const [ cancelDialogOpen, setCancelDialogOpen ] = useState<boolean>(false);
  const [ test, setTest ] = useState<boolean>(false);

  const fetchUserInfo = async () => {
    try {
      const targetUserInfo = await getUserInfo();
      console.log("targetUserInfo: ", targetUserInfo);
      setUserInfo(targetUserInfo);
    } catch (error) {
      console.log(error);
      alert("Error getting userinfo");
    }
  }
  const fetchCoachInfo = async () => {
    try {
      const targetCoachInfo = await getOtherUserInfo();
      console.log("targetCoach: ", targetCoachInfo);
      setCoachInfo(targetCoachInfo);
    } catch (error) {
      console.log(error);
      alert("Error geting coachinfo");
    }
  }

  useEffect(() => {
    fetchUserInfo();
    fetchCoachInfo();
  }, [scheduleDialogOpen, cancelDialogOpen, test])

  return (
    <div>
      <NavBar/>
      <div>
        <Image
          src={coachInfo?.avatarUrl ? coachInfo.avatarUrl : ""}
          width={20}
          height={20}
          alt=""
        />
        <h1>{coachInfo?.displayName}</h1>
        <h1>{coachInfo?.sportType}</h1>
        <h1>{coachInfo?.age}</h1>
        <h1>{coachInfo?.height}</h1>
        <h1>{coachInfo?.weight}</h1>
      </div>

      {coachInfo?.availableTime && coachInfo.appointment && userInfo?.availableTime && userInfo.appointment && session?.user?.isCoach !== undefined &&
        <Schedule _coach_availableTime={coachInfo?.availableTime}
                  _coach_appointment={coachInfo.appointment}
                  _availableTime={userInfo?.availableTime}
                  _appointment={userInfo?.appointment}
                  coachname={coachInfo.displayName}
                  username={userInfo.displayName}
                  dialogOpen={scheduleDialogOpen}
                  setDialogOpen={setScheduleDialogOpen}
                  cancelDialogOpen={cancelDialogOpen}
                  setCancelDialogOpen={setCancelDialogOpen}
                  isCoach={session?.user?.isCoach}
                  setTest={setTest}
        />
      }
    </div>
  );
}