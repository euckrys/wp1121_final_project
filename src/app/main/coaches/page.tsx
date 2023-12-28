"use client"
import NavBar from "../_components/NavBar";
import UserAvatar from "../_components/UserAvatar"
import Link from "next/link";
import { useSession } from "next-auth/react";
import useCoach from "@/hooks/useCoach";
import type { Coach } from "@/lib/types/db"
import { useEffect, useState } from "react";
import PostsSearchBar from "@/app/main/posts/_components/PostsSearchBar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PostPageProps = {
  searchParams: {
    search?: string;
  };
};
export default function CoachPage({
  searchParams: { search },
}: PostPageProps
) {
  const {data: session} = useSession();
  const { getCoaches, loading } = useCoach();
  const [ userInfo, setUserInfo ] = useState<Coach[]>([]);
  const [sportType, setSportType] = useState<string>("");

  const fetchCoaches = async () => {
    try {
      const targetUserInfo = await getCoaches({sportType, search});
      console.log("targetUserInfo: ", targetUserInfo);
      setUserInfo(targetUserInfo);
      console.log("userInfo: ",userInfo);
    } catch (error) {
      console.log(error);
      alert("Error getting userinfo");
    }
  }
  () => fetchCoaches();
  useEffect(() => {
    fetchCoaches();
  }, [search, sportType])
  return (
    <div>
      <NavBar/>
      <PostsSearchBar isCoach={true}/>
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
          <SelectItem value="%">ALL</SelectItem>
          <SelectItem value="fitness">健身</SelectItem>
          <SelectItem value="swimming">游泳</SelectItem>
          <SelectItem value="others">其他</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-col">
        {userInfo && userInfo.map((coach, i) => {
          if(coach.displayName !== session?.user?.username)
          {
            return (
              <Link href={`/main/coaches/${coach.userId}`}>
                <div className="flex m-3" >
                  <p>{coach.sportType}</p>
                  <p className="m-3 text-2xl">{coach.displayName}</p>
                </div>
              </Link>
            )
          }
        }    
        )}
      </div>
    </div>
  );
}