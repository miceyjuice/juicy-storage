"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useSession,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  useSession();

  const saveFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 pt-10">
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="default">Sign in</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button variant="default">Sign out</Button>
        </SignOutButton>
      </SignedIn>

      <Button
        onClick={() => {
          saveFile({ name: "Siemaneczko" });
        }}
      >
        Save file
      </Button>

      {files?.map((file) => (
        <div key={file._id}>{file.name}</div>
      ))}
    </main>
  );
}
