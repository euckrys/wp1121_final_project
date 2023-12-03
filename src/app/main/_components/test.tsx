import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import UserAvatar from "./UserAvatar";

async function Test() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;
  const username = session.user.username;
  const isCoach = session.user.isCoach;
  const email = session.user.email;
  return (
    <div>
      <UserAvatar mine={true} username={session?.user?.username  ?? "User"} />
      <div> userId: {userId}</div>
      <div> username: {username}</div>
      <div> isCoach: {isCoach.toString()}</div>
      <div> email: {email}</div>
    </div>
  )
}

export default Test;