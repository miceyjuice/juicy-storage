"use client";

import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession,
} from "@clerk/nextjs";
import React from "react";

function Header() {
  const session = useSession();

  return (
    <header className="border-b-2 py-4 px-2">
      <div className="container mx-auto flex justify-between items-center">
        <span className="font-semibold">JUICY STORAGE</span>
        <div className="flex gap-4">
          <OrganizationSwitcher />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default">Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default Header;
