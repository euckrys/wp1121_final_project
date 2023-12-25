"use client"

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NavBar() {



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
                            className="flex"
                        >
                            <p>Home</p>
                        </Button>
                    </Link>
                    <Link href={`/main/coaches`}>
                        <Button
                            type={"button"}
                        >
                            <p>Coach</p>
                        </Button>
                    </Link>
                    <Link href={`/main/posts`}>
                        <Button
                            type={"button"}
                            className=""
                        >
                            <p>Post</p>
                        </Button>
                    </Link>
                    <Link href={`/main/appointments`}>
                        <Button
                            type={"button"}
                        >
                            <p>Appointment</p>
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="grid col-span-2 items-center justify-center">
                <Link href={'/auth/signout'}>
                <Button
                    variant={"ghost"}
                    type={"submit"}
                    className="hover:bg-slate-200"
                >
                    <p className="text-lg underline">Sign Out</p>
                </Button>
                </Link>
            </div>
        </div>
    );
}