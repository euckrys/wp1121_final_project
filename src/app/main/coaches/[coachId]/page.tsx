"use client"
import NavBar from "../../_components/NavBar";
import useOtherUserInfo from "@/hooks/useOtherUserInfo";
import useUserInfo from "@/hooks/useUserInfo";
import useReview from "@/hooks/useReview";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { UserInfo, Review } from "@/lib/types/db";
import Schedule from "@/app/main/_components/Schedule";
import Image from "next/image";
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { Button } from "@/components/ui/button";
import Checkbox from '@mui/material/Checkbox';

export default function HomePage() {
  const { data: session } = useSession();
  const { getOtherUserInfo } = useOtherUserInfo();
  const { getUserInfo } = useUserInfo();
  const { getReview, postReview, loading } = useReview();
  const [ userInfo, setUserInfo ] = useState<UserInfo>();
  const [ coachInfo, setCoachInfo ] = useState<UserInfo>();
  const [ reviews, setReviews ] = useState<Review[]>();
  const [ scheduleDialogOpen, setScheduleDialogOpen ] = useState<boolean>(false);
  const [ cancelDialogOpen, setCancelDialogOpen ] = useState<boolean>(false);
  const [ alreadyReview, setAlreadyeview ] = useState<boolean>(false);
  const [ star, setStar ] = useState<number|null>(0);
  const [ reviewInput, setReviewInput ] = useState<string>('');
  const [ isAnonymous, setIsAnonymous ] = useState<boolean>(true);
  const [ totalStar, setTotalStar ] = useState<number>();
  const [ totalReview, setTotalReview ] = useState<number>();
  const [ averageStar, setAverageStar ] = useState<number>();

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
  }
  const fetchCoachInfo = async () => {
    try {
      const targetCoachInfo = await getOtherUserInfo();
      // console.log("targetCoach: ", targetCoachInfo);
      setCoachInfo(targetCoachInfo);
    } catch (error) {
      console.log(error);
      alert("Error geting coachinfo");
    }
  }

  const fetchReview = async () => {
    try {
      const targetReview = await getReview();
      console.log("targetReviews: ", targetReview);
      setReviews(targetReview?.review);
      setTotalStar(targetReview?.totalStar);
      setTotalReview(targetReview?.totalReview);
      totalStar && totalReview && setAverageStar((totalStar/totalReview));
    } catch (error) {
      console.log(error);
      alert("Error geting Review");
    }
  }
  useEffect(() => {
    fetchUserInfo();
    fetchCoachInfo();
    fetchReview();
  }, [scheduleDialogOpen, cancelDialogOpen, alreadyReview])


  
  const sendReview = async () => {
    // console.log(star);
    // console.log(reviewInput);
    // console.log(isAnonymous);
    if(!star)
    {
      alert("please rating this coach!!!")
    }
    else
    {
      try {
        await postReview({
          authorId: userId,
          author: username,
          isAnonymous,
          star,
          content: reviewInput,
        })
      } catch (error) {
          console.log(error);
          alert("Error creating Post");
      }
      setAlreadyeview(true);
    }
  }

  const myReview = reviews?.find((obj) => {
    return obj.authorId === userId;
  });

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
        <h1>avarage star: {totalStar && totalReview && (totalStar/totalReview)} totalReview: {totalReview}</h1>
        <Rating name="half-rating" precision={0.1} readOnly defaultValue={averageStar}/>
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
      />}

        {myReview===undefined && (
          <div>
            留下您的評論
            <div>
              <Rating name="half-rating" 
                      defaultValue={0} 
                      precision={0.1} 
                      onChange={(event, newValue) => {
                        setStar(newValue);
                      }}
              />
              <span>{star}</span>
              <Checkbox checked={isAnonymous} onChange={(event) => {setIsAnonymous(!isAnonymous)}}/>
              <span>是否匿名</span>
            </div>
            <TextField id="outlined-basic" 
                      label="留下您詳細的評論" 
                      variant="outlined" 
                      multiline 
                      maxRows={5} 
                      value={reviewInput}
                      onChange = {(event) => {setReviewInput(event.target.value)}}
            />
            <Button disabled={loading} onClick={() => sendReview()}>送出</Button>
          </div>
        )}
        {myReview && (
          <div>
            <div>this is my review</div>
            <div>{myReview.author}</div>
            <div>{myReview.isAnonymous}</div>
            <div>{myReview.createdAt}</div>
            <div>{myReview.star}</div>
            <div>{myReview.content}</div>
          </div>)}
        {reviews?.map((review, i) => (
          review !== myReview && (
          <div key={i}>
            <div>{review.author}</div>
            <div>{review.isAnonymous}</div>
            <div>{review.createdAt}</div>
            <div>{review.star}</div>
            <div>{review.content}</div>
          </div>)
        ))}
    </div>
  );
}