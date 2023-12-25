import Test from "./_components/test"
import NavBar from "./_components/NavBar";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function MainPage() {
  const session = await auth();
  if(session) redirect("/main/home");

  return (
    <div>
      <NavBar/>
      <h1>Main</h1>
      <Test/>
    </div>
  );
}
