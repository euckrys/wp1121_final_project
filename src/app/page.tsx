"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button";

import AuthForm from "./_components/AuthForm";

export default function Home() {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  return (
    <main className="">
      {!formOpen ? (
        <div>
          <p>Welcome to Our Service</p>
          <Button
            onClick={() => setFormOpen(true)}
          >
            Log in
          </Button>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
          {formOpen && (
            <AuthForm />
          )}
        </div>
      )}

    </main>
  );
}
