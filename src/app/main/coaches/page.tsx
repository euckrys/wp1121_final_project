"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import NavBar from "../_components/NavBar";
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreeDots } from 'react-loader-spinner'

import PostsSearchBar from "@/app/main/posts/_components/PostsSearchBar";
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

  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);

  const fetchCoaches = async () => {
    try {
      const targetUserInfo = await getCoaches({ sportType, search });
      setUserInfo(targetUserInfo);

    } catch (error) {

      console.log(error);
      alert("Error getting coachinfo");

    } finally {

      setIsFirstLoading(false);
    }
  };

  useEffect(() => {
    setIsFirstLoading(true);
    fetchCoaches();
  }, [])

  useEffect(() => {
    if (isFirstLoading) return;
    fetchCoaches();
  }, [search, sportType]);


  const getSportType = (value: string) => {
    let correctSportType: string = "";
    if (value == "swimming") correctSportType = "游泳";
    else if (value == "fitness") correctSportType = "健身";
    else if (value == "yoga") correctSportType = "瑜伽";
    else if (value == "badminton") correctSportType = "羽球";
    else if (value == "basketball") correctSportType = "籃球";
    else if (value == "soccer") correctSportType = "足球";
    else if (value == "others") correctSportType = "其他";
    return correctSportType;
  }

  return (
    <div>
      <div>
        <NavBar />
        <div className="grid grid-cols-5 justify-center items-center  ">
          <div className="ml-8 mt-8">
            <PostsSearchBar isCoach={true}/>
          </div>
          <div className="px-6 py-2 mt-8">
            <Tabs
              defaultValue="%"
              className="w-full"
              onValueChange={(value) => {
                if (value == "%") setSportType("");
                else setSportType(value);
              }}
            >
              <TabsList>
                <TabsTrigger value="%" disabled={loading}>
                  <p className="font-bold text-xl">ALL</p>
                </TabsTrigger>
                <TabsTrigger value="fitness" disabled={loading}>
                  <p className="font-bold text-xl">健身</p>
                </TabsTrigger>
                <TabsTrigger value="swimming" disabled={loading}>
                  <p className="font-bold text-xl">游泳</p>
                </TabsTrigger>
                <TabsTrigger value="yoga" disabled={loading}>
                  <p className="font-bold text-xl">瑜伽</p>
                </TabsTrigger>
                <TabsTrigger value="badminton" disabled={loading}>
                 <p className="font-bold text-xl">羽球</p>
                </TabsTrigger>
                <TabsTrigger value="basketball" disabled={loading}>
                  <p className="font-bold text-xl">籃球</p>
                </TabsTrigger>
                <TabsTrigger value="soccer" disabled={loading}>
                  <p className="font-bold text-xl">足球</p>
                </TabsTrigger>
                <TabsTrigger value="others" disabled={loading}>
                  <p className="font-bold text-xl">其他</p>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {isFirstLoading ? (
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
            <p className="font-bold text-2xl text-gray-800">Loading Coaches...</p>
          </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 overflow-y-auto p-16">
          {userInfo.length > 0 ? (
            userInfo.map((coach, i) => {
              if (coach.userId !== session?.user?.id) {
                return (
                  <div key={i} className="w-5/6 min-w-[200px]">
                    <Card className="flex-col justify-center items-center">
                      <CardContent className="w-full h-fit flex flex-col">
                        <div className="flex flex-col justify-center items-center pt-8 pl-0 pr-0 pb-0">
                          <Link href={`/main/coaches/${coach.userId}`}>
                            <div>
                              <Image
                                src={coach.avatarUrl ? coach.avatarUrl : ""}
                                width={200}
                                height={200}
                                alt="123"
                                className="mr-1 mt-0.5 h-40 w-40 rounded-full"
                              />
                            </div>
                            <div className="flex items-center justify-center mt-8">
                              <p className="font-bold text-2xl">{getSportType(coach.sportType)}</p>
                            </div>
                            <div className="flex items-center justify-center mt-8">
                              <p className="font-bold text-2xl">{coach.displayName}</p>
                            </div>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              }
            })
          ) : (
            <div className="w-full h-full flex justify-self-center content-self-center flex-row justify-center items-center">
              <div>
                <p className="font-bold text-2xl">沒有找到符合條件的教練...</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}