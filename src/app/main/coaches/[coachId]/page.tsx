"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";

import NavBar from "../../_components/NavBar";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";

import Schedule from "@/app/main/_components/Schedule";
import { Button } from "@/components/ui/button";
import useOtherUserInfo from "@/hooks/useOtherUserInfo";
import useReview from "@/hooks/useReview";
import useUserInfo from "@/hooks/useUserInfo";
import type { UserInfo, Review } from "@/lib/types/db";

export default function HomePage() {
  const { data: session } = useSession();
  const { getOtherUserInfo } = useOtherUserInfo();
  const { getUserInfo } = useUserInfo();
  const { getReview, postReview, loading } = useReview();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [coachInfo, setCoachInfo] = useState<UserInfo>();
  const [reviews, setReviews] = useState<Review[]>();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState<boolean>(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [alreadyReview, setAlreadyeview] = useState<boolean>(false);
  const [star, setStar] = useState<number | null>(0);
  const [reviewInput, setReviewInput] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [totalStar, setTotalStar] = useState<number>();
  const [totalReview, setTotalReview] = useState<number>();
  const [averageStar, setAverageStar] = useState<number>();

  const userId = session?.user?.id ? session.user.id : "";
  const username = session?.user?.username ? session.user.username : "";

  const fetchUserInfo = async () => {
    try {
      const targetUserInfo = await getUserInfo();
      // console.log("targetUserInfo: ", targetUserInfo);
      setUserInfo(targetUserInfo);
    } catch (error) {
      console.log(error);
      alert("Error getting userinfo");
    }
  };
  const fetchCoachInfo = async () => {
    try {
      const targetCoachInfo = await getOtherUserInfo();
      // console.log("targetCoach: ", targetCoachInfo);
      setCoachInfo(targetCoachInfo);
    } catch (error) {
      console.log(error);
      alert("Error geting coachinfo");
    }
  };

  const fetchReview = async () => {
    try {
      const targetReview = await getReview();
      console.log("targetReviews: ", targetReview);
      setReviews(targetReview?.review);
      setTotalStar(targetReview?.totalStar);
      setTotalReview(targetReview?.totalReview);
      totalStar && totalReview && setAverageStar(totalStar / totalReview);
    } catch (error) {
      console.log(error);
      alert("Error geting Review");
    }
  };
  useEffect(() => {
    fetchUserInfo();
    fetchCoachInfo();
    fetchReview();
  }, [scheduleDialogOpen, cancelDialogOpen, alreadyReview]);

  const sendReview = async () => {
    // console.log(star);
    // console.log(reviewInput);
    // console.log(isAnonymous);
    if (!star) {
      alert("please rate this coach!!!");
    } else {
      try {
        await postReview({
          authorId: userId,
          author: username,
          isAnonymous,
          star,
          content: reviewInput,
        });
      } catch (error) {
        console.log(error);
        alert("Error creating Post");
      }
      setAlreadyeview(true);
    }
  };

  const myReview = reviews?.find((obj) => {
    return obj.authorId === userId;
  });

  return (
    <div>
      <NavBar />
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-3 p-2 px-6">
          <section className="col-span-1 px-10 py-20">
            <Image
              src={coachInfo?.avatarUrl ? coachInfo.avatarUrl : ""}
              width={400}
              height={400}
              alt="123"
              className="mr-1 mt-0.5 h-40 w-40 rounded-full"
            />
          </section>
          <div className="col-span-2">
            <p className="p-2 text-2xl font-bold">{coachInfo?.displayName}</p>
            <div className="grid grid-cols-2 gap-4">
              <section className="grid grid-rows-1 gap-4">
                <div className="flex flex-col p-4">
                  <div className="grid grid-cols-2 grid-rows-4 gap-4 px-2">
                    <span className="flex items-center">
                      <p className="mr-3 inline-flex h-4 w-4 rounded-full bg-red-100"></p>
                      運動種類
                    </span>
                    <span className="flex items-center">
                      {coachInfo?.sportType}
                    </span>
                    <span className="flex items-center">
                      <p className="mr-3 inline-flex h-4 w-4 rounded-full bg-red-100"></p>
                      年齡
                    </span>
                    <span className="flex items-center">{coachInfo?.age}</span>
                    <span className="flex items-center">
                      <p className="mr-3 inline-flex h-4 w-4 rounded-full bg-red-100"></p>
                      身高
                    </span>
                    <span className="flex items-center">
                      {coachInfo?.height}
                    </span>
                    <span className="flex items-center">
                      <p className="mr-3 inline-flex h-4 w-4 rounded-full bg-red-100"></p>
                      體重
                    </span>
                    <span className="flex items-center">
                      {coachInfo?.weight}
                    </span>
                  </div>
                </div>
              </section>
              <section className="grid grid-rows-3 gap-4">
                <div className="flex flex-col p-4">
                  <div className="grid grid-cols-2 grid-rows-3 gap-4">
                    <span className="flex items-center">
                      <p className="mr-3 inline-flex h-4 w-4 rounded-full bg-red-100"></p>
                      場館
                    </span>
                    <span className="flex items-center">
                      {coachInfo?.place}
                    </span>
                    <span className="flex items-center">
                      <p className="mr-3 inline-flex h-4 w-4 rounded-full bg-red-100"></p>
                      證照資訊
                    </span>
                    <span className="flex items-center">
                      {coachInfo?.license}
                    </span>
                    <span className="flex items-center">
                      <p className="mr-3 inline-flex h-4 w-4 rounded-full bg-red-100"></p>
                      介紹/教學理念
                    </span>
                    <span className="flex items-center">
                      {coachInfo?.introduce}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full flex-col items-center rounded-xl bg-white p-4 shadow-md">
          <div className="inline-flex w-full items-center justify-center">
            <hr className="my-4 h-px w-full border-0 bg-black" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
              Make a Reservation
            </span>
          </div>
          <div className="mt-2">
            <div className="flex w-full">
              {coachInfo?.availableTime &&
                coachInfo.appointment &&
                userInfo?.availableTime &&
                userInfo.appointment &&
                session?.user?.isCoach !== undefined && (
                  <Schedule
                    _coach_availableTime={coachInfo?.availableTime}
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
                  />
                )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col">
            {myReview === undefined && (
              <div className="flex flex-col justify-between">
                <div className="flex flex-row px-2">
                  <span className="p-2 text-xl font-medium">留下您的評論</span>
                  <div className="flex py-2">
                    <Rating
                      name="half-rating"
                      defaultValue={0}
                      precision={0.1}
                      onChange={(event, newValue) => {
                        setStar(newValue);
                        console.log(event);
                      }}
                    />
                  </div>
                  <div className="flex px-2 py-2 text-xl">
                    <span className="font-mono text-xl">{star}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-center px-1 ">
                  <Checkbox
                    checked={isAnonymous}
                    onChange={() => {
                      setIsAnonymous(!isAnonymous);
                    }}
                  />
                  <div className="flex py-3">
                    <span>是否匿名</span>
                  </div>
                </div>
                <div className="flex flex-row justify-center px-3">
                  <TextField
                    id="outlined-basic"
                    label="留下您詳細的評論"
                    variant="outlined"
                    multiline
                    maxRows={5}
                    value={reviewInput}
                    onChange={(event) => {
                      setReviewInput(event.target.value);
                    }}
                  />
                  <div className="p-2 py-2">
                    <Button disabled={loading} onClick={() => sendReview()}>
                      送出
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-row justify-center">
              <div className="flex flex-row p-2">
                <div className="flex justify-between">
                  <span className="px-2 font-mono text-xl">
                    {totalStar && totalReview && totalStar / totalReview}
                  </span>
                </div>
                <div className="flex justify-between py-[0.15em]">
                  <Rating
                    name="half-rating"
                    precision={0.1}
                    readOnly
                    defaultValue={averageStar}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="px-2 font-mono text-xl">
                    ({totalReview})
                  </span>
                </div>
              </div>
            </div>
          </div>
          {myReview && (
            <div>
              <div>this is my review</div>
              <div>{myReview.author}</div>
              <div>{myReview.isAnonymous}</div>
              <div>{myReview.createdAt}</div>
              <div>{myReview.star}</div>
              <div>{myReview.content}</div>
            </div>
          )}
          {reviews?.map(
            (review, i) =>
              review !== myReview && (
                <div key={i}>
                  <div>{review.author}</div>
                  <div>{review.isAnonymous}</div>
                  <div>{review.createdAt}</div>
                  <div>{review.star}</div>
                  <div>{review.content}</div>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
