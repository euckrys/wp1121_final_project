import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

export default async function MainPage() {
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  if (!session.user.hasProfile) redirect("/welcome");
  else redirect("/main/home");
}
