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
      <div className="flex flex-row p-2 px-6">
        <div className="py-20">
          <Image
            src={coachInfo?.avatarUrl ? coachInfo.avatarUrl : ""}
            width={400}
            height={400}
            alt="123"
            className="mr-1 mt-0.5 h-40 w-40 rounded-full"
          />
        </div>
        <div className="flex">
          <div className="flex flex-col p-4 ">
            <div className="flex flex-row p-2">
              <p className="text-2xl font-bold">{coachInfo?.displayName}</p>
            </div>
            <div className="flex flex-row">
              <div className="flex flex-row px-2 ">
                <div className="flex flex-col px-12 py-3 text-lg font-bold">
                  <span className="px-8 py-2">Sport Type</span>
                  <span className="px-8 py-2">Age</span>
                  <span className="px-8 py-2">Height</span>
                  <span className="px-8 py-2">Weight</span>
                </div>
                <div className="flex flex-col px-12 py-3 text-lg">
                  <span className="px-8 py-2">{coachInfo?.sportType}</span>
                  <span className="px-8 py-2">{coachInfo?.age}</span>
                  <span className="px-8 py-2">{coachInfo?.height}</span>
                  <span className="px-8 py-2">{coachInfo?.weight}</span>
                </div>
              </div>
              <div className="flex flex-row px-2 ">
                <div className="flex flex-col px-12 py-3 text-lg font-bold">
                  <span className="px-8 py-2">Place</span>
                  <span className="px-8 py-2">Lisence</span>
                </div>
                <div className="flex flex-col px-12 py-3 text-lg">
                  <span className="px-8 py-2">{coachInfo?.place}</span>
                  <span className="px-8 py-2">{coachInfo?.license}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
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
            <div className="flex flex-row px-1  ">
              <Checkbox
                checked={isAnonymous}
                onChange={() => {
                  setIsAnonymous(!isAnonymous);
                }}
              />
              <div className="py-3">
                <span>是否匿名</span>
              </div>
            </div>
            <div className="flex flex-row px-3">
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

      <div className="flex flex-row p-2">
        <div className="flex justify-between">
          <span className="px-2 font-mono text-xl">
            {totalStar && totalReview && totalStar / totalReview}
          </span>
        </div>
        <div className="flex justify-between px-2 py-[0.15em]">
          <Rating
            name="half-rating"
            precision={0.1}
            readOnly
            defaultValue={averageStar}
          />
        </div>
        <div className="flex justify-between">
          <span className="px-2 font-mono text-xl">({totalReview})</span>
        </div>
      </div>
    </div>
  );
}
