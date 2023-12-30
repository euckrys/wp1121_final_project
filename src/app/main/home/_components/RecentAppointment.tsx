"use client"

import { useSession } from "next-auth/react"

import { Card, CardContent } from "@/components/ui/card"

type RecentAppointmentProps = {
    recentAppointment: string,
    recentAppointmentTime: string,
}

export default function RecentAppointment ({
    recentAppointment,
    recentAppointmentTime,
}: RecentAppointmentProps) {

    const { data: session } = useSession();

    return (
        <div className="mt-20 h-full">
            <Card className="h-full shadow-xl">
                <CardContent className="flex flex-col items-center h-full">
                    <p className="font-bold text-2xl mt-8 underline">Recent Appointment</p>
                    <div className="flex flex-col justify-center items-center h-full">
                        <p>
                            <span className="font-semibold text-2xl">{recentAppointment}</span>
                            <span className="text-xl ml-4">{session?.user?.isCoach ? "學員" : "教練"}</span>
                        </p>
                        <p className="font-medium text-2xl mt-4">{recentAppointmentTime.search(":") == 6 ? "12":"12"}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}