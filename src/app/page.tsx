"use client"

import AuthForm from "./_components/AuthForm";

export default function Home() {

  return (
    <main className="w-full h-full">
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <AuthForm />
        </div>
    </main>
  );
}
