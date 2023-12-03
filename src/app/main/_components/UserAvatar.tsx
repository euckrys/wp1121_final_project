import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function UserAvatar(props: { mine: boolean, username: string }) {
  const { mine, username } = props;

  const [user] = await db
    .select({
      avatarUrl: usersTable.avatarUrl,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .execute();

  return (
    <>
      {mine ? <img
        src={user.avatarUrl}
        className="w-6 h-6 rounded-full mr-1 mt-0.5"
      /> : <img
      src={user.avatarUrl}
      className="w-8 h-8 rounded-full mr-1 mt-0.5"
    />}
    </>
  );
}