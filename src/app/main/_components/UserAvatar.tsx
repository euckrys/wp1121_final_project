import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cn } from "@/lib/utils/shadcn";
import Image from "next/image";

export default async function UserAvatar(props: { className?: string, mine: boolean, username: string }) {
  const { className, mine, username } = props;

  const [user] = await db
    .select({
      avatarUrl: usersTable.avatarUrl,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .execute();

  return (
    <>
      {mine ?
        <Image
          src={user.avatarUrl}
          alt={"image"}
          width={20}
          height={20}
          className={cn("w-6 h-6 rounded-full mr-1 mt-0.5", className)}
        /> :
        <Image
          src={user.avatarUrl}
          alt={"image"}
          width={20}
          height={20}
          className={cn("w-8 h-8 rounded-full mr-1 mt-0.5", className)}
        />
      }
    </>
  );
}