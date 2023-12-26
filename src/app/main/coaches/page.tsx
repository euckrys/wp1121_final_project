import NavBar from "../_components/NavBar";
import { getCoachs } from "./_components/actions"
import UserAvatar from "../_components/UserAvatar"
import Link from "next/link";

export default async function HomePage() {
  const coachs = await getCoachs();
  return (
    <div>
      <NavBar/>
      <div className="flex flex-col">
        {coachs.map( (coach) => {
          return (
            <Link href={`/main/coaches/${coach.displayId}`} key={coach.displayId}>
              <div className="flex m-3" >
                <UserAvatar className="w-12 h-12" mine={true} username={coach.username} />
                <p className="m-3 text-2xl">{coach.username}</p>
              </div>
            </Link>
          )
        }
        )}
      </div>
    </div>
  );
}