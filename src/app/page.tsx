"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useSession,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  const orgId =
    (organization.isLoaded && organization.organization?.id) ||
    (user.isLoaded && user.user?.id);

  const saveFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  console.log("files:", files);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 pt-10">
      <Button
        onClick={() => {
          if (!orgId) return;

          saveFile({
            name: "Siemaneczko",
            orgId,
          });
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
