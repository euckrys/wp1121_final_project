import { NextResponse } from "next/server";

import { db } from "@/db";
import { profileInfoTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const revalidate = 0
export const GET = async () => {
  try {
    const yesterdayDatas = await db.query.profileInfoTable.findMany({
        columns: {
            userId: true,
            isCoach: true,
            availableTime: true,
            appointment: true,
        }
    })

    const newDatas = yesterdayDatas.map((yesterdayData,i) =>{
        return (
            {
                userId: yesterdayData.userId,
                availableTime: yesterdayData.availableTime?.map((a,i) => { 
                    if(i>64) {
                        return !yesterdayData.isCoach
                    } 
                    else{
                        if(yesterdayData.availableTime) {return yesterdayData.availableTime[i+5]} 
                        else {return false}
                    }}),
                appointment: yesterdayData.appointment?.map((a,i) => {
                    if(i>29) {
                        return "/"
                    } 
                    else{
                        if(yesterdayData.appointment) {return yesterdayData.appointment[i+5]} 
                        else {return "/"}
                    }})
            }
        );
    })

    for (const newData of newDatas)[
        await db
              .update(profileInfoTable)
              .set({
                availableTime: newData.availableTime,
                appointment: newData.appointment,
              })
              .where(eq(profileInfoTable.userId, newData.userId))
              .returning()
    ]
    
    console.log("update success")
    return NextResponse.json(
      { message: "Update successfully."},
      { status: 200 },
    );
  } catch (error) {
    console.error("Error update the database:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};