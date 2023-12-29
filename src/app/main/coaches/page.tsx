"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

import NavBar from "../_components/NavBar";

import PostsSearchBar from "@/app/main/posts/_components/PostsSearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCoach from "@/hooks/useCoach";
import type { Coach } from "@/lib/types/db";

type PostPageProps = {
  searchParams: {
    search?: string;
  };
};
export default function CoachPage({ searchParams: { search } }: PostPageProps) {
  const { data: session } = useSession();
  const { getCoaches, loading } = useCoach();
  const [userInfo, setUserInfo] = useState<Coach[]>([]);
  const [sportType, setSportType] = useState<string>("");

  const fetchCoaches = async () => {
    try {
      const targetUserInfo = await getCoaches({ sportType, search });
      // console.log("targetUserInfo: ", targetUserInfo);
      setUserInfo(targetUserInfo);
      // console.log("userInfo: ",userInfo);
    } catch (error) {
      console.log(error);
      alert("Error getting coachinfo");
    }
  };
  () => fetchCoaches();
  useEffect(() => {
    fetchCoaches();
  }, [search, sportType]);
  return (
    <div>
      <NavBar />
      <PostsSearchBar isCoach={true} />
      <div className="px-6 py-2">
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
          <SelectItem value="yoga">瑜伽</SelectItem>
          <SelectItem value="badminton">羽球</SelectItem>
          <SelectItem value="basketball">籃球</SelectItem>
          <SelectItem value="soccer">足球</SelectItem>
          <SelectItem value="others">其他</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3 p-2">
        {userInfo &&
          userInfo.map((coach, i) => {
            if (coach.userId !== session?.user?.id) {
              return (
                <div className="grid w-full">
                  <form className="grid grid-cols-3 gap-2 p-2 md:grid-cols-2">
                    <div className="justify-between rounded-lg bg-white p-2 shadow-md">
                      <Link key={i} href={`/main/coaches/${coach.userId}`}>
                        <div className="flex flex-col items-center">
                          <img src={coach.avatarUrl} />
                        </div>
                        <div className="flex flex-col items-center font-bold">
                          <p className="py-1">{coach.sportType}</p>
                          <p className="py-1">{coach.displayName}</p>
                        </div>
                      </Link>
                    </div>
                  </form>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}
