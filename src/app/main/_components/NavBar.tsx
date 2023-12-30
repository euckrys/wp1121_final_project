"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NavBar() {
  const { data: session } = useSession();
  const avatarUrl = session?.user?.avartarUrl ? session.user.avartarUrl : "";
  // console.log(session);

  return (
    <div className="grid h-24 grid-cols-12 bg-red-100">
      <div className="col-span-3 grid items-center justify-center">
        <p className="font-mono text-2xl font-bold italic tracking-[.25em]">
          SPORTS
        </p>
      </div>
      <div className="col-span-7 grid h-full">
        <div className="flex items-center justify-between">
          <Link href={`/main/home`}>
            <Button
              type={"button"}
              className="flex bg-transparent font-serif text-3xl text-black shadow-none"
            >
              <p>Home</p>
            </Button>
          </Link>
          <Link href={`/main/coaches?search=`}>
            <Button
              type={"button"}
              className="flex bg-transparent font-serif text-3xl text-black shadow-none"
            >
              <p>Coach</p>
            </Button>
          </Link>
          <Link href={`/main/posts?search=`}>
            <Button
              type={"button"}
              className="hover: flex border-black bg-transparent font-serif text-3xl text-black shadow-none hover:border-b-4 hover:bg-transparent"
            >
              <p>Post</p>
            </Button>
          </Link>
          <Link href={`/main/appointments`}>
            <Button
              type={"button"}
              className="flex bg-transparent font-serif text-3xl text-black shadow-none"
            >
              <p>Appointment</p>
            </Button>
          </Link>
        </div>
      </div>
      <div className="col-span-2 grid">
        <div className="flex items-center justify-center">
          <Link href={"/main/personal"}>
            <Button
              variant={"ghost"}
              type={"submit"}
              className="hover:bg-slate-200"
            >
              <Image
                src={avatarUrl}
                width={20}
                height={20}
                className="mr-1 mt-0.5 h-12 w-12 rounded-full"
                alt={"image"}
              />
            </Button>
          </Link>
          <Link href={"/auth/signout"}>
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
