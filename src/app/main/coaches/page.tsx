import NavBar from "../_components/NavBar";
import { getCoachs } from "./_components/actions"
import UserAvatar from "../_components/UserAvatar"
import Link from "next/link";
import { auth } from "@/lib/auth";
export default async function HomePage() {
  const coachs = await getCoachs();
  const session = await auth()

  return (
    <div>
      <NavBar/>
      <div className="flex flex-col">
        {coachs.map((coach) => {
          if(coach.displayId !== session?.user?.id)
          {
            return (
              <Link key={coach.displayId} href={`/main/coaches/${coach.displayId}`}>
                <div className="flex m-3">
                  <UserAvatar className="w-12 h-12" mine={true} username={coach.username} />
                  <p className="m-3 text-2xl">{coach.username}</p>
                </div>
              </Link>
            )
          }
        }
      )}
      </div>
    </div>
  );
}