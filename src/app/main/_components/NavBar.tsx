"use client"

import Link from "next/link";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NavBar() {
    const { data: session } = useSession();
    const avatarUrl = session?.user?.avartarUrl ? session.user.avartarUrl : "";
    console.log(session);

    return (
        <div className="bg-pink-300 grid grid-cols-12 h-24">
            <div className="grid col-span-3 items-center justify-center">
                <p className="text-2xl">SPORTS</p>
            </div>
            <div className="grid col-span-7 h-full">
                <div className="flex justify-between items-center">
                    <Link href={`/main/home`}>
                        <Button
                            type={"button"}
                            className="flex shadow-none bg-transparent text-3xl text-black font-serif"
                        >
                            <p>Home</p>
                        </Button>
                    </Link>
                    <Link href={`/main/coaches?search=`}>
                        <Button
                            type={"button"}
                            className="flex shadow-none bg-transparent text-3xl text-black font-serif"
                        >
                            <p>Coach</p>
                        </Button>
                    </Link>
                    <Link href={`/main/posts?search=`}>
                        <Button
                            type={"button"}
                            className="flex shadow-none bg-transparent text-3xl text-black font-serif hover:border-b-4 hover:bg-transparent hover: border-black"
                        >
                            <p>Post</p>
                        </Button>
                    </Link>
                    <Link href={`/main/appointments`}>
                        <Button
                            type={"button"}
                            className="flex shadow-none bg-transparent text-3xl text-black font-serif"
                        >
                            <p>Appointment</p>
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="grid col-span-2">
                <div className="flex items-center justify-center">
                    <Link href={'/main/personal'}>
                        <Button
                            variant={"ghost"}
                            type={"submit"}
                            className="hover:bg-slate-200"
                        >
                            <Image
                                src={avatarUrl}
                                width={20}
                                height={20}
                                className="w-12 h-12 rounded-full mr-1 mt-0.5"
                                alt={"image"}
                            />
                        </Button>
                    </Link>
                    <Link href={'/auth/signout'}>
                        <Button
                            variant={"ghost"}
                            type={"submit"}
                            className="flex hover:bg-slate-200"
                        >
                            <p className="text-lg underline">Sign Out</p>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}